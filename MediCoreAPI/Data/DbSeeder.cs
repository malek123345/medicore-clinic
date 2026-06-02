using MediCoreAPI.Models;

namespace MediCoreAPI.Data
{
  public static class DbSeeder
  {
    public static void Seed(AppDbContext db)
    {
      if (db.Users.Any()) return;

      // ─── Users ────────────────────────────────────────────────
      var doctor = new User
      {
        Email = "doctor@gmail.tn",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
        Role = "Doctor",
        Name = "Dr. Zied Khaddar",
        Specialty = "Parodontologie & Implantologie Orale",
        Phone = "+216 71 234 567",
        PermRdv = true,
        PermPatients = true,
        PermOrdonnances = true,
        PermParametres = true,
      };

      var patientUser1 = new User
      {
        Email = "karim@gmail.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
        Role = "Patient",
        Name = "Karim Ayoub",
        PatientId = "PAT-001",
        Phone = "+216 55 123 456",
      };

      var patientUser2 = new User
      {
        Email = "sana@gmail.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
        Role = "Patient",
        Name = "Sana Ben Ali",
        PatientId = "PAT-002",
        Phone = "+216 98 765 432",
      };

      db.Users.AddRange(doctor, patientUser1, patientUser2);

      // ─── Patients ─────────────────────────────────────────────
      var patients = new List<Patient>
      {
        new Patient { Name="Karim Ayoub",    FirstName="Karim",   LastName="Ayoub",    DateOfBirth="1970-01-01", Phone="+216 22 456 789", Status="stable"   },
        new Patient { Name="Sonia Ben Ali",  FirstName="Sonia",   LastName="Ben Ali",  DateOfBirth="1986-01-01", Phone="+216 55 123 456", Status="stable"   },
        new Patient { Name="Fatma Amor",     FirstName="Fatma",   LastName="Amor",     DateOfBirth="1962-01-01", Phone="+216 98 321 654", Status="revoir"   },
        new Patient { Name="Omar Mejri",     FirstName="Omar",    LastName="Mejri",    DateOfBirth="1977-01-01", Phone="+216 71 654 321", Status="critique" },
        new Patient { Name="Mohamed Haddad", FirstName="Mohamed", LastName="Haddad",   DateOfBirth="1983-01-01", Phone="+216 25 789 012", Status="stable"   },
        new Patient { Name="Lina Mansouri",  FirstName="Lina",    LastName="Mansouri", DateOfBirth="1995-01-01", Phone="+216 44 234 567", Status="revoir"   },
        new Patient { Name="Rania Belhadj",  FirstName="Rania",   LastName="Belhadj",  DateOfBirth="1991-01-01", Phone="+216 53 345 678", Status="stable"   },
        new Patient { Name="Ahmed Brahim",   FirstName="Ahmed",   LastName="Brahim",   DateOfBirth="1966-01-01", Phone="+216 20 456 789", Status="stable"   },
      };
      db.Patients.AddRange(patients);

      // ─── Appointments ─────────────────────────────────────────
      var appointments = new List<Appointment>
      {
        new Appointment { Time="09:00", Date="2026-03-12", PatientName="Karim Ayoub",    PatientPhone="+216 22 456 789", Type="Consultation · Cardiologie", Status="en-cours"  },
        new Appointment { Time="10:30", Date="2026-03-12", PatientName="Sonia Ben Ali",  PatientPhone="+216 55 123 456", Type="Suivi · ECG",                Status="attente"   },
        new Appointment { Time="14:00", Date="2026-03-12", PatientName="Mohamed Haddad", PatientPhone="+216 25 789 012", Type="Bilan · Annuel",             Status="prochain"  },
        new Appointment { Time="15:30", Date="2026-03-12", PatientName="Lina Mansouri",  PatientPhone="+216 44 234 567", Type="Urgence · Thoracique",       Status="prochain"  },
        new Appointment { Time="08:30", Date="2026-03-13", PatientName="Fatma Amor",     PatientPhone="+216 98 321 654", Type="Suivi · Hypertension",       Status="prochain"  },
        new Appointment { Time="11:00", Date="2026-03-13", PatientName="Omar Mejri",     PatientPhone="+216 71 654 321", Type="Post-op · Surveillance",     Status="prochain"  },
        new Appointment { Time="16:00", Date="2026-03-14", PatientName="Rania Belhadj",  PatientPhone="+216 53 345 678", Type="Consultation · Neurologie",  Status="prochain"  },
        new Appointment { Time="09:30", Date="2026-03-18", PatientName="Ahmed Brahim",   PatientPhone="+216 20 456 789", Type="Bilan · Cardiaque",          Status="prochain"  },
        new Appointment { Time="09:00", Date="2026-04-18", PatientId="P001", PatientName="Karim Ayoub",  PatientPhone="+216 55 123 456", Type="Consultation", Status="confirmed" },
        new Appointment { Time="10:00", Date="2026-04-18", PatientId="P002", PatientName="Sana Ben Ali", PatientPhone="+216 98 765 432", Type="Détartrage",   Status="pending"   },
        new Appointment { Time="14:00", Date="2026-04-22", PatientId="P001", PatientName="Karim Ayoub",  PatientPhone="+216 55 123 456", Type="Implant",       Status="confirmed" },
        new Appointment { Time="08:00", Date="2026-04-14", PatientId="P002", PatientName="Sana Ben Ali", PatientPhone="+216 98 765 432", Type="Suivi",         Status="completed" },
      };
      db.Appointments.AddRange(appointments);

      // ─── Ordonnances ──────────────────────────────────────────
      var ord1 = new Ordonnance { PatientName = "Karim Ayoub", PatientId = "PAT-001", Date = "12 Mar 2026", Status = "active" };
      var ord2 = new Ordonnance { PatientName = "Fatma Amor", PatientId = "PAT-003", Date = "10 Mar 2026", Status = "active" };
      var ord3 = new Ordonnance { PatientName = "Omar Mejri", PatientId = "PAT-004", Date = "09 Mar 2026", Status = "expiring" };
      var ord4 = new Ordonnance { PatientName = "Sonia Ben Ali", PatientId = "PAT-002", Date = "01 Mar 2026", Status = "expired" };
      var ord5 = new Ordonnance { PatientName = "Mohamed Haddad", PatientId = "PAT-005", Date = "12 Mar 2026", Status = "active" };
      db.Ordonnances.AddRange(ord1, ord2, ord3, ord4, ord5);
      db.SaveChanges();

      db.OrdonnanceMeds.AddRange(
        new OrdonnanceMed { OrdonnanceId = ord1.Id, Name = "Bisoprolol 5mg", Dose = "1 cp/jour le matin", Duree = "3 mois" },
        new OrdonnanceMed { OrdonnanceId = ord1.Id, Name = "Anticoagulant Xarelto", Dose = "20mg/jour avec repas", Duree = "6 mois" },
        new OrdonnanceMed { OrdonnanceId = ord2.Id, Name = "Amlodipine 5mg", Dose = "1 cp/jour", Duree = "Longue durée" },
        new OrdonnanceMed { OrdonnanceId = ord2.Id, Name = "Ramipril 10mg", Dose = "1 cp le soir", Duree = "Longue durée" },
        new OrdonnanceMed { OrdonnanceId = ord3.Id, Name = "Amoxicilline 1g", Dose = "2 fois/jour", Duree = "10 jours" },
        new OrdonnanceMed { OrdonnanceId = ord3.Id, Name = "Paracétamol 1g", Dose = "Si douleur (max 3/j)", Duree = "1 semaine" },
        new OrdonnanceMed { OrdonnanceId = ord4.Id, Name = "Magnésium B6", Dose = "1 cp/jour", Duree = "2 mois" },
        new OrdonnanceMed { OrdonnanceId = ord5.Id, Name = "Vitamine D3 1000UI", Dose = "1 cp/jour", Duree = "3 mois" },
        new OrdonnanceMed { OrdonnanceId = ord5.Id, Name = "Aspirine 100mg", Dose = "1 cp/jour avec repas", Duree = "6 mois" }
      );

      

      // ─── Cas Cliniques ────────────────────────────────────────
      db.CasCliniques.AddRange(
        new CasClinique { Categorie = "parodontologie", Category = "Parodontologie", CatColor = "#1b7fc4", Titre = "Correction du sourire gingival", BeforeImg = "assets/images/cas/1.png", AfterImg = "assets/images/cas/2.png", Description = "Récession gingivale sévère traitée par greffe gingivale.", Traitement = "Greffe Gingivale + ROG", Duree = "9 mois", Tags = "[\"Greffe gingivale\",\"Parodontite\"]", CreatedAt = new DateTime(2024, 1, 15) },
        new CasClinique { Categorie = "implantologie", Category = "Implantologie", CatColor = "#17a2b8", Titre = "Pose d'Implant Dentaire", BeforeImg = "assets/images/cas/avant2.png", AfterImg = "assets/images/cas/apres2.png", Description = "Remplacement d'une molaire manquante par implant.", Traitement = "Implant + Couronne", Duree = "4 mois", Tags = "[\"Implant\",\"Couronne\"]", CreatedAt = new DateTime(2024, 2, 10) },
        new CasClinique { Categorie = "chirurgie", Category = "Chirurgie", CatColor = "#155f9a", Titre = "Chirurgie Esthétique Gingivale", BeforeImg = "assets/images/cas/avant3.png", AfterImg = "assets/images/cas/apres3.png", Description = "Correction du sourire gingival par gingivectomie.", Traitement = "Gingivectomie", Duree = "2 mois", Tags = "[\"Esthétique\",\"Gingivectomie\"]", CreatedAt = new DateTime(2024, 3, 5) },
        new CasClinique { Categorie = "implantologie", Category = "Implantologie", CatColor = "#17a2b8", Titre = "Réhabilitation Complète All-on-4", BeforeImg = "assets/images/cas/avant4.png", AfterImg = "assets/images/cas/apres4.png", Description = "Arcade complète sur 4 implants pour patient édenté.", Traitement = "All-on-4", Duree = "8 mois", Tags = "[\"All-on-4\",\"Réhabilitation\"]", CreatedAt = new DateTime(2024, 4, 1) },
        new CasClinique { Categorie = "parodontologie", Category = "Parodontologie", CatColor = "#1b7fc4", Titre = "Traitement Parodontite Avancée", BeforeImg = "assets/images/cas/avant5.png", AfterImg = "assets/images/cas/apres5.png", Description = "Parodontite stade 3 stabilisée par traitement.", Traitement = "Surfaçage Radiculaire", Duree = "3 mois", Tags = "[\"Parodontite\",\"Surfaçage\"]", CreatedAt = new DateTime(2024, 5, 12) },
        new CasClinique { Categorie = "chirurgie", Category = "Chirurgie", CatColor = "#155f9a", Titre = "Greffe Osseuse Pré-Implantaire", BeforeImg = "assets/images/cas/avant6.png", AfterImg = "assets/images/cas/apres6.png", Description = "Augmentation osseuse horizontale avant pose d'implant.", Traitement = "Greffe Osseuse", Duree = "5 mois", Tags = "[\"Greffe osseuse\",\"Augmentation\"]", CreatedAt = new DateTime(2024, 6, 20) }
      );

      db.SaveChanges();
    }
  }
}
