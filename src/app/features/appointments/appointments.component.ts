import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { Appointment, AppointmentStatus, CreateAppointmentDto } from '../../core/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
<div class="rv-page">

  <!-- HEADER -->
  <div class="rv-header">
    <div class="rv-header-left">
      <div class="rv-header-badge">
        <div class="rv-header-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
            <rect x="3" y="4" width="18" height="18" rx="3"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="rv-header-glow"></div>
      </div>
      <div>
        <h1 class="rv-title">Rendez-vous</h1>
        <p class="rv-sub"><span class="rv-sub-dot"></span>Mars 2026 · {{ all().length }} rendez-vous</p>
      </div>
    </div>
    <div class="rv-header-actions">
      <div class="rv-view-switch">
        <button class="rv-vsw" [class.rv-vsw-on]="viewMode()==='list'" (click)="viewMode.set('list')" title="Liste">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg>
        </button>
        <button class="rv-vsw" [class.rv-vsw-on]="viewMode()==='kanban'" (click)="viewMode.set('kanban')" title="Kanban">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>
        </button>
      </div>
      <button class="rv-btn-new" (click)="openModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouveau RDV
        <div class="rv-shine"></div>
      </button>
    </div>
  </div>

  <!-- STATS -->
  <div class="rv-stats">
    @for (s of stats; track s.key; let i = $index) {
      <div class="rv-stat" [style.animation-delay]="(i*0.07)+'s'" (click)="setFilter(s.key)" [class.rv-stat-on]="activeFilter()===s.key">
        <div class="rv-stat-shine"></div>
        <div class="rv-stat-top">
          <div class="rv-stat-ico" [style.background]="s.color+'18'" [style.border-color]="s.color+'35'" [innerHTML]="s.icon" [style.color]="s.color"></div>
          <div class="rv-stat-trend" [style.color]="s.trend>0?'#34d399':'#f87171'">{{ s.trend>0?'↑':'↓' }}{{ abs(s.trend) }}%</div>
        </div>
        <div class="rv-stat-val" [style.color]="s.color">{{ countStat(s.key) }}</div>
        <div class="rv-stat-lbl">{{ s.label }}</div>
        <div class="rv-stat-bar"><div class="rv-stat-fill" [style.width]="(countStat(s.key)/max(all().length,1)*100)+'%'" [style.background]="s.color"></div></div>
      </div>
    }
  </div>

  <!-- TOOLBAR -->
  <div class="rv-toolbar">
    <div class="rv-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" placeholder="Rechercher patient, médecin, type…" [(ngModel)]="searchQ">
      @if (searchQ) { <button class="rv-sc" (click)="searchQ=''">✕</button> }
    </div>
    <div class="rv-chips">
      @for (f of filters; track f.v) {
        <button class="rv-chip" [class.rv-chip-on]="activeFilter()===f.v" (click)="setFilter(f.v)">
          @if (f.v!=='all') { <span class="rv-cdot" [style.background]="f.color"></span> }
          {{ f.l }} <span class="rv-cn">{{ countStat(f.v) }}</span>
        </button>
      }
    </div>
  </div>

  <!-- LIST VIEW -->
  @if (viewMode()==='list') {
    <div class="rv-table-wrap">
      <div class="rv-table-hd">
        <span>Patient</span><span>Date & Heure</span><span>Type</span><span>Médecin</span><span>Statut</span><span>Actions</span>
      </div>
      <div class="rv-rows">
        @for (a of visible(); track a.id; let i=$index) {
          <div class="rv-row"
  [style.animation-delay]="(i*0.033)+'s'"
  [class.rv-row-urg]="a.type?.toLowerCase()?.includes('urgence')">
            <div class="rv-row-accent"></div>
            <div class="rv-cell-pat">
              <div class="rv-av" [style.background]="(a.patientAvatarColor||'#0ea5e9')+'22'" [style.color]="a.patientAvatarColor||'#0ea5e9'" [style.box-shadow]="'0 0 14px '+(a.patientAvatarColor||'#0ea5e9')+'28'">
                {{ a.patientAvatar || a.patientName?.slice(0,2) || '' }}
              </div>
              <div>
                <div class="rv-pname">{{ a.patientName }}</div>
                <div class="rv-pmeta">{{ a.patientAge ? 'Âge '+a.patientAge : '' }}</div>
              </div>
            </div>
            <div class="rv-cell-dt">
              <div class="rv-dt-d">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10" style="color:#3d6480"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ a.date }}
              </div>
              <div class="rv-dt-t">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10" style="color:#0ea5e9"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ a.time }}
              </div>
            </div>
            <div class="rv-cell-type"><span class="rv-type"
[class.rv-type-urg]="a.type?.toLowerCase()?.includes('urgence')">{{ a.type }}</span></div>
            <div class="rv-cell-doc">{{ a.doctor }}</div>
            <div class="rv-cell-st">
              <span class="rv-st" [class]="'rv-s-'+a.status"><span class="rv-sdot"></span>{{ lbl(a.status) }}</span>
            </div>
            <div class="rv-cell-act">
              <button class="rv-act rv-a-ok"  (click)="confirm(a.id)"       [disabled]="a.status==='confirmed'||a.status==='completed'" title="Confirmer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <button class="rv-act rv-a-go"  (click)="setInProgress(a.id)" [disabled]="a.status==='inprogress'||a.status==='completed'" title="En cours">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <button class="rv-act rv-a-del" (click)="cancel(a.id)"         [disabled]="a.status==='cancelled'" title="Annuler">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        }
        @empty {
          <div class="rv-empty">
            <div class="rv-empty-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
            <div class="rv-empty-t">Aucun rendez-vous</div>
            <div class="rv-empty-s">Modifiez vos filtres ou créez un nouveau RDV</div>
          </div>
        }
      </div>
    </div>
  }

  <!-- KANBAN VIEW -->
  @if (viewMode()==='kanban') {
    <div class="rv-kanban">
      @for (col of kanban; track col.key) {
        <div class="rv-kb-col">
          <div class="rv-kb-hd" [style.border-color]="col.color+'40'">
            <div class="rv-kb-dot" [style.background]="col.color" [style.box-shadow]="'0 0 8px '+col.color"></div>
            <span class="rv-kb-title">{{ col.label }}</span>
            <span class="rv-kb-n" [style.background]="col.color+'20'" [style.color]="col.color">{{ byStatus(col.key).length }}</span>
          </div>
          @for (a of byStatus(col.key); track a.id; let i=$index) {
            <div class="rv-kb-card" [style.animation-delay]="(i*0.05)+'s'" [style.border-top-color]="col.color">
              <div class="rv-kb-top">
                <div class="rv-av rv-av-sm" [style.background]="(a.patientAvatarColor||'#0ea5e9')+'22'" [style.color]="a.patientAvatarColor||'#0ea5e9'">{{ a.patientAvatar||a.patientName?.slice(0,2) }}</div>
                <div style="flex:1;min-width:0"><div class="rv-kb-nm">{{ a.patientName }}</div><div class="rv-kb-ty">{{ a.type }}</div></div>
              </div>
              <div class="rv-kb-meta">
                <span class="rv-kb-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{{ a.time }}</span>
                <span class="rv-kb-doc">{{ a.patientAvatar || a.patientName?.slice(0,2) || '' }}</span>
              </div>
              <div class="rv-kb-acts">
                @if (col.key!=='confirmed'&&col.key!=='completed') { <button class="rv-kb-a" (click)="confirm(a.id)" style="color:#34d399">✓ Confirmer</button> }
                @if (col.key!=='cancelled') { <button class="rv-kb-a" (click)="cancel(a.id)" style="color:#f87171">✕ Annuler</button> }
              </div>
            </div>
          }
          @empty { <div class="rv-kb-empty">Aucun RDV</div> }
        </div>
      }
    </div>
  }

</div>

<!-- MODAL -->
@if (showModal()) {
  <div class="rv-overlay" (click)="closeBkd($event)">
    <div class="rv-modal">
      <div class="rv-modal-glow"></div>
      <div class="rv-modal-hd">
        <div class="rv-modal-ttl">
          <div class="rv-modal-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg></div>
          Nouveau rendez-vous
        </div>
        <button class="rv-modal-x" (click)="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()" class="rv-modal-body">
        <div class="rv-frow">
          <div class="rv-fg"><label class="rv-fl">NOM DU PATIENT *</label><input class="rv-fi" type="text" placeholder="Nom complet" formControlName="patientName" [class.rv-err]="inv('patientName')"></div>
          <div class="rv-fg"><label class="rv-fl">ID PATIENT</label><input class="rv-fi" type="text" placeholder="P-XXXX" formControlName="patientId"></div>
        </div>
        <div class="rv-frow">
          <div class="rv-fg"><label class="rv-fl">DATE *</label><input class="rv-fi" type="date" formControlName="date" [class.rv-err]="inv('date')"></div>
          <div class="rv-fg"><label class="rv-fl">HEURE *</label><input class="rv-fi" type="time" formControlName="time" [class.rv-err]="inv('time')"></div>
        </div>
        <div class="rv-frow">
          <div class="rv-fg"><label class="rv-fl">TYPE</label><select class="rv-fi" formControlName="type"><option>Consultation générale</option><option>Suivi cardiologie</option><option>ECG</option><option>Échocardiographie</option><option>Consultation pédiatrique</option><option>Bilan neurologique</option><option>Bilan annuel</option><option>Urgence</option></select></div>
          <div class="rv-fg"><label class="rv-fl">MÉDECIN</label><select class="rv-fi" formControlName="doctor"><option>Dr. Marie Dupont</option><option>Dr. Jean Fontaine</option><option>Dr. Sophie Martin</option></select></div>
        </div>
        <div class="rv-fg"><label class="rv-fl">NOTES</label><input class="rv-fi" type="text" placeholder="Informations supplémentaires…" formControlName="notes"></div>
        <button type="submit" class="rv-submit" [disabled]="submitting()">
          @if (submitting()) { <span class="rv-spin"></span> Enregistrement… }
          @else { <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> Confirmer le rendez-vous }
          <div class="rv-shine"></div>
        </button>
      </form>
    </div>
  </div>
}
  `,
  styles: [`
    :host{--bg:#03080f;--card:rgba(255,255,255,.038);--cardh:rgba(14,165,201,.08);--bdr:rgba(14,165,201,.11);--bdr2:rgba(14,165,201,.26);--txt:#e8f4fd;--txt2:#7ba8c4;--txt3:#3d6480;--royal:#1a56db;--sky:#0ea5e9;--sky2:#38bdf8;--grn:#10b981;--amb:#f59e0b;--red:#ef4444;}
    :host{display:block}
    .rv-page{padding:24px 26px;display:flex;flex-direction:column;gap:20px;min-height:100%;animation:rvIn .5s cubic-bezier(.22,1,.36,1)}
    .rv-header{display:flex;align-items:center;justify-content:space-between;animation:rvDown .4s .04s ease both}
    .rv-header-left{display:flex;align-items:center;gap:16px}
    .rv-header-badge{position:relative;flex-shrink:0}
    .rv-header-ico{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,rgba(14,165,201,.22),rgba(26,86,219,.18));border:1px solid rgba(14,165,201,.3);display:flex;align-items:center;justify-content:center;color:#38bdf8;box-shadow:0 0 28px rgba(14,165,201,.2);position:relative;z-index:1}
    .rv-header-glow{position:absolute;inset:-10px;border-radius:26px;background:radial-gradient(circle,rgba(14,165,201,.1),transparent 70%);pointer-events:none}
    .rv-title{font-size:26px;font-weight:800;color:var(--txt);letter-spacing:-.6px}
    .rv-sub{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--txt2);margin-top:4px}
    .rv-sub-dot{width:6px;height:6px;border-radius:50%;background:var(--grn);box-shadow:0 0 8px var(--grn);animation:rvPulse 2s ease infinite}
    .rv-header-actions{display:flex;align-items:center;gap:10px}
    .rv-view-switch{display:flex;background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:10px;padding:3px;gap:2px}
    .rv-vsw{width:32px;height:32px;border-radius:7px;background:none;border:none;color:var(--txt3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .16s}
    .rv-vsw:hover{color:var(--txt2)}
    .rv-vsw-on{background:rgba(14,165,201,.16);color:var(--sky2) !important}
    .rv-btn-new{position:relative;overflow:hidden;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#1a56db,#0ea5e9);border:none;border-radius:12px;padding:11px 20px;font-size:13.5px;font-weight:700;color:white;cursor:pointer;font-family:'Outfit',sans-serif;box-shadow:0 4px 22px rgba(14,165,201,.45);transition:all .22s}
    .rv-btn-new:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(14,165,201,.55)}
    .rv-shine{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .45s}
    .rv-btn-new:hover .rv-shine{left:100%}
    .rv-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
    .rv-stat{position:relative;overflow:hidden;background:var(--card);border:1px solid var(--bdr);border-radius:18px;padding:18px;backdrop-filter:blur(28px) saturate(160%);cursor:pointer;transition:all .22s;animation:rvCardIn .55s cubic-bezier(.34,1.56,.64,1) both}
    .rv-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,201,.2),transparent)}
    .rv-stat:hover{transform:translateY(-4px);border-color:var(--bdr2);box-shadow:0 16px 40px rgba(0,0,0,.45),0 0 0 1px rgba(14,165,201,.1)}
    .rv-stat-on{border-color:rgba(14,165,201,.35) !important;background:rgba(14,165,201,.07) !important}
    .rv-stat-shine{position:absolute;top:0;right:0;width:60px;height:60px;border-radius:50%;opacity:.06;background:radial-gradient(circle,white,transparent);pointer-events:none}
    .rv-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
    .rv-stat-ico{width:36px;height:36px;border-radius:10px;border:1px solid;display:flex;align-items:center;justify-content:center}
    .rv-stat-trend{font-size:11px;font-weight:700}
    .rv-stat-val{font-size:32px;font-weight:800;line-height:1;letter-spacing:-1.5px;margin-bottom:4px}
    .rv-stat-lbl{font-size:11px;color:var(--txt2);margin-bottom:10px}
    .rv-stat-bar{height:3px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
    .rv-stat-fill{height:100%;border-radius:99px;transition:width .6s .3s cubic-bezier(.22,1,.36,1)}
    .rv-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .rv-search{display:flex;align-items:center;gap:9px;flex:1;min-width:220px;background:var(--card);border:1px solid var(--bdr);border-radius:12px;padding:10px 14px;transition:all .18s;position:relative}
    .rv-search svg{color:var(--txt3);flex-shrink:0}
    .rv-search input{border:none;background:none;outline:none;font-size:13px;font-family:'Outfit',sans-serif;color:var(--txt);width:100%}
    .rv-search input::placeholder{color:var(--txt3)}
    .rv-search:focus-within{border-color:var(--bdr2);box-shadow:0 0 0 3px rgba(14,165,201,.12);background:rgba(14,165,201,.05)}
    .rv-sc{background:none;border:none;color:var(--txt3);cursor:pointer;font-size:12px;padding:0 2px}
    .rv-chips{display:flex;gap:6px;flex-wrap:wrap}
    .rv-chip{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:99px;font-size:12px;font-weight:600;background:var(--card);border:1px solid var(--bdr);color:var(--txt2);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .17s}
    .rv-chip:hover{border-color:var(--bdr2);color:var(--sky2)}
    .rv-chip-on{background:rgba(14,165,201,.12);border-color:rgba(14,165,201,.32);color:var(--sky2)}
    .rv-cdot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
    .rv-cn{font-size:10px;background:rgba(255,255,255,.08);border-radius:99px;padding:1px 6px}
    .rv-table-wrap{background:var(--card);border:1px solid var(--bdr);border-radius:20px;overflow:hidden;backdrop-filter:blur(28px) saturate(160%);animation:rvUp .4s .15s ease both}
    .rv-table-hd{display:grid;grid-template-columns:2fr 1.4fr 1.4fr 1.3fr 1fr 1fr;padding:13px 20px;background:rgba(14,165,201,.05);border-bottom:1px solid var(--bdr);font-size:9.5px;font-weight:700;color:var(--txt3);letter-spacing:1.2px;text-transform:uppercase}
    .rv-rows{display:flex;flex-direction:column}
    .rv-row{display:grid;grid-template-columns:2fr 1.4fr 1.4fr 1.3fr 1fr 1fr;align-items:center;padding:13px 20px;border-bottom:1px solid rgba(14,165,201,.05);transition:all .18s;animation:rvRowIn .4s ease both;position:relative}
    .rv-row-accent{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(135deg,rgba(14,165,201,.14),transparent);transition:width .22s;border-radius:0 8px 8px 0}
    .rv-row:last-child{border-bottom:none}
    .rv-row:hover{background:rgba(14,165,201,.04)}
    .rv-row:hover .rv-row-accent{width:3px}
    .rv-row-urg{border-left:2px solid #ef4444}
    .rv-cell-pat{display:flex;align-items:center;gap:11px}
    .rv-av{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
    .rv-av-sm{width:30px;height:30px;border-radius:8px;font-size:9px}
    .rv-pname{font-size:13.5px;font-weight:700;color:var(--txt)}
    .rv-pmeta{font-size:11px;color:var(--txt3);margin-top:1px}
    .rv-cell-dt{display:flex;flex-direction:column;gap:4px}
    .rv-dt-d,.rv-dt-t{display:flex;align-items:center;gap:5px}
    .rv-dt-d{font-size:12.5px;font-weight:600;color:var(--txt2)}
    .rv-dt-t{font-size:12.5px;font-weight:800;color:var(--sky2)}
    .rv-type{background:rgba(14,165,201,.08);border:1px solid rgba(14,165,201,.14);border-radius:7px;padding:4px 10px;font-size:11.5px;color:var(--txt2)}
    .rv-type-urg{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.22);color:#f87171}
    .rv-cell-doc{font-size:12.5px;color:var(--txt2)}
    .rv-st{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:99px;font-size:10.5px;font-weight:700}
    .rv-sdot{width:5px;height:5px;border-radius:50%;background:currentColor}
    .rv-s-confirmed{background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.22);color:#34d399}
    .rv-s-pending{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);color:#fbbf24}
    .rv-s-inprogress{background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.22);color:#a78bfa}
    .rv-s-cancelled{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171}
    .rv-s-completed{background:rgba(100,116,139,.1);border:1px solid rgba(100,116,139,.2);color:#94a3b8}
    .rv-cell-act{display:flex;gap:5px}
    .rv-act{width:30px;height:30px;border-radius:8px;border:1px solid var(--bdr);background:rgba(255,255,255,.03);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--txt3);transition:all .16s}
    .rv-act:disabled{opacity:.2;cursor:default}
    .rv-a-ok:not(:disabled):hover{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.3);color:#34d399}
    .rv-a-go:not(:disabled):hover{background:rgba(139,92,246,.12);border-color:rgba(139,92,246,.3);color:#a78bfa}
    .rv-a-del:not(:disabled):hover{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:#f87171}
    .rv-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:60px 0;color:var(--txt3)}
    .rv-empty-ico{width:70px;height:70px;border-radius:20px;background:rgba(14,165,201,.06);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;color:var(--txt3)}
    .rv-empty-t{font-size:15px;font-weight:700;color:var(--txt2)}
    .rv-empty-s{font-size:12px}
    .rv-kanban{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;align-items:start;animation:rvUp .4s .15s ease both}
    .rv-kb-col{background:rgba(255,255,255,.025);border:1px solid var(--bdr);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:10px}
    .rv-kb-hd{display:flex;align-items:center;gap:8px;padding-bottom:10px;border-bottom:1px solid;margin-bottom:4px}
    .rv-kb-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
    .rv-kb-title{font-size:12.5px;font-weight:700;color:var(--txt2);flex:1}
    .rv-kb-n{font-size:10px;font-weight:800;border-radius:99px;padding:2px 8px}
    .rv-kb-card{background:var(--card);border:1px solid var(--bdr);border-top-width:2px;border-radius:12px;padding:12px;transition:all .18s;animation:rvCardIn .45s cubic-bezier(.34,1.56,.64,1) both}
    .rv-kb-card:hover{transform:translateY(-2px);border-color:var(--bdr2);box-shadow:0 8px 24px rgba(0,0,0,.4)}
    .rv-kb-top{display:flex;align-items:center;gap:8px;margin-bottom:10px}
    .rv-kb-nm{font-size:12.5px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rv-kb-ty{font-size:10.5px;color:var(--txt3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rv-kb-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    .rv-kb-time{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--sky2);font-weight:700}
    .rv-kb-doc{font-size:10.5px;color:var(--txt3)}
    .rv-kb-acts{display:flex;gap:5px}
    .rv-kb-a{flex:1;padding:5px;border-radius:7px;background:rgba(255,255,255,.04);border:1px solid var(--bdr);font-size:10.5px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s}
    .rv-kb-a:hover{background:rgba(255,255,255,.08)}
    .rv-kb-empty{text-align:center;padding:20px;font-size:12px;color:var(--txt3)}
    .rv-overlay{position:fixed;inset:0;background:rgba(3,8,15,.8);backdrop-filter:blur(10px);z-index:500;display:flex;align-items:center;justify-content:center;animation:rvFadeIn .2s ease}
    .rv-modal{position:relative;overflow:hidden;background:#060e1c;border:1px solid var(--bdr2);border-radius:24px;width:520px;max-width:95vw;box-shadow:0 32px 80px rgba(0,0,0,.75),0 0 0 1px rgba(14,165,201,.1);max-height:90vh;overflow-y:auto;animation:rvModalIn .3s cubic-bezier(.34,1.56,.64,1)}
    .rv-modal-glow{position:absolute;top:-60px;right:-60px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,201,.12),transparent 70%);pointer-events:none}
    @keyframes rvModalIn{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:none}}
    .rv-modal-hd{display:flex;align-items:center;justify-content:space-between;padding:22px 24px 17px;border-bottom:1px solid var(--bdr)}
    .rv-modal-ttl{display:flex;align-items:center;gap:11px;font-size:18px;font-weight:800;color:var(--txt)}
    .rv-modal-ico{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,rgba(14,165,201,.22),rgba(26,86,219,.16));border:1px solid rgba(14,165,201,.28);display:flex;align-items:center;justify-content:center;color:#38bdf8}
    .rv-modal-x{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.05);border:1px solid var(--bdr);color:var(--txt2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
    .rv-modal-x:hover{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:#f87171}
    .rv-modal-body{padding:22px 24px;display:flex;flex-direction:column;gap:14px}
    .rv-frow{display:grid;grid-template-columns:1fr 1fr;gap:13px}
    .rv-fg{display:flex;flex-direction:column;gap:6px}
    .rv-fl{font-size:9.5px;font-weight:700;color:var(--txt3);letter-spacing:.9px}
    .rv-fi{background:rgba(14,165,201,.05);border:1px solid var(--bdr);border-radius:12px;padding:11px 14px;font-size:13px;color:var(--txt);font-family:'Outfit',sans-serif;outline:none;transition:all .2s;width:100%;box-sizing:border-box}
    .rv-fi:focus{border-color:rgba(14,165,201,.52);box-shadow:0 0 0 3px rgba(14,165,201,.14);background:rgba(14,165,201,.08)}
    .rv-fi::placeholder{color:var(--txt3)}
    .rv-fi option{background:#060e1c}
    .rv-err{border-color:rgba(239,68,68,.5) !important}
    .rv-submit{display:flex;align-items:center;justify-content:center;gap:9px;position:relative;overflow:hidden;background:linear-gradient(135deg,#1a56db,#0ea5e9);border:none;border-radius:13px;padding:13px;font-size:14px;font-weight:700;color:white;cursor:pointer;font-family:'Outfit',sans-serif;box-shadow:0 4px 22px rgba(14,165,201,.45);transition:all .22s;margin-top:5px}
    .rv-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 32px rgba(14,165,201,.55)}
    .rv-submit:hover:not(:disabled) .rv-shine{left:100%}
    .rv-submit:disabled{opacity:.4;cursor:not-allowed}
    .rv-spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.35);border-top-color:white;animation:rvSpin .6s linear infinite}
    @keyframes rvIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @keyframes rvDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
    @keyframes rvUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes rvCardIn{from{opacity:0;transform:translateY(22px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes rvRowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
    @keyframes rvFadeIn{from{opacity:0}to{opacity:1}}
    @keyframes rvPulse{0%,100%{box-shadow:0 0 8px var(--grn)}50%{box-shadow:0 0 18px var(--grn)}}
    @keyframes rvSpin{to{transform:rotate(360deg)}}
  `]
})
export class AppointmentsComponent implements OnInit {
  private ds    = inject(DataService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  all          = signal<Appointment[]>([]);
  activeFilter = signal('all');
  showModal    = signal(false);
  submitting   = signal(false);
  viewMode     = signal<'list'|'kanban'>('list');
  searchQ      = '';

  abs = Math.abs; max = Math.max;

  visible = computed(() => {
    let list = this.activeFilter()==='all' ? this.all() : this.all().filter(a=>a.status===this.activeFilter());
    if (this.searchQ) {
      const q = this.searchQ.toLowerCase();
      list = list.filter(a=>a.patientName?.toLowerCase().includes(q)||a.doctor?.toLowerCase().includes(q)||a.type?.toLowerCase().includes(q));
    }
    return list;
  });

  stats = [
    {key:'all',        label:'Total RDV',  color:'#38bdf8', trend:8,  icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`},
    {key:'inprogress', label:'En cours',   color:'#a78bfa', trend:12, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>`},
    {key:'pending',    label:'En attente', color:'#fbbf24', trend:-3, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`},
    {key:'confirmed',  label:'Confirmés',  color:'#34d399', trend:5,  icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>`},
    {key:'cancelled',  label:'Annulés',    color:'#f87171', trend:-8, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`},
  ];

  filters = [
    {v:'all',l:'Tous',color:'#7ba8c4'},{v:'inprogress',l:'En cours',color:'#a78bfa'},
    {v:'pending',l:'Attente',color:'#fbbf24'},{v:'confirmed',l:'Confirmé',color:'#34d399'},
    {v:'cancelled',l:'Annulé',color:'#f87171'},{v:'completed',l:'Terminé',color:'#94a3b8'},
  ];

  kanban = [
    {key:'pending',label:'En attente',color:'#fbbf24'},{key:'confirmed',label:'Confirmé',color:'#34d399'},
    {key:'inprogress',label:'En cours',color:'#a78bfa'},{key:'completed',label:'Terminé',color:'#94a3b8'},
    {key:'cancelled',label:'Annulé',color:'#f87171'},
  ];

  form = this.fb.group({
    patientName:['',Validators.required], patientId:[''],
    date:['',Validators.required], time:['',Validators.required],
    type:['Consultation générale'], doctor:['Dr. Marie Dupont'], notes:[''],
  });

  ngOnInit() { this.ds.getAppointments().subscribe({next:r=>this.all.set(r.data)}); }
  setFilter(v:string){this.activeFilter.set(v)}
  countStat(k:string){return k==='all'?this.all().length:this.all().filter(a=>a.status===k).length}
  byStatus(s:string){return this.all().filter(a=>a.status===s)}
  confirm(id:number){this.ds.updateAppointmentStatus(id,'confirmed').subscribe(()=>{this.updateLocal(id,'confirmed');this.toast.success('Confirmé','RDV confirmé ✓')})}
  setInProgress(id:number){this.ds.updateAppointmentStatus(id,'inprogress').subscribe(()=>{this.updateLocal(id,'inprogress');this.toast.info('En cours','Consultation démarrée')})}
  cancel(id:number){this.ds.updateAppointmentStatus(id,'cancelled').subscribe(()=>{this.updateLocal(id,'cancelled');this.toast.error('Annulé','RDV annulé')})}
  openModal(){this.showModal.set(true)}
  closeModal(){this.showModal.set(false);this.form.reset({type:'Consultation générale',doctor:'Dr. Marie Dupont'})}
  closeBkd(e:MouseEvent){if((e.target as HTMLElement).classList.contains('rv-overlay'))this.closeModal()}
  inv(c:string){const ctrl=this.form.get(c);return ctrl?.invalid&&ctrl?.touched}
  lbl(s:string){return({confirmed:'Confirmé',pending:'En attente',inprogress:'En cours',cancelled:'Annulé',completed:'Terminé'} as any)[s]??s}
  private updateLocal(id:number,status:AppointmentStatus){this.all.update(l=>l.map(a=>a.id===id?{...a,status}:a))}
  submit(){
    if(this.form.invalid){this.form.markAllAsTouched();return}
    this.submitting.set(true);
    this.ds.createAppointment(this.form.value as CreateAppointmentDto).subscribe({
      next:a=>{this.all.update(l=>[a,...l]);this.submitting.set(false);this.closeModal();this.toast.success('RDV créé',`${a.patientName} · ${a.time}`)},
      error:e=>{this.submitting.set(false);this.toast.error('Erreur',e.message)}
    });
  }
}