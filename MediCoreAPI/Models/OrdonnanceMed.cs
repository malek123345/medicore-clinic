namespace MediCoreAPI.Models
{
  public class OrdonnanceMed
  {
    public int Id { get; set; }

    public int OrdonnanceId { get; set; }

    public string Name { get; set; } = "";

    public string Dose { get; set; } = "";

    public string? Freq { get; set; }

    public string Duree { get; set; } = "";
  }
}
