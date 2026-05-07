import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="rx-page">
  <div class="rx-header">
    <div>
      <div class="rx-eyebrow"><span class="rx-dot"></span>Gestion des ordonnances</div>
      <h1 class="rx-title">Ordonnances</h1>
      <p class="rx-sub">{{ prescriptions.length }} ordonnances actives</p>
    </div>
    <div class="rx-hdr-right">
      <div class="rx-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Chercher…" [(ngModel)]="search">
      </div>
      <button class="rx-btn-add">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouvelle ordonnance
      </button>
    </div>
  </div>

  <div class="rx-stats">
    @for (s of stats; track s.label) {
      <div class="rx-card rx-stat">
        <div class="rx-stat-icon" [style.background]="s.bg" [style.color]="s.color">
          <span [innerHTML]="s.icon"></span>
        </div>
        <div>
          <div class="rx-stat-val" [style.color]="s.color">{{ s.val }}</div>
          <div class="rx-stat-lbl">{{ s.label }}</div>
        </div>
      </div>
    }
  </div>

  <div class="rx-grid">
    @for (rx of filtered(); track rx.id; let i = $index) {
      <div class="rx-card rx-item" [class.rx-expiring]="rx.status==='expiring'" [style.animation-delay]="(i*0.07)+'s'">
        <div class="rx-item-hd">
          <div class="rx-pat-info">
            <div class="rx-av" [style.background]="rx.grad">{{ rx.ini }}</div>
            <div>
              <div class="rx-pat-name">{{ rx.patient }}</div>
              <div class="rx-pat-diag">{{ rx.diagnosis }}</div>
            </div>
          </div>
          <span class="rx-status" [class]="'rxs-'+rx.status">{{ rxStatusLabel(rx.status) }}</span>
        </div>

        <div class="rx-meds">
          @for (med of rx.meds; track med.name) {
            <div class="rx-med-row">
              <div class="rx-med-dot"></div>
              <div class="rx-med-info">
                <span class="rx-med-name">{{ med.name }}</span>
                <span class="rx-med-dose">{{ med.dose }}</span>
              </div>
              <span class="rx-med-freq">{{ med.freq }}</span>
            </div>
          }
        </div>

        <div class="rx-item-ft">
          <div class="rx-dates">
            <div class="rx-date-item"><span class="rx-date-lbl">Émise le</span><span class="rx-date-val">{{ rx.issued }}</span></div>
            <div class="rx-date-sep"></div>
            <div class="rx-date-item"><span class="rx-date-lbl">Expire le</span><span class="rx-date-val" [style.color]="rx.status==='expiring'?'#fbbf24':''">{{ rx.expires }}</span></div>
          </div>
          <div class="rx-actions">
            <button class="rx-btn-icon" title="Imprimer"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>
            <button class="rx-btn-icon" title="Renouveler"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg></button>
          </div>
        </div>
      </div>
    }
  </div>
