import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export interface PatientDocument {
  id: number;
  patientId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private http    = inject(HttpClient);
  private auth    = inject(AuthService);
  private API     = `${environment.apiUrl}/documents`;

  private _docs = signal<PatientDocument[]>([]);
  docs = this._docs.asReadonly();

  private getHeaders() {
    const token = this.auth.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  async loadForPatient(patientId: string) {
    try {
      const data = await firstValueFrom(
        this.http.get<PatientDocument[]>(
          `${this.API}/patient/${patientId}`,
          this.getHeaders()
        )
      );
      this._docs.set(data ?? []);
    } catch { this._docs.set([]); }
  }

  async upload(file: File, patientId: string, uploadedBy = 'patient'): Promise<PatientDocument | null> {
    try {
      const token = this.auth.getToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);
      formData.append('uploadedBy', uploadedBy);

      const doc = await firstValueFrom(
        this.http.post<PatientDocument>(
          `${this.API}/upload`,
          formData,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        )
      );
      this._docs.update(d => [doc, ...d]);
      return doc;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.API}/${id}`, this.getHeaders())
      );
      this._docs.update(d => d.filter(f => f.id !== id));
      return true;
    } catch { return false; }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }
}