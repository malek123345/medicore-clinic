// src/app/core/services/auth.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

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

interface Account {
  password: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private _user = signal<AuthUser | null>(null);
  user = this._user.asReadonly();
  isLoggedIn = () => this._user() !== null;

  // ✅ Comptes fixes (doctor + patients de test)
  private readonly defaultAccounts: Record<string, Account> = {
    'doctor@gmail.tn': {
      password: '123456',
      user: {
        id: 'D001',
        name: 'Dr. Zied Khaddar',
        role: 'Doctor',
        email: 'doctor@khaddar.tn',
        avatar: 'ZK',
        specialty: 'Parodontologie & Implantologie Orale',
        phone: '+216 71 234 567'
      }
    },
    'karim@gmail.com': {
      password: '123456',
      user: {
        id: 'P001',
        name: 'Karim Ayoub',
        role: 'Patient',
        email: 'karim@gmail.com',
        avatar: 'KA',
        patientId: 'PAT-001',
        phone: '+216 55 123 456',
        dateNaissance: '15/03/1985',
        groupeSanguin: 'A+'
      }
    },
    'sana@gmail.com': {
      password: '123456',
      user: {
        id: 'P002',
        name: 'Sana Ben Ali',
        role: 'Patient',
        email: 'sana@gmail.com',
        avatar: 'SB',
        patientId: 'PAT-002',
        phone: '+216 98 765 432',
        dateNaissance: '22/07/1992',
        groupeSanguin: 'O+'
      }
    }
  };

  // ✅ Clé localStorage pour les comptes dynamiques
  private readonly STORAGE_KEY = 'khaddar_accounts';
  private readonly SESSION_KEY = 'khaddar_user';
  private readonly SECRETARIES_KEY = 'khaddar_secretaries';

  constructor() {
    this.loadUserFromSession();
    this.migrateOldData();
  }

  // ═══════════════════════════════════════════════════════════
  //  GESTION DES COMPTES DYNAMIQUES
  // ═══════════════════════════════════════════════════════════

