using MediCoreAPI.Data;
using MediCoreAPI.Models;
using MediCoreAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/notifications")]
  [Authorize]
  public class NotificationsController : ControllerBase
  {
    private readonly AppDbContext _db;
    private readonly NotificationService _notifSvc;

    public NotificationsController(AppDbContext db, NotificationService notifSvc)
    {
      _db = db;
      _notifSvc = notifSvc;
    }

    private string UserId => User.FindFirstValue("id") ?? "";

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var list = await _db.Notifications
          .Where(n => n.UserId == UserId)
          .OrderByDescending(n => n.CreatedAt)
          .Take(50)
          .ToListAsync();
      return Ok(list);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> UnreadCount()
    {
      var count = await _db.Notifications
          .CountAsync(n => n.UserId == UserId && !n.IsRead);
      return Ok(new { count });
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
      var notif = await _db.Notifications
          .FirstOrDefaultAsync(n => n.Id == id && n.UserId == UserId);
      if (notif == null) return NotFound();
      notif.IsRead = true;
      await _db.SaveChangesAsync();
      return Ok(notif);
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
      var notifs = await _db.Notifications
          .Where(n => n.UserId == UserId && !n.IsRead)
          .ToListAsync();
      notifs.ForEach(n => n.IsRead = true);
      await _db.SaveChangesAsync();
      return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var notif = await _db.Notifications
          .FirstOrDefaultAsync(n => n.Id == id && n.UserId == UserId);
      if (notif == null) return NotFound();
      _db.Notifications.Remove(notif);
      await _db.SaveChangesAsync();
      return NoContent();
    }

    // ✅ المريض يقبل الـ slot المتاح
    [HttpPost("{id}/confirm-slot")]
    public async Task<IActionResult> ConfirmSlot(int id)
    {
      var notif = await _db.Notifications
          .FirstOrDefaultAsync(n => n.Id == id && n.UserId == UserId);
      if (notif == null) return NotFound();
      if (string.IsNullOrWhiteSpace(notif.ActionData))
        return BadRequest(new { message = "Aucune donnée de créneau." });

      // جيب بيانات الـ slot
      var data = JsonSerializer.Deserialize<SlotActionData>(notif.ActionData);
      if (data == null) return BadRequest();

      // تأكد الـ slot مازال متاح
      var taken = await _db.Appointments.AnyAsync(a =>
          a.Date == data.date &&
          a.Time == data.time &&
          a.Status != "cancelled");

      if (taken)
        return Conflict(new { message = "Ce créneau a déjà été pris." });

      // جيب بيانات المريض
      var user = await _db.Users.FindAsync(int.Parse(UserId));
      if (user == null) return NotFound();

      var patientName = user.Name;
      string? patientPhone = user.Phone;
      if (!string.IsNullOrWhiteSpace(user.PatientId))
      {
        var patientIdNum = user.PatientId.Replace("PAT-", "").TrimStart('0');
        if (int.TryParse(patientIdNum, out var pid))
        {
          var patient = await _db.Patients.FindAsync(pid);
          if (patient != null)
          {
            patientName = patient.Name;
            patientPhone = patient.Phone;
          }
        }
      }

      // زيد الموعد تلقائياً
      var appt = new Appointment
      {
        Date = data.date,
        Time = data.time,
        PatientName = patientName ?? "",
        PatientId = user.PatientId,
        PatientPhone = patientPhone,
        Type = "Consultation",
        Status = "confirmed",
      };
      _db.Appointments.Add(appt);

      // حذف من الـ waiting list
      var waiting = await _db.WaitingList.FindAsync(data.waitingListId);
      if (waiting != null)
      {
        waiting.IsConfirmed = true;
        _db.WaitingList.Update(waiting);
      }

      // حذف الإشعار
      notif.IsRead = true;
      notif.ActionData = null;

      await _db.SaveChangesAsync();

      // إشعار تأكيد للمريض
      await _notifSvc.SendAsync(
        UserId,
        "Rendez-vous confirmé ✓",
        $"Votre RDV du {data.date} à {data.time} a été confirmé automatiquement !",
        "success"
      );

      return Ok(new { message = "Rendez-vous confirmé !", appointment = appt });
    }
  }

  public class SlotActionData
  {
    public int waitingListId { get; set; }
    public string date { get; set; } = "";
    public string time { get; set; } = "";
  }
}
