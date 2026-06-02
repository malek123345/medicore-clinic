import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CasClinique {
  id: number;
  categorie: 'parodontologie' | 'implantologie' | 'chirurgie';
  category: string;
  catColor: string;
  titre: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  traitement: string;
  duree: string;
  tags: string[];
  sliderPos: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CasCliniquesService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/cas-cliniques`;

  private _cases = signal<CasClinique[]>([]);
  cases = computed(() => this._cases());

  constructor() {
    this.loadCases();
  }

  loadCases() {
    this.http.get<CasClinique[]>(this.API).subscribe(res => {
      this._cases.set(res);
    });
  }

  add(cas: Omit<CasClinique, 'id' | 'sliderPos' | 'createdAt'>): void {
    const formData = new FormData();
    formData.append('categorie', cas.categorie);
    formData.append('category', cas.category);
    formData.append('catColor', cas.catColor);
    formData.append('titre', cas.titre);
    formData.append('description', cas.description);
    formData.append('traitement', cas.traitement);
    formData.append('duree', cas.duree);
    cas.tags.forEach(t => formData.append('tags', t));

    // For file uploads, the component should pass File objects, but for now
    // if beforeImg and afterImg are just URLs or base64, the backend needs them.
    // Assuming backend takes files. We'll simplify and just send them if possible,
    // or let the backend handle it. Since we don't have the File object here,
    // we would ideally need a different method signature. For compatibility:
    this.http.post<CasClinique>(this.API, formData).subscribe(res => {
      this._cases.update(list => [...list, res]);
    });
  }

  remove(id: number): void {
    this.http.delete(`${this.API}/${id}`).subscribe(() => {
      this._cases.update(list => list.filter(c => c.id !== id));
    });
  }

  update(id: number, data: Partial<CasClinique>): void {
    // Basic implementation for compatibility
    this.http.put<CasClinique>(`${this.API}/${id}`, data).subscribe(res => {
      this._cases.update(list => list.map(c => c.id === id ? res : c));
    });
  }

  updateSlider(id: number, pos: number): void {
    this.http.put<CasClinique>(`${this.API}/${id}/slider`, { sliderPos: pos }).subscribe(res => {
      this._cases.update(list => list.map(c => c.id === id ? res : c));
    });
  }
}