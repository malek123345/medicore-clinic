import { Injectable, signal } from '@angular/core';

export interface Ordonnance {
  id: string; patientId: string; patientName: string; date: string;
  doctorName: string;
  medications: { name: string; dose: string; freq: string; duree: string }[];
  notes?: string; createdAt: string;
}

export interface MedicalFile {
  id: string; patientId: string; name: string;
  type: 'scanner' | 'pdf' | 'image' | 'document';
  size: string; uploadedAt: string; uploadedBy: 'patient' | 'doctor';
  dataUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class DossierService {
  private _ordonnances = signal<Ordonnance[]>([
    { id:'ORD001', patientId:'P001', patientName:'Karim Ayoub',  date:'2026-04-12', doctorName:'Dr. Zied Khaddar', createdAt:'2026-04-12',
      medications:[{ name:'Amoxicilline',dose:'500mg',freq:'3×/jour',duree:'7 jours' },{ name:'Ibuprofène',dose:'400mg',freq:'2×/jour',duree:'5 jours' }], notes:'À prendre après les repas.' },
    { id:'ORD002', patientId:'P001', patientName:'Karim Ayoub',  date:'2026-03-05', doctorName:'Dr. Zied Khaddar', createdAt:'2026-03-05',
      medications:[{ name:'Chlorhexidine 0.12%',dose:'Bain de bouche',freq:'2×/jour',duree:'14 jours' }], notes:'Ne pas manger 30 min après.' },
    { id:'ORD003', patientId:'P002', patientName:'Sana Ben Ali', date:'2026-04-10', doctorName:'Dr. Zied Khaddar', createdAt:'2026-04-10',
      medications:[{ name:'Métronidazole',dose:'250mg',freq:'3×/jour',duree:'7 jours' },{ name:'Paracétamol',dose:'1000mg',freq:'si douleur',duree:'5 jours' }] },
  ]);

  private _files = signal<MedicalFile[]>([
    { id:'F001', patientId:'P001', name:'Panoramique_Dental_2026.pdf', type:'scanner', size:'2.4 MB', uploadedAt:'2026-04-12', uploadedBy:'doctor' },
    { id:'F002', patientId:'P001', name:'Radio_periapicale.jpg',       type:'image',   size:'850 KB', uploadedAt:'2026-03-05', uploadedBy:'doctor' },
    { id:'F003', patientId:'P002', name:'Bilan_paro_sana.pdf',         type:'pdf',     size:'1.1 MB', uploadedAt:'2026-04-10', uploadedBy:'patient' },
  ]);

  readonly ordonnances = this._ordonnances.asReadonly();
  readonly files       = this._files.asReadonly();

  getOrdonnancesForPatient(id: string) { return this._ordonnances().filter(o => o.patientId === id); }
  getFilesForPatient(id: string)       { return this._files().filter(f => f.patientId === id); }

  searchOrdonnances(q: string): Ordonnance[] {
    const low = q.toLowerCase();
    return this._ordonnances().filter(o =>
      o.patientName.toLowerCase().includes(low) || o.id.toLowerCase().includes(low) || o.date.includes(low)
    );
  }

  addOrdonnance(ord: Omit<Ordonnance,'id'|'createdAt'>): Ordonnance {
    const newOrd: Ordonnance = { ...ord, id:'ORD'+Date.now(), createdAt: new Date().toISOString().slice(0,10) };
    this._ordonnances.update(l => [newOrd, ...l]);
    return newOrd;
  }

  addFile(file: Omit<MedicalFile,'id'>): void {
    this._files.update(l => [{ ...file, id:'F'+Date.now() }, ...l]);
  }
  deleteFile(id: string): void { this._files.update(l => l.filter(f => f.id !== id)); }
}