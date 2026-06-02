using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace MediCoreAPI.Services
{
  public class EmailService
  {
    private readonly string _host;
    private readonly int _port;
    private readonly string _username;
    private readonly string _password;
    private readonly string _fromName;

    public EmailService(IConfiguration config)
    {
      _host = config["Email:SmtpHost"] ?? "smtp.gmail.com";
      _port = int.Parse(config["Email:SmtpPort"] ?? "587");
      _username = config["Email:Username"] ?? "";
      _password = config["Email:Password"] ?? "";
      _fromName = config["Email:FromName"] ?? "MediCore";
    }

    public async Task SendAsync(string toEmail, string subject, string htmlBody)
    {
      Console.WriteLine("EMAIL START");

      try
      {
        var message = new MimeMessage();

        message.From.Add(new MailboxAddress(_fromName, _username));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;

        message.Body = new TextPart("html")
        {
          Text = htmlBody
        };

        using var client = new SmtpClient();

        client.CheckCertificateRevocation = false;

        Console.WriteLine("CONNECTING...");

        await client.ConnectAsync(
            _host,
            _port,
            SecureSocketOptions.StartTls
        );

        Console.WriteLine("AUTH...");

        client.AuthenticationMechanisms.Remove("XOAUTH2");

        await client.AuthenticateAsync(_username, _password);

        Console.WriteLine("SENDING...");

        await client.SendAsync(message);

        await client.DisconnectAsync(true);

        Console.WriteLine("EMAIL SENT SUCCESS");
      }
      catch (Exception ex)
      {
        Console.WriteLine("EMAIL ERROR:");
        Console.WriteLine(ex.Message);
      }
    }
  }
}
