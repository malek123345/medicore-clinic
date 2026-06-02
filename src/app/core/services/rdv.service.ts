import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ════════════════════════════════════════════════════════════════════════════
//  INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface Appointment {
  id: number;
  time: string;
  ap: string;
  date: string;
  day: number;
  mo: string;
  month: number;
  year: number;
  av?: string;
  avGrad?: string;
  patientName: string;
  patientAvatar?: string;
  patientAvatarColor?: string;
  patientAge?: string;
  patientId?: string;
  patientPhone?: string;
  type: string;
  status: string;
  statusLbl: string;
  statusCls: string;
  createdAt?: string;
}

export interface CreateAppointmentRequest {
  patientName: string;
  patientPhone?: string;
   patientId?: string;
  date: string;
  time: string;
  type: string;
  status?: string;
}

export interface TimeSlot {
  time: string;
  label: string;
  taken: boolean;
}

// ════════════════════════════════════════════════════════════════════════════
//  SERVICE
// ════════════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class RdvService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/appointments';

  // ══════════════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════════════

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CRUD OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get all appointments
   */
  getAll(date?: string, month?: number, day?: number): Observable<Appointment[]> {
    let url = this.API_URL;
    const params: string[] = [];
    
    if (date) params.push(`date=${date}`);
    if (month) params.push(`month=${month}`);
    if (day) params.push(`day=${day}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<{ data: Appointment[]; total: number }>(url, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data || []),
        catchError(err => {
          console.error('Get appointments error:', err);
          return of([]);
        })
      );
  }

  /**
   * Get today's appointments
   */
  getToday(): Observable<Appointment[]> {
    const url = `${this.API_URL}/today`;
    
    return this.http.get<Appointment[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Get today appointments error:', err);
          return of([]);
        })
      );
  }

  /**
   * Get appointments for a specific patient
   */
  getForPatient(patientId: string): Observable<Appointment[]> {
    if (!patientId) return of([]);
    
    const url = `${this.API_URL}/patient/${patientId}`;
    
    return this.http.get<Appointment[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Get patient appointments error:', err);
          return of([]);
        })
      );
  }

  /**
   * Create new appointment
   */
  create(data: CreateAppointmentRequest): Observable<Appointment> {
    const payload = {
      ...data,
      status: data.status || 'pending'
    };

    return this.http.post<Appointment>(this.API_URL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Create appointment error:', err);
          throw err;
        })
      );
  }

  /**
   * Book appointment (for patients)
   */
  async bookAppointment(data: CreateAppointmentRequest): Promise<{ success: boolean; error?: string }> {
    try {
      await firstValueFrom(this.create(data));
      return { success: true };
    } catch (err: any) {
      console.error('Book appointment error:', err);
      return { 
        success: false, 
        error: err.error?.message || 'Erreur lors de la réservation' 
      };
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  STATUS UPDATES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Confirm appointment
   */
  confirmAppointment(id: number): Observable<any> {
    const url = `${this.API_URL}/${id}/status`;
    
    return this.http.put(url, { status: 'confirmed' }, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Confirm appointment error:', err);
          throw err;
        })
      );
  }

  /**
   * Mark appointment as done
   */
  markAppointmentAsDone(id: number): Observable<any> {
    const url = `${this.API_URL}/${id}/status`;
    
    return this.http.put(url, { status: 'done' }, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Mark as done error:', err);
          throw err;
        })
      );
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(id: number | string): Observable<any> {
    const appointmentId = typeof id === 'string' ? parseInt(id, 10) : id;
    const url = `${this.API_URL}/${appointmentId}/status`;
    
    return this.http.put(url, { status: 'cancelled' }, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Cancel appointment error:', err);
          throw err;
        })
      );
  }

  /**
   * Delete appointment
   */
  deleteAppointment(id: number): Observable<void> {
    const url = `${this.API_URL}/${id}`;
    
    return this.http.delete<void>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Delete appointment error:', err);
          throw err;
        })
      );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  SLOTS MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get available time slots for a specific date
   */
  getAvailableSlots(date: string): Observable<TimeSlot[]> {
    if (!date) return of([]);
    
    const url = `${this.API_URL}/slots?date=${date}`;
    
    return this.http.get<TimeSlot[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(err => {
          console.error('Get slots error:', err);
          // Return default slots if API fails
          return of(this.getDefaultSlots());
        })
      );
  }

  /**
   * Get default time slots (fallback)
   */
  private getDefaultSlots(): TimeSlot[] {
    return [
      { time: '08:00', label: '08:00', taken: false },
      { time: '09:00', label: '09:00', taken: false },
      { time: '10:00', label: '10:00', taken: false },
      { time: '11:00', label: '11:00', taken: false },
      { time: '14:00', label: '14:00', taken: false },
      { time: '15:00', label: '15:00', taken: false },
      { time: '16:00', label: '16:00', taken: false },
      { time: '17:00', label: '17:00', taken: false },
    ];
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  STATISTICS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get appointments count by status
   */
  getCountByStatus(appointments: Appointment[], status: string): number {
    return appointments.filter(apt => apt.status === status).length;
  }

  /**
   * Get upcoming appointments
   */
  getUpcoming(appointments: Appointment[]): Appointment[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate >= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Get past appointments
   */
  getPast(appointments: Appointment[]): Appointment[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate < today;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}