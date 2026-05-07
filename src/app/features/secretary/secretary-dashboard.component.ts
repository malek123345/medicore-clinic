import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secretary-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="banner">
    <h1>Bonjour, Amira 👋</h1>
    <p>{{ today }} — Tableau de bord secrétariat</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card" *ngFor="let s of stats">
      <div class="stat-icon" [style.background]="s.bg">{{ s.icon }}</div>
      <div><p class="stat-val">{{ s.val }}</p><p class="stat-lbl">{{ s.label }}</p></div>
    </div>
  </div>

  <div class="two-col">
    <div class="card">
      <h3>Rendez-vous du jour</h3>
      <div class="rdv-list">
        <div class="rdv-row" *ngFor="let r of rdvs">
          <span class="rdv-time-badge">{{ r.time }}</span>
          <div><p class="rdv-patient">{{ r.patient }}</p><p class="rdv-doc">{{ r.doctor }}</p></div>
          <span class="rdv-status-badge" [class]="r.status">{{ r.statusLabel }}</span>
        </div>
      </div>
    </div>
    <div class="card">
      <h3>Demandes en attente</h3>
      <div class="demande-list">
        <div class="demande-row" *ngFor="let d of demandes">
          <div class="demande-av">{{ d.avatar }}</div>
          <div><p class="dem-name">{{ d.patient }}</p><p class="dem-info">{{ d.info }}</p></div>
          <div class="dem-actions">
            <button class="btn-accept">✓</button>
            <button class="btn-reject">✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    * { box-sizing:border-box; margin:0; padding:0; }
    .page { padding:1.5rem; font-family:'Segoe UI',sans-serif; min-height:100vh; background:#f5f3ff; }
    .banner { background:linear-gradient(135deg,#7c3aed,#4f46e5); border-radius:16px; padding:1.5rem 2rem; color:white; margin-bottom:1.5rem; }
    .banner h1 { font-size:1.6rem; font-weight:700; }
    .banner p  { opacity:.8; margin-top:.25rem; }
    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
    .stat-card { background:white; border-radius:14px; padding:1.1rem; box-shadow:0 2px 10px rgba(0,0,0,.06); display:flex; align-items:center; gap:.9rem; }
    .stat-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; }
    .stat-val  { font-size:1.4rem; font-weight:800; color:#1e293b; }
    .stat-lbl  { font-size:.75rem; color:#64748b; }
    .two-col { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
    .card { background:white; border-radius:16px; padding:1.25rem; box-shadow:0 2px 12px rgba(0,0,0,.06); }
    .card h3 { font-size:1rem; font-weight:700; color:#1e293b; margin-bottom:1rem; }
    .rdv-list { display:flex; flex-direction:column; gap:.6rem; }
    .rdv-row { display:flex; align-items:center; gap:.75rem; padding:.6rem; background:#f8fafc; border-radius:8px; }
    .rdv-time-badge { background:#7c3aed; color:white; font-size:.75rem; font-weight:700; padding:.25rem .6rem; border-radius:6px; flex-shrink:0; }
    .rdv-patient { font-weight:600; font-size:.88rem; color:#1e293b; }
    .rdv-doc { font-size:.75rem; color:#64748b; }
    .rdv-status-badge { margin-left:auto; font-size:.7rem; font-weight:700; padding:.2rem .6rem; border-radius:20px; }
    .rdv-status-badge.confirmed { background:#d1fae5; color:#065f46; }
    .rdv-status-badge.pending   { background:#fef9c3; color:#854d0e; }
    .demande-list { display:flex; flex-direction:column; gap:.6rem; }
    .demande-row { display:flex; align-items:center; gap:.75rem; padding:.7rem; background:#f8fafc; border-radius:8px; }
    .demande-av { width:34px; height:34px; border-radius:50%; background:#7c3aed; color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.8rem; }
    .dem-name { font-weight:600; font-size:.88rem; color:#1e293b; }
    .dem-info { font-size:.75rem; color:#64748b; }
    .dem-actions { margin-left:auto; display:flex; gap:.4rem; }
    .btn-accept { background:#d1fae5; color:#065f46; border:none; width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:.9rem; }
    .btn-reject  { background:#fef2f2; color:#dc2626; border:none; width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:.9rem; }
    @media (max-width:900px) { .stats-grid { grid-template-columns:repeat(2,1fr); } .two-col { grid-template-columns:1fr; } }
  `]
})
export class SecretaryDashboardComponent {
  today = new Date().toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  stats = [
    { icon:'📅', val:12, label:'RDV aujourd\'hui', bg:'#ede9fe' },
    { icon:'⏳', val:4,  label:'En attente',        bg:'#fef9c3' },
    { icon:'👥', val:38, label:'Patients actifs',   bg:'#dbeafe' },
    { icon:'✅', val:8,  label:'Confirmés',          bg:'#d1fae5' },
  ];

  rdvs = [
    { time:'09:00', patient:'Karim Ayoub',    doctor:'Dr. Dupont',  status:'confirmed', statusLabel:'Confirmé' },
    { time:'10:30', patient:'Sana Ben Ali',   doctor:'Dr. Fontaine',status:'confirmed', statusLabel:'Confirmé' },
    { time:'11:00', patient:'Ahmed Trabelsi', doctor:'Dr. Martin',  status:'pending',   statusLabel:'En attente' },
    { time:'14:00', patient:'Nadia Hamdi',    doctor:'Dr. Dupont',  status:'confirmed', statusLabel:'Confirmé' },
  ];

  demandes = [
    { avatar:'MT', patient:'Mohamed Tlili',  info:'RDV Cardiologie — 25 Avr' },
    { avatar:'LB', patient:'Leila Baccouche',info:'RDV Générale — 26 Avr' },
    { avatar:'RS', patient:'Rami Saidi',     info:'RDV Neurologie — 28 Avr' },
  ];
}