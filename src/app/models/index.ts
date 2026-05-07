// ─── Navigation ───────────────────────────────────────────────
export type PageId =
  | 'dashboard' | 'patients' | 'rdv'
  | 'ordonnances' | 'analytics' | 'messages' | 'params';

export type Theme = 'dark' | 'light';

// ─── Dashboard ────────────────────────────────────────────────
export interface DashboardStats {
  appointmentsToday: number;
  appointmentsTrend: number;
  totalPatients: number;
  patientsTrend: number;
  completedToday: number;
  completedTrend: number;
  pendingReview: number;
  pendingTrend: number;
}

export interface WeeklyActivity {
  day: string;
  count: number;
  isToday: boolean;
}

export interface MonthlyStats {
  month: string;
  patients: number;
  rdv: number;
  revenue: number;
}

// ─── Patient ──────────────────────────────────────────────────
export type PatientStatus = 'stable' | 'revoir' | 'critique' | 'active' | 'warning' | 'critical';
export type StatusCls     = 'sok' | 'srv' | 'scr';
export type RdvStatusCls  = 'ton' | 'twt' | 'tnx';

export interface Patient {
  // Champs base (compatibles avec les 2 systèmes)
  id: number | string; // string pour P-009 format
  // Système ancien (ini/grad/name)
  ini?: string;
  grad?: string;
  name?: string;
  // Système nouveau (firstName/lastName)
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  avatarColor?: string;
  // Infos communes
  age: number | string;
  diag?: string;
  department?: string;
  gender?: string;
  dateOfBirth?: string;
  status: PatientStatus;
  statusCls?: StatusCls | string;
  statusLbl?: string;
  // Visites
  lastVisit?: string;
  lastVisitDate?: string;
  totalVisits: number;
  // Contact
  tel?: string;
  email?: string;
  contact?: string;
  nss?: string;
  blood?: string;
  next?: string;
  // Signes vitaux
  heartRate: number;
  bloodPressure?: string;
  temperature: number;
  spo2: number;
  // Divers
  medicalHistory?: string;
}

export interface CreatePatientDto {
  firstName?: string;
  lastName?: string;
  name?: string;
  age?: number | string;
  gender?: string;
  dateOfBirth?: string;
  department?: string;
  contact?: string;
  blood?: string;
  status?: PatientStatus;
  medicalHistory?: string;
  heartRate: number;
  bloodPressure?: string;
  temperature: number;
  spo2: number;
}

// ─── Appointment ──────────────────────────────────────────────
export type AppointmentStatus =
  | 'en-cours' | 'attente' | 'prochain'
  | 'confirmed' | 'pending' | 'inprogress'
  | 'cancelled' | 'completed' | 'scheduled';

export interface Appointment {
  id: number;
  time: string;
  ap?: 'AM' | 'PM';
  // date peut être number (jour) ou string (ISO '2026-03-09')
  date: number | string;
  mo?: string;
  month?: number;
  year?: number;
  // Avatar patient
  av?: string;
  avGrad?: string;
  patientName: string;
  patientAvatar?: string;
  patientAvatarColor?: string;
  patientAge?: number | string;
  // Infos RDV
  name?: string;
  type: string;
  doctor?: string;
  notes?: string;
  status: AppointmentStatus;
  statusLbl?: string;
  statusCls?: string;
}

export interface AppointmentPage {
  data: Appointment[];
  total: number;
}

export interface CreateAppointmentDto {
  patientName: string;
  patientAvatar?: string;
  patientAvatarColor?: string;
  date: number | string;
  time: string;
  type: string;
  doctor?: string;
  notes?: string;
  status?: AppointmentStatus;
}

// ─── Rendez-vous (alias) ──────────────────────────────────────
export type RdvStatus = 'en-cours' | 'attente' | 'prochain';

export interface Rdv {
  id: number;
  time: string;
  ap: 'AM' | 'PM';
  date: number;
  mo: string;
  month: number;
  year: number;
  av: string;
  avGrad: string;
  name: string;
  type: string;
  status: RdvStatus;
  statusLbl: string;
  statusCls: RdvStatusCls;
}

export interface CalEvent {
  name: string;
  cls: 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
}

// ─── Ordonnance / Prescription ────────────────────────────────
export type OrdoStatus = 'active' | 'expiring' | 'expired';

export interface Medicament {
  name: string;
  dose: string;
  duree: string;
}

export interface Ordonnance {
  id: number | string;
  // Système ancien
  ini?: string;
  grad?: string;
  patient?: string;
  // Système nouveau
  patientName: string;
  patientAvatar?: string;
  patientAvatarColor?: string;
  // Infos ordonnance
  date: string;
  diag?: string;
  doctor?: string;
  // Médicaments - système ancien (tableau)
  meds?: Medicament[];
  // Médicaments - système nouveau (champs séparés)
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  // Statut
  status: OrdoStatus | string;
  statusCls?: RdvStatusCls | StatusCls | string;
  statusLbl?: string;
}

// Alias pour compatibilité
export type Prescription = Ordonnance;

// ─── Facturation ──────────────────────────────────────────────
export interface Invoice {
  id: number | string;
  patientName: string;
  patientAvatar?: string;
  patientAvatarColor?: string;
  patientId?: number | string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | string;
  description?: string;
  service?: string;
}

// ─── Pagination ───────────────────────────────────────────────
export interface PagedResult<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}

// ─── Messages ─────────────────────────────────────────────────
export type MsgFrom = 'doctor' | 'patient' | 'other';

export interface Message {
  from: MsgFrom;
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  ini: string;
  grad: string;
  name: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
  msgs: Message[];
}

// ─── Stats ────────────────────────────────────────────────────
export interface MonthStat {
  month: string;
  patients: number;
  rdv: number;
  revenue: number;
}

// ─── Paramètres ───────────────────────────────────────────────
export type ParamSection = 'profil' | 'securite' | 'notifications' | 'affichage' | 'about';

export interface ParamState {
  notifRdv: boolean;
  notifMsg: boolean;
  notifSystem: boolean;
  twoFactor: boolean;
  sessionTimeout: string;
  nom: string;
  prenom: string;
  spec: string;
  tel: string;
  email: string;
}