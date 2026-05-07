export type UserRole = 'doctor' | 'patient' | 'secretary';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  // Doctor specific
  rpps?: string;
  // Patient specific
  patientId?: number;
  birthDate?: string;
  blood?: string;
  phone?: string;
  address?: string;
}

export interface Patient {
  id: number;
  name: string;
  ini?: string;
  grad?: string;
  diag?: string;
  lastVisit?: string;
  statusCls?: string;
  statusLbl?: string;
  age?: number;
  gender?: 'M' | 'F';
  phone?: string;
  email?: string;
  blood?: string;
  diagnosis?: string;
  nextVisit?: string;
  status?: 'stable' | 'review' | 'critical';
  notes?: string;
  visits?: number;
  allergies?: string[];
  antecedents?: string[];
  weight?: number;
  height?: number;
}