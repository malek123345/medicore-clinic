namespace MediCoreAPI.Models
{
  public class WaitingList
  {
    public int Id { get; set; }
    public string PatientId { get; set; } = "";
    public string PatientName { get; set; } = "";
    public string WantedDate { get; set; } = "";
    public string? WantedTime { get; set; }
    public int Priority { get; set; } = 0;
    public bool IsNotified { get; set; } = false;
    public bool IsConfirmed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
