import { Appointment, Patient, DashboardStats, WeeklyActivity, Prescription, Invoice } from '../models';

export const MOCK_PATIENTS: Patient[] = [
  { id:'P-001', firstName:'Sarah',   lastName:'Johnson',  fullName:'Sarah Johnson',   age:34, dateOfBirth:'1991-04-12', gender:'Féminin',   department:'Cardiologie', totalVisits:8,  lastVisitDate:'09 mar 2026', bloodPressure:'128/84', heartRate:92, temperature:36.8, spo2:97,  status:'stable',   contact:'sarah.j@email.com',    medicalHistory:'Hypertension légère',                    avatar:'SJ', avatarColor:'#0ea5c9' },
  { id:'P-002', firstName:'Marc',    lastName:'Bernard',  fullName:'Marc Bernard',    age:56, dateOfBirth:'1969-08-22', gender:'Masculin',  department:'Cardiologie', totalVisits:12, lastVisitDate:'09 mar 2026', bloodPressure:'145/90', heartRate:88, temperature:37.1, spo2:96,  status:'warning',  contact:'m.bernard@email.com',   medicalHistory:'Diabète type 2, cholestérol',            avatar:'MB', avatarColor:'#6366f1' },
  { id:'P-003', firstName:'Lina',    lastName:'Khalil',   fullName:'Lina Khalil',     age:28, dateOfBirth:'1997-11-05', gender:'Féminin',   department:'Générale',    totalVisits:3,  lastVisitDate:'09 mar 2026', bloodPressure:'118/76', heartRate:72, temperature:36.6, spo2:99,  status:'stable',   contact:'lina.kh@email.com',     medicalHistory:'Aucun antécédent',                       avatar:'LK', avatarColor:'#10b981' },
  { id:'P-004', firstName:'Pierre',  lastName:'Morel',    fullName:'Pierre Morel',    age:67, dateOfBirth:'1958-02-18', gender:'Masculin',  department:'Cardiologie', totalVisits:20, lastVisitDate:'09 mar 2026', bloodPressure:'152/96', heartRate:98, temperature:37.4, spo2:94,  status:'critical', contact:'p.morel@email.com',     medicalHistory:'Insuffisance cardiaque, fibrillation',   avatar:'PM', avatarColor:'#f59e0b' },
  { id:'P-005', firstName:'Emma',    lastName:'Lefevre',  fullName:'Emma Lefevre',    age:42, dateOfBirth:'1983-07-30', gender:'Féminin',   department:'Générale',    totalVisits:5,  lastVisitDate:'01 mar 2026', bloodPressure:'122/80', heartRate:74, temperature:36.7, spo2:98,  status:'stable',   contact:'emma.lef@email.com',    medicalHistory:'Allergie pénicilline',                   avatar:'EL', avatarColor:'#f43f5e' },
  { id:'P-006', firstName:'Ahmed',   lastName:'Benali',   fullName:'Ahmed Benali',    age:51, dateOfBirth:'1974-09-14', gender:'Masculin',  department:'Cardiologie', totalVisits:9,  lastVisitDate:'25 fév 2026', bloodPressure:'136/88', heartRate:82, temperature:36.9, spo2:97,  status:'stable',   contact:'a.benali@email.com',    medicalHistory:'Hypertension traitée',                   avatar:'AB', avatarColor:'#a78bfa' },
  { id:'P-007', firstName:'Claire',  lastName:'Rousseau', fullName:'Claire Rousseau', age:38, dateOfBirth:'1987-12-03', gender:'Féminin',   department:'Neurologie',  totalVisits:4,  lastVisitDate:'18 fév 2026', bloodPressure:'120/78', heartRate:70, temperature:36.5, spo2:99,  status:'stable',   contact:'claire.r@email.com',    medicalHistory:'Migraines chroniques',                   avatar:'CR', avatarColor:'#fb923c' },
  { id:'P-008', firstName:'James',   lastName:'Wilson',   fullName:'James Wilson',    age:72, dateOfBirth:'1953-06-08', gender:'Masculin',  department:'Neurologie',  totalVisits:15, lastVisitDate:'15 fév 2026', bloodPressure:'158/100',heartRate:86, temperature:37.2, spo2:94,  status:'critical', contact:'j.wilson@email.com',    medicalHistory:'AVC ischémique 2023, anticoagulants',    avatar:'JW', avatarColor:'#0ea5c9' },
  { id:'P-009', firstName:'Sophia',  lastName:'Chen',     fullName:'Sophia Chen',     age:19, dateOfBirth:'2006-03-21', gender:'Féminin',   department:'Pédiatrie',   totalVisits:2,  lastVisitDate:'10 fév 2026', bloodPressure:'110/70', heartRate:76, temperature:36.4, spo2:99,  status:'stable',   contact:'sophia.chen@email.com', medicalHistory:'Asthme léger',                           avatar:'SC', avatarColor:'#10b981' },
  { id:'P-010', firstName:'Omar',    lastName:'Hassan',   fullName:'Omar Hassan',     age:45, dateOfBirth:'1980-01-15', gender:'Masculin',  department:'Générale',    totalVisits:6,  lastVisitDate:'05 fév 2026', bloodPressure:'130/85', heartRate:78, temperature:36.8, spo2:98,  status:'stable',   contact:'omar.h@email.com',      medicalHistory:'Surpoids, sédentarité',                  avatar:'OH', avatarColor:'#6366f1' },
  { id:'P-011', firstName:'Marie',   lastName:'Blanc',    fullName:'Marie Blanc',     age:61, dateOfBirth:'1964-10-27', gender:'Féminin',   department:'Cardiologie', totalVisits:11, lastVisitDate:'01 fév 2026', bloodPressure:'142/92', heartRate:84, temperature:37.0, spo2:96,  status:'warning',  contact:'marie.blanc@email.com', medicalHistory:'Arythmie traitée, statines',             avatar:'MB', avatarColor:'#f59e0b' },
  { id:'P-012', firstName:'Karim',   lastName:'Osman',    fullName:'Karim Osman',     age:33, dateOfBirth:'1992-05-19', gender:'Masculin',  department:'Générale',    totalVisits:1,  lastVisitDate:'28 jan 2026', bloodPressure:'115/74', heartRate:68, temperature:36.3, spo2:100, status:'stable',   contact:'karim.o@email.com',     medicalHistory:'Aucun',                                  avatar:'KO', avatarColor:'#f43f5e' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id:1,  patientName:'Sarah Johnson',   patientAge:34, patientAvatar:'SJ', patientAvatarColor:'#0ea5c9', date:'2026-03-09', time:'08:00', type:'Suivi cardiologie',        doctor:'Dr. Dupont',   status:'completed'  },
  { id:2,  patientName:'Marc Bernard',    patientAge:56, patientAvatar:'MB', patientAvatarColor:'#6366f1', date:'2026-03-09', time:'08:45', type:'ECG',                      doctor:'Dr. Dupont',   status:'completed'  },
  { id:3,  patientName:'Lina Khalil',     patientAge:28, patientAvatar:'LK', patientAvatarColor:'#10b981', date:'2026-03-09', time:'09:30', type:'Consultation générale',    doctor:'Dr. Dupont',   status:'completed'  },
  { id:4,  patientName:'Pierre Morel',    patientAge:67, patientAvatar:'PM', patientAvatarColor:'#f59e0b', date:'2026-03-09', time:'10:15', type:'Échocardiographie',        doctor:'Dr. Dupont',   status:'inprogress' },
  { id:5,  patientName:'Emma Lefevre',    patientAge:42, patientAvatar:'EL', patientAvatarColor:'#f43f5e', date:'2026-03-09', time:'11:00', type:'Bilan annuel',             doctor:'Dr. Fontaine', status:'confirmed'  },
  { id:6,  patientName:'Ahmed Benali',    patientAge:51, patientAvatar:'AB', patientAvatarColor:'#a78bfa', date:'2026-03-09', time:'11:45', type:'Suivi cardiologie',        doctor:'Dr. Dupont',   status:'confirmed'  },
  { id:7,  patientName:'Claire Rousseau', patientAge:38, patientAvatar:'CR', patientAvatarColor:'#fb923c', date:'2026-03-09', time:'14:00', type:'ECG',                      doctor:'Dr. Dupont',   status:'pending'    },
  { id:8,  patientName:'James Wilson',    patientAge:72, patientAvatar:'JW', patientAvatarColor:'#0ea5c9', date:'2026-03-09', time:'14:45', type:'Bilan neurologique',       doctor:'Dr. Martin',   status:'pending'    },
  { id:9,  patientName:'Sophia Chen',     patientAge:19, patientAvatar:'SC', patientAvatarColor:'#10b981', date:'2026-03-09', time:'15:30', type:'Consultation pédiatrique', doctor:'Dr. Dupont',   status:'pending'    },
  { id:10, patientName:'Omar Hassan',     patientAge:45, patientAvatar:'OH', patientAvatarColor:'#6366f1', date:'2026-03-09', time:'16:15', type:'Consultation générale',    doctor:'Dr. Dupont',   status:'cancelled'  },
  { id:11, patientName:'Marie Blanc',     patientAge:61, patientAvatar:'MB', patientAvatarColor:'#f59e0b', date:'2026-03-10', time:'08:00', type:'Suivi cardiologie',        doctor:'Dr. Dupont',   status:'confirmed'  },
  { id:12, patientName:'Karim Osman',     patientAge:33, patientAvatar:'KO', patientAvatarColor:'#f43f5e', date:'2026-03-10', time:'09:00', type:'ECG',                      doctor:'Dr. Dupont',   status:'confirmed'  },
  { id:13, patientName:'Sarah Johnson',   patientAge:34, patientAvatar:'SJ', patientAvatarColor:'#0ea5c9', date:'2026-03-11', time:'10:00', type:'Suivi cardiologie',        doctor:'Dr. Dupont',   status:'confirmed'  },
  { id:14, patientName:'Ahmed Benali',    patientAge:51, patientAvatar:'AB', patientAvatarColor:'#a78bfa', date:'2026-03-12', time:'11:00', type:'ECG',                      doctor:'Dr. Dupont',   status:'pending'    },
  { id:15, patientName:'Emma Lefevre',    patientAge:42, patientAvatar:'EL', patientAvatarColor:'#f43f5e', date:'2026-03-13', time:'09:30', type:'Bilan annuel',             doctor:'Dr. Fontaine', status:'confirmed'  },
];

