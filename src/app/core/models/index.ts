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
  id: number | string;
  // Système MediCore (ini/grad/name)
  ini?: string;
  grad?: string;
  name?: string;
  // Système étendu (firstName/lastName)
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
  // Contact
  tel?: string;
  email?: string;
  contact?: string;
  nss?: string;
  blood?: string;
  next?: string;
  // Visites
  lastVisit?: string;
  lastVisitDate?: string;
  totalVisits: number;
  // Signes vitaux (0 = non renseigné)
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
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  spo2?: number;
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
  date: number | string;
  mo?: string;
  month?: number;
  year?: number;
  av?: string;
  avGrad?: string;
  patientName: string;
  patientAvatar?: string;
  patientAvatarColor?: string;
  patientAge?: number | string;
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

// ─── CalEvent ─────────────────────────────────────────────────
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
  ini?: string;
  grad?: string;
  patient?: string;
  patientName?: string;
  patientAvatar?: string;
  patientAvatarColor?: string;
  date: string;
  diag?: string;
  doctor?: string;
  meds?: Medicament[];
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  status: OrdoStatus | string;
  statusCls?: RdvStatusCls | StatusCls | string;
  statusLbl?: string;
}

export type Prescription = Ordonnance;

// ─── Facturation ──────────────────────────────────────────────
export interface Invoice {
  id: number | string;
  patientName?: string;
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