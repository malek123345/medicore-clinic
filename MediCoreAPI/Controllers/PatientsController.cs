using MediCoreAPI.Data;
using MediCoreAPI.DTOs;
using MediCoreAPI.Models;
using MediCoreAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/patients")]
  [Authorize]
  public class PatientsController : ControllerBase
  {
    private readonly AppDbContext _db;
    private readonly NotificationService _notifSvc;

    public PatientsController(AppDbContext db, NotificationService notifSvc)
    {
      _db = db;
      _notifSvc = notifSvc;
    }

    // ================= GET ALL =================
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? q)
    {
      var query = _db.Patients.AsQueryable();

      if (!string.IsNullOrWhiteSpace(q))
      {
        var ql = q.ToLower();

        query = query.Where(p =>
          (p.Name != null && p.Name.ToLower().Contains(ql)) ||
          (p.FirstName != null && p.FirstName.ToLower().Contains(ql)) ||
          (p.LastName != null && p.LastName.ToLower().Contains(ql)) ||
          p.Id.ToString().Contains(ql)
        );
      }

      var list = await query
        .OrderByDescending(p => p.CreatedAt)
        .ToListAsync();

      return Ok(new { data = list, total = list.Count });
    }

    // ================= GET BY ID =================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var p = await _db.Patients.FindAsync(id);
      if (p == null) return NotFound();
      return Ok(p);
    }

    // ================= CREATE PATIENT =================
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePatientRequest req)
    {
      var firstName = req.FirstName ?? "";
      var lastName = req.LastName ?? "";
      var fullName = req.Name ?? $"{firstName} {lastName}".Trim();

      // 1️⃣ Create patient
      var patient = new Patient
      {
        Name = fullName,
        FirstName = firstName,
        LastName = lastName,
        DateOfBirth = req.DateOfBirth,
        Phone = req.Phone,
        Email = req.Email,
        Address = req.Address,
        Status = req.Status ?? "stable",
        CreatedAt = DateTime.UtcNow
      };

      _db.Patients.Add(patient);
      await _db.SaveChangesAsync();

      // 2️⃣ Notifications
      var doctorUser = await _db.Users.FirstOrDefaultAsync(u => u.Role == "Doctor");

      if (doctorUser != null)
      {
        await _notifSvc.SendAsync(
          doctorUser.Id.ToString(),
          "Nouveau patient",
          $"{patient.Name} a été ajouté.",
          "info"
        );
      }

      var secretaries = await _db.Users.Where(u => u.Role == "Secretary").ToListAsync();

      foreach (var sec in secretaries)
      {
        await _notifSvc.SendAsync(
          sec.Id.ToString(),
          "Nouveau patient",
          $"{patient.Name} a été ajouté.",
          "info"
        );
      }

      // 3️⃣ Create login account (ONLY if email + password exist)
      if (!string.IsNullOrWhiteSpace(req.Email) &&
          !string.IsNullOrWhiteSpace(req.Password))
      {
        var email = req.Email.ToLower().Trim();

        var exists = await _db.Users.AnyAsync(u => u.Email.ToLower() == email);

        if (!exists)
        {
          var user = new User
          {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = "Patient",
            Name = fullName,
            Phone = req.Phone,
            PatientId = $"PAT-{patient.Id:D3}",

            // ✅ IMPORTANT FIX
            IsVerified = true,
            VerificationCode = null,
            CreatedAt = DateTime.UtcNow
          };

          _db.Users.Add(user);
          await _db.SaveChangesAsync();
        }
      }

      return CreatedAtAction(nameof(GetById), new { id = patient.Id }, patient);
    }

    // ================= UPDATE =================
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Patient req)
    {
      var patient = await _db.Patients.FindAsync(id);
      if (patient == null) return NotFound();

      patient.Name = req.Name ?? patient.Name;
      patient.FirstName = req.FirstName ?? patient.FirstName;
      patient.LastName = req.LastName ?? patient.LastName;
      patient.DateOfBirth = req.DateOfBirth ?? patient.DateOfBirth;
      patient.Phone = req.Phone ?? patient.Phone;
      patient.Email = req.Email ?? patient.Email;
      patient.Address = req.Address ?? patient.Address;
      patient.Status = req.Status ?? patient.Status;

      await _db.SaveChangesAsync();
      return Ok(patient);
    }

    // ================= DELETE =================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var patient = await _db.Patients.FindAsync(id);
      if (patient == null) return NotFound();

      _db.Patients.Remove(patient);
      await _db.SaveChangesAsync();

      return NoContent();
    }
    [HttpGet("{id}/user")]
    public async Task<IActionResult> GetPatientUser(int id)
    {
      var padded = $"PAT-{id:D3}";
      var user = await _db.Users.FirstOrDefaultAsync(u =>
          u.PatientId == id.ToString() ||
          u.PatientId == padded);
      if (user == null) return NotFound();
      return Ok(new { id = user.Id });
    }
  }
}