export const MOCK_STATS: DashboardStats = {
  appointmentsToday:12, totalPatients:248, completedToday:7, pendingReview:3,
  appointmentsTrend:12, patientsTrend:8, completedTrend:3, pendingTrend:2,
};

export const MOCK_WEEKLY: WeeklyActivity[] = [
  { day:'Lun', count:9,  isToday:false },
  { day:'Mar', count:14, isToday:false },
  { day:'Mer', count:11, isToday:false },
  { day:'Jeu', count:16, isToday:false },
  { day:'Ven', count:8,  isToday:false },
  { day:'Sam', count:12, isToday:true  },
  { day:'Dim', count:7,  isToday:false },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id:1, patientName:'Sarah Johnson',   patientAvatar:'SJ', patientAvatarColor:'#0ea5c9', medication:'Amlodipine',    dosage:'5mg',   frequency:'1x/jour', duration:'3 mois', date:'09 mar 2026', doctor:'Dr. Dupont', instructions:'Le matin avec le repas',   status:'active'  },
  { id:2, patientName:'Marc Bernard',    patientAvatar:'MB', patientAvatarColor:'#6366f1', medication:'Metformine',    dosage:'500mg', frequency:'2x/jour', duration:'1 mois', date:'09 mar 2026', doctor:'Dr. Dupont', instructions:'Matin et soir avec repas',  status:'active'  },
  { id:3, patientName:'Pierre Morel',    patientAvatar:'PM', patientAvatarColor:'#f59e0b', medication:'Bisoprolol',    dosage:'5mg',   frequency:'1x/jour', duration:'3 mois', date:'05 mar 2026', doctor:'Dr. Dupont', instructions:'Le matin',                  status:'active'  },
  { id:4, patientName:'Marie Blanc',     patientAvatar:'MB', patientAvatarColor:'#f59e0b', medication:'Atorvastatine', dosage:'20mg',  frequency:'1x/jour', duration:'3 mois', date:'01 fév 2026', doctor:'Dr. Dupont', instructions:'Le soir',                   status:'expired' },
  { id:5, patientName:'Ahmed Benali',    patientAvatar:'AB', patientAvatarColor:'#a78bfa', medication:'Ramipril',      dosage:'5mg',   frequency:'1x/jour', duration:'1 mois', date:'25 fév 2026', doctor:'Dr. Dupont', instructions:'Le matin',                  status:'active'  },
  { id:6, patientName:'James Wilson',    patientAvatar:'JW', patientAvatarColor:'#0ea5c9', medication:'Warfarine',     dosage:'2mg',   frequency:'1x/jour', duration:'6 mois', date:'15 fév 2026', doctor:'Dr. Martin', instructions:'Surveillance INR mensuel',  status:'active'  },
  { id:7, patientName:'Claire Rousseau', patientAvatar:'CR', patientAvatarColor:'#fb923c', medication:'Sumatriptan',   dosage:'50mg',  frequency:'Si besoin',duration:'3 mois', date:'18 fév 2026', doctor:'Dr. Martin', instructions:'Lors des crises',           status:'active'  },
];

