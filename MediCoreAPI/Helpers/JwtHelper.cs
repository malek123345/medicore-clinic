using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MediCoreAPI.Models;
using Microsoft.IdentityModel.Tokens;

namespace MediCoreAPI.Helpers
{
  public class JwtHelper
  {
    private readonly IConfiguration _config;
    public JwtHelper(IConfiguration config) => _config = config;

    public string GenerateToken(User user)
    {
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
      var expires = DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpiresInHours"] ?? "24"));

      var claims = new List<Claim>
      {
        new Claim("id",              user.Id.ToString()),
        new Claim(ClaimTypes.Email,  user.Email),
        new Claim(ClaimTypes.Role,   user.Role),
        new Claim("name",            user.Name),
      };

      if (user.Role == "Secretary")
      {
        var perms = System.Text.Json.JsonSerializer.Serialize(new
        {
          rdv = user.PermRdv,
          patients = user.PermPatients,
          ordonnances = user.PermOrdonnances,
          parametres = user.PermParametres,
        });
        claims.Add(new Claim("permissions", perms));
        claims.Add(new Claim("doctorId", user.PatientId ?? ""));
      }

      if (user.Role == "Patient" && user.PatientId != null)
        claims.Add(new Claim("patientId", user.PatientId));

      if (user.Specialty != null)
        claims.Add(new Claim("specialty", user.Specialty));

      var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: expires,
        signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
