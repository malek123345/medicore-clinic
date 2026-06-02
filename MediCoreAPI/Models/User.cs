namespace MediCoreAPI.Models
{
  public class User
  {
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Specialty { get; set; }
    public string? Phone { get; set; }
    public string? PatientId { get; set; }
    public bool PermRdv { get; set; }
    public bool PermPatients { get; set; }
    public bool PermOrdonnances { get; set; }
    public bool PermParametres { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // ✅ جديد
    public string? VerificationCode { get; set; }
    public bool IsVerified { get; set; } = true;
  }
}
