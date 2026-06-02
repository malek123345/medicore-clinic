namespace MediCoreAPI.DTOs
{
  public record LoginRequest(string Email, string Password);
  public record LoginResponse(string Token, UserDto User);

  public record UserDto(
      int Id, string Email, string Role, string Name,
      string? Specialty, string? Phone, string? PatientId,
      PermissionsDto? Permissions, DateTime CreatedAt
  );

  public record PermissionsDto(
      bool Rdv, bool Patients, bool Ordonnances, bool Parametres
  );

  public record UpdateProfileRequest(string? Nom, string? Prenom, string? Spec, string? Tel, string? Email);
  public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

  public record CreatePatientRequest(
      string? FirstName, string? LastName, string? Name,
      string? DateOfBirth, string? Phone, string? Email,
      string? Address, string? Status, string? Password
  );

  public record CreateAppointmentRequest(
    string PatientName, string? PatientId, string? PatientPhone,
    string Date, string Time, string Type
);

  public record UpdateStatusRequest(string Status);

  public record CreateOrdonnanceRequest(
      string PatientName, string? PatientId,
      string? Date, string? Instructions,
      string? Status, List<MedDto>? Meds
  );

  public record MedDto(string Name, string Dose, string? Freq, string Duree);

  public record CreateInvoiceRequest(
      string PatientName, string? PatientId,
      string? Date, decimal Amount,
      string? Status, string? Description, string? Service
  );

  public record SendMessageRequest(string Text);

  public record CreateSecretaryRequest(
      string FirstName, string LastName, string Email,
      string Phone, string Password, PermissionsDto Permissions
  );

  public record UpdatePermissionsRequest(PermissionsDto Permissions);
  public record ResetPasswordRequest(string NewPassword);

  public record CreateCasCliniqueRequest(
      string Categorie, string Category, string CatColor, string Titre,
      string Description, string Traitement, string Duree, List<string>? Tags
  );

  public record UpdateSliderRequest(double SliderPos);
  public record RegisterRequest(
    string FirstName, string LastName,
    string Email, string Phone, string Password
);
  public record VerifyRequest(string Email, string Code);
}
