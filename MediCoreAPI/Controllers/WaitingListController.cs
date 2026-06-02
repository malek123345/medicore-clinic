using MediCoreAPI.Data;
using MediCoreAPI.Models;
using MediCoreAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/waiting-list")]
  [Authorize]
  public class WaitingListController : ControllerBase
  {
    private readonly AppDbContext _db;
    private readonly NotificationService _notifSvc;

    public WaitingListController(AppDbContext db, NotificationService notifSvc)
    {
      _db = db;
      _notifSvc = notifSvc;
    }

    // ✅ المريض يزيد نفسه في الـ waiting list
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddWaitingRequest req)
    {
      var userId = User.FindFirstValue("id") ?? "";

      // تأكد ما هوش موجود بالفعل
      var exists = await _db.WaitingList.AnyAsync(w =>
          w.PatientId == req.PatientId &&
          w.WantedDate == req.WantedDate &&
          !w.IsConfirmed);

      if (exists)
        return Conflict(new { message = "Vous êtes déjà sur la liste d'attente pour cette date." });

      var entry = new WaitingList
      {
        PatientId = req.PatientId,
        PatientName = req.PatientName,
        WantedDate = req.WantedDate,
        WantedTime = req.WantedTime,
        Priority = req.Priority,
        CreatedAt = DateTime.UtcNow
      };

      _db.WaitingList.Add(entry);
      await _db.SaveChangesAsync();

      return Ok(new { message = "Vous avez été ajouté à la liste d'attente.", id = entry.Id });
    }

    // ✅ المريض يشوف مكانه في الـ waiting list
    [HttpGet("my")]
    public async Task<IActionResult> GetMy([FromQuery] string patientId)
    {
      var list = await _db.WaitingList
          .Where(w => w.PatientId == patientId && !w.IsConfirmed)
          .OrderBy(w => w.CreatedAt)
          .ToListAsync();
      return Ok(list);
    }

    // ✅ المريض يحذف نفسه من الـ waiting list
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
      var entry = await _db.WaitingList.FindAsync(id);
      if (entry == null) return NotFound();
      _db.WaitingList.Remove(entry);
      await _db.SaveChangesAsync();
      return Ok(new { message = "Retiré de la liste d'attente." });
    }

    // ✅ المريض يقبل الـ slot المتاح
    [HttpPut("{id}/confirm")]
    public async Task<IActionResult> Confirm(int id)
    {
      var entry = await _db.WaitingList.FindAsync(id);
      if (entry == null) return NotFound();

      entry.IsConfirmed = true;
      await _db.SaveChangesAsync();

      return Ok(new { message = "Rendez-vous confirmé !" });
    }

    // ✅ الدكتور يشوف كل الـ waiting list
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var list = await _db.WaitingList
          .Where(w => !w.IsConfirmed)
          .OrderByDescending(w => w.Priority)
          .ThenBy(w => w.CreatedAt)
          .ToListAsync();
      return Ok(list);
    }
  }

  public record AddWaitingRequest(
      string PatientId, string PatientName,
      string WantedDate, string? WantedTime,
      int Priority = 0
  );
}
