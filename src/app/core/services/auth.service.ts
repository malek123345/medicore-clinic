// src/app/core/services/auth.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UserRole = 'Doctor' | 'Patient' | 'Secretary';

export interface Permissions {
  rdv: boolean;
  patients: boolean;
  ordonnances: boolean;
  paiements: boolean;
  parametres: boolean;
  urgences: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  specialty?: string;
  patientId?: string;
  phone?: string;
  dateNaissance?: string;
  groupeSanguin?: string;
  permissions?: Permissions;
  doctorId?: string;
  createdAt?: string;
  online?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private http   = inject(HttpClient);
  private readonly TOKEN_KEY   = 'khaddar_token';
  private readonly SESSION_KEY = 'khaddar_user';
  private readonly API         = environment.apiUrl;

  private _user = signal<AuthUser | null>(null);
  user      = this._user.asReadonly();
  isLoggedIn = () => this._user() !== null;

  // ✅ Callbacks pour reset au logout
  logoutCallbacks: (() => void)[] = [];

  constructor() {
    this.loadUserFromSession();
  }

  // ═══════════════════════════════════════════════════════════
  //  SESSION
  // ═══════════════════════════════════════════════════════════

  private loadUserFromSession() {
    const saved = sessionStorage.getItem(this.SESSION_KEY);
    if (saved) {
      try { this._user.set(JSON.parse(saved)); } catch {}
    }
  }

  private saveUserToSession(user: AuthUser) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }

  private clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // ═══════════════════════════════════════════════════════════
  //  AUTHENTIFICATION
  // ═══════════════════════════════════════════════════════════

 async login(email: string, password: string): Promise<boolean> {
  try {
    const res: any = await firstValueFrom(
      this.http.post(`${this.API}/auth/login`, { email, password })
    );

    sessionStorage.setItem(this.TOKEN_KEY, res.token);

   const user: AuthUser = {
  id:       String(res.user.id),
  name:     res.user.name,
  role:     res.user.role,
  email:    res.user.email,
  avatar:   res.user.avatar,
  // ✅ زيد هذه
  permissions: res.user.permissions ? {
    rdv:          res.user.permissions.rdv          ?? false,
    patients:     res.user.permissions.patients     ?? false,
    ordonnances:  res.user.permissions.ordonnances  ?? false,
    paiements:    res.user.permissions.paiements    ?? false,
    parametres:   res.user.permissions.parametres   ?? false,
    urgences:     res.user.permissions.urgences     ?? false,
  } : undefined,
  patientId:   res.user.patientId,
  phone:       res.user.phone,
  specialty:   res.user.specialty,
};

    this._user.set(user);
    this.saveUserToSession(user);

    return true;
  } catch (err: any) {

    const msg = err?.error?.message;

    if (msg === "EMAIL_NOT_VERIFIED") {
      alert("Compte non vérifié. Vérifiez votre email.");
    } else if (msg === "INVALID_CREDENTIALS") {
      alert("Email ou mot de passe incorrect.");
    } else {
      alert("Erreur serveur");
    }

    return false;
  }
}

  async logout() {
    try {
      await firstValueFrom(this.http.post(`${this.API}/auth/logout`, {}));
    } catch {}

    // ✅ reset الإشعارات عند الخروج
    this.logoutCallbacks.forEach(cb => cb());
    this.logoutCallbacks = [];

    this._user.set(null);
    this.clearSession();
    this.router.navigate(['/']);
  }

  // ═══════════════════════════════════════════════════════════
  //  SECRETAIRES — via API
  // ═══════════════════════════════════════════════════════════

  async createSecretaryAccount(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    permissions: Permissions;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await firstValueFrom(
        this.http.post(`${this.API}/secretaries`, {
          firstName:   data.firstName,
          lastName:    data.lastName,
          email:       data.email,
          phone:       data.phone,
          password:    data.password,
          permissions: data.permissions,
        })
      );
      return { success: true };
    } catch (err: any) {
      const msg = err?.error?.message || 'Erreur lors de la création.';
      return { success: false, error: msg };
    }
  }

  async getSecretaries(): Promise<AuthUser[]> {
    try {
      const res: any[] = await firstValueFrom(
        this.http.get<any[]>(`${this.API}/secretaries`)
      );
      return res.map(s => ({
        id:          String(s.id),
        name:        s.name,
        role:        'Secretary' as UserRole,
        email:       s.email,
        avatar:      s.avatar || s.name?.slice(0, 2).toUpperCase(),
        phone:       s.phone,
        permissions: s.permissions,
        online:      s.online,
        createdAt:   s.createdAt,
      }));
    } catch {
      return [];
    }
  }

  async updateSecretaryPermissions(
    email: string,
    permissions: Permissions
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.put(`${this.API}/secretaries/${email}/permissions`, { permissions })
      );
      return true;
    } catch {
      return false;
    }
  }

  async changeSecretaryPassword(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await firstValueFrom(
        this.http.put(`${this.API}/secretaries/${email}/password`, { newPassword })
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.error?.message || 'Erreur.' };
    }
  }

  async deleteSecretary(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.API}/secretaries/${email}`)
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.error?.message || 'Erreur.' };
    }
  }

  async updateProfile(data: {
    nom?: string; prenom?: string; spec?: string; tel?: string; email?: string;
  }): Promise<boolean> {
    try {
      const res: any = await firstValueFrom(
        this.http.put(`${this.API}/auth/me`, data)
      );
      const current = this._user();
      if (current) {
        const updated = { ...current, name: res.name, specialty: res.specialty, phone: res.phone, email: res.email };
        this._user.set(updated);
        this.saveUserToSession(updated);
      }
      return true;
    } catch {
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      await firstValueFrom(
        this.http.put(`${this.API}/auth/me/password`, { currentPassword, newPassword })
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.error?.message || 'Erreur.' };
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  PERMISSIONS
  // ═══════════════════════════════════════════════════════════

  hasPermission(permission: keyof Permissions): boolean {
    const user = this._user();
    if (user?.role === 'Doctor') return true;
    if (user?.role === 'Secretary') return user.permissions?.[permission] === true;
    return false;
  }

  getPermissions(): Permissions | null {
    const user = this._user();
    if (user?.role === 'Doctor') {
      return { rdv: true, patients: true, ordonnances: true, paiements: true, parametres: true, urgences: true };
    }
    if (user?.role === 'Secretary') return user.permissions || null;
    return null;
  }

  // ═══════════════════════════════════════════════════════════
  //  UTILITAIRES
  // ═══════════════════════════════════════════════════════════

  getDashboardRoute(): string {
    const role = this._user()?.role;
    if (role === 'Patient') return '/';
    if (role === 'Doctor' || role === 'Secretary') return '/doctor/dashboard';
    return '/login';
  }

  isDoctor():    boolean { return this._user()?.role === 'Doctor'; }
  isSecretary(): boolean { return this._user()?.role === 'Secretary'; }
  isPatient():   boolean { return this._user()?.role === 'Patient'; }
  getUserRole(): UserRole | null { return this._user()?.role || null; }
  getUserName(): string { return this._user()?.name || 'Utilisateur'; }
  getUserAvatar(): string { return this._user()?.avatar || 'U'; }

  getSecretariesStats(): { total: number; online: number; offline: number } {
    return { total: 0, online: 0, offline: 0 };
  }
}