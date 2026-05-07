import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  DashboardStats, WeeklyActivity, Patient, Appointment,
  AppointmentPage, Ordonnance, Conversation, MonthlyStats,
  CreateAppointmentDto, CreatePatientDto, Invoice, PagedResult,
  AppointmentStatus
} from '../models';

export const AVATAR_GRADS = [
  'linear-gradient(135deg,#7c3aed,#6366f1)',
  'linear-gradient(135deg,#0891b2,#22d3ee)',
  'linear-gradient(135deg,#059669,#34d399)',
  'linear-gradient(135deg,#be185d,#f472b6)',
  'linear-gradient(135deg,#d97706,#fbbf24)',
];

@Injectable({ providedIn: 'root' })
export class DataService {

  // ─── Dashboard ────────────────────────────────────────────
  getStats(): Observable<DashboardStats> {
    return of({
      appointmentsToday: 4, appointmentsTrend: 8,
      totalPatients: 248,   patientsTrend: 12,
      completedToday: 2,    completedTrend: 5,
      pendingReview: 6,     pendingTrend: 3,
    });
  }

  getWeeklyActivity(): Observable<WeeklyActivity[]> {
    return of([
      { day: 'L', count: 6,  isToday: false },
      { day: 'M', count: 9,  isToday: false },
      { day: 'M', count: 5,  isToday: false },
      { day: 'J', count: 14, isToday: false },
      { day: 'V', count: 11, isToday: false },
      { day: 'S', count: 8,  isToday: false },
      { day: 'D', count: 3,  isToday: false },
      { day: 'L', count: 10, isToday: false },
      { day: 'M', count: 13, isToday: false },
      { day: 'M', count: 7,  isToday: false },
      { day: 'J', count: 18, isToday: true  },
      { day: 'V', count: 15, isToday: false },
    ]);
  }

