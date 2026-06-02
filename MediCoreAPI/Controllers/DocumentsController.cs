using MediCoreAPI.Data;
using MediCoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/documents")]
  [Authorize]
  public class DocumentsController : ControllerBase
  {
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public DocumentsController(AppDbContext db, IWebHostEnvironment env)
    {
      _db = db;
      _env = env;
    }

    // ✅ Upload — patient أو doctor
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] string patientId, [FromForm] string? uploadedBy)
    {
      if (file == null || file.Length == 0)
        return BadRequest(new { message = "Fichier invalide." });

      if (file.Length > 10 * 1024 * 1024)
        return BadRequest(new { message = "Fichier trop volumineux (max 10MB)." });

      var uploads = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
      Directory.CreateDirectory(uploads);

      var ext = Path.GetExtension(file.FileName);
      var safeName = $"{Guid.NewGuid()}{ext}";
      var fullPath = Path.Combine(uploads, safeName);

      using (var stream = new FileStream(fullPath, FileMode.Create))
        await file.CopyToAsync(stream);

      var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
      var by = uploadedBy ?? (role == "Doctor" ? "doctor" : "patient");

      var doc = new PatientDocument
      {
        PatientId = patientId,
        FileName = file.FileName,
        FilePath = $"/uploads/{safeName}",
        FileType = file.ContentType,
        FileSize = file.Length,
        UploadedBy = by,
        UploadedAt = DateTime.UtcNow
      };

      _db.PatientDocuments.Add(doc);
      await _db.SaveChangesAsync();

      return Ok(doc);
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetForPatient(string patientId)
    {
      var num = patientId.Replace("PAT-", "").TrimStart('0');
      if (string.IsNullOrEmpty(num)) num = "0";
      var padded = $"PAT-{num.PadLeft(3, '0')}";

      // ✅ ابحث في Users باش تلقى User.Id المرتبط بهذا المريض
      var user = await _db.Users.FirstOrDefaultAsync(u =>
          u.PatientId == patientId ||
          u.PatientId == padded);

      var userIdStr = user?.Id.ToString() ?? "";

      var docs = await _db.PatientDocuments
          .Where(d =>
              d.PatientId == patientId ||
              d.PatientId == num ||
              d.PatientId == padded ||
              (userIdStr != "" && d.PatientId == userIdStr))
          .OrderByDescending(d => d.UploadedAt)
          .ToListAsync();

      return Ok(docs);
    }

    // ✅ حذف ملف
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var doc = await _db.PatientDocuments.FindAsync(id);
      if (doc == null) return NotFound();

      var fullPath = Path.Combine(_env.WebRootPath ?? "wwwroot", doc.FilePath.TrimStart('/'));
      if (System.IO.File.Exists(fullPath))
        System.IO.File.Delete(fullPath);

      _db.PatientDocuments.Remove(doc);
      await _db.SaveChangesAsync();

      return NoContent();
    }
  }
}
