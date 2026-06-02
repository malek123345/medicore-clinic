import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Secretary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  permissions: {
    rdv: boolean;
    patients: boolean;
    ordonnances: boolean;
    paiements: boolean;
    parametres: boolean;
    urgences: boolean;
  };
  online: boolean;
  createdAt: string;
  doctorId?: string;
}

@Injectable({ providedIn: 'root' })
export class SecretaryService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/secretaries`;

  getAll(): Observable<Secretary[]> {
    return this.http.get<Secretary[]>(this.API);
  }

  getByEmail(email: string): Observable<Secretary> {
    return this.http.get<Secretary>(`${this.API}/${email}`);
  }

  create(secretary: Omit<Secretary, 'id' | 'createdAt' | 'online'>): Observable<any> {
    return this.http.post(this.API, secretary);
  }

  update(id: string, updates: Partial<Secretary>): Observable<any> {
    return this.http.put(`${this.API}/${id}`, updates);
  }

  updatePermissions(email: string, permissions: any): Observable<any> {
    return this.http.put(`${this.API}/${email}/permissions`, { permissions });
  }

  delete(email: string): Observable<any> {
    return this.http.delete(`${this.API}/${email}`);
  }
}