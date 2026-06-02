using MediCoreAPI.Data;
using MediCoreAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MediCoreAPI.Services
{
  public class NotificationCleanupService : BackgroundService
  {
    private readonly IServiceProvider _services;
    private readonly ILogger<NotificationCleanupService> _logger;

    public NotificationCleanupService(
      IServiceProvider services,
      ILogger<NotificationCleanupService> logger)
    {
      _services = services;
      _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      while (!stoppingToken.IsCancellationRequested)
      {
        await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        await CheckExpiredSlots();
      }
    }

    private async Task CheckExpiredSlots()
    {
      using var scope = _services.CreateScope();
      var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
      var notifSvc = scope.ServiceProvider.GetRequiredService<NotificationService>();

      var expired = await db.Notifications
          .Where(n =>
              n.Title.Contains("Place disponible") &&
              n.ActionData != null &&
              !n.IsRead &&
              n.CreatedAt < DateTime.UtcNow.AddMinutes(-10))
          .ToListAsync();

      foreach (var notif in expired)
      {
        try
        {
          var data = JsonSerializer.Deserialize<SlotActionData>(notif.ActionData!);
          if (data == null) continue;

          // حذف الإشعار المنتهي
          notif.ActionData = null;
          notif.IsRead = true;
          await db.SaveChangesAsync();

          // إشعار للمريض إن الوقت انتهى
          await notifSvc.SendAsync(
            notif.UserId,
            "Créneau expiré ⌛",
            $"Le délai de confirmation pour le {data.date} à {data.time} est expiré.",
            "error"
          );

          // ✅ جيب المريض الحالي باش نستثنيه
          var currentUser = await db.Users.FindAsync(int.Parse(notif.UserId));

          // ✅ بحث في الـ waiting list للمريض الثاني — مختلف عن المريض المنتهي
          var nextWaiting = await db.WaitingList
              .Where(w =>
                  w.WantedDate == data.date &&
                  !w.IsConfirmed &&
                  w.PatientId != currentUser!.PatientId)
              .OrderByDescending(w => w.Priority)
              .ThenBy(w => w.CreatedAt)
              .FirstOrDefaultAsync();

          if (nextWaiting != null)
          {
            nextWaiting.IsNotified = true;
            await db.SaveChangesAsync();

            var nextUser = await db.Users
                .FirstOrDefaultAsync(u => u.PatientId == nextWaiting.PatientId);

            if (nextUser != null)
            {
              var actionData = JsonSerializer.Serialize(new
              {
                waitingListId = nextWaiting.Id,
                date = data.date,
                time = data.time
              });

              await notifSvc.SendWithActionAsync(
                nextUser.Id.ToString(),
                "Place disponible ! ⏰",
                $"Une place s'est libérée le {data.date} à {data.time}. Vous avez 10 minutes pour confirmer !",
                "warning",
                actionData
              );
            }
          }
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Erreur lors du traitement du slot expiré");
        }
      }
    }
  }

  public class SlotActionData
  {
    public int waitingListId { get; set; }
    public string date { get; set; } = "";
    public string time { get; set; } = "";
  }
}
