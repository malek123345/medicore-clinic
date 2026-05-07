import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { Patient, Appointment } from '../../../core/models';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
@if (patient(); as p) {
  <div class="back"><a routerLink="/patients">← Retour aux patients</a></div>
  <div class="phead">
    <div class="ava-lg" [style.background]="p.avatarColor+'18'" [style.color]="p.avatarColor">{{ p.avatar }}</div>
    <div>
      <h1>{{ p.firstName }} {{ p.lastName }}</h1>
      <div class="pids">
        <span>{{ p.id }}</span><span>·</span><span>{{ p.age }} ans</span>
        <span>·</span><span>{{ p.gender }}</span><span>·</span><span>{{ p.department }}</span>
        <span class="stag" [style.background]="dc(p.status)+'18'" [style.color]="dc(p.status)">{{ p.status }}</span>
      </div>
    </div>
  </div>

  <div class="dgrid">
    <div class="card">
      <div class="ch"><div class="ct">Signes vitaux</div></div>
      <div class="cb">
        @for (v of vitals(p); track v.label) {
          <div class="vrow">
            <div class="vico">{{ v.icon }}</div>
            <div style="flex:1"><div class="vl">{{ v.label }}</div><div class="vv" [style.color]="v.color">{{ v.value }}</div></div>
            <div class="vbar"><div class="vbf" [style.width]="v.pct+'%'" [style.background]="v.color"></div></div>
          </div>
        }
      </div>
    </div>

    <div class="card">
      <div class="ch"><div class="ct">Informations</div></div>
      <div class="cb">
        <div class="irow"><div class="il">Date de naissance</div><div class="iv">{{ p.dateOfBirth }}</div></div>
        <div class="irow"><div class="il">Contact</div><div class="iv">{{ p.contact || '—' }}</div></div>
        <div class="irow"><div class="il">Total visites</div><div class="iv">{{ p.totalVisits }}</div></div>
        <div class="irow"><div class="il">Dernière visite</div><div class="iv">{{ p.lastVisitDate }}</div></div>
        <div class="irow" style="align-items:flex-start">
          <div class="il">Antécédents</div>
          <div class="iv" style="max-width:200px;text-align:right">{{ p.medicalHistory || '—' }}</div>
        </div>
      </div>
    </div>

    <div class="card" style="grid-column:1/-1">
      <div class="ch"><div class="ct">Historique des rendez-vous</div></div>
      <div class="cb">
        <table class="tbl">
          <thead><tr><th>Date</th><th>Heure</th><th>Type</th><th>Médecin</th><th>Statut</th></tr></thead>
          <tbody>
            @for (a of patAppts(); track a.id) {
              <tr>
                <td>{{ a.date }}</td>
                <td class="muted">{{ a.time }}</td>
                <td>{{ a.type }}</td>
                <td class="muted">{{ a.doctor }}</td>
                <td><span class="bdg" [class]="a.status">{{ lbl(a.status) }}</span></td>
              </tr>
            } @empty {
              <tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:20px">Aucun rendez-vous</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>
} @else {
  <div style="text-align:center;padding:60px;color:#94a3b8">
    @if (loading()) { Chargement… } @else { Patient introuvable }
  </div>
}
  `,
  styles: [`
    :host{display:block}
    .back{margin-bottom:16px} .back a{font-size:13px;color:#0ea5c9;text-decoration:none;font-weight:600}
    .phead{display:flex;align-items:center;gap:18px;margin-bottom:22px;padding:20px;background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 4px rgba(0,0,0,.05)}
    .ava-lg{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;flex-shrink:0}
    h1{font-size:22px;font-weight:700;color:#0d1b2a}
    .pids{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:13px;color:#64748b;flex-wrap:wrap}
    .stag{padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600}
    .dgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .card{background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 4px rgba(0,0,0,.05)}
    .ch{display:flex;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(0,0,0,.04)}
    .ct{font-size:14px;font-weight:600;color:#0d1b2a}
    .cb{padding:14px 18px}
    .vrow{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.04)}
    .vrow:last-child{border-bottom:none}
    .vico{font-size:18px;width:30px;text-align:center;flex-shrink:0}
    .vl{font-size:11px;color:#94a3b8} .vv{font-size:15px;font-weight:700;margin-top:1px}
    .vbar{width:60px;height:3px;background:#f0f4f8;border-radius:99px;overflow:hidden}
    .vbf{height:100%;border-radius:99px}
    .irow{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.04)}
    .irow:last-child{border-bottom:none}
    .il{font-size:12px;color:#94a3b8} .iv{font-size:13px;font-weight:500;color:#0d1b2a}
    .tbl{width:100%;border-collapse:collapse}
    .tbl th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;padding:0 10px 10px 0;border-bottom:1px solid rgba(0,0,0,.06);font-weight:600}
    .tbl td{padding:10px 10px 10px 0;font-size:13px;border-bottom:1px solid rgba(0,0,0,.04)}
    .tbl tr:last-child td{border-bottom:none} .muted{color:#94a3b8}
    .bdg{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600}
    .bdg::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.7}
    .bdg.confirmed{background:#ecfdf5;color:#059669} .bdg.pending{background:#fffbeb;color:#d97706}
    .bdg.inprogress{background:#e0f5fa;color:#0ea5c9} .bdg.cancelled{background:#fff1f2;color:#e11d48}
    .bdg.completed{background:#f1f5f9;color:#64748b}
  `]
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ds    = inject(DataService);

  patient  = signal<Patient | null>(null);
  patAppts = signal<Appointment[]>([]);
  loading  = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.ds.getPatientById(id).subscribe(p => {
      this.patient.set(p ?? null);
      this.loading.set(false);
    });
    this.ds.getAppointments().subscribe(r => {
      this.patAppts.set(r.data.filter(a =>
        a.patientName.toLowerCase().includes(
          id.replace('P-0','').replace('P-','').toLowerCase()
        )
      ));
    });
  }

  vitals(p: Patient) {
    return [
      { label:'Fréquence cardiaque', icon:'❤️', value:`${p.heartRate} bpm`, color:'#e11d48', pct:Math.min(p.heartRate, 100) },
      { label:'Tension artérielle',  icon:'🩸', value:p.bloodPressure,       color:'#d97706', pct:55 },
      { label:'Température',         icon:'🌡️', value:`${p.temperature}°C`, color:'#059669', pct:48 },
      { label:'SpO₂',                icon:'💨', value:`${p.spo2}%`,          color:'#0ea5c9', pct:p.spo2 },
    ];
  }

  dc(s: string)  { return ({stable:'#10b981',warning:'#f59e0b',critical:'#f43f5e'} as any)[s] ?? '#10b981'; }
  lbl(s: string) { return ({confirmed:'Confirmé',pending:'En attente',inprogress:'En cours',cancelled:'Annulé',completed:'Terminé'} as any)[s] ?? s; }
}