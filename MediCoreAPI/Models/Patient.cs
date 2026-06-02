namespace MediCoreAPI.Models
{
  public class Patient
  {
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? DateOfBirth { get; set; }
    public string? Status { get; set; } = "stable";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