</div>
  `,
  styles: [`
    :host {
      --bg:#04050a; --b:#2563eb; --b2:#3b82f6; --b3:#60a5fa; --b4:#93c5fd;
      --bD:rgba(59,130,246,.1); --bdrB:rgba(59,130,246,.26);
      --card:rgba(255,255,255,.032); --bdr:rgba(255,255,255,.062);
      --t1:#dde6f5; --t2:#6272a0; --t3:#323a58;
      --grn:#34d399; --red:#f87171; --amb:#fbbf24;
    }
    .rx-page { padding:28px 30px; display:flex; flex-direction:column; gap:18px; background:var(--bg); min-height:100%; animation:pgIn .5s ease both; }
    @keyframes pgIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
    .rx-header { display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:20px; border-bottom:1px solid rgba(59,130,246,.1); }
    .rx-eyebrow { display:flex; align-items:center; gap:7px; font-size:10px; font-weight:700; letter-spacing:2px; color:var(--b3); text-transform:uppercase; margin-bottom:8px; }
    .rx-dot { width:6px; height:6px; border-radius:50%; background:var(--b2); box-shadow:0 0 8px var(--b2); animation:dotP 2s ease infinite; }
    @keyframes dotP { 0%,100%{opacity:1} 50%{opacity:.3} }
    .rx-title { font-size:34px; font-weight:800; color:var(--t1); letter-spacing:-1.5px; background:linear-gradient(135deg,var(--t1) 20%,var(--b4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .rx-sub { font-size:12.5px; color:var(--t3); margin-top:5px; }
    .rx-hdr-right { display:flex; align-items:center; gap:10px; }
    .rx-search { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.036); border:1px solid rgba(59,130,246,.13); border-radius:10px; padding:8px 14px; width:200px; color:var(--t3); transition:all .2s; }
    .rx-search input { border:none; background:none; outline:none; font-size:13px; font-family:inherit; color:var(--t1); width:100%; }
    .rx-search input::placeholder { color:var(--t3); }
    .rx-search:focus-within { border-color:rgba(59,130,246,.45); background:rgba(59,130,246,.06); box-shadow:0 0 0 3px rgba(59,130,246,.1); }
    .rx-btn-add { display:flex; align-items:center; gap:7px; background:linear-gradient(135deg,var(--b2),var(--b)); border:none; border-radius:10px; padding:9px 18px; font-size:13px; font-weight:700; color:white; cursor:pointer; font-family:inherit; box-shadow:0 4px 18px rgba(59,130,246,.4); transition:all .2s; }
    .rx-btn-add:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(59,130,246,.55); }

    .rx-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
    .rx-card { background:var(--card); border:1px solid var(--bdr); border-radius:16px; backdrop-filter:blur(24px); position:relative; overflow:hidden; }
    .rx-card::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,.18),transparent); pointer-events:none; }
    .rx-stat { display:flex; align-items:center; gap:14px; padding:18px 20px; animation:cardIn .5s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes cardIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    .rx-stat-icon { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rx-stat-icon ::ng-deep svg { width:16px; height:16px; }
    .rx-stat-val { font-size:28px; font-weight:800; letter-spacing:-1px; }
    .rx-stat-lbl { font-size:11px; color:var(--t2); margin-top:2px; }

    .rx-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(360px,1fr)); gap:14px; }
    .rx-item { padding:18px 20px; transition:all .22s; animation:cardIn .5s cubic-bezier(.34,1.56,.64,1) both; cursor:pointer; }
    .rx-item:hover { border-color:rgba(59,130,246,.22); transform:translateY(-2px); box-shadow:0 12px 36px rgba(0,0,0,.4); }
    .rx-expiring { border-color:rgba(251,191,36,.25); box-shadow:0 0 20px rgba(251,191,36,.07); }
    .rx-item-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .rx-pat-info { display:flex; align-items:center; gap:10px; }
    .rx-av { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:white; }
    .rx-pat-name { font-size:13.5px; font-weight:700; color:var(--t1); }
    .rx-pat-diag { font-size:11px; color:var(--t3); margin-top:2px; }
    .rx-status { padding:3px 10px; border-radius:99px; font-size:9.5px; font-weight:700; white-space:nowrap; }
    .rxs-active   { background:rgba(52,211,153,.1); border:1px solid rgba(52,211,153,.22); color:var(--grn); }
    .rxs-expiring { background:rgba(251,191,36,.1); border:1px solid rgba(251,191,36,.22); color:var(--amb); animation:expPulse 2s ease infinite; }
    .rxs-expired  { background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.22); color:var(--red); }
    @keyframes expPulse { 0%,100%{box-shadow:none} 50%{box-shadow:0 0 8px rgba(251,191,36,.3)} }
    .rx-meds { display:flex; flex-direction:column; gap:7px; margin-bottom:14px; padding:12px; background:rgba(255,255,255,.025); border-radius:10px; border:1px solid var(--bdr); }
    .rx-med-row { display:flex; align-items:center; gap:9px; }
    .rx-med-dot { width:6px; height:6px; border-radius:50%; background:var(--b2); box-shadow:0 0 6px var(--b2); flex-shrink:0; }
    .rx-med-info { flex:1; display:flex; align-items:center; gap:8px; }
    .rx-med-name { font-size:12.5px; font-weight:600; color:var(--t1); }
    .rx-med-dose { font-size:11px; color:var(--b3); background:var(--bD); padding:1px 7px; border-radius:99px; }
    .rx-med-freq { font-size:11px; color:var(--t2); }
    .rx-item-ft { display:flex; align-items:center; justify-content:space-between; }
    .rx-dates { display:flex; align-items:center; gap:12px; }
    .rx-date-item { display:flex; flex-direction:column; gap:2px; }
    .rx-date-lbl { font-size:9px; font-weight:700; color:var(--t3); letter-spacing:.8px; text-transform:uppercase; }
    .rx-date-val { font-size:12px; color:var(--t2); font-weight:500; }
    .rx-date-sep { width:1px; height:28px; background:rgba(255,255,255,.06); }
    .rx-actions { display:flex; gap:6px; }
    .rx-btn-icon { width:30px; height:30px; border-radius:8px; background:rgba(255,255,255,.04); border:1px solid var(--bdr); color:var(--t2); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .14s; }
    .rx-btn-icon:hover { background:var(--bD); border-color:var(--bdrB); color:var(--b3); transform:scale(1.08); }
  `]
})
export class PrescriptionsComponent {
  search = '';

  readonly stats = [
    { label:'Actives', val:'18', color:'#34d399', bg:'rgba(52,211,153,.1)', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>` },
    { label:'Expirent bientôt', val:'3', color:'#fbbf24', bg:'rgba(251,191,36,.1)', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
    { label:'Expirées', val:'5', color:'#f87171', bg:'rgba(248,113,113,.1)', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>` },
    { label:'Ce mois', val:'26', color:'#60a5fa', bg:'rgba(59,130,246,.1)', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  ];

  readonly prescriptions = [
    { id:1, patient:'Karim Ayoub', ini:'KA', grad:'linear-gradient(135deg,#3b82f6,#1d4ed8)', diagnosis:'Arythmie cardiaque', status:'active', issued:'1 Mars 2026', expires:'1 Juin 2026', meds:[{name:'Bisoprolol',dose:'5mg',freq:'1×/jour'},{name:'Rivaroxaban',dose:'20mg',freq:'1×/jour au dîner'}] },
    { id:2, patient:'Fatma Ben Ali', ini:'FB', grad:'linear-gradient(135deg,#22d3ee,#0891b2)', diagnosis:'Hypertension', status:'expiring', issued:'10 Jan 2026', expires:'10 Avril 2026', meds:[{name:'Amlodipine',dose:'5mg',freq:'1×/jour'},{name:'Losartan',dose:'50mg',freq:'1×/jour'}] },
    { id:3, patient:'Omar Mejri', ini:'OM', grad:'linear-gradient(135deg,#f87171,#dc2626)', diagnosis:'Post-op valve', status:'active', issued:'5 Mars 2026', expires:'5 Sept 2026', meds:[{name:'Warfarine',dose:'5mg',freq:'1×/jour soir'},{name:'Furosémide',dose:'40mg',freq:'1×/matin'},{name:'Spironolactone',dose:'25mg',freq:'1×/jour'}] },
    { id:4, patient:'Sonia Trabelsi', ini:'ST', grad:'linear-gradient(135deg,#34d399,#059669)', diagnosis:'Diabète T2', status:'active', issued:'15 Fév 2026', expires:'15 Mai 2026', meds:[{name:'Metformine',dose:'1000mg',freq:'2×/jour'},{name:'Sitagliptine',dose:'100mg',freq:'1×/jour'}] },
    { id:5, patient:'Hichem Gharbi', ini:'HG', grad:'linear-gradient(135deg,#818cf8,#4f46e5)', diagnosis:'IRC stade 3', status:'expiring', issued:'20 Fév 2026', expires:'20 Avril 2026', meds:[{name:'Epoetin alfa',dose:'4000UI',freq:'3×/semaine'},{name:'Carbonate de Ca',dose:'500mg',freq:'3×/jour'}] },
    { id:6, patient:'Bilel Jrad', ini:'BJ', grad:'linear-gradient(135deg,#f472b6,#db2777)', diagnosis:'Coronaropathie', status:'active', issued:'8 Mars 2026', expires:'8 Sept 2026', meds:[{name:'Aspirine',dose:'100mg',freq:'1×/jour'},{name:'Atorvastatine',dose:'40mg',freq:'1×/soir'},{name:'Clopidogrel',dose:'75mg',freq:'1×/jour'}] },
  ];

  readonly filtered = computed(() => {
    if (!this.search) return this.prescriptions;
    return this.prescriptions.filter(rx => rx.patient.toLowerCase().includes(this.search.toLowerCase()) || rx.diagnosis.toLowerCase().includes(this.search.toLowerCase()));
  });

  rxStatusLabel(s: string) { return { active:'Active', expiring:'Expire bientôt', expired:'Expirée' }[s] ?? s; }
}