using MediCoreAPI.Data;
using MediCoreAPI.DTOs;
using MediCoreAPI.Models;
using MediCoreAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/appointments")]
  [Authorize]
  public class AppointmentsController : ControllerBase
  {
    private readonly AppDbContext _db;
    private readonly NotificationService _notifSvc;

    public AppointmentsController(AppDbContext db, NotificationService notifSvc)
    {
      _db = db;
      _notifSvc = notifSvc;
    }

    private static readonly string[] TIME_SLOTS =
    {
      "08:00","09:00","10:00","11:00","14:00","15:00","16:00"
    };

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? date)
    {
      var query = _db.Appointments.AsQueryable();

      if (!string.IsNullOrWhiteSpace(date))
        query = query.Where(a => a.Date == date);

      var list = await query
        .OrderBy(a => a.Date)
        .ThenBy(a => a.Time)
        .ToListAsync();

      return Ok(new { data = list, total = list.Count });
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
      var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

      var list = await _db.Appointments
        .Where(a => a.Date == today)
        .OrderBy(a => a.Time)
        .ToListAsync();

      return Ok(list);
    }

    [HttpGet("slots")]
    public async Task<IActionResult> GetSlots([FromQuery] string date)
    {
      if (string.IsNullOrWhiteSpace(date))
        return BadRequest(new { message = "Date requise." });

      var taken = await _db.Appointments
        .Where(a => a.Date == date && a.Status != "cancelled")
        .Select(a => a.Time)
        .ToListAsync();

      var slots = TIME_SLOTS.Select(t => new
      {
        time = t,
        label = $"{t} → {TimeSpan.Parse(t).Add(TimeSpan.FromMinutes(45)):hh\\:mm}",
        taken = taken.Contains(t)
      });

      return Ok(new { slots });
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetForPatient(string patientId)
    {
      var list = await _db.Appointments
        .Where(a => a.PatientId == patientId)
        .OrderByDescending(a => a.Date)
        .ToListAsync();

      return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest req)
    {
      var appt = new Appointment
      {
        Time = req.Time,
        Date = req.Date,
        PatientName = req.PatientName ?? "",
        PatientId = req.PatientId,
        PatientPhone = req.PatientPhone,
        Type = req.Type,
        Status = "pending",
      };

      _db.Appointments.Add(appt);
      await _db.SaveChangesAsync();

      // doctor
      var doctorUser = await _db.Users.FirstOrDefaultAsync(u => u.Role == "Doctor");
      if (doctorUser != null)
        await _notifSvc.SendAsync(doctorUser.Id.ToString(),
          "Nouveau rendez-vous",
          $"RDV avec {appt.PatientName} le {appt.Date} à {appt.Time}",
          "info");

      // secretary
      var secretaries = await _db.Users.Where(u => u.Role == "Secretary").ToListAsync();
      foreach (var sec in secretaries)
        await _notifSvc.SendAsync(sec.Id.ToString(),
          "Nouveau rendez-vous",
          $"RDV avec {appt.PatientName} le {appt.Date} à {appt.Time}",
          "info");

      return Ok(appt);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest req)
    {
      var appt = await _db.Appointments.FindAsync(id);

      if (appt == null)
        return NotFound();

      appt.Status = req.Status;

      await _db.SaveChangesAsync();

      // 👤 Notification patient
      if (!string.IsNullOrWhiteSpace(appt.PatientId))
      {
        var patientUser = await _db.Users.FirstOrDefaultAsync(u =>
            u.PatientId == appt.PatientId ||
            u.PatientId == $"PAT-{appt.PatientId.PadLeft(3, '0')}");

        if (patientUser != null)
        {
          var (title, message, type) = req.Status switch
          {
            "confirmed" => (
                "Rendez-vous confirmé",
                $"RDV {appt.Date} {appt.Time} confirmé ✓",
                "success"
            ),

            "cancelled" => (
                "Rendez-vous annulé",
                $"RDV {appt.Date} {appt.Time} annulé",
                "error"
            ),

            "done" => (
                "Consultation terminée",
                $"Merci pour votre visite",
                "info"
            ),

            _ => (
                "Mise à jour RDV",
                "Statut mis à jour",
                "info"
            )
          };

          await _notifSvc.SendAsync(
              patientUser.Id.ToString(),
              title,
              message,
              type
          );
        }
      }

      // 🔥 SMART CANCELLATION
      if (req.Status == "cancelled")
      {
        Console.WriteLine("🔥 CANCEL RDV TRIGGERED");
        var date = appt.Date;
        var time = appt.Time;

        var waiting = await _db.WaitingList
            .Where(w =>
                w.WantedDate == date &&
                !w.IsConfirmed &&
                !w.IsNotified)
            .OrderByDescending(w => w.Priority)
            .ThenBy(w => w.CreatedAt)
            .FirstOrDefaultAsync();

        if (waiting != null)
        {
          _db.WaitingList.Remove(waiting);
          await _db.SaveChangesAsync();

          var patientId = waiting.PatientId;
          var patientIdPadded = $"PAT-{waiting.PatientId.PadLeft(3, '0')}";

          var rawId = waiting.PatientId.Replace("PAT-", "").TrimStart('0');
          if (string.IsNullOrEmpty(rawId)) rawId = "0";

          Console.WriteLine($"🔍 WaitingList PatientId = '{waiting.PatientId}' | rawId = '{rawId}'");

          var allPatients = await _db.Users.Where(u => u.Role == "Patient").ToListAsync();
          foreach (var p in allPatients)
            Console.WriteLine($"   👤 User Id={p.Id} | PatientId='{p.PatientId}' | Email={p.Email}");

          var waitingUser = allPatients.FirstOrDefault(u =>
              u.PatientId != null &&
              (
                  u.PatientId == waiting.PatientId ||
                  u.PatientId == $"PAT-{waiting.PatientId.PadLeft(3, '0')}" ||
                  u.PatientId.Replace("PAT-", "").TrimStart('0') == rawId ||
                  u.Id.ToString() == rawId
              ));

          if (waitingUser != null)
          {
            Console.WriteLine($"✅ WAITING USER FOUND: {waitingUser.Email}");

            var actionData = JsonSerializer.Serialize(new
            {
              waitingListId = waiting.Id,
              date,
              time
            });

            await _notifSvc.SendWithActionAsync(
                waitingUser.Id.ToString(),
                "Place disponible ! ⏰",
                $"Une place est libre le {date} à {time}. Vous avez 10 minutes pour confirmer.",
                "warning",
                actionData
            );

            Console.WriteLine("✅ PLACE DISPONIBLE SENT");
          }
          else
          {
            Console.WriteLine("❌ WAITING USER NOT FOUND");
          }
        }
        else
        {
          Console.WriteLine("❌ NO WAITING PATIENT");
        }
      }

      return Ok(appt);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var appt = await _db.Appointments.FindAsync(id);
      if (appt == null) return NotFound();

      _db.Appointments.Remove(appt);
      await _db.SaveChangesAsync();

      return NoContent();
    }
  }
}
