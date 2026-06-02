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
  [Route("api/ordonnances")]
  [Authorize]
  public class OrdonnancesController : ControllerBase
  {
    private readonly AppDbContext _db;
    private readonly NotificationService _notifSvc;

    public OrdonnancesController(AppDbContext db, NotificationService notifSvc)
    {
      _db = db;
      _notifSvc = notifSvc;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var list = await _db.Ordonnances
          .Include(o => o.Meds)
          .OrderByDescending(o => o.CreatedAt)
          .ToListAsync();
      return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var o = await _db.Ordonnances
          .Include(x => x.Meds)
          .FirstOrDefaultAsync(x => x.Id == id);
      if (o == null) return NotFound();
      return Ok(o);
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetForPatient(string patientId)
    {
      var list = await _db.Ordonnances
          .Include(o => o.Meds)
          .Where(o => o.PatientId == patientId)
          .OrderByDescending(o => o.CreatedAt)
          .ToListAsync();
      return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrdonnanceRequest req)
    {
      var ord = new Ordonnance
      {
        PatientName = req.PatientName,
        PatientId = req.PatientId,
        Date = req.Date ?? DateTime.UtcNow.ToString("dd MMM yyyy"),
        Instructions = req.Instructions,
        Status = req.Status ?? "active",
        CreatedAt = DateTime.UtcNow
      };
      _db.Ordonnances.Add(ord);
      await _db.SaveChangesAsync();

      if (req.Meds?.Count > 0)
      {
        var meds = req.Meds.Select(m => new OrdonnanceMed
        {
          OrdonnanceId = ord.Id,
          Name = m.Name,
          Dose = m.Dose,
          Freq = m.Freq,
          Duree = m.Duree,
        }).ToList();
        _db.OrdonnanceMeds.AddRange(meds);
        await _db.SaveChangesAsync();
      }

      // ✅ إشعار للمريض
      if (!string.IsNullOrWhiteSpace(req.PatientId))
      {
        var patientId = req.PatientId;
        var patientIdPadded = $"PAT-{req.PatientId.PadLeft(3, '0')}";

        var patientUser = await _db.Users
            .FirstOrDefaultAsync(u =>
                u.PatientId == patientId ||
                u.PatientId == patientIdPadded);

        if (patientUser != null)
        {
          await _notifSvc.SendAsync(
            patientUser.Id.ToString(),
            "Nouvelle ordonnance",
            $"Dr. Khaddar vous a prescrit une nouvelle ordonnance le {ord.Date}.",
            "success"
          );
        }
      }

      var result = await _db.Ordonnances
          .Include(o => o.Meds)
          .FirstAsync(o => o.Id == ord.Id);
      return CreatedAtAction(nameof(GetById), new { id = ord.Id }, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var ord = await _db.Ordonnances
          .Include(o => o.Meds)
          .FirstOrDefaultAsync(o => o.Id == id);
      if (ord == null) return NotFound();
      _db.OrdonnanceMeds.RemoveRange(ord.Meds);
      _db.Ordonnances.Remove(ord);
      await _db.SaveChangesAsync();
      return NoContent();
    }
  }
}
