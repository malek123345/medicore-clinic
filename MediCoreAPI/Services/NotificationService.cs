using MediCoreAPI.Data;
using MediCoreAPI.Hubs;
using MediCoreAPI.Models;
using Microsoft.AspNetCore.SignalR;

namespace MediCoreAPI.Services
{
  public class NotificationService
  {
    private readonly AppDbContext _db;
    private readonly IHubContext<NotificationHub> _hub;
    private readonly EmailService _emailSvc;

    public NotificationService(AppDbContext db, IHubContext<NotificationHub> hub, EmailService emailSvc)
    {
      _db = db;
      _hub = hub;
      _emailSvc = emailSvc;
    }

    private async Task<string?> GetUserEmail(string userId)
    {
      Console.WriteLine($"GET EMAIL FOR: {userId}");

      // 1) نحاول Users أولاً
      if (int.TryParse(userId, out var uid))
      {
        var user = await _db.Users.FindAsync(uid);

        if (user != null && !string.IsNullOrWhiteSpace(user.Email))
        {
          Console.WriteLine($"EMAIL FROM USER: {user.Email}");
          return user.Email;
        }

        // 2) fallback إلى patient
        if (!string.IsNullOrWhiteSpace(user?.PatientId))
        {
          var clean = user.PatientId.Replace("PAT-", "").TrimStart('0');

          if (int.TryParse(clean, out var pid))
          {
            var patient = await _db.Patients.FindAsync(pid);

            if (patient != null && !string.IsNullOrWhiteSpace(patient.Email))
            {
              Console.WriteLine($"EMAIL FROM PATIENT: {patient.Email}");
              return patient.Email;
            }
          }
        }
      }

      Console.WriteLine("EMAIL NOT FOUND ❌");
      return null;
    }

    public async Task SendAsync(string userId, string title, string message, string type = "info")
    {
      var notif = new Notification
      {
        UserId = userId,
        Title = title,
        Message = message,
        Type = type,
        CreatedAt = DateTime.UtcNow
      };
      _db.Notifications.Add(notif);
      await _db.SaveChangesAsync();

      await _hub.Clients.Group($"user-{userId}").SendAsync("ReceiveNotification", new
      {
        notif.Id,
        notif.Title,
        notif.Message,
        notif.Type,
        notif.IsRead,
        notif.CreatedAt
      });

      Console.WriteLine($"SendAsync: userId={userId}, title={title}");
      var email = await GetUserEmail(userId);
      Console.WriteLine($"SendAsync: email={email ?? "NULL"}");
      if (email != null)
        _ = Task.Run(() => _emailSvc.SendAsync(email, title,
          $@"<div style='font-family:Arial;padding:20px;max-width:600px;margin:0 auto'>
            <h2 style='color:#1b7fc4'>Dr. Khaddar - MediCore</h2>
            <p style='font-size:16px;color:#333'>{message}</p>
            <p style='font-size:12px;color:#999'>Cabinet Dr. Zied Khaddar — MediCore</p>
          </div>"));
    }

    public async Task SendWithActionAsync(string userId, string title, string message, string type, string actionData)
    {
      var notif = new Notification
      {
        UserId = userId,
        Title = title,
        Message = message,
        Type = type,
        ActionData = actionData,
        CreatedAt = DateTime.UtcNow
      };
      _db.Notifications.Add(notif);
      await _db.SaveChangesAsync();

      await _hub.Clients.Group($"user-{userId}").SendAsync("ReceiveNotification", new
      {
        notif.Id,
        notif.Title,
        notif.Message,
        notif.Type,
        notif.IsRead,
        notif.CreatedAt,
        notif.ActionData
      });

      Console.WriteLine($"SendWithActionAsync: userId={userId}, title={title}");
      Console.WriteLine("🔥 SEND NOTIF START");
      Console.WriteLine($"🔥 USER ID = {userId}");
      var email = await GetUserEmail(userId);

      Console.WriteLine($"SendWithActionAsync: email={email ?? "NULL"}");
      Console.WriteLine($"🔥 EMAIL FOUND = {email ?? "NULL"}");
      if (email != null)
        _ = Task.Run(() => _emailSvc.SendAsync(email, title,
          $@"<div style='font-family:Arial;padding:20px;max-width:600px;margin:0 auto'>
            <h2 style='color:#1b7fc4'>Dr. Khaddar - MediCore</h2>
            <p style='font-size:16px;color:#333'>{message}</p>
            <a href='http://localhost:4200'
               style='background:#1b7fc4;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold'>
              Confirmer maintenant
            </a>
            <p style='font-size:12px;color:#999'>Cabinet Dr. Zied Khaddar — MediCore</p>
          </div>"));
    }
  }
}
