import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ─── PATIENTS ───
  getPatients(q?: string, department?: string): Observable<any> {
    let params: any = {};

    if (q) params.q = q;
    if (department) params.department = department;

    return this.http.get(`${this.baseUrl}/patients`, { params });
  }

  createPatient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/patients`, data);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/patients/${id}`);
  }

  // ─── APPOINTMENTS ───
  getAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointments`);
  }

  createAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments`, data);
  }
deleteSecretary(email: string) {
  return this.http.delete(`/api/secretaries/${email}`);
}
  // ─── SECRETARIES ───
  updatePermissions(email: string, permissions: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/secretaries/${email}/permissions`,
      permissions
    );
  }

  // ─── AUTH ───
  me(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me`);
  }
}