  // ─── Appointments ─────────────────────────────────────────
  private _appointments = signal<Appointment[]>([
    { id:1,  time:'09:00', ap:'AM', date:12, mo:'Mar', month:2, year:2026, av:'KA', avGrad:AVATAR_GRADS[0], name:'Karim Ayoub',    patientName:'Karim Ayoub',    patientAvatar:'KA', patientAvatarColor:'#7c3aed', patientAge:54, type:'Consultation · Cardiologie', status:'en-cours', statusLbl:'En cours',   statusCls:'ton' },
    { id:2,  time:'10:30', ap:'AM', date:12, mo:'Mar', month:2, year:2026, av:'SB', avGrad:AVATAR_GRADS[1], name:'Sonia Ben Ali',  patientName:'Sonia Ben Ali',  patientAvatar:'SB', patientAvatarColor:'#0891b2', patientAge:38, type:'Suivi · ECG',              status:'attente',  statusLbl:'Attente',     statusCls:'twt' },
    { id:3,  time:'14:00', ap:'PM', date:12, mo:'Mar', month:2, year:2026, av:'MH', avGrad:AVATAR_GRADS[2], name:'Mohamed Haddad', patientName:'Mohamed Haddad', patientAvatar:'MH', patientAvatarColor:'#059669', patientAge:41, type:'Bilan · Annuel',            status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
    { id:4,  time:'15:30', ap:'PM', date:12, mo:'Mar', month:2, year:2026, av:'LM', avGrad:AVATAR_GRADS[3], name:'Lina Mansouri',  patientName:'Lina Mansouri',  patientAvatar:'LM', patientAvatarColor:'#be185d', patientAge:29, type:'Urgence · Thoracique',     status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
    { id:5,  time:'08:30', ap:'AM', date:13, mo:'Mar', month:2, year:2026, av:'FA', avGrad:AVATAR_GRADS[4], name:'Fatma Amor',     patientName:'Fatma Amor',     patientAvatar:'FA', patientAvatarColor:'#d97706', patientAge:62, type:'Suivi · Hypertension',      status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
    { id:6,  time:'11:00', ap:'AM', date:13, mo:'Mar', month:2, year:2026, av:'OM', avGrad:AVATAR_GRADS[3], name:'Omar Mejri',     patientName:'Omar Mejri',     patientAvatar:'OM', patientAvatarColor:'#be185d', patientAge:47, type:'Post-op · Surveillance',    status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
    { id:7,  time:'16:00', ap:'PM', date:14, mo:'Mar', month:2, year:2026, av:'RB', avGrad:AVATAR_GRADS[0], name:'Rania Belhadj',  patientName:'Rania Belhadj',  patientAvatar:'RB', patientAvatarColor:'#7c3aed', patientAge:33, type:'Consultation · Neurologie', status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
    { id:8,  time:'09:30', ap:'AM', date:18, mo:'Mar', month:2, year:2026, av:'AB', avGrad:AVATAR_GRADS[2], name:'Ahmed Brahim',   patientName:'Ahmed Brahim',   patientAvatar:'AB', patientAvatarColor:'#059669', patientAge:58, type:'Bilan · Cardiaque',         status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
    { id:9,  time:'14:30', ap:'PM', date:18, mo:'Mar', month:2, year:2026, av:'NM', avGrad:AVATAR_GRADS[3], name:'Nadia Mezghani', patientName:'Nadia Mezghani', patientAvatar:'NM', patientAvatarColor:'#be185d', patientAge:44, type:'Suivi · ECG',              status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
    { id:10, time:'10:00', ap:'AM', date:22, mo:'Mar', month:2, year:2026, av:'HC', avGrad:AVATAR_GRADS[4], name:'Habib Chaabane', patientName:'Habib Chaabane', patientAvatar:'HC', patientAvatarColor:'#d97706', patientAge:65, type:'Consultation · Cardiologie',status:'prochain', statusLbl:'Prochain',    statusCls:'tnx' },
  ]);

  readonly appointments = this._appointments.asReadonly();

  getAppointments(filter?: { date?: string; month?: number; day?: number }): Observable<AppointmentPage> {
    const data = this._appointments();
    return of({ data, total: data.length });
  }

  getTodayAppointments(): Appointment[] {
    return this._appointments().filter(a => a.date === 12 && a.month === 2);
  }

  addAppointment(appt: Omit<Appointment, 'id'>): void {
    const current = this._appointments();
    this._appointments.set([...current, { ...appt, id: current.length + 1 }]);
  }

  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    const cur = this._appointments();
    const h = parseInt((dto.time || '09:00').split(':')[0]);
    const initials = dto.patientName.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
    const newAppt: Appointment = {
      id: cur.length + 1,
      time: dto.time,
      ap: h < 12 ? 'AM' : 'PM',
      date: typeof dto.date === 'string' ? parseInt(dto.date.split('-')[2]) : dto.date,
      mo: 'Mar', month: 2, year: 2026,
      av: initials,
      avGrad: AVATAR_GRADS[cur.length % AVATAR_GRADS.length],
      name: dto.patientName,
      patientName: dto.patientName,
      patientAvatar: dto.patientAvatar || initials,
      patientAvatarColor: dto.patientAvatarColor || '#7c3aed',
      type: dto.type,
      doctor: dto.doctor,
      status: dto.status || 'prochain',
      statusLbl: 'Prochain',
      statusCls: 'tnx',
    };
    this._appointments.set([...cur, newAppt]);
    return of(newAppt);
  }

  updateAppointmentStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    const statusMap: Record<string, { lbl: string; cls: string }> = {
      'confirmed':  { lbl: 'Confirmé',   cls: 'ton' },
      'inprogress': { lbl: 'En cours',   cls: 'ton' },
      'cancelled':  { lbl: 'Annulé',     cls: 'scr' },
      'completed':  { lbl: 'Terminé',    cls: 'completed' },
      'pending':    { lbl: 'En attente', cls: 'twt' },
      'en-cours':   { lbl: 'En cours',   cls: 'ton' },
      'attente':    { lbl: 'Attente',    cls: 'twt' },
      'prochain':   { lbl: 'Prochain',   cls: 'tnx' },
    };
    const meta = statusMap[status] || { lbl: status, cls: 'tnx' };
    let updated!: Appointment;
    this._appointments.update(list => list.map(a => {
      if (a.id === id) {
        updated = { ...a, status, statusLbl: meta.lbl, statusCls: meta.cls };
        return updated;
      }
      return a;
    }));
    return of(updated);
  }

  // ─── Patients ─────────────────────────────────────────────
  private _patients = signal<Patient[]>([
    { id:1, ini:'KA', grad:AVATAR_GRADS[0], name:'Karim Ayoub',    age:54, diag:'Arythmie cardiaque',     status:'stable',   statusCls:'sok', statusLbl:'Stable',   lastVisit:'Auj. 09:00', tel:'+216 22 456 789', email:'k.ayoub@gmail.com',    nss:'08054123456', blood:'A+',  next:'12 Avr 2026', totalVisits:12, heartRate:88, bloodPressure:'120/80', temperature:37.0, spo2:97 },
    { id:2, ini:'SB', grad:AVATAR_GRADS[1], name:'Sonia Ben Ali',  age:38, diag:'ECG – Résultats normaux', status:'stable',   statusCls:'sok', statusLbl:'Stable',   lastVisit:'08 Mar',      tel:'+216 55 123 456', email:'sonia.ba@outlook.com', nss:'08638765432', blood:'O+',  next:'10 Avr 2026', totalVisits:5,  heartRate:72, bloodPressure:'115/75', temperature:36.8, spo2:98 },
    { id:3, ini:'FA', grad:AVATAR_GRADS[4], name:'Fatma Amor',     age:62, diag:'Hypertension chronique',  status:'revoir',   statusCls:'srv', statusLbl:'À revoir', lastVisit:'10 Mar',      tel:'+216 98 321 654', email:'fatma.amor@gmail.com', nss:'06262987654', blood:'B+',  next:'15 Mar 2026', totalVisits:28, heartRate:95, bloodPressure:'145/90', temperature:37.2, spo2:96 },
    { id:4, ini:'OM', grad:AVATAR_GRADS[3], name:'Omar Mejri',     age:47, diag:'Post-op surveillance',    status:'critique', statusCls:'scr', statusLbl:'Critique', lastVisit:'09 Mar',      tel:'+216 71 654 321', email:'o.mejri@yahoo.fr',     nss:'07747456321', blood:'AB-', next:'13 Mar 2026', totalVisits:8,  heartRate:102,bloodPressure:'135/85', temperature:38.1, spo2:94 },
    { id:5, ini:'MH', grad:AVATAR_GRADS[2], name:'Mohamed Haddad', age:41, diag:'Bilan annuel cardiaque',  status:'stable',   statusCls:'sok', statusLbl:'Stable',   lastVisit:'12 Mar',      tel:'+216 25 789 012', email:'m.haddad@gmail.com',   nss:'08341789012', blood:'A-',  next:'14 Avr 2026', totalVisits:3,  heartRate:78, bloodPressure:'118/78', temperature:36.9, spo2:99 },
    { id:6, ini:'LM', grad:AVATAR_GRADS[3], name:'Lina Mansouri',  age:29, diag:'Douleur thoracique',      status:'revoir',   statusCls:'srv', statusLbl:'À revoir', lastVisit:'12 Mar',      tel:'+216 44 234 567', email:'lina.m@hotmail.com',   nss:'09529234567', blood:'O-',  next:'19 Mar 2026', totalVisits:2,  heartRate:85, bloodPressure:'122/82', temperature:36.7, spo2:97 },
    { id:7, ini:'RB', grad:AVATAR_GRADS[0], name:'Rania Belhadj',  age:33, diag:'Consultation neurologie', status:'stable',   statusCls:'sok', statusLbl:'Stable',   lastVisit:'07 Mar',      tel:'+216 53 345 678', email:'rania.b@gmail.com',    nss:'09133345678', blood:'B-',  next:'14 Mar 2026', totalVisits:6,  heartRate:70, bloodPressure:'110/70', temperature:36.6, spo2:99 },
    { id:8, ini:'AB', grad:AVATAR_GRADS[2], name:'Ahmed Brahim',   age:58, diag:'Bilan cardiaque annuel',  status:'stable',   statusCls:'sok', statusLbl:'Stable',   lastVisit:'05 Mar',      tel:'+216 20 456 789', email:'a.brahim@gmail.com',   nss:'06658456789', blood:'A+',  next:'18 Mar 2026', totalVisits:15, heartRate:82, bloodPressure:'128/84', temperature:37.1, spo2:97 },
  ]);

  readonly patients = this._patients.asReadonly();

  /** Observable m3a { data, total } — pour patients.component et records.component */
  getPatients(filter?: { department?: string; q?: string; [key: string]: any }): Observable<{ data: Patient[]; total: number }> {
    let list = this._patients();
    if (filter?.['department'] && filter['department'] !== 'all') {
      list = list.filter(p => p.department === filter['department']);
    }
    if (filter?.['q']) {
      const q = (filter['q'] as string).toLowerCase();
      list = list.filter(p =>
        (p.firstName?.toLowerCase().includes(q)) ||
        (p.lastName?.toLowerCase().includes(q)) ||
        (p.name?.toLowerCase().includes(q)) ||
        String(p.id).includes(q)
      );
    }
    return of({ data: list, total: list.length });
  }

  /** Synchrone — pour dashboard uniquement */
  getPatientsSync(): Patient[] {
    return this._patients();
  }

  /** Retourne un patient par id sous forme Observable */
  getPatientById(id: number | string): Observable<Patient | undefined> {
    return of(this._patients().find(p => String(p.id) === String(id)));
  }

  addPatient(p: Omit<Patient, 'id'>): void {
    const cur = this._patients();
    this._patients.set([{ ...p, id: cur.length + 1 }, ...cur]);
  }

  createPatient(dto: CreatePatientDto): Observable<Patient> {
    const cur = this._patients();
    const firstName = dto.firstName || '';
    const lastName  = dto.lastName  || '';
    const fullName  = dto.name || `${firstName} ${lastName}`.trim();
    const ini = fullName.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
    const newP: Patient = {
      id: cur.length + 1,
      ini,
      grad: AVATAR_GRADS[cur.length % AVATAR_GRADS.length],
      name: fullName,
      firstName, lastName,
      age: dto.age || '—',
      diag: 'Nouvelle consultation',
      department: dto.department,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth,
      contact: dto.contact,
      blood: dto.blood,
      status: dto.status || 'stable',
      statusCls: 'sok',
      statusLbl: 'Stable',
      lastVisit: 'Auj.',
      lastVisitDate: new Date().toISOString().split('T')[0],
      totalVisits: 0,
      heartRate:    dto.heartRate    ?? 0,
      bloodPressure: dto.bloodPressure,
      temperature:  dto.temperature  ?? 0,
      spo2:         dto.spo2         ?? 0,
      medicalHistory: dto.medicalHistory,
      next: 'À planifier',
    };
    this._patients.set([newP, ...cur]);
    return of(newP);
  }

  // ─── Ordonnances / Prescriptions ──────────────────────────
  private _ordos = signal<Ordonnance[]>([
    { id:1, ini:'KA', grad:AVATAR_GRADS[0], patient:'Karim Ayoub',    patientName:'Karim Ayoub',    patientAvatar:'KA', patientAvatarColor:'#7c3aed', date:'12 Mar 2026', diag:'Arythmie cardiaque', meds:[{name:'Bisoprolol 5mg',dose:'1 cp/jour le matin',duree:'3 mois'},{name:'Anticoagulant Xarelto',dose:'20mg/jour avec repas',duree:'6 mois'}],   status:'active',   statusCls:'ton', statusLbl:'Active' },
    { id:2, ini:'FA', grad:AVATAR_GRADS[4], patient:'Fatma Amor',     patientName:'Fatma Amor',     patientAvatar:'FA', patientAvatarColor:'#d97706', date:'10 Mar 2026', diag:'Hypertension',       meds:[{name:'Amlodipine 5mg',dose:'1 cp/jour',duree:'Longue durée'},{name:'Ramipril 10mg',dose:'1 cp le soir',duree:'Longue durée'}],                status:'active',   statusCls:'ton', statusLbl:'Active' },
    { id:3, ini:'OM', grad:AVATAR_GRADS[3], patient:'Omar Mejri',     patientName:'Omar Mejri',     patientAvatar:'OM', patientAvatarColor:'#be185d', date:'09 Mar 2026', diag:'Post-opératoire',    meds:[{name:'Amoxicilline 1g',dose:'2 fois/jour',duree:'10 jours'},{name:'Paracétamol 1g',dose:'Si douleur (max 3/j)',duree:'1 semaine'}],             status:'expiring', statusCls:'twt', statusLbl:'Expire bientôt' },
    { id:4, ini:'SB', grad:AVATAR_GRADS[1], patient:'Sonia Ben Ali',  patientName:'Sonia Ben Ali',  patientAvatar:'SB', patientAvatarColor:'#0891b2', date:'01 Mar 2026', diag:'Bilan préventif',    meds:[{name:'Magnésium B6',dose:'1 cp/jour',duree:'2 mois'}],                                                                                        status:'expired',  statusCls:'scr', statusLbl:'Expirée' },
    { id:5, ini:'MH', grad:AVATAR_GRADS[2], patient:'Mohamed Haddad', patientName:'Mohamed Haddad', patientAvatar:'MH', patientAvatarColor:'#059669', date:'12 Mar 2026', diag:'Bilan annuel',       meds:[{name:'Vitamine D3 1000UI',dose:'1 cp/jour',duree:'3 mois'},{name:'Aspirine 100mg',dose:'1 cp/jour avec repas',duree:'6 mois'}],                status:'active',   statusCls:'ton', statusLbl:'Active' },
  ]);

  readonly ordos = this._ordos.asReadonly();

  addOrdonnance(o: Omit<Ordonnance, 'id'>): void {
    const cur = this._ordos();
    this._ordos.set([{ ...o, id: cur.length + 1 }, ...cur]);
  }

  getPrescriptions(): Observable<Ordonnance[]> {
    return of(this._ordos());
  }

  createPrescription(dto: Partial<Ordonnance>): Observable<Ordonnance> {
    const cur = this._ordos();
    const newO: Ordonnance = {
      id: cur.length + 1,
      ini: dto.patientAvatar?.substring(0, 2).toUpperCase() || 'XX',
      grad: AVATAR_GRADS[cur.length % AVATAR_GRADS.length],
      patient: dto.patientName || dto.patient || 'Patient',
      patientName: dto.patientName || dto.patient,
      patientAvatar: dto.patientAvatar,
      patientAvatarColor: dto.patientAvatarColor,
      date: dto.date || new Date().toLocaleDateString('fr-FR'),
      diag: dto.diag || '',
      doctor: dto.doctor,
      medication: dto.medication,
      dosage: dto.dosage,
      frequency: dto.frequency,
      duration: dto.duration,
      instructions: dto.instructions,
      meds: dto.meds || [],
      status: dto.status || 'active',
      statusCls: 'ton',
      statusLbl: 'Active',
    };
    this._ordos.set([newO, ...cur]);
    return of(newO);
  }

  // ─── Facturation ──────────────────────────────────────────
  private _invoices = signal<Invoice[]>([
    { id:1, patientName:'Karim Ayoub',    patientAvatar:'KA', patientAvatarColor:'#7c3aed', date:'12 Mar 2026', amount:150, status:'paid',    description:'Consultation cardiologie', service:'Consultation' },
    { id:2, patientName:'Fatma Amor',     patientAvatar:'FA', patientAvatarColor:'#d97706', date:'10 Mar 2026', amount:220, status:'paid',    description:'Bilan + ECG',              service:'Bilan' },
    { id:3, patientName:'Omar Mejri',     patientAvatar:'OM', patientAvatarColor:'#be185d', date:'09 Mar 2026', amount:380, status:'pending', description:'Post-op surveillance',     service:'Chirurgie' },
    { id:4, patientName:'Sonia Ben Ali',  patientAvatar:'SB', patientAvatarColor:'#0891b2', date:'08 Mar 2026', amount:90,  status:'paid',    description:'Consultation + ECG',       service:'Consultation' },
    { id:5, patientName:'Mohamed Haddad', patientAvatar:'MH', patientAvatarColor:'#059669', date:'05 Mar 2026', amount:175, status:'overdue', description:'Bilan annuel',             service:'Bilan' },
  ]);

  getInvoices(): Observable<Invoice[]> {
    return of(this._invoices());
  }

  // ─── Messages ─────────────────────────────────────────────
  private _convs = signal<Conversation[]>([
    { id:1, ini:'KA', grad:AVATAR_GRADS[0], name:'Karim Ayoub',    role:'Patient',     preview:"Docteur, j'ai ressenti des palpitations hier soir...",   time:'10:23', unread:2, msgs:[{from:'patient',text:"Bonjour Docteur, j'ai ressenti des palpitations hier soir vers 22h.",time:'10:15'},{from:'patient',text:'Elles ont duré environ 10 minutes puis ont disparu.',time:'10:23'}] },
    { id:2, ini:'DR', grad:AVATAR_GRADS[2], name:'Dr. Ben Salem',  role:'Cardiologue', preview:'Concernant le patient Omar Mejri, voici mon avis...',       time:'09:45', unread:1, msgs:[{from:'other',text:'Bonjour Marie, concernant Omar Mejri en post-op, je recommande une surveillance rapprochée 72h.',time:'09:45'}] },
    { id:3, ini:'FA', grad:AVATAR_GRADS[4], name:'Fatma Amor',     role:'Patient',     preview:'Est-ce que je peux continuer le traitement habituel ?',      time:'Hier',  unread:0, msgs:[{from:'patient',text:'Bonjour Docteur. Est-ce que je peux continuer le traitement habituel ?',time:'Hier 15:30'},{from:'doctor',text:'Bonjour Mme Amor. Continuez votre traitement actuel, nous réévaluerons lors de votre prochain RDV.',time:'Hier 16:00'}] },
    { id:4, ini:'HC', grad:AVATAR_GRADS[3], name:'Admin MediCore', role:'Système',     preview:'Rappel: Réunion équipe médicale jeudi 14h',                  time:'Lun',   unread:0, msgs:[{from:'other',text:"Rappel: Réunion de l'équipe médicale jeudi 13 mars à 14h en salle de conférence.",time:'Lun 09:00'}] },
  ]);

  readonly conversations = this._convs.asReadonly();

  markAsRead(id: number): void {
    this._convs.update(convs => convs.map(c => c.id === id ? { ...c, unread: 0 } : c));
  }

  addMessage(convId: number, msg: { text: string; time: string }): void {
    this._convs.update(convs => convs.map(c =>
      c.id === convId
        ? { ...c, msgs: [...c.msgs, { from: 'doctor' as const, ...msg }], preview: msg.text }
        : c
    ));
  }

  // ─── Analytics ────────────────────────────────────────────
  getMonthlyStats(): Observable<MonthlyStats[]> {
    return of([
      { month:'Jan', patients:180, rdv:22, revenue:3200  },
      { month:'Fév', patients:195, rdv:28, revenue:3800  },
      { month:'Mar', patients:210, rdv:31, revenue:4100  },
      { month:'Avr', patients:202, rdv:26, revenue:3600  },
      { month:'Mai', patients:220, rdv:34, revenue:4820  },
      { month:'Jun', patients:235, rdv:38, revenue:5100  },
      { month:'Jul', patients:228, rdv:35, revenue:4700  },
      { month:'Aoû', patients:242, rdv:40, revenue:5400  },
      { month:'Sep', patients:238, rdv:37, revenue:4900  },
      { month:'Oct', patients:248, rdv:42, revenue:5600  },
      { month:'Nov', patients:244, rdv:39, revenue:5200  },
      { month:'Déc', patients:260, rdv:45, revenue:6100  },
    ]);
  }
}