namespace MediCoreAPI.Models
{
  public class PatientDocument
  {
    public int Id { get; set; }
    public string PatientId { get; set; } = "";
    public string FileName { get; set; } = "";
    public string FilePath { get; set; } = "";
    public string FileType { get; set; } = "";
    public long FileSize { get; set; }
    public string UploadedBy { get; set; } = "patient"; // "patient" أو "doctor"
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
  }
}
