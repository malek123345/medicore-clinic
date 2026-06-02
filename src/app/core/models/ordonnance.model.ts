export interface Ordonnance {
  id: number;
  patientId: string;
  patientName: string;
  date: string;
  status: string;

  doctorName: string;

  notes?: string | null;

  meds: {
    name: string;
    dose: string;
    freq: string;
    duree: string;
  }[];
}