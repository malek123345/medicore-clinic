using MediCoreAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/analytics")]
  [Authorize]
  public class AnalyticsController : ControllerBase
  {
    private readonly AppDbContext _db;
    public AnalyticsController(AppDbContext db) => _db = db;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
      var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
      var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1)
          .ToString("yyyy-MM-dd");

      var appointmentsToday = await _db.Appointments
          .CountAsync(a => a.Date == today);

      var appointmentsMonth = await _db.Appointments
          .CountAsync(a => string.Compare(a.Date, firstOfMonth) >= 0);

      var totalPatients = await _db.Patients.CountAsync();

      var totalOrdonnances = await _db.Ordonnances.CountAsync();

      var confirmedToday = await _db.Appointments
          .CountAsync(a => a.Date == today && a.Status == "confirmed");

      var pendingReview = await _db.Patients
          .CountAsync(p => p.Status == "revoir");

      return Ok(new
      {
        appointmentsToday,
        appointmentsMonth,
        appointmentsTrend = 8,
        totalPatients,
        patientsTrend = 12,
        totalOrdonnances,
        completedToday = confirmedToday,
        completedTrend = 5,
        pendingReview,
        pendingTrend = 3,
      });
    }

    [HttpGet("weekly")]
    public async Task<IActionResult> GetWeekly()
    {
      var today = DateTime.UtcNow;
      var result = new List<object>();

      for (int i = 6; i >= 0; i--)
      {
        var date = today.AddDays(-i);
        var dateStr = date.ToString("yyyy-MM-dd");
        var count = await _db.Appointments
            .CountAsync(a => a.Date == dateStr);

        result.Add(new
        {
          day = date.DayOfWeek switch
          {
            DayOfWeek.Monday => "L",
            DayOfWeek.Tuesday => "M",
            DayOfWeek.Wednesday => "M",
            DayOfWeek.Thursday => "J",
            DayOfWeek.Friday => "V",
            DayOfWeek.Saturday => "S",
            _ => "D"
          },
          count,
          isToday = i == 0
        });
      }

      return Ok(result);
    }

    [HttpGet("mini-stats")]
    public async Task<IActionResult> GetMiniStats()
    {
      var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

      var newPatients = await _db.Patients
          .CountAsync(p => p.CreatedAt >= firstOfMonth);

      var pending = await _db.Appointments
          .CountAsync(a => a.Status == "pending");

      var urgences = await _db.Patients
          .CountAsync(p => p.Status == "revoir");

      return Ok(new { newPatients, pending, urgences });
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthly()
    {
      var data = new[]
      {
                new { month="Jan", patients=180, rdv=22, revenue=3200 },
                new { month="Fév", patients=195, rdv=28, revenue=3800 },
                new { month="Mar", patients=210, rdv=31, revenue=4100 },
                new { month="Avr", patients=202, rdv=26, revenue=3600 },
                new { month="Mai", patients=220, rdv=34, revenue=4820 },
                new { month="Jun", patients=235, rdv=38, revenue=5100 },
                new { month="Jul", patients=228, rdv=35, revenue=4700 },
                new { month="Aoû", patients=242, rdv=40, revenue=5400 },
                new { month="Sep", patients=238, rdv=37, revenue=4900 },
                new { month="Oct", patients=248, rdv=42, revenue=5600 },
                new { month="Nov", patients=244, rdv=39, revenue=5200 },
                new { month="Déc", patients=260, rdv=45, revenue=6100 },
            };
      return Ok(data);
    }
  }
}
