import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { permissionGuard } from './core/guards/permission.guard';
export const routes: Routes = [

  // ── PUBLIC (avec navbar + footer) ───────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-shell/public-shell.component')
        .then(m => m.PublicShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component')
            .then(m => m.HomeComponent),
      },
      {
        path: 'apropos',
        loadComponent: () =>
          import('./features/public/about/about.component')
            .then(m => m.AboutComponent),
      },
      {
        path: 'cas-cliniques',
        loadComponent: () =>
          import('./features/public/cas-cliniques/cas-cliniques.component')
            .then(m => m.CasCliniquesComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact/contact.component')
            .then(m => m.ContactComponent),
      },
      {
        path: 'rendez-vous',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Patient'] },
        loadComponent: () =>
          import('./features/public/patient-rdv/patient-rdv-public.component')
            .then(m => m.PatientRdvPublicComponent),
      },
      {
        path: 'dossier-medical',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Patient'] },
        loadComponent: () =>
          import('./features/public/patient-dossier/patient-dossier-public.component')
            .then(m => m.PatientDossierPublicComponent),
      },
    ],
  },

  // ── LOGIN ────────────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent),
  },

  // ── DOCTOR SPACE ─────────────────────────────────────────────────────────
  {
    path: 'doctor',
    loadComponent: () =>
      import('./features/doctor/doctor-shell/doctor-shell.component')
        .then(m => m.DoctorShellComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Doctor', 'Secretary'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/doctor/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
      },

      {
        path: 'rdv',
        canActivate: [permissionGuard],
        data: { permission: 'rdv' },
        loadComponent: () =>
          import('./features/doctor/rdv/rdv.component')
            .then(m => m.RdvComponent),
      },

      {
        path: 'patients',
        canActivate: [permissionGuard],
        data: { permission: 'patients' },
        loadComponent: () =>
          import('./features/doctor/patients/patients.component')
            .then(m => m.PatientsComponent),
      },

      {
        path: 'ordonnances',
        canActivate: [permissionGuard],
        data: { permission: 'ordonnances' },
        loadComponent: () =>
          import('./features/doctor/ordonnances/ordonnances.component')
            .then(m => m.OrdonnancesComponent),
      },

      {
        path: 'parametres',
        canActivate: [permissionGuard],
        data: { permission: 'parametres' },
        loadComponent: () =>
          import('./features/doctor/parametres/parametres.component')
            .then(m => m.ParametresComponent),
      },

      {
        path: 'billing',
        loadComponent: () =>
          import('./features/doctor/billing/billing.component')
            .then(m => m.BillingComponent),
      },

      // ── NOUVEAU : Cas Cliniques Secrétaire ──────────────────────────────
      {
        path: 'cas-cliniques-secretaire',
        canActivate: [permissionGuard],
        data: { permission: 'downloadCasCliniques' },
        loadComponent: () =>
          import('./features/doctor/secretaire-cas-cliniques/secretaire-cas-cliniques.component')
            .then(m => m.SecretaireCasCliniquesComponent),
      },
    ],
  },

  // ── PATIENT SPACE ─────────────────────────────────────────────────────────
  {
    path: 'patient',
    loadComponent: () =>
      import('./features/patient/patient-shell/patient-shell.component')
        .then(m => m.PatientShellComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    children: [
      { path: '', redirectTo: 'rdv', pathMatch: 'full' },
      {
        path: 'rdv',
        loadComponent: () =>
          import('./features/patient/rdv/patient-rdv.component')
            .then(m => m.PatientRdvComponent),
      },
      {
        path: 'dossier',
        loadComponent: () =>
          import('./features/patient/dossier/dossier.component')
            .then(m => m.DossierComponent),
      },
    ],
  },

  // ── FALLBACK ─────────────────────────────────────────────────────────────
  { path: '**', redirectTo: '' },
];