export const MOCK_INVOICES: Invoice[] = [
  { id:'F-2026-001', patientName:'Sarah Johnson',   patientAvatar:'SJ', patientAvatarColor:'#0ea5c9', date:'09 mar 2026', amount:85,  service:'Consultation cardiologie', status:'paid'    },
  { id:'F-2026-002', patientName:'Marc Bernard',    patientAvatar:'MB', patientAvatarColor:'#6366f1', date:'09 mar 2026', amount:120, service:'ECG + consultation',       status:'pending' },
  { id:'F-2026-003', patientName:'Pierre Morel',    patientAvatar:'PM', patientAvatarColor:'#f59e0b', date:'09 mar 2026', amount:220, service:'Échocardiographie',         status:'pending' },
  { id:'F-2026-004', patientName:'Emma Lefevre',    patientAvatar:'EL', patientAvatarColor:'#f43f5e', date:'01 mar 2026', amount:65,  service:'Consultation générale',    status:'paid'    },
  { id:'F-2026-005', patientName:'James Wilson',    patientAvatar:'JW', patientAvatarColor:'#0ea5c9', date:'15 fév 2026', amount:150, service:'Bilan neurologique',       status:'overdue' },
  { id:'F-2026-006', patientName:'Ahmed Benali',    patientAvatar:'AB', patientAvatarColor:'#a78bfa', date:'25 fév 2026', amount:85,  service:'Consultation cardiologie', status:'paid'    },
  { id:'F-2026-007', patientName:'Karim Osman',     patientAvatar:'KO', patientAvatarColor:'#f43f5e', date:'28 jan 2026', amount:65,  service:'Consultation générale',    status:'overdue' },
  { id:'F-2026-008', patientName:'Sophia Chen',     patientAvatar:'SC', patientAvatarColor:'#10b981', date:'10 fév 2026', amount:55,  service:'Consultation pédiatrique', status:'paid'    },
];