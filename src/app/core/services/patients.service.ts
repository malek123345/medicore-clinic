import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

export interface FrontendPatient {
  id: string;
  ini: string;
  name: string;
  patientId: string;
  blood: string;
  grad: string;
  badgeClass: string;
  badgeLbl: string;
  score: number;
  scoreColor: string;

  firstName?: string;
  lastName?: string;
  age?: string;
  tel?: string;
  email?: string;
  status?: string;
  lastVisit?: string;
  totalVisits?: number;
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  spo2?: number;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class PatientsService {

  private api = inject(ApiService);

  patients = signal<FrontendPatient[]>([]);
  loading = signal(false);
  error = signal('');

  private readonly GRADS = [
    'linear-gradient(135deg,#1d5fe0,#154dc8)',
    'linear-gradient(135deg,#6366f1,#4f46e5)',
    'linear-gradient(135deg,#0891b2,#0e7490)',
    'linear-gradient(135deg,#0eb88a,#0d9a76)',
    'linear-gradient(135deg,#ec4899,#db2777)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
  ];

  async loadPatients(): Promise<void> {
    this.loading.set(true);

    try {
      const res = await firstValueFrom(this.api.getPatients());
      const data = res?.data ?? [];

      this.patients.set(
        data.map((p: any, i: number) => this.transform(p, i))
      );

    } finally {
      this.loading.set(false);
    }
  }

  private transform(p: any, index: number): FrontendPatient {
    return {
      id: String(p.id),
      name: p.name,
      ini: p.ini || this.getInitials(p.name),
      patientId: `PAT-${String(p.id).padStart(3, '0')}`,
      blood: p.blood || '—',
      grad: this.GRADS[index % this.GRADS.length],
      badgeClass: 'badge-active',
      badgeLbl: 'Actif',
      score: 80,
      scoreColor: '#1d5fe0',

      firstName: p.firstName,
      lastName: p.lastName,
      age: p.age,
      tel: p.tel,
      email: p.email,
      status: p.status,
      createdAt: p.createdAt,
    };
  }

  private getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  async createPatient(data: any): Promise<boolean> {
    this.loading.set(true);

    try {
      const payload = {
  firstName:   data.firstName,
  lastName:    data.lastName,
  name:        `${data.firstName} ${data.lastName}`,
  dateOfBirth: data.birthDate,
  phone:       data.phone,
  email:       data.email,
  address:     data.address,
  status:      'stable',
  password:    data.password  // ← زيد هذا
};

      await firstValueFrom(this.api.createPatient(payload));

      await this.loadPatients();

      return true;

    } finally {
      this.loading.set(false);
    }
  }

  async deletePatient(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.deletePatient(Number(id)));
      await this.loadPatients();
      return true;
    } catch {
      return false;
    }
  }
}