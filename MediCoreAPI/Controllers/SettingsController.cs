using MediCoreAPI.Data;
using MediCoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/settings")]
  [Authorize]
  public class SettingsController : ControllerBase
  {
    private readonly AppDbContext _db;
    public SettingsController(AppDbContext db) => _db = db;

    [HttpGet("cabinet")]
    public async Task<IActionResult> Get()
    {
      var s = await _db.CabinetSettings.FirstOrDefaultAsync();
      if (s == null) return Ok(new CabinetSettings());
      return Ok(s);
    }

    [HttpPut("cabinet")]
    public async Task<IActionResult> Save([FromBody] CabinetSettings req)
    {
      var s = await _db.CabinetSettings.FirstOrDefaultAsync();
      if (s == null)
      {
        _db.CabinetSettings.Add(req);
      }
      else
      {
        s.Nom = req.Nom;
        s.Adresse = req.Adresse;
        s.Telephone = req.Telephone;
        s.Email = req.Email;
        s.SiteWeb = req.SiteWeb;
        s.Horaires = req.Horaires;
        s.NumeroOrdre = req.NumeroOrdre;
        s.MatriculeFiscal = req.MatriculeFiscal;
      }
      await _db.SaveChangesAsync();
      return Ok(s ?? req);
    }
  }
}
