import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-analytiques',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="an-page">

  <!-- HEADER -->
  <div class="an-header">
    <div class="an-header-left">
      <div class="an-hico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <div class="an-hglow"></div>
      </div>
      <div>
        <h1 class="an-title">Analytiques</h1>
        <p class="an-sub"><span class="an-dot"></span>Mars 2026 · Données en temps réel</p>
      </div>
    </div>
    <div class="an-header-right">
      <div class="an-period-tabs">
        @for (p of periods; track p) {
          <button class="an-ptab" [class.an-ptab-on]="period()===p" (click)="period.set(p)">{{ p }}</button>
        }
      </div>
      <button class="an-btn-export">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Exporter
      </button>
    </div>
  </div>

  <!-- KPI CARDS -->
  <div class="an-kpis">
    @for (k of kpis; track k.label; let i=$index) {
      <div class="an-kpi" [style.animation-delay]="(i*0.07)+'s'">
        <div class="an-kpi-shine"></div>
        <div class="an-kpi-top">
          <div class="an-kpi-ico" [style.background]="k.color+'18'" [style.border-color]="k.color+'35'" [innerHTML]="k.icon" [style.color]="k.color"></div>
          <div class="an-kpi-badge" [style.background]="k.trend>0?'rgba(16,185,129,.12)':'rgba(239,68,68,.1)'" [style.color]="k.trend>0?'#34d399':'#f87171'" [style.border-color]="k.trend>0?'rgba(16,185,129,.22)':'rgba(239,68,68,.2)'">
            {{ k.trend>0?'↑':'↓' }} {{ k.trend }}%
          </div>
        </div>
        <div class="an-kpi-val" [style.color]="k.color">{{ k.value }}</div>
        <div class="an-kpi-lbl">{{ k.label }}</div>
        <div class="an-kpi-sub">{{ k.sub }}</div>
        <!-- Sparkline -->
        <div class="an-sparkline">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" width="100%" height="30">
            <defs>
              <linearGradient [id]="'sg'+i" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" [style.stop-color]="k.color" stop-opacity=".3"/>
                <stop offset="100%" [style.stop-color]="k.color" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path [attr.d]="sparkPath(k.spark)" fill="none" [style.stroke]="k.color" stroke-width="2" stroke-linecap="round"/>
            <path [attr.d]="sparkFill(k.spark)" [attr.fill]="'url(#sg'+i+')'"/>
          </svg>
        </div>
      </div>
    }
  </div>

  <!-- MAIN CHARTS ROW -->
  <div class="an-charts-row">

    <!-- Bar chart - Consultations -->
    <div class="an-chart-card an-chart-lg">
      <div class="an-chart-hd">
        <div>
          <div class="an-chart-title">Évolution des consultations</div>
          <div class="an-chart-sub">{{ period() }} · Par jour</div>
        </div>
        <div class="an-legend">
          <div class="an-leg-item"><div class="an-leg-dot" style="background:#0ea5e9"></div><span>Consultations</span></div>
          <div class="an-leg-item"><div class="an-leg-dot" style="background:#a78bfa"></div><span>Annulés</span></div>
        </div>
      </div>
      <div class="an-bar-chart">
        <div class="an-bar-grid">
          @for (l of [0,1,2,3,4]; track l) { <div class="an-grid-line"></div> }
        </div>
        <div class="an-bars">
          @for (d of chartData; track d.day; let i=$index) {
            <div class="an-bar-group" [style.animation-delay]="(i*0.04)+'s'">
              <div class="an-bar-consult" [style.height]="(d.consult/maxConsult*100)+'%'" [style.animation-delay]="(0.2+i*0.04)+'s'" [title]="d.consult+' consultations'"></div>
              <div class="an-bar-cancel"  [style.height]="(d.cancel/maxConsult*100)+'%'"  [style.animation-delay]="(0.25+i*0.04)+'s'" [title]="d.cancel+' annulés'"></div>
              <div class="an-bar-lbl">{{ d.day }}</div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Donut - Spécialités -->
    <div class="an-chart-card an-chart-sm">
      <div class="an-chart-hd">
        <div>
          <div class="an-chart-title">Spécialités</div>
          <div class="an-chart-sub">Répartition des cas</div>
        </div>
      </div>
      <div class="an-donut-wrap">
        <div class="an-donut-svg-wrap">
          <svg width="140" height="140" viewBox="0 0 140 140" style="transform:rotate(-90deg)">
            <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(14,165,201,.07)" stroke-width="18"/>
            <circle cx="70" cy="70" r="52" fill="none" stroke="#0ea5e9" stroke-width="18" stroke-dasharray="150 177" stroke-linecap="round"/>
            <circle cx="70" cy="70" r="52" fill="none" stroke="#a78bfa" stroke-width="18" stroke-dasharray="92 235" stroke-linecap="round" stroke-dashoffset="-153"/>
            <circle cx="70" cy="70" r="52" fill="none" stroke="#34d399" stroke-width="18" stroke-dasharray="52 275" stroke-linecap="round" stroke-dashoffset="-247"/>
            <circle cx="70" cy="70" r="52" fill="none" stroke="#f59e0b" stroke-width="18" stroke-dasharray="33 294" stroke-linecap="round" stroke-dashoffset="-301"/>
          </svg>
          <div class="an-donut-center">
            <div class="an-donut-val">248</div>
            <div class="an-donut-sub">cas</div>
          </div>
        </div>
        <div class="an-donut-legend">
          @for (s of specialites; track s.name) {
            <div class="an-dl-row">
              <div class="an-dl-dot" [style.background]="s.color" [style.box-shadow]="'0 0 6px '+s.color+'80'"></div>
              <span class="an-dl-name">{{ s.name }}</span>
              <div class="an-dl-bar-wrap">
                <div class="an-dl-bar" [style.width]="s.pct+'%'" [style.background]="s.color"></div>
              </div>
              <span class="an-dl-pct" [style.color]="s.color">{{ s.pct }}%</span>
            </div>
          }
        </div>
      </div>
    </div>

  </div>

  <!-- SECOND ROW -->
  <div class="an-charts-row">

    <!-- Line chart - Revenus -->
    <div class="an-chart-card an-chart-md">
      <div class="an-chart-hd">
        <div><div class="an-chart-title">Revenus mensuels</div><div class="an-chart-sub">En dinars tunisiens (DT)</div></div>
        <div class="an-rev-total">
          <div class="an-rev-val">4 820 DT</div>
          <div class="an-rev-trend" style="color:#34d399">↑ 12% vs mois dernier</div>
        </div>
      </div>
      <div class="an-line-wrap">
        <svg viewBox="0 0 500 120" preserveAspectRatio="none" width="100%" height="120">
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0ea5e9" stop-opacity=".25"/>
              <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,90 C40,80 80,60 120,55 C160,50 200,65 240,50 C280,35 320,20 360,25 C400,30 440,15 500,10" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M0,90 C40,80 80,60 120,55 C160,50 200,65 240,50 C280,35 320,20 360,25 C400,30 440,15 500,10 L500,120 L0,120 Z" fill="url(#revGrad)"/>
          @for (p of revPoints; track p.x) {
            <circle [attr.cx]="p.x" [attr.cy]="p.y" r="3.5" fill="#0ea5e9" stroke="#060e1c" stroke-width="2"/>
          }
        </svg>
        <div class="an-rev-months">
          @for (m of months; track m) { <span>{{ m }}</span> }
        </div>
      </div>
    </div>

    <!-- Stats table -->
    <div class="an-chart-card an-chart-sm">
      <div class="an-chart-hd">
        <div><div class="an-chart-title">Performance</div><div class="an-chart-sub">Indicateurs clés</div></div>
      </div>
      <div class="an-perf-list">
        @for (p of perfs; track p.label) {
          <div class="an-perf-row">
            <div class="an-perf-info">
              <div class="an-perf-lbl">{{ p.label }}</div>
              <div class="an-perf-val" [style.color]="p.color">{{ p.value }}</div>
            </div>
            <div class="an-perf-bar-wrap">
              <div class="an-perf-bar" [style.width]="p.pct+'%'" [style.background]="'linear-gradient(90deg,'+p.color+','+p.color+'88)'"></div>
            </div>
            <div class="an-perf-pct" [style.color]="p.color">{{ p.pct }}%</div>
          </div>
        }
      </div>
    </div>

  </div>

  <!-- TOP PATIENTS + RECENT ACTIVITY -->
  <div class="an-charts-row">

    <!-- Top patients -->
    <div class="an-chart-card an-chart-md">
      <div class="an-chart-hd">
        <div><div class="an-chart-title">Patients les plus actifs</div><div class="an-chart-sub">Par nombre de visites</div></div>
        <a routerLink="/patients" class="an-see-all">Voir tout →</a>
      </div>
      <div class="an-top-pats">
        @for (p of topPatients; track p.name; let i=$index) {
          <div class="an-tp-row" [style.animation-delay]="(i*0.06)+'s'">
            <div class="an-tp-rank" [style.color]="i===0?'#fbbf24':i===1?'#94a3b8':i===2?'#b45309':'#3d6480'">#{{ i+1 }}</div>
            <div class="an-tp-av" [style.background]="p.color+'22'" [style.color]="p.color">{{ p.ini }}</div>
            <div class="an-tp-info">
              <div class="an-tp-name">{{ p.name }}</div>
              <div class="an-tp-dept">{{ p.dept }}</div>
            </div>
            <div class="an-tp-bar-wrap">
              <div class="an-tp-bar" [style.width]="(p.visits/topPatients[0].visits*100)+'%'" [style.background]="p.color"></div>
            </div>
            <div class="an-tp-visits" [style.color]="p.color">{{ p.visits }}</div>
          </div>
        }
      </div>
    </div>

    <!-- Activity feed -->
    <div class="an-chart-card an-chart-sm">
      <div class="an-chart-hd">
        <div><div class="an-chart-title">Activité récente</div><div class="an-chart-sub">Dernières 24h</div></div>
      </div>
      <div class="an-activity">
        @for (a of activity; track a.time; let i=$index) {
          <div class="an-act-row" [style.animation-delay]="(i*0.06)+'s'">
            <div class="an-act-ico" [style.background]="a.color+'18'" [style.color]="a.color" [innerHTML]="a.icon"></div>
            <div class="an-act-info">
              <div class="an-act-txt">{{ a.text }}</div>
              <div class="an-act-time">{{ a.time }}</div>
            </div>
            <div class="an-act-dot" [style.background]="a.color" [style.box-shadow]="'0 0 6px '+a.color"></div>
          </div>
        }
      </div>
    </div>

  </div>

</div>
  `,
  styles: [`
    :host{--bg:#03080f;--card:rgba(255,255,255,.038);--cardh:rgba(14,165,201,.08);--bdr:rgba(14,165,201,.11);--bdr2:rgba(14,165,201,.26);--txt:#e8f4fd;--txt2:#7ba8c4;--txt3:#3d6480;--sky:#0ea5e9;--sky2:#38bdf8;--grn:#10b981;--amb:#f59e0b;--red:#ef4444;}
    :host{display:block}
    .an-page{padding:24px 26px;display:flex;flex-direction:column;gap:20px;min-height:100%;animation:anIn .5s cubic-bezier(.22,1,.36,1)}
    .an-header{display:flex;align-items:center;justify-content:space-between;animation:anDown .4s .04s ease both}
    .an-header-left{display:flex;align-items:center;gap:16px}
    .an-hico{position:relative;width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,rgba(14,165,201,.22),rgba(26,86,219,.18));border:1px solid rgba(14,165,201,.3);display:flex;align-items:center;justify-content:center;color:#38bdf8;box-shadow:0 0 28px rgba(14,165,201,.2)}
    .an-hglow{position:absolute;inset:-10px;border-radius:26px;background:radial-gradient(circle,rgba(14,165,201,.1),transparent 70%);pointer-events:none}
    .an-title{font-size:26px;font-weight:800;color:var(--txt);letter-spacing:-.6px}
    .an-sub{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--txt2);margin-top:4px}
    .an-dot{width:6px;height:6px;border-radius:50%;background:var(--grn);box-shadow:0 0 8px var(--grn);animation:anPulse 2s ease infinite}
    .an-header-right{display:flex;align-items:center;gap:10px}
    .an-period-tabs{display:flex;background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:11px;padding:3px;gap:2px}
    .an-ptab{padding:6px 14px;border-radius:8px;border:none;background:none;font-size:12.5px;font-weight:600;color:var(--txt3);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .16s}
    .an-ptab:hover{color:var(--txt2)}
    .an-ptab-on{background:rgba(14,165,201,.16);color:var(--sky2) !important}
    .an-btn-export{display:flex;align-items:center;gap:7px;padding:9px 16px;background:var(--card);border:1px solid var(--bdr);border-radius:11px;font-size:12.5px;font-weight:600;color:var(--txt2);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .16s}
    .an-btn-export:hover{border-color:var(--bdr2);color:var(--sky2);background:rgba(14,165,201,.06)}
    .an-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .an-kpi{position:relative;overflow:hidden;background:var(--card);border:1px solid var(--bdr);border-radius:18px;padding:18px 20px;backdrop-filter:blur(28px) saturate(160%);cursor:pointer;transition:all .22s;animation:anCardIn .55s cubic-bezier(.34,1.56,.64,1) both}
    .an-kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,201,.22),transparent)}
    .an-kpi:hover{transform:translateY(-4px);border-color:var(--bdr2);box-shadow:0 16px 40px rgba(0,0,0,.45),0 0 0 1px rgba(14,165,201,.1)}
    .an-kpi-shine{position:absolute;top:0;right:0;width:70px;height:70px;border-radius:50%;opacity:.05;background:radial-gradient(circle,white,transparent);pointer-events:none}
    .an-kpi-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
    .an-kpi-ico{width:38px;height:38px;border-radius:11px;border:1px solid;display:flex;align-items:center;justify-content:center}
    .an-kpi-badge{font-size:11px;font-weight:700;padding:3px 9px;border-radius:99px;border:1px solid}
    .an-kpi-val{font-size:32px;font-weight:800;line-height:1;letter-spacing:-1.5px;margin-bottom:4px}
    .an-kpi-lbl{font-size:13px;font-weight:600;color:var(--txt);margin-bottom:2px}
    .an-kpi-sub{font-size:11px;color:var(--txt3);margin-bottom:10px}
    .an-sparkline{margin-top:2px;opacity:.7}
    .an-charts-row{display:grid;grid-template-columns:1.7fr 1fr;gap:14px;animation:anUp .4s .15s ease both}
    .an-chart-card{background:var(--card);border:1px solid var(--bdr);border-radius:20px;padding:20px;backdrop-filter:blur(28px) saturate(160%);position:relative;overflow:hidden;transition:border-color .22s}
    .an-chart-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,201,.18),transparent)}
    .an-chart-card:hover{border-color:var(--bdr2)}
    .an-chart-lg{} .an-chart-md{} .an-chart-sm{}
    .an-chart-hd{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
    .an-chart-title{font-size:15px;font-weight:700;color:var(--txt)}
    .an-chart-sub{font-size:11.5px;color:var(--txt3);margin-top:3px}
    .an-legend{display:flex;gap:12px;align-items:center}
    .an-leg-item{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--txt2)}
    .an-leg-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
    .an-bar-chart{position:relative;height:160px;display:flex;flex-direction:column}
    .an-bar-grid{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding-bottom:22px;pointer-events:none}
    .an-grid-line{width:100%;height:1px;background:rgba(14,165,201,.06)}
    .an-bars{display:flex;align-items:flex-end;gap:6px;height:100%;padding-bottom:22px;position:relative;z-index:1}
    .an-bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;height:100%;justify-content:flex-end;animation:anBarGrp .4s ease both}
    .an-bar-consult{width:55%;border-radius:5px 5px 0 0;background:linear-gradient(to top,#0ea5e9,#38bdf8);box-shadow:0 0 12px rgba(14,165,201,.3);cursor:pointer;transition:opacity .16s;animation:anBarUp .6s cubic-bezier(.34,1.56,.64,1) both}
    .an-bar-cancel{width:35%;border-radius:5px 5px 0 0;background:linear-gradient(to top,#a78bfa,#c4b5fd);cursor:pointer;transition:opacity .16s;animation:anBarUp .6s cubic-bezier(.34,1.56,.64,1) both}
    .an-bar-consult:hover,.an-bar-cancel:hover{opacity:.75}
    .an-bar-lbl{font-size:8.5px;color:var(--txt3);margin-top:5px}
    .an-donut-wrap{display:flex;align-items:center;gap:20px}
    .an-donut-svg-wrap{position:relative;flex-shrink:0}
    .an-donut-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .an-donut-val{font-size:22px;font-weight:800;color:var(--txt)}
    .an-donut-sub{font-size:10px;color:var(--txt3)}
    .an-donut-legend{flex:1;display:flex;flex-direction:column;gap:10px}
    .an-dl-row{display:flex;align-items:center;gap:8px}
    .an-dl-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
    .an-dl-name{font-size:12px;color:var(--txt2);min-width:70px}
    .an-dl-bar-wrap{flex:1;height:4px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
    .an-dl-bar{height:100%;border-radius:99px;transition:width .6s .3s ease}
    .an-dl-pct{font-size:12px;font-weight:800;min-width:30px;text-align:right}
    .an-see-all{font-size:12px;font-weight:700;color:var(--sky2);text-decoration:none;white-space:nowrap}
    .an-rev-total{text-align:right}
    .an-rev-val{font-size:18px;font-weight:800;color:var(--sky2)}
    .an-rev-trend{font-size:11px;color:#34d399;margin-top:2px}
    .an-line-wrap{margin-top:8px}
    .an-rev-months{display:flex;justify-content:space-between;margin-top:8px;padding:0 2px}
    .an-rev-months span{font-size:9.5px;color:var(--txt3)}
    .an-perf-list{display:flex;flex-direction:column;gap:14px}
    .an-perf-row{display:flex;align-items:center;gap:10px}
    .an-perf-info{min-width:100px}
    .an-perf-lbl{font-size:12px;color:var(--txt2)}
    .an-perf-val{font-size:13px;font-weight:800}
    .an-perf-bar-wrap{flex:1;height:5px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
    .an-perf-bar{height:100%;border-radius:99px;transition:width .7s .3s cubic-bezier(.22,1,.36,1)}
    .an-perf-pct{font-size:12px;font-weight:700;min-width:36px;text-align:right}
    .an-top-pats{display:flex;flex-direction:column;gap:10px}
    .an-tp-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(14,165,201,.04);border:1px solid rgba(14,165,201,.08);transition:all .18s;animation:anRowIn .4s ease both}
    .an-tp-row:hover{background:rgba(14,165,201,.07);border-color:rgba(14,165,201,.16);transform:translateX(4px)}
    .an-tp-rank{font-size:13px;font-weight:800;min-width:22px}
    .an-tp-av{width:34px;height:34px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800}
    .an-tp-info{flex:1;min-width:0}
    .an-tp-name{font-size:13px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .an-tp-dept{font-size:10.5px;color:var(--txt3)}
    .an-tp-bar-wrap{width:80px;height:4px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
    .an-tp-bar{height:100%;border-radius:99px;transition:width .6s .4s ease}
    .an-tp-visits{font-size:13px;font-weight:800;min-width:24px;text-align:right}
    .an-activity{display:flex;flex-direction:column;gap:10px}
    .an-act-row{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(14,165,201,.04);border:1px solid rgba(14,165,201,.08);transition:all .18s;animation:anRowIn .4s ease both}
    .an-act-row:hover{background:rgba(14,165,201,.07);border-color:rgba(14,165,201,.16)}
    .an-act-ico{width:30px;height:30px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
    .an-act-info{flex:1;min-width:0}
    .an-act-txt{font-size:12.5px;color:var(--txt);font-weight:500}
    .an-act-time{font-size:10.5px;color:var(--txt3);margin-top:2px}
    .an-act-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px}
    @keyframes anIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @keyframes anDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
    @keyframes anUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes anCardIn{from{opacity:0;transform:translateY(22px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes anRowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
    @keyframes anBarUp{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}
    @keyframes anBarGrp{from{opacity:0}to{opacity:1}}
    @keyframes anPulse{0%,100%{box-shadow:0 0 8px #10b981}50%{box-shadow:0 0 18px #10b981}}
  `]
})
export class AnalytiquesComponent {
  period = signal('Semaine');
  periods = ['Semaine', 'Mois', 'Trimestre', 'Année'];

  kpis = [
    { label:'Total patients',   value:'248',      sub:'↑ 12 ce mois',    color:'#38bdf8', trend:12, spark:[20,35,28,42,38,55,60], icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { label:'RDV ce mois',      value:'34',       sub:'10 aujourd\'hui',  color:'#a78bfa', trend:8,  spark:[15,22,18,30,25,32,34], icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
    { label:'Satisfaction',     value:'96%',      sub:'Excellent',        color:'#34d399', trend:5,  spark:[88,90,85,92,94,93,96], icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
    { label:'Revenus (DT)',     value:'4 820',    sub:'Objectif: 6 000',  color:'#f59e0b', trend:-3, spark:[4200,4500,4100,4800,4600,4900,4820], icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  ];

  chartData = [
    {day:'L',consult:8,cancel:1},{day:'M',consult:12,cancel:2},{day:'M',consult:6,cancel:0},
    {day:'J',consult:15,cancel:3},{day:'V',consult:10,cancel:1},{day:'S',consult:4,cancel:0},
    {day:'D',consult:2,cancel:0},{day:'L',consult:11,cancel:2},{day:'M',consult:14,cancel:1},
    {day:'M',consult:9,cancel:2},{day:'J',consult:16,cancel:3},{day:'V',consult:13,cancel:1},
    {day:'S',consult:5,cancel:0},{day:'D',consult:3,cancel:0},
  ];
  get maxConsult() { return Math.max(...this.chartData.map(d=>d.consult)); }

  specialites = [
    {name:'Cardiologie', color:'#0ea5e9', pct:46},
    {name:'Neurologie',  color:'#a78bfa', pct:28},
    {name:'Pédiatrie',   color:'#34d399', pct:16},
    {name:'Autre',       color:'#f59e0b', pct:10},
  ];

  months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  revPoints = [
    {x:0,y:90},{x:45,y:75},{x:90,y:55},{x:135,y:52},{x:180,y:65},
    {x:225,y:50},{x:270,y:35},{x:315,y:25},{x:360,y:28},{x:405,y:15},{x:450,y:18},{x:500,y:10}
  ];

  perfs = [
    {label:'Taux de confirmation', value:'82%',  pct:82, color:'#34d399'},
    {label:'Taux d\'occupation',   value:'76%',  pct:76, color:'#0ea5e9'},
    {label:'Satisfaction patient', value:'96%',  pct:96, color:'#a78bfa'},
    {label:'Revenus vs objectif',  value:'80%',  pct:80, color:'#f59e0b'},
    {label:'Taux annulation',      value:'18%',  pct:18, color:'#f87171'},
  ];

  topPatients = [
    {name:'Karim Ayoub',   dept:'Cardiologie', visits:12, color:'#0ea5e9', ini:'KA'},
    {name:'Fatma Amor',    dept:'Neurologie',  visits:9,  color:'#a78bfa', ini:'FA'},
    {name:'Sonia Ben Ali', dept:'Cardiologie', visits:8,  color:'#34d399', ini:'SB'},
    {name:'Omar Mejri',    dept:'Pédiatrie',   visits:6,  color:'#f59e0b', ini:'OM'},
    {name:'Rania Belhadj', dept:'Neurologie',  visits:5,  color:'#f472b6', ini:'RB'},
  ];

  activity = [
    {text:'Nouveau RDV — Karim Ayoub · 09:00',  time:'Il y a 5 min',  color:'#0ea5e9', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/></svg>`},
    {text:'RDV confirmé — Sonia Ben Ali · 10:30',time:'Il y a 12 min', color:'#34d399', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`},
    {text:'Patient ajouté — Ahmed Brahim',       time:'Il y a 28 min', color:'#a78bfa', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`},
    {text:'RDV annulé — Habib Chaabane',        time:'Il y a 1h',     color:'#f87171', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`},
    {text:'Ordonnance émise — Mohamed Haddad',  time:'Il y a 2h',     color:'#f59e0b', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>`},
  ];

  sparkPath(data: number[]): string {
    if (!data.length) return '';
    const mx = Math.max(...data), mn = Math.min(...data), rng = mx-mn||1;
    return data.map((v,i) => `${i===0?'M':'L'}${(i/(data.length-1))*100},${30-((v-mn)/rng)*26}`).join(' ');
  }
  sparkFill(data: number[]): string {
    if (!data.length) return '';
    const mx = Math.max(...data), mn = Math.min(...data), rng = mx-mn||1;
    const pts = data.map((v,i) => `${(i/(data.length-1))*100},${30-((v-mn)/rng)*26}`).join(' L');
    return `M0,30 L${pts} L100,30 Z`;
  }
}