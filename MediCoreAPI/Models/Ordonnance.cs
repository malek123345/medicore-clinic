namespace MediCoreAPI.Models
{
  public class Ordonnance
  {
    public int Id { get; set; }
    public string PatientName { get; set; } = "";
    public string? PatientId { get; set; }
    public string Date { get; set; } = "";
    public string? Instructions { get; set; }
    public string Status { get; set; } = "active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<OrdonnanceMed> Meds { get; set; }
        = new List<OrdonnanceMed>();
  }
}
