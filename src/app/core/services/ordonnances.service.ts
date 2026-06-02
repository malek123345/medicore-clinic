import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Ordonnance } from '../models/ordonnance.model';
@Injectable({ providedIn: 'root' })
export class OrdonnancesService {
  
  private http = inject(HttpClient);
  private API = `${environment.apiUrl}/ordonnances`;

  private _ordonnances = signal<Ordonnance[]>([]);
  ordonnances = this._ordonnances.asReadonly();

  load() {
    this.http.get<Ordonnance[]>(this.API).subscribe(res => {
  this._ordonnances.set(res);
});
  }

  add(ord: any) {
    this.http.post<Ordonnance>(this.API, ord).subscribe(res => {
      this._ordonnances.update((l: Ordonnance[]) => [res, ...l]);
    });
  }

  delete(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe(() => {
      this._ordonnances.update(l => l.filter(o => o.id !== id));
    });
  }
}