import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="rc-page">
  <div class="rc-header">
    <div>
      <div class="rc-eyebrow"><span class="rc-dot"></span>Dossiers médicaux</div>
      <h1 class="rc-title">Dossiers</h1>
      <p class="rc-sub">{{ records.length }} dossiers patients</p>
    </div>
    <div class="rc-hdr-right">
      <div class="rc-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Chercher un dossier…" [(ngModel)]="search">
      </div>
      <div class="rc-filters">
        @for (f of categories; track f) {
          <button class="rc-fbtn" [class.rc-fbtn-on]="activeCategory()===f" (click)="activeCategory.set(f)">{{ f }}</button>
        }
      </div>
    </div>
  </div>

  <div class="rc-layout" [class.rc-has-detail]="selectedRecord()">

    <div class="rc-card rc-list">
      @for (r of filteredRecords(); track r.id; let i = $index) {
        <div class="rc-row" [class.rc-row-sel]="selectedRecord()?.id===r.id" (click)="selectedRecord.set(r)"
             [style.animation-delay]="(i*0.05)+'s'">
          <div class="rc-row-left">
            <div class="rc-av" [style.background]="r.grad">{{ r.ini }}</div>
            <div>
              <div class="rc-patient-name">{{ r.patient }}</div>
              <div class="rc-record-type">{{ r.category }} · {{ r.date }}</div>
            </div>
          </div>
          <div class="rc-row-right">
            <span class="rc-category-tag" [style.background]="r.catColor+'20'" [style.border-color]="r.catColor+'50'" [style.color]="r.catColor">{{ r.category }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--t3)"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      }
    </div>

    @if (selectedRecord(); as r) {
      <div class="rc-card rc-detail" style="animation:slideIn .3s cubic-bezier(.34,1.56,.64,1)">
        <div class="rc-detail-hd">
          <button class="rc-close-btn" (click)="selectedRecord.set(null)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="rc-det-patient">
            <div class="rc-det-av" [style.background]="r.grad">{{ r.ini }}</div>
            <div>
              <div class="rc-det-name">{{ r.patient }}</div>
              <span class="rc-category-tag" [style.background]="r.catColor+'20'" [style.border-color]="r.catColor+'50'" [style.color]="r.catColor">{{ r.category }}</span>
            </div>
          </div>
        </div>
        <div class="rc-det-body">
          <div class="rc-det-section">
            <div class="rc-det-sec-title">Informations</div>
            <div class="rc-info-grid">
              <div class="rc-info-item"><div class="rc-info-lbl">Date</div><div class="rc-info-val">{{ r.date }}</div></div>
              <div class="rc-info-item"><div class="rc-info-lbl">Médecin</div><div class="rc-info-val">Dr. Dupont</div></div>
              <div class="rc-info-item"><div class="rc-info-lbl">Type</div><div class="rc-info-val">{{ r.category }}</div></div>
              <div class="rc-info-item"><div class="rc-info-lbl">Ref</div><div class="rc-info-val" style="color:var(--b3)">#{{ r.id.toString().padStart(5,'0') }}</div></div>
            </div>
          </div>
          <div class="rc-det-section">
            <div class="rc-det-sec-title">Résumé</div>
            <div class="rc-summary">{{ r.summary }}</div>
          </div>
          <div class="rc-det-section">
            <div class="rc-det-sec-title">Résultats</div>
            @for (result of r.results; track result.key) {
              <div class="rc-result-row">
                <span class="rc-result-key">{{ result.key }}</span>
                <span class="rc-result-val" [style.color]="result.flag ? '#f87171' : 'var(--t1)'">{{ result.val }}</span>
                @if (result.flag) { <span class="rc-flag">⚠</span> }
              </div>
            }
          </div>
          <div class="rc-det-actions">
            <button class="rc-det-btn rc-det-btn-blue">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Imprimer
            </button>
            <button class="rc-det-btn rc-det-btn-outline">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Télécharger
            </button>
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
    }
    .rc-page { padding:28px 30px; display:flex; flex-direction:column; gap:18px; background:var(--bg); min-height:100%; animation:pgIn .5s ease both; }
    @keyframes pgIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
    .rc-header { display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:20px; border-bottom:1px solid rgba(59,130,246,.1); flex-wrap:wrap; gap:12px; }
    .rc-eyebrow { display:flex; align-items:center; gap:7px; font-size:10px; font-weight:700; letter-spacing:2px; color:var(--b3); text-transform:uppercase; margin-bottom:8px; }
    .rc-dot { width:6px; height:6px; border-radius:50%; background:var(--b2); box-shadow:0 0 8px var(--b2); animation:dotP 2s ease infinite; }
    @keyframes dotP { 0%,100%{opacity:1} 50%{opacity:.3} }
    .rc-title { font-size:34px; font-weight:800; color:var(--t1); letter-spacing:-1.5px; background:linear-gradient(135deg,var(--t1) 20%,var(--b4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .rc-sub { font-size:12.5px; color:var(--t3); margin-top:5px; }
    .rc-hdr-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .rc-search { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.036); border:1px solid rgba(59,130,246,.13); border-radius:10px; padding:8px 14px; width:210px; color:var(--t3); transition:all .2s; }
    .rc-search input { border:none; background:none; outline:none; font-size:13px; font-family:inherit; color:var(--t1); width:100%; }
    .rc-search input::placeholder { color:var(--t3); }
    .rc-search:focus-within { border-color:rgba(59,130,246,.45); background:rgba(59,130,246,.06); box-shadow:0 0 0 3px rgba(59,130,246,.1); }
    .rc-filters { display:flex; gap:4px; background:rgba(0,0,0,.4); border-radius:10px; padding:3px; }
    .rc-fbtn { padding:5px 12px; border-radius:8px; font-size:12px; font-weight:600; color:var(--t3); cursor:pointer; border:none; background:none; font-family:inherit; transition:all .16s; white-space:nowrap; }
    .rc-fbtn:hover { color:var(--t2); }
    .rc-fbtn-on { background:var(--bD); color:var(--b3); border:1px solid var(--bdrB); }

    .rc-layout { display:grid; grid-template-columns:1fr; gap:14px; }
    .rc-has-detail { grid-template-columns:1fr 330px; }
    .rc-card { background:var(--card); border:1px solid var(--bdr); border-radius:16px; backdrop-filter:blur(24px); position:relative; overflow:hidden; }
    .rc-card::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,.18),transparent); pointer-events:none; }

    .rc-list { overflow:hidden; }
    .rc-row { display:flex; align-items:center; justify-content:space-between; padding:13px 20px; border-bottom:1px solid rgba(255,255,255,.03); cursor:pointer; transition:all .18s; animation:rowIn .4s cubic-bezier(.22,1,.36,1) both; }
    @keyframes rowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
    .rc-row:last-child { border-bottom:none; }
    .rc-row:hover { background:rgba(59,130,246,.06); }
    .rc-row-sel { background:rgba(59,130,246,.1) !important; }
    .rc-row-left { display:flex; align-items:center; gap:12px; }
    .rc-av { width:36px; height:36px; border-radius:9px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:white; }
    .rc-patient-name { font-size:13.5px; font-weight:700; color:var(--t1); }
    .rc-record-type { font-size:11.5px; color:var(--t3); margin-top:2px; }
    .rc-row-right { display:flex; align-items:center; gap:10px; }
    .rc-category-tag { padding:3px 10px; border-radius:99px; font-size:10px; font-weight:700; border:1px solid; white-space:nowrap; }

    @keyframes slideIn { from{opacity:0;transform:translateX(20px) scale(.97)} to{opacity:1;transform:none} }
    .rc-detail { display:flex; flex-direction:column; }
    .rc-detail-hd { padding:18px 20px 14px; border-bottom:1px solid rgba(59,130,246,.1); background:linear-gradient(to bottom,rgba(59,130,246,.07),transparent); position:relative; }
    .rc-close-btn { position:absolute; top:12px; right:12px; width:26px; height:26px; border-radius:7px; background:rgba(255,255,255,.06); border:1px solid var(--bdr); color:var(--t2); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .14s; }
    .rc-close-btn:hover { background:rgba(255,255,255,.12); color:var(--t1); }
    .rc-det-patient { display:flex; align-items:center; gap:12px; }
    .rc-det-av { width:44px; height:44px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:white; }
    .rc-det-name { font-size:15px; font-weight:800; color:var(--t1); margin-bottom:6px; }
    .rc-det-body { flex:1; overflow-y:auto; padding:16px 20px; display:flex; flex-direction:column; gap:16px; }
    .rc-det-body::-webkit-scrollbar { width:2px; }
    .rc-det-body::-webkit-scrollbar-thumb { background:var(--bD); border-radius:99px; }
    .rc-det-section {}
    .rc-det-sec-title { font-size:9.5px; font-weight:700; letter-spacing:1.5px; color:var(--t3); text-transform:uppercase; margin-bottom:10px; }
    .rc-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .rc-info-item { background:rgba(255,255,255,.025); border:1px solid var(--bdr); border-radius:9px; padding:9px 11px; }
    .rc-info-lbl { font-size:9px; font-weight:700; color:var(--t3); letter-spacing:.8px; text-transform:uppercase; margin-bottom:3px; }
    .rc-info-val { font-size:12.5px; color:var(--t1); font-weight:500; }
    .rc-summary { background:rgba(255,255,255,.025); border:1px solid var(--bdr); border-radius:10px; padding:12px 14px; font-size:12px; color:var(--t2); line-height:1.6; }
    .rc-result-row { display:flex; align-items:center; padding:8px 12px; border-radius:8px; background:rgba(255,255,255,.02); border:1px solid var(--bdr); margin-bottom:6px; gap:10px; }
    .rc-result-row:last-child { margin-bottom:0; }
    .rc-result-key { font-size:12px; color:var(--t2); flex:1; }
    .rc-result-val { font-size:12.5px; font-weight:700; }
    .rc-flag { font-size:12px; flex-shrink:0; }
    .rc-det-actions { display:flex; gap:8px; margin-top:4px; }
    .rc-det-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:10px; border-radius:10px; font-size:12.5px; font-weight:700; cursor:pointer; font-family:inherit; transition:all .18s; }
    .rc-det-btn-blue { background:linear-gradient(135deg,var(--b2),var(--b)); color:white; border:none; box-shadow:0 4px 16px rgba(59,130,246,.35); }
    .rc-det-btn-blue:hover { transform:translateY(-1px); box-shadow:0 7px 22px rgba(59,130,246,.5); }
    .rc-det-btn-outline { background:rgba(255,255,255,.04); border:1px solid var(--bdr); color:var(--t2); }
    .rc-det-btn-outline:hover { background:rgba(255,255,255,.08); color:var(--t1); }
  `]
})
export class RecordsComponent {
  search = '';
  activeCategory = signal('Tous');
  selectedRecord = signal<any>(null);

  readonly categories = ['Tous', 'Biologie', 'Imagerie', 'ECG', 'Consultation', 'Chirurgie'];

  readonly records = [
    { id:1, patient:'Karim Ayoub', ini:'KA', grad:'linear-gradient(135deg,#3b82f6,#1d4ed8)', category:'ECG', catColor:'#60a5fa', date:'12 Mars 2026', summary:"ECG de contrôle réalisé en cabinet. Rythme sinusal régulier. Présence de quelques extrasystoles ventriculaires isolées. Pas de bloc auriculo-ventriculaire.", results:[{key:'Rythme',val:'Sinusal régulier',flag:false},{key:'FC',val:'74 bpm',flag:false},{key:'PR',val:'165 ms',flag:false},{key:'QRS',val:'88 ms',flag:false},{key:'ESV',val:'Présentes ×3',flag:true}] },
    { id:2, patient:'Fatma Ben Ali', ini:'FB', grad:'linear-gradient(135deg,#22d3ee,#0891b2)', category:'Biologie', catColor:'#22d3ee', date:'10 Mars 2026', summary:'Bilan biologique complet réalisé au laboratoire central. Résultats globalement satisfaisants. Tension artérielle correctement contrôlée sous traitement.', results:[{key:'HbA1c',val:'5.8%',flag:false},{key:'Créatinine',val:'72 µmol/L',flag:false},{key:'Cholestérol LDL',val:'2.8 mmol/L',flag:false},{key:'Potassium',val:'4.1 mEq/L',flag:false}] },
    { id:3, patient:'Omar Mejri', ini:'OM', grad:'linear-gradient(135deg,#f87171,#dc2626)', category:'Chirurgie', catColor:'#f87171', date:'1 Mars 2026', summary:"Remplacement valvulaire mitral réalisé sous circulation extracorporelle. Durée: 3h45min. Suites immédiates simples. Anticoagulation débutée J1 post-op.", results:[{key:'Type',val:'Remplacement valvulaire',flag:false},{key:'Valve',val:'Bioprothèse porcine',flag:false},{key:'CEC',val:'95 min',flag:false},{key:'INR J3',val:'3.2',flag:true}] },
    { id:4, patient:'Sonia Trabelsi', ini:'ST', grad:'linear-gradient(135deg,#34d399,#059669)', category:'Biologie', catColor:'#34d399', date:'7 Mars 2026', summary:"Bilan diabétique trimestriel. Équilibre glycémique satisfaisant. HbA1c dans les objectifs thérapeutiques. Pas de complications microvasculaires détectées.", results:[{key:'HbA1c',val:'6.8%',flag:false},{key:'Glycémie à jeun',val:'6.2 mmol/L',flag:false},{key:'Microalbuminurie',val:'< 30 mg/24h',flag:false},{key:'FO',val:'Normal',flag:false}] },
    { id:5, patient:'Hichem Gharbi', ini:'HG', grad:'linear-gradient(135deg,#818cf8,#4f46e5)', category:'Imagerie', catColor:'#818cf8', date:'5 Mars 2026', summary:"Échographie rénale bilatérale. Reins de taille réduite avec hyperéchogénicité corticale évocatrice d'IRC. Pas d'obstacle urinaire identifié.", results:[{key:'Rein droit',val:'9.2 cm',flag:true},{key:'Rein gauche',val:'9.0 cm',flag:true},{key:'Corticale',val:'Hyperéchogène',flag:true},{key:'Obstacle',val:'Absent',flag:false}] },
    { id:6, patient:'Leila Mansouri', ini:'LM', grad:'linear-gradient(135deg,#fbbf24,#d97706)', category:'Consultation', catColor:'#fbbf24', date:'3 Mars 2026', summary:"Consultation de suivi pour asthme allergique. Symptômes bien contrôlés sous traitement de fond. Fonction respiratoire stable. Poursuite du traitement actuel.", results:[{key:'DEP',val:'88% théorique',flag:false},{key:'VEMS',val:'82%',flag:false},{key:'Contrôle',val:'Bien contrôlé',flag:false}] },
  ];

  readonly filteredRecords = computed(() => {
    let list = this.records;
    if (this.activeCategory() !== 'Tous') list = list.filter(r => r.category === this.activeCategory());
    if (this.search) list = list.filter(r => r.patient.toLowerCase().includes(this.search.toLowerCase()));
    return list;
  });
}