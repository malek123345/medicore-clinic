using Microsoft.EntityFrameworkCore;
using MediCoreAPI.Models;

namespace MediCoreAPI.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Ordonnance> Ordonnances => Set<Ordonnance>();
    public DbSet<OrdonnanceMed> OrdonnanceMeds => Set<OrdonnanceMed>();
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<CasClinique> CasCliniques => Set<CasClinique>();
    public DbSet<WaitingList> WaitingList { get; set; }
    // ✅ جديد
    public DbSet<PatientDocument> PatientDocuments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<OrdonnanceMed>()
          .HasOne<Ordonnance>()
          .WithMany(o => o.Meds)
          .HasForeignKey(m => m.OrdonnanceId);
    }
  }
}