  private getDynamicAccounts(): Record<string, Account> {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  private saveDynamicAccounts(accounts: Record<string, Account>) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts));
  }

  private getAllAccounts(): Record<string, Account> {
    return { ...this.defaultAccounts, ...this.getDynamicAccounts() };
  }

  // ═══════════════════════════════════════════════════════════
  //  GESTION SESSION
  // ═══════════════════════════════════════════════════════════

  private loadUserFromSession() {
    const saved = sessionStorage.getItem(this.SESSION_KEY);
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this._user.set(user);
        // Mettre à jour le statut online si secrétaire
        if (user.role === 'Secretary') {
          this.updateSecretaryOnlineStatus(user.email, true);
        }
      } catch {}
    }
  }

  private saveUserToSession(user: AuthUser) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }

  private clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  // ═══════════════════════════════════════════════════════════
  //  MIGRATION ANCIENNES DONNÉES
  // ═══════════════════════════════════════════════════════════

  private migrateOldData() {
    try {
      // Migrer anciennes secrétaires si elles existent
      const oldSecretaries = localStorage.getItem('medspace_secretaries');
      if (oldSecretaries) {
        const secretaries = JSON.parse(oldSecretaries);
        const dynamic = this.getDynamicAccounts();

        secretaries.forEach((sec: any) => {
          const email = sec.email.toLowerCase().trim();
          if (!dynamic[email]) {
            dynamic[email] = {
              password: sec.password || '123456',
              user: {
                id: sec.id,
                name: `${sec.firstName} ${sec.lastName}`,
                role: 'Secretary',
                email: sec.email,
                avatar: `${sec.firstName[0]}${sec.lastName[0]}`.toUpperCase(),
                phone: sec.phone,
                permissions: sec.permissions,
                doctorId: sec.doctorId,
                createdAt: sec.createdAt,
                online: false
              }
            };
          }
        });

        this.saveDynamicAccounts(dynamic);
        localStorage.removeItem('medspace_secretaries');
      }
    } catch {}
  }

  // ═══════════════════════════════════════════════════════════
  //  AUTHENTIFICATION
  // ═══════════════════════════════════════════════════════════

  login(email: string, password: string): boolean {
    const emailKey = email.toLowerCase().trim();
    const accounts = this.getAllAccounts();
    const account = accounts[emailKey];

    if (account && account.password === password) {
      const user = { ...account.user };
      
      // Mettre à jour le statut online pour les secrétaires
      if (user.role === 'Secretary') {
        this.updateSecretaryOnlineStatus(emailKey, true);
        user.online = true;
      }

      this._user.set(user);
      this.saveUserToSession(user);
      return true;
    }

    return false;
  }

  logout() {
    const user = this._user();
    
    // Mettre à jour le statut offline pour les secrétaires
    if (user?.role === 'Secretary' && user.email) {
      this.updateSecretaryOnlineStatus(user.email, false);
    }

    this._user.set(null);
    this.clearSession();
    this.router.navigate(['/']);
  }

  // ═══════════════════════════════════════════════════════════
  //  GESTION DES SECRÉTAIRES
  // ═══════════════════════════════════════════════════════════

  createSecretaryAccount(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    permissions: Permissions;
  }): { success: boolean; error?: string } {
    const emailKey = data.email.toLowerCase().trim();

    // Vérifier si l'email existe déjà
    const allAccounts = this.getAllAccounts();
    if (allAccounts[emailKey]) {
      return { success: false, error: 'Cet email est déjà utilisé.' };
    }

    // Validation
    if (!data.firstName || !data.lastName) {
      return { success: false, error: 'Nom et prénom sont obligatoires.' };
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      return { success: false, error: 'Email invalide.' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' };
    }

    // Créer le nouveau compte secrétaire
    const currentUser = this._user();
    const newUser: AuthUser = {
      id: 'SEC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: `${data.firstName} ${data.lastName}`,
      role: 'Secretary',
      email: data.email,
      avatar: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
      phone: data.phone,
      specialty: 'Secrétaire Médicale',
      permissions: data.permissions,
      doctorId: currentUser?.id || 'D001',
      createdAt: new Date().toISOString(),
      online: false
    };

    // Sauvegarder
    const dynamic = this.getDynamicAccounts();
    dynamic[emailKey] = {
      password: data.password,
      user: newUser
    };
    this.saveDynamicAccounts(dynamic);

    return { success: true };
  }

  getSecretaries(): AuthUser[] {
    const currentUser = this._user();
    if (currentUser?.role !== 'Doctor') return [];

    const dynamic = this.getDynamicAccounts();
    return Object.values(dynamic)
      .filter(account => 
        account.user.role === 'Secretary' && 
        account.user.doctorId === currentUser.id
      )
      .map(account => account.user)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
  }

  getSecretaryByEmail(email: string): AuthUser | null {
    const emailKey = email.toLowerCase().trim();
    const accounts = this.getAllAccounts();
    const account = accounts[emailKey];
    
    if (account && account.user.role === 'Secretary') {
      return account.user;
    }
    
    return null;
  }

  updateSecretaryPermissions(email: string, permissions: Permissions): boolean {
    const emailKey = email.toLowerCase().trim();
    const dynamic = this.getDynamicAccounts();
    const account = dynamic[emailKey];

    if (!account || account.user.role !== 'Secretary') {
      return false;
    }

    account.user.permissions = permissions;
    this.saveDynamicAccounts(dynamic);

    // Si c'est l'utilisateur connecté, mettre à jour la session
    const currentUser = this._user();
    if (currentUser?.email === emailKey) {
      const updatedUser = { ...currentUser, permissions };
      this._user.set(updatedUser);
      this.saveUserToSession(updatedUser);
    }

    return true;
  }

  updateSecretaryOnlineStatus(email: string, online: boolean): void {
    const emailKey = email.toLowerCase().trim();
    const dynamic = this.getDynamicAccounts();
    const account = dynamic[emailKey];

    if (account && account.user.role === 'Secretary') {
      account.user.online = online;
      this.saveDynamicAccounts(dynamic);
    }
  }

  deleteSecretary(email: string): { success: boolean; error?: string } {
    const emailKey = email.toLowerCase().trim();
    const dynamic = this.getDynamicAccounts();
    const account = dynamic[emailKey];

    if (!account) {
      return { success: false, error: 'Compte non trouvé.' };
    }

    if (account.user.role !== 'Secretary') {
      return { success: false, error: 'Ce compte n\'est pas une secrétaire.' };
    }

    // Vérifier que ce n'est pas l'utilisateur connecté
    const currentUser = this._user();
    if (currentUser?.email === emailKey) {
      return { success: false, error: 'Impossible de supprimer votre propre compte.' };
    }

    delete dynamic[emailKey];
    this.saveDynamicAccounts(dynamic);

    return { success: true };
  }

  changeSecretaryPassword(email: string, newPassword: string): { success: boolean; error?: string } {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' };
    }

    const emailKey = email.toLowerCase().trim();
    const dynamic = this.getDynamicAccounts();
    const account = dynamic[emailKey];

    if (!account || account.user.role !== 'Secretary') {
      return { success: false, error: 'Compte non trouvé.' };
    }

    account.password = newPassword;
    this.saveDynamicAccounts(dynamic);

    return { success: true };
  }

  // ═══════════════════════════════════════════════════════════
  //  PERMISSIONS
  // ═══════════════════════════════════════════════════════════

  hasPermission(permission: keyof Permissions): boolean {
    const user = this._user();
    
    // Le médecin a toutes les permissions
    if (user?.role === 'Doctor') return true;
    
    // La secrétaire vérifie ses permissions
    if (user?.role === 'Secretary') {
      return user.permissions?.[permission] === true;
    }
    
    return false;
  }

  getPermissions(): Permissions | null {
    const user = this._user();
    
    // Le médecin a toutes les permissions
    if (user?.role === 'Doctor') {
      return {
        rdv: true,
        patients: true,
        ordonnances: true,
        paiements: true,
        parametres: true,
        urgences: true
      };
    }
    
    // Retourner les permissions de la secrétaire
    if (user?.role === 'Secretary') {
      return user.permissions || null;
    }
    
    return null;
  }

  // ═══════════════════════════════════════════════════════════
  //  UTILITAIRES
  // ═══════════════════════════════════════════════════════════

  getDashboardRoute(): string {
    const role = this._user()?.role;
    if (role === 'Patient') return '/';
    if (role === 'Doctor') return '/doctor/dashboard';
    if (role === 'Secretary') return '/doctor/dashboard';
    return '/login';
  }

  isDoctor(): boolean {
    return this._user()?.role === 'Doctor';
  }

  isSecretary(): boolean {
    return this._user()?.role === 'Secretary';
  }

  isPatient(): boolean {
    return this._user()?.role === 'Patient';
  }

  getUserRole(): UserRole | null {
    return this._user()?.role || null;
  }

  getUserName(): string {
    return this._user()?.name || 'Utilisateur';
  }

  getUserAvatar(): string {
    return this._user()?.avatar || 'U';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ═══════════════════════════════════════════════════════════
  //  STATISTIQUES (pour le dashboard)
  // ═══════════════════════════════════════════════════════════

  getSecretariesStats(): {
    total: number;
    online: number;
    offline: number;
  } {
    const secretaries = this.getSecretaries();
    return {
      total: secretaries.length,
      online: secretaries.filter(s => s.online).length,
      offline: secretaries.filter(s => !s.online).length
    };
  }

  // ═══════════════════════════════════════════════════════════
  //  DEBUG / ADMIN
  // ═══════════════════════════════════════════════════════════

  clearAllData(): void {
    if (confirm('⚠️ ATTENTION: Supprimer toutes les données ? (comptes secrétaires)')) {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SECRETARIES_KEY);
      this.logout();
      window.location.reload();
    }
  }

  exportData(): string {
    const data = {
      accounts: this.getDynamicAccounts(),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonData);
      if (data.accounts) {
        this.saveDynamicAccounts(data.accounts);
        return { success: true };
      }
      return { success: false, error: 'Format de données invalide.' };
    } catch {
      return { success: false, error: 'Erreur lors de l\'import des données.' };
    }
  }
}