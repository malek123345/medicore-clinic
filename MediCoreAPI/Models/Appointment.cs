namespace MediCoreAPI.Models
{
  public class Appointment
  {
    public int Id { get; set; }
    public string Time { get; set; } = "";
    public string Date { get; set; } = "";
    public string PatientName { get; set; } = "";
    public string? PatientId { get; set; }
    public string? PatientPhone { get; set; }
    public string Type { get; set; } = "";
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
