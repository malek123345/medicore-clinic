// dossier.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Ordonnance {
  id: number; // ✅ تبديل من string إلى number
  patientId: string;
  patientName: string;
  date: string;
  doctorName: string;
  medications: { name: string; dose: string; freq: string; duree: string }[];
  notes?: string;
  createdAt: string;
}

export interface MedicalFile {
  id: string;
  patientId: string;
  name: string;
  type: 'scanner' | 'pdf' | 'image' | 'document';
  size: string;
  uploadedAt: string;
  uploadedBy: 'patient' | 'doctor';
  dataUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class DossierService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/ordonnances`;

  // ✅ تحميل من Backend
  private _ordonnances = signal<Ordonnance[]>([]);
  private _files = signal<MedicalFile[]>([]);

  readonly ordonnances = this._ordonnances.asReadonly();
  readonly files = this._files.asReadonly();

  constructor() {
    this.loadOrdonnances();
  }

  // ✅ تحميل من Backend
  loadOrdonnances() {
    this.http.get<Ordonnance[]>(this.API).subscribe(res => {
      this._ordonnances.set(res);
    });
  }

  getOrdonnancesForPatient(id: string) {
    return this._ordonnances().filter(o => o.patientId === id);
  }

  getFilesForPatient(id: string) {
    return this._files().filter(f => f.patientId === id);
  }

  searchOrdonnances(q: string): Ordonnance[] {
    const low = q.toLowerCase();
    return this._ordonnances().filter(o =>
      o.patientName.toLowerCase().includes(low) ||
      String(o.id).includes(low) ||
      o.date.includes(low)
    );
  }

  // ✅ إضافة إلى Backend
  addOrdonnance(ord: Omit<Ordonnance, 'id' | 'createdAt'>): void {
    const payload = {
      patientId: ord.patientId,
      patientName: ord.patientName,
      date: ord.date,
      doctor: ord.doctorName,
      meds: ord.medications.map(m => ({
        name: m.name,
        dose: m.dose,
        freq: m.freq,
        duree: m.duree
      })),
      // ✅ إضافة الحقول المطلوبة في Backend
      diag: ord.notes || '',
      medication: ord.medications[0]?.name || '',
      dosage: ord.medications[0]?.dose || '',
      frequency: ord.medications[0]?.freq || '',
      duration: ord.medications[0]?.duree || '',
      instructions: ord.notes || '',
      status: 'active'
    };

    this.http.post<Ordonnance>(this.API, payload).subscribe(res => {
      this._ordonnances.update(l => [res, ...l]);
    });
  }

  // ✅ حذف من Backend
  deleteOrdonnance(id: number): void {
    this.http.delete(`${this.API}/${id}`).subscribe(() => {
      this._ordonnances.update(l => l.filter(o => o.id !== id));
    });
  }

  addFile(file: Omit<MedicalFile, 'id'>): void {
    this._files.update(l => [{ ...file, id: 'F' + Date.now() }, ...l]);
  }

  deleteFile(id: string): void {
    this._files.update(l => l.filter(f => f.id !== id));
  }
}