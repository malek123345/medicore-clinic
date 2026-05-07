import { Injectable, signal } from '@angular/core';

export interface Appointment {
  id: string; patientId: string; patientName: string; patientPhone?: string;
  date: string; time: string; type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'done'; notes?: string; createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RdvService {
  readonly slots = [
    { time:'08:00', label:'08:00 → 08:45' },
    { time:'09:00', label:'09:00 → 09:45' },
    { time:'10:00', label:'10:00 → 10:45' },
    { time:'11:00', label:'11:00 → 11:45' },
    { time:'14:00', label:'14:00 → 14:45' },
    { time:'15:00', label:'15:00 → 15:45' },
    { time:'16:00', label:'16:00 → 16:45' },
  ];

  private _appointments = signal<Appointment[]>([
    { id:'RDV001', patientId:'P001', patientName:'Karim Ayoub',  patientPhone:'+216 55 123 456', date:'2026-04-18', time:'09:00', type:'Consultation',  status:'confirmed', createdAt:'2026-04-10' },
    { id:'RDV002', patientId:'P002', patientName:'Sana Ben Ali', patientPhone:'+216 98 765 432', date:'2026-04-18', time:'10:00', type:'Détartrage',    status:'pending',   createdAt:'2026-04-11' },
    { id:'RDV003', patientId:'P001', patientName:'Karim Ayoub',  patientPhone:'+216 55 123 456', date:'2026-04-22', time:'14:00', type:'Implant',        status:'confirmed', createdAt:'2026-04-10' },
    { id:'RDV004', patientId:'P002', patientName:'Sana Ben Ali', patientPhone:'+216 98 765 432', date:'2026-04-14', time:'08:00', type:'Suivi',          status:'done',      createdAt:'2026-04-08' },
    { id:'RDV005', patientId:'P001', patientName:'Karim Ayoub',  patientPhone:'+216 55 123 456', date:'2026-04-16', time:'11:00', type:'Détartrage',    status:'done',      createdAt:'2026-04-05' },
  ]);

  readonly appointments = this._appointments.asReadonly();

  isSunday(date: string): boolean { return new Date(date).getDay() === 0; }

  isSlotTaken(date: string, time: string): boolean {
    return this._appointments().some(a => a.date === date && a.time === time && a.status !== 'cancelled');
  }

  getAvailableSlots(date: string): { time: string; label: string; taken: boolean }[] {
    if (this.isSunday(date)) return [];
    return this.slots.map(s => ({ ...s, taken: this.isSlotTaken(date, s.time) }));
  }

  bookAppointment(appt: Omit<Appointment, 'id' | 'createdAt'>): { success: boolean; message: string } {
    if (this.isSunday(appt.date)) return { success: false, message: 'Le cabinet est fermé le dimanche.' };
    if (this.isSlotTaken(appt.date, appt.time)) {
      return { success: false, message: 'Ce temps est déjà réservé, veuillez choisir un autre temps.' };
    }
    this._appointments.update(l => [
      ...l,
      { ...appt, id: 'RDV' + Date.now(), createdAt: new Date().toISOString().slice(0, 10) }
    ]);
    return { success: true, message: 'Rendez-vous confirmé avec succès !' };
  }

  cancelAppointment(id: string): void {
    this._appointments.update(l => l.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));
  }
  confirmAppointment(id: string): void {
    this._appointments.update(l => l.map(a => a.id === id ? { ...a, status: 'confirmed' as const } : a));
  }
  markAppointmentAsDone(id: string) {
  const rdvs = this.getAll();
  const rdv = rdvs.find(r => r.id === id);
  if (rdv) {
    rdv.status = 'done';
  }
}
  getForPatient(patientId: string): Appointment[] { return this._appointments().filter(a => a.patientId === patientId); }
  getForDate(date: string): Appointment[] { return this._appointments().filter(a => a.date === date); }
  getAll(): Appointment[] { return this._appointments(); }
}