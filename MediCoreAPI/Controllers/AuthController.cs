using MediCoreAPI.Data;
using MediCoreAPI.DTOs;
using MediCoreAPI.Helpers;
using MediCoreAPI.Models;
using MediCoreAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/auth")]
  public class AuthController : ControllerBase
  {
    private readonly AppDbContext _db;
    private readonly JwtHelper _jwt;
    private readonly EmailService _emailSvc;

    public AuthController(AppDbContext db, JwtHelper jwt, EmailService emailSvc)
    {
      _db = db;
      _jwt = jwt;
      _emailSvc = emailSvc;
    }

    // ================= LOGIN =================
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
      var email = req.Email?.Trim().ToLower();

      var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);

      if (user == null)
        return Unauthorized(new { message = "INVALID_CREDENTIALS" });

      if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        return Unauthorized(new { message = "INVALID_CREDENTIALS" });

      // ✅ IMPORTANT FIX (FINAL LOGIC)
      if (user.Role == "Patient"
          && user.VerificationCode != null
          && !user.IsVerified)
      {
        return Unauthorized(new { message = "EMAIL_NOT_VERIFIED" });
      }

      var token = _jwt.GenerateToken(user);

      return Ok(new
      {
        token,
        user = MapUser(user)
      });
    }

    // ================= REGISTER =================
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
      var email = req.Email?.Trim().ToLower();

      if (await _db.Users.AnyAsync(u => u.Email.ToLower() == email))
        return Conflict(new { message = "EMAIL_ALREADY_USED" });

      var code = new Random().Next(100000, 999999).ToString();

      var user = new User
      {
        Name = $"{req.FirstName} {req.LastName}",
        Email = email,
        Phone = req.Phone,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
        Role = "Patient",

        IsVerified = false,
        VerificationCode = code,

        CreatedAt = DateTime.UtcNow
      };

      _db.Users.Add(user);
      await _db.SaveChangesAsync();

      await _emailSvc.SendAsync(email, "Verification Code", $"Your code: {code}");

      return Ok(new { message = "CODE_SENT", userId = user.Id });
    }

    // ================= VERIFY =================
    [HttpPost("verify")]
    [AllowAnonymous]
    public async Task<IActionResult> Verify([FromBody] VerifyRequest req)
    {
      var email = req.Email?.Trim().ToLower();

      var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);

      if (user == null)
        return NotFound(new { message = "USER_NOT_FOUND" });

      if (user.VerificationCode != req.Code)
        return BadRequest(new { message = "INVALID_CODE" });

      user.IsVerified = true;
      user.VerificationCode = null;

      await _db.SaveChangesAsync();

      return Ok(new { message = "ACCOUNT_VERIFIED" });
    }

    // ================= LOGOUT =================
    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
      return Ok(new { message = "Déconnecté" });
    }

    // ================= ME =================
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
      var userId = int.Parse(User.FindFirstValue("id")!);
      var user = await _db.Users.FindAsync(userId);
      if (user == null) return NotFound();
      return Ok(MapUser(user));
    }

    // ================= UPDATE PROFILE =================
    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
    {
      var userId = int.Parse(User.FindFirstValue("id")!);
      var user = await _db.Users.FindAsync(userId);
      if (user == null) return NotFound();

      if (!string.IsNullOrWhiteSpace(req.Nom) || !string.IsNullOrWhiteSpace(req.Prenom))
      {
        var prenom = req.Prenom ?? "";
        var nom = req.Nom ?? "";
        user.Name = $"{prenom} {nom}".Trim();
      }

      if (!string.IsNullOrWhiteSpace(req.Spec)) user.Specialty = req.Spec;
      if (!string.IsNullOrWhiteSpace(req.Tel)) user.Phone = req.Tel;
      if (!string.IsNullOrWhiteSpace(req.Email)) user.Email = req.Email;

      await _db.SaveChangesAsync();
      return Ok(MapUser(user));
    }

    // ================= PASSWORD =================
    [HttpPut("me/password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
      var userId = int.Parse(User.FindFirstValue("id")!);
      var user = await _db.Users.FindAsync(userId);

      if (user == null) return NotFound();

      if (!BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
        return BadRequest(new { message = "WRONG_PASSWORD" });

      user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);

      await _db.SaveChangesAsync();

      return Ok(new { message = "PASSWORD_UPDATED" });
    }

    // ================= MAPPER =================
    private static UserDto MapUser(User u) => new(
      u.Id,
      u.Email,
      u.Role,
      u.Name,
      u.Specialty,
      u.Phone,
      u.PatientId,
      u.Role == "Secretary"
        ? new PermissionsDto(u.PermRdv, u.PermPatients, u.PermOrdonnances, u.PermParametres)
        : null,
      u.CreatedAt
    );
  }
}
