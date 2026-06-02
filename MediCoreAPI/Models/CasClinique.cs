namespace MediCoreAPI.Models
{
  public class CasClinique
  {
    public int Id { get; set; }

    public string Categorie { get; set; } = "";

    public string Category { get; set; } = "";

    public string CatColor { get; set; } = "";

    public string Titre { get; set; } = "";

    public string BeforeImg { get; set; } = "";

    public string AfterImg { get; set; } = "";

    public string Description { get; set; } = "";

    public string Traitement { get; set; } = "";

    public string Duree { get; set; } = "";

    public string Tags { get; set; } = "";

    public double SliderPos { get; set; } = 50;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
