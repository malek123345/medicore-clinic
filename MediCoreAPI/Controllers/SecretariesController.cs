using MediCoreAPI.Data;
using MediCoreAPI.DTOs;
using MediCoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/secretaries")]
  [Authorize]
  public class SecretariesController : ControllerBase
  {
    private readonly AppDbContext _db;
    public SecretariesController(AppDbContext db) => _db = db;

    private int DoctorUserId => int.Parse(User.FindFirstValue("id") ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var doctorId = DoctorUserId.ToString();
      var list = await _db.Users
          .Where(u => u.Role == "Secretary" && u.PatientId == doctorId)
          .OrderByDescending(u => u.CreatedAt)
          .Select(u => new {
            u.Id,
            u.Email,
            u.Name,
            u.Phone,
            u.CreatedAt,
            permissions = new { u.PermRdv, u.PermPatients, u.PermOrdonnances, u.PermParametres }
          })
          .ToListAsync();
      return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSecretaryRequest req)
    {
      var emailKey = req.Email.ToLower().Trim();
      if (await _db.Users.AnyAsync(u => u.Email.ToLower() == emailKey))
        return Conflict(new { message = "Cet email est déjà utilisé." });

      if (string.IsNullOrWhiteSpace(req.FirstName) || string.IsNullOrWhiteSpace(req.LastName))
        return BadRequest(new { message = "Nom et prénom sont obligatoires." });

      if (req.Password.Length < 6)
        return BadRequest(new { message = "Le mot de passe doit contenir au moins 6 caractères." });

      var sec = new User
      {
        Email = emailKey,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
        Role = "Secretary",
        Name = $"{req.FirstName} {req.LastName}",
        Phone = req.Phone,
        Specialty = "Secrétaire Médicale",
        PatientId = DoctorUserId.ToString(),
        PermRdv = req.Permissions.Rdv,
        PermPatients = req.Permissions.Patients,
        PermOrdonnances = req.Permissions.Ordonnances,
        PermParametres = req.Permissions.Parametres,
      };
      _db.Users.Add(sec);
      await _db.SaveChangesAsync();
      return Ok(new { message = "Secrétaire créée avec succès.", id = sec.Id });
    }

    [HttpPut("{email}/permissions")]
    public async Task<IActionResult> UpdatePermissions(string email, [FromBody] UpdatePermissionsRequest req)
    {
      var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower() && u.Role == "Secretary");
      if (user == null) return NotFound();

      user.PermRdv = req.Permissions.Rdv;
      user.PermPatients = req.Permissions.Patients;
      user.PermOrdonnances = req.Permissions.Ordonnances;
      user.PermParametres = req.Permissions.Parametres;
      await _db.SaveChangesAsync();
      return Ok(new { message = "Permissions mises à jour." });
    }

    [HttpPut("{email}/password")]
    public async Task<IActionResult> ResetPassword(string email, [FromBody] ResetPasswordRequest req)
    {
      if (req.NewPassword.Length < 6)
        return BadRequest(new { message = "Le mot de passe doit contenir au moins 6 caractères." });

      var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower() && u.Role == "Secretary");
      if (user == null) return NotFound();

      user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
      await _db.SaveChangesAsync();
      return Ok(new { message = "Mot de passe réinitialisé." });
    }

    [HttpDelete("{email}")]
    public async Task<IActionResult> Delete(string email)
    {
      var currentEmail = User.FindFirstValue(ClaimTypes.Email);
      if (email.ToLower() == currentEmail?.ToLower())
        return BadRequest(new { message = "Impossible de supprimer votre propre compte." });

      var doctorId = DoctorUserId.ToString();
      var user = await _db.Users.FirstOrDefaultAsync(u =>
          u.Email.ToLower() == email.ToLower()
          && u.Role == "Secretary"
          && u.PatientId == doctorId);
      if (user == null) return NotFound();

      _db.Users.Remove(user);
      await _db.SaveChangesAsync();
      return Ok(new { message = "Secrétaire supprimée." });
    }
  }
}
