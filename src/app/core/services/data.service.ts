import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, map } from 'rxjs';
import {
  DashboardStats, WeeklyActivity, Patient, Appointment,
  AppointmentPage, Ordonnance, Conversation, MonthlyStats,
  CreateAppointmentDto, CreatePatientDto, Invoice,
  AppointmentStatus
} from '../models';
import { environment } from '../../../environments/environment';

export const AVATAR_GRADS = [
  'linear-gradient(135deg,#7c3aed,#6366f1)',
  'linear-gradient(135deg,#0891b2,#22d3ee)',
  'linear-gradient(135deg,#059669,#34d399)',
  'linear-gradient(135deg,#be185d,#f472b6)',
  'linear-gradient(135deg,#d97706,#fbbf24)',
];

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private readonly API = environment.apiUrl;

  // ─── Dashboard ────────────────────────────────────────────
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API}/analytics/stats`);
  }

  getWeeklyActivity(): Observable<WeeklyActivity[]> {
    return this.http.get<WeeklyActivity[]>(`${this.API}/analytics/weekly`);
  }

  getMonthlyStats(): Observable<MonthlyStats[]> {
    return this.http.get<MonthlyStats[]>(`${this.API}/analytics/monthly`);
  }

  // ─── Appointments ─────────────────────────────────────────
  private _appointments = signal<Appointment[]>([]);
  readonly appointments = this._appointments.asReadonly();

  getAppointments(filter?: { date?: string; month?: number; day?: number }): Observable<AppointmentPage> {
    let params: any = {};
    if (filter?.date) params.date = filter.date;
    if (filter?.month) params.month = filter.month;
    if (filter?.day) params.day = filter.day;

    return this.http.get<AppointmentPage>(`${this.API}/appointments`, { params }).pipe(
      tap(res => this._appointments.set(res.data))
    );
  }

  getTodayAppointments(): Appointment[] {
    // This is synchronous in the old mock. We should probably fetch it,
    // but returning what we have in the signal for now to avoid breaking components.
    const today = new Date();
    return this._appointments().filter(a => a.date === today.getDate() && a.month === today.getMonth() + 1);
  }

  addAppointment(appt: Omit<Appointment, 'id'>): void {
    // Legacy method, not used directly if we use HTTP POST, but keeping for compatibility.
    // In reality, createAppointment is what components call.
  }

  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.API}/appointments`, dto).pipe(
      tap(res => {
        const cur = this._appointments();
        this._appointments.set([...cur, res]);
      })
    );
  }

  updateAppointmentStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API}/appointments/${id}/status`, { status }).pipe(
      tap(res => {
        this._appointments.update(list => list.map(a => a.id === id ? res : a));
      })
    );
  }

  // ─── Patients ─────────────────────────────────────────────
  private _patients = signal<Patient[]>([]);
  readonly patients = this._patients.asReadonly();

  getPatients(filter?: { department?: string; q?: string; [key: string]: any }): Observable<{ data: Patient[]; total: number }> {
    let params: any = {};
    if (filter?.department) params.department = filter.department;
    if (filter?.q) params.q = filter.q;

    return this.http.get<{ data: Patient[]; total: number }>(`${this.API}/patients`, { params }).pipe(
      tap(res => this._patients.set(res.data))
    );
  }

  getPatientsSync(): Patient[] {
    return this._patients();
  }

  getPatientById(id: number | string): Observable<Patient | undefined> {
    return this.http.get<Patient>(`${this.API}/patients/${id}`);
  }

  addPatient(p: Omit<Patient, 'id'>): void {}

  createPatient(dto: CreatePatientDto): Observable<Patient> {
    return this.http.post<Patient>(`${this.API}/patients`, dto).pipe(
      tap(res => {
        const cur = this._patients();
        this._patients.set([res, ...cur]);
      })
    );
  }

  // ─── Ordonnances / Prescriptions ──────────────────────────
  private _ordos = signal<Ordonnance[]>([]);
  readonly ordos = this._ordos.asReadonly();

  getPrescriptions(): Observable<Ordonnance[]> {
    return this.http.get<Ordonnance[]>(`${this.API}/ordonnances`).pipe(
      tap(res => this._ordos.set(res))
    );
  }

  addOrdonnance(o: Omit<Ordonnance, 'id'>): void {}

  createPrescription(dto: Partial<Ordonnance>): Observable<Ordonnance> {
    return this.http.post<Ordonnance>(`${this.API}/ordonnances`, dto).pipe(
      tap(res => {
        const cur = this._ordos();
        this._ordos.set([res, ...cur]);
      })
    );
  }

  // ─── Facturation ──────────────────────────────────────────
  private _invoices = signal<Invoice[]>([]);

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.API}/invoices`).pipe(
      tap(res => this._invoices.set(res))
    );
  }

  // ─── Messages ─────────────────────────────────────────────
  private _convs = signal<Conversation[]>([]);
  readonly conversations = this._convs.asReadonly();

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.API}/messages/conversations`).pipe(
      tap(res => this._convs.set(res))
    );
  }
  getMiniStats(): Observable<any> {
  return this.http.get<any>(`${this.API}/analytics/mini-stats`);
}

  markAsRead(id: number): void {
    this.http.put(`${this.API}/messages/conversations/${id}/read`, {}).subscribe(() => {
      this._convs.update(convs => convs.map(c => c.id === id ? { ...c, unread: 0 } : c));
    });
  }

  addMessage(convId: number, msg: { text: string; time: string }): void {
    this.http.post(`${this.API}/messages/conversations/${convId}/messages`, { text: msg.text }).subscribe(() => {
      this._convs.update(convs => convs.map(c =>
        c.id === convId
          ? { ...c, msgs: [...(c.msgs || []), { from: 'doctor' as const, ...msg }], preview: msg.text }
          : c
      ));
    });
  }
}