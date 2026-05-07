import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="bl-page">
  <div class="bl-header">
    <div>
      <div class="bl-eyebrow"><span class="bl-dot"></span>Finance</div>
      <h1 class="bl-title">Facturation</h1>
      <p class="bl-sub">Mars 2026 · {{ invoices.length }} factures</p>
    </div>
    <div class="bl-hdr-right">
      <div class="bl-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Chercher…" [(ngModel)]="search">
      </div>
      <button class="bl-btn-add">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouvelle facture
      </button>
    </div>
  </div>

  <!-- REVENUE CARDS -->
  <div class="bl-stats">
    @for (s of stats; track s.label; let i = $index) {
      <div class="bl-card bl-stat" [style.animation-delay]="(i*0.07)+'s'">
        <div class="bl-stat-glow" [style.background]="s.color"></div>
        <div class="bl-stat-label">{{ s.label }}</div>
        <div class="bl-stat-val" [style.color]="s.color">{{ s.val }}</div>
        <div class="bl-stat-sub">{{ s.sub }}</div>
        <div class="bl-stat-trend" [class.bl-trend-up]="s.up" [class.bl-trend-dn]="!s.up">
          {{ s.up ? '↑' : '↓' }} {{ s.trend }}
        </div>
      </div>
    }
  </div>

  <!-- CHART + BREAKDOWN -->
  <div class="bl-middle">
    <div class="bl-card bl-chart-card">
      <div class="bl-card-hd">
        <div class="bl-card-eyebrow">Revenus</div>
        <div class="bl-card-title">Évolution mensuelle</div>
      </div>
      <div class="bl-bar-chart">
        @for (m of monthlyData; track m.month; let i = $index) {
          <div class="bl-bar-col">
            <div class="bl-bar-wrap">
              <div class="bl-bar" [class.bl-bar-cur]="m.current"
                   [style.height]="(m.val/maxMonth*100)+'%'"
                   [style.animation-delay]="(0.2+i*0.05)+'s'"
                   [title]="m.val+' DT'">
                <div class="bl-bar-tooltip">{{ m.val }} DT</div>
              </div>
            </div>
            <div class="bl-bar-lbl" [class.bl-lbl-cur]="m.current">{{ m.month }}</div>
          </div>
        }
      </div>
    </div>

    <div class="bl-card bl-breakdown">
      <div class="bl-card-hd">
        <div class="bl-card-eyebrow">Répartition</div>
        <div class="bl-card-title">Par type</div>
      </div>
      @for (item of breakdown; track item.label) {
        <div class="bl-break-row">
          <div class="bl-break-dot" [style.background]="item.color"></div>
          <span class="bl-break-label">{{ item.label }}</span>
          <div class="bl-break-bar">
            <div class="bl-break-fill" [style.width]="item.pct+'%'" [style.background]="item.color"></div>
          </div>
          <span class="bl-break-val">{{ item.val }} DT</span>
          <span class="bl-break-pct">{{ item.pct }}%</span>
        </div>
      }
    </div>
  </div>

  <!-- INVOICES TABLE -->
  <div class="bl-card bl-table-card">
    <div class="bl-card-hd bl-table-hd">
      <div>
        <div class="bl-card-eyebrow">Historique</div>
        <div class="bl-card-title">Factures</div>
      </div>
      <div class="bl-status-filters">
        @for (f of invoiceFilters; track f.val) {
          <button class="bl-fbtn" [class.bl-fbtn-on]="activeFilter()===f.val" (click)="activeFilter.set(f.val)">{{ f.label }}</button>
        }
      </div>
    </div>
    <table class="bl-table">
      <thead>
        <tr>
          <th>Facture</th><th>Patient</th><th>Type</th><th>Date</th><th>Montant</th><th>Statut</th><th></th>
        </tr>
      </thead>
      <tbody>
        @for (inv of filteredInvoices(); track inv.id; let i = $index) {
          <tr class="bl-row" [style.animation-delay]="(i*0.04)+'s'">
            <td><span class="bl-inv-id">#{{ inv.id }}</span></td>
            <td>
              <div class="bl-pat-cell">
                <div class="bl-av" [style.background]="inv.grad">{{ inv.ini }}</div>
                <span class="bl-pat-name">{{ inv.patient }}</span>
              </div>
            </td>
            <td><span class="bl-type">{{ inv.type }}</span></td>
            <td><span class="bl-date">{{ inv.date }}</span></td>
            <td><span class="bl-amount">{{ inv.amount }} DT</span></td>
            <td><span class="bl-inv-status" [class]="'bls-'+inv.status">{{ invStatusLabel(inv.status) }}</span></td>
            <td>
              <div class="bl-row-actions">
                <button class="bl-ra-btn" title="Imprimer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>
                <button class="bl-ra-btn" title="Télécharger"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
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
    .bl-page { padding:28px 30px; display:flex; flex-direction:column; gap:18px; background:var(--bg); min-height:100%; animation:pgIn .5s ease both; }
    @keyframes pgIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
    .bl-header { display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:20px; border-bottom:1px solid rgba(59,130,246,.1); }
    .bl-eyebrow { display:flex; align-items:center; gap:7px; font-size:10px; font-weight:700; letter-spacing:2px; color:var(--b3); text-transform:uppercase; margin-bottom:8px; }
    .bl-dot { width:6px; height:6px; border-radius:50%; background:var(--b2); box-shadow:0 0 8px var(--b2); animation:dotP 2s ease infinite; }
    @keyframes dotP { 0%,100%{opacity:1} 50%{opacity:.3} }
    .bl-title { font-size:34px; font-weight:800; color:var(--t1); letter-spacing:-1.5px; background:linear-gradient(135deg,var(--t1) 20%,var(--b4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .bl-sub { font-size:12.5px; color:var(--t3); margin-top:5px; }
    .bl-hdr-right { display:flex; align-items:center; gap:10px; }
    .bl-search { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.036); border:1px solid rgba(59,130,246,.13); border-radius:10px; padding:8px 14px; width:200px; color:var(--t3); transition:all .2s; }
    .bl-search input { border:none; background:none; outline:none; font-size:13px; font-family:inherit; color:var(--t1); width:100%; }
    .bl-search input::placeholder { color:var(--t3); }
    .bl-search:focus-within { border-color:rgba(59,130,246,.45); background:rgba(59,130,246,.06); box-shadow:0 0 0 3px rgba(59,130,246,.1); }
    .bl-btn-add { display:flex; align-items:center; gap:7px; background:linear-gradient(135deg,var(--b2),var(--b)); border:none; border-radius:10px; padding:9px 18px; font-size:13px; font-weight:700; color:white; cursor:pointer; font-family:inherit; box-shadow:0 4px 18px rgba(59,130,246,.4); transition:all .2s; }
    .bl-btn-add:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(59,130,246,.55); }

    .bl-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
    .bl-card { background:var(--card); border:1px solid var(--bdr); border-radius:16px; backdrop-filter:blur(24px); position:relative; overflow:hidden; }
    .bl-card::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,.18),transparent); pointer-events:none; }
    .bl-stat { padding:20px 22px; animation:cardIn .5s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes cardIn { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:none} }
    .bl-stat-glow { position:absolute; bottom:0; left:10%; right:10%; height:1px; border-radius:99px; opacity:.5; filter:blur(2px); }
    .bl-stat-label { font-size:9px; font-weight:700; color:var(--t3); letter-spacing:1.4px; text-transform:uppercase; margin-bottom:10px; }
    .bl-stat-val { font-size:26px; font-weight:800; letter-spacing:-1px; line-height:1; margin-bottom:4px; }
    .bl-stat-sub { font-size:11.5px; color:var(--t2); margin-bottom:8px; }
    .bl-stat-trend { font-size:11px; font-weight:700; }
    .bl-trend-up { color:var(--grn); }
    .bl-trend-dn { color:var(--red); }

    .bl-middle { display:grid; grid-template-columns:1.6fr 1fr; gap:14px; }
    .bl-card-hd { padding:18px 20px 0; margin-bottom:14px; }
    .bl-card-eyebrow { font-size:9px; font-weight:700; letter-spacing:2px; color:var(--b3); text-transform:uppercase; margin-bottom:4px; }
    .bl-card-title { font-size:15px; font-weight:800; color:var(--t1); letter-spacing:-.3px; }

    .bl-bar-chart { height:140px; display:flex; align-items:flex-end; gap:6px; padding:0 20px 18px; position:relative; }
    .bl-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end; }
    .bl-bar-wrap { width:100%; flex:1; display:flex; align-items:flex-end; }
    .bl-bar { width:100%; border-radius:5px 5px 0 0; background:rgba(59,130,246,.12); position:relative; cursor:pointer; transition:all .2s; animation:barUp .6s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes barUp { from{transform:scaleY(0);transform-origin:bottom} to{transform:scaleY(1);transform-origin:bottom} }
    .bl-bar:hover .bl-bar-tooltip { opacity:1; transform:translateX(-50%) translateY(0); }
    .bl-bar-tooltip { position:absolute; top:-30px; left:50%; transform:translateX(-50%) translateY(5px); background:#0c1128; border:1px solid var(--bdrB); border-radius:7px; padding:3px 8px; font-size:10px; font-weight:700; color:var(--b3); pointer-events:none; opacity:0; transition:all .14s; white-space:nowrap; }
    .bl-bar-cur { background:linear-gradient(to top,#1d4ed8,#60a5fa); box-shadow:0 0 20px rgba(59,130,246,.5); }
    .bl-bar-lbl { font-size:9px; color:var(--t3); font-weight:600; }
    .bl-lbl-cur { color:var(--b3); font-weight:700; }

    .bl-break-row { display:flex; align-items:center; gap:10px; padding:10px 20px; border-bottom:1px solid rgba(255,255,255,.03); }
    .bl-break-row:last-child { border-bottom:none; padding-bottom:18px; }
    .bl-break-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .bl-break-label { font-size:12.5px; color:var(--t1); font-weight:500; min-width:90px; }
    .bl-break-bar { flex:1; height:4px; background:rgba(255,255,255,.05); border-radius:99px; overflow:hidden; }
    .bl-break-fill { height:100%; border-radius:99px; transition:width .6s ease; }
    .bl-break-val { font-size:12px; font-weight:700; color:var(--t1); min-width:65px; text-align:right; }
    .bl-break-pct { font-size:11px; color:var(--t3); min-width:30px; text-align:right; }

    .bl-table-hd { display:flex; align-items:flex-start; justify-content:space-between; }
    .bl-status-filters { display:flex; gap:4px; background:rgba(0,0,0,.4); border-radius:10px; padding:3px; }
    .bl-fbtn { padding:5px 12px; border-radius:8px; font-size:12px; font-weight:600; color:var(--t3); cursor:pointer; border:none; background:none; font-family:inherit; transition:all .16s; }
    .bl-fbtn:hover { color:var(--t2); }
    .bl-fbtn-on { background:var(--bD); color:var(--b3); border:1px solid var(--bdrB); }
    .bl-table { width:100%; border-collapse:collapse; }
    .bl-table thead tr { border-bottom:1px solid rgba(59,130,246,.08); }
    .bl-table th { padding:10px 18px; text-align:left; font-size:9.5px; font-weight:700; color:var(--t3); letter-spacing:1.2px; text-transform:uppercase; }
    .bl-row { border-bottom:1px solid rgba(255,255,255,.03); transition:all .16s; animation:rowIn .4s cubic-bezier(.22,1,.36,1) both; }
    @keyframes rowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
    .bl-row:last-child { border-bottom:none; }
    .bl-row:hover { background:rgba(59,130,246,.05); }
    .bl-row td { padding:11px 18px; vertical-align:middle; }
    .bl-inv-id { font-size:12px; font-weight:700; color:var(--b3); font-family:monospace; }
    .bl-pat-cell { display:flex; align-items:center; gap:9px; }
    .bl-av { width:28px; height:28px; border-radius:7px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:800; color:white; }
    .bl-pat-name { font-size:13px; font-weight:600; color:var(--t1); }
    .bl-type { font-size:12px; color:var(--t2); }
    .bl-date { font-size:12px; color:var(--t2); }
    .bl-amount { font-size:13.5px; font-weight:800; color:var(--t1); }
    .bl-inv-status { padding:3px 10px; border-radius:99px; font-size:9.5px; font-weight:700; white-space:nowrap; }
    .bls-paid     { background:rgba(52,211,153,.1); border:1px solid rgba(52,211,153,.22); color:var(--grn); }
    .bls-pending  { background:rgba(251,191,36,.1); border:1px solid rgba(251,191,36,.22); color:var(--amb); }
    .bls-overdue  { background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.22); color:var(--red); }
    .bl-row-actions { display:flex; gap:5px; }
    .bl-ra-btn { width:26px; height:26px; border-radius:6px; background:rgba(255,255,255,.04); border:1px solid var(--bdr); color:var(--t2); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .14s; }
    .bl-ra-btn:hover { background:var(--bD); border-color:var(--bdrB); color:var(--b3); transform:scale(1.08); }
  `]
})
export class BillingComponent {
  search = '';
  activeFilter = signal('all');

  readonly maxMonth = 6500;

  readonly stats = [
    { label:'REVENUS DU MOIS', val:'4 820 DT', sub:'Mars 2026', trend:'3% vs Fév', up:false, color:'#60a5fa' },
    { label:'PAYÉ', val:'3 960 DT', sub:'82% des factures', trend:'12% vs Fév', up:true, color:'#34d399' },
    { label:'EN ATTENTE', val:'620 DT', sub:'4 factures', trend:'2% vs Fév', up:false, color:'#fbbf24' },
    { label:'EN RETARD', val:'240 DT', sub:'2 factures', trend:'5% vs Fév', up:false, color:'#f87171' },
  ];

  readonly monthlyData = [
    { month:'Oct', val:3800, current:false },{ month:'Nov', val:4200, current:false },
    { month:'Déc', val:3600, current:false },{ month:'Jan', val:4800, current:false },
    { month:'Fév', val:4980, current:false },{ month:'Mars', val:4820, current:true },
  ];

  readonly breakdown = [
    { label:'Consultations', val:'2 340', pct:49, color:'#3b82f6' },
    { label:'Bilans', val:'1 240', pct:26, color:'#22d3ee' },
    { label:'Post-op', val:'860', pct:18, color:'#818cf8' },
    { label:'Urgences', val:'380', pct:8, color:'#f472b6' },
  ];

  readonly invoiceFilters = [
    { val:'all', label:'Toutes' },
    { val:'paid', label:'Payées' },
    { val:'pending', label:'En attente' },
    { val:'overdue', label:'En retard' },
  ];

  readonly invoices = [
    { id:'2026-0042', patient:'Karim Ayoub', ini:'KA', grad:'linear-gradient(135deg,#3b82f6,#1d4ed8)', type:'Suivi cardiologie', date:'12 Mars 2026', amount:'85', status:'paid' },
    { id:'2026-0041', patient:'Fatma Ben Ali', ini:'FB', grad:'linear-gradient(135deg,#22d3ee,#0891b2)', type:'Consultation', date:'10 Mars 2026', amount:'70', status:'paid' },
    { id:'2026-0040', patient:'Omar Mejri', ini:'OM', grad:'linear-gradient(135deg,#f87171,#dc2626)', type:'Post-op (valve)', date:'8 Mars 2026', amount:'240', status:'pending' },
    { id:'2026-0039', patient:'Sonia Trabelsi', ini:'ST', grad:'linear-gradient(135deg,#34d399,#059669)', type:'Bilan diabétique', date:'7 Mars 2026', amount:'120', status:'paid' },
    { id:'2026-0038', patient:'Hichem Gharbi', ini:'HG', grad:'linear-gradient(135deg,#818cf8,#4f46e5)', type:'Suivi IRC', date:'5 Mars 2026', amount:'85', status:'overdue' },
    { id:'2026-0037', patient:'Bilel Jrad', ini:'BJ', grad:'linear-gradient(135deg,#f472b6,#db2777)', type:'Urgence cardiaque', date:'4 Mars 2026', amount:'150', status:'paid' },
    { id:'2026-0036', patient:'Leila Mansouri', ini:'LM', grad:'linear-gradient(135deg,#fbbf24,#d97706)', type:'Consultation asthme', date:'3 Mars 2026', amount:'70', status:'pending' },
    { id:'2026-0035', patient:'Nadia Chaari', ini:'NC', grad:'linear-gradient(135deg,#22d3ee,#4f46e5)', type:'Suivi migraine', date:'1 Mars 2026', amount:'70', status:'overdue' },
  ];

  readonly filteredInvoices = computed(() => {
    let list = this.invoices;
    if (this.activeFilter() !== 'all') list = list.filter(i => i.status === this.activeFilter());
    if (this.search) list = list.filter(i => i.patient.toLowerCase().includes(this.search.toLowerCase()));
    return list;
  });

  invStatusLabel(s: string) { return { paid:'Payée', pending:'En attente', overdue:'En retard' }[s] ?? s; }
}