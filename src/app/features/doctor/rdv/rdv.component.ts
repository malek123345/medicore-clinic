import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../../core/services/rdv.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="page-wrap">

  <!-- ══ FLOATING BG ══ -->
  <div class="page-bg" aria-hidden="true">
    <div class="pg-orb pg-orb1"></div>
    <div class="pg-orb pg-orb2"></div>
    <div class="pg-grid"></div>
    <svg class="pg-ecg" viewBox="0 0 900 60" preserveAspectRatio="none">
      <polyline class="pg-ecg-line" points="0,30 60,30 75,30 82,8 90,52 97,30 120,30 180,30 195,30 202,8 210,52 217,30 240,30 300,30 315,30 322,8 330,52 337,30 360,30 420,30 435,30 442,8 450,52 457,30 480,30 540,30 555,30 562,8 570,52 577,30 600,30 660,30 675,30 682,8 690,52 697,30 720,30 780,30 795,30 802,8 810,52 817,30 840,30 900,30"/>
    </svg>
    <div class="cross-float cf1">✚</div>
    <div class="cross-float cf2">✚</div>
  </div>

  <!-- ══ HEADER ══ -->
  <div class="pg-hd">
    <div class="pg-hd-left">
      <div class="pg-eyebrow">
        <span class="pg-live-dot"></span>Agenda médical
      </div>
      <h1 class="pg-title">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Rendez-vous
      </h1>
      <p class="pg-sub">{{ rdvSvc.getAll().length }} rendez-vous enregistrés</p>
    </div>
    <button class="btn-cta" (click)="showAdd.set(!showAdd())">
      <div class="btn-cta-ico">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
      Nouveau RDV
      <div class="btn-cta-shine"></div>
    </button>
  </div>

  <!-- ══ STATS STRIP — DYNAMIQUES ══ -->
  <div class="stats-strip">
    <div class="ss-item" style="--sc:var(--P);--scb:rgba(29,95,224,0.1);animation-delay:.05s">
      <div class="ss-ico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      </div>
      <div>
        <div class="ss-val">{{ totalRdv() }}</div>
        <div class="ss-lbl">Total RDV</div>
      </div>
    </div>

    <div class="ss-item" style="--sc:#0eb88a;--scb:rgba(14,184,138,0.1);animation-delay:.1s">
      <div class="ss-ico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <div>
        <div class="ss-val">{{ confirmedRdv() }}</div>
        <div class="ss-lbl">Confirmés</div>
      </div>
    </div>

    <div class="ss-item" style="--sc:#f0a020;--scb:rgba(240,160,32,0.1);animation-delay:.15s">
      <div class="ss-ico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <div>
        <div class="ss-val">{{ pendingRdv() }}</div>
        <div class="ss-lbl">En attente</div>
      </div>
    </div>

    <div class="ss-item" style="--sc:#f0426a;--scb:rgba(240,66,106,0.1);animation-delay:.2s">
      <div class="ss-ico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <div>
        <div class="ss-val">{{ cancelledRdv() }}</div>
        <div class="ss-lbl">Annulés</div>
      </div>
    </div>
  </div>

  <!-- ══ ADD FORM ══ -->
  @if (showAdd()) {
    <div class="form-card">
      <div class="form-card-stripe"></div>
      <div class="fc-hd">
        <div class="fc-hd-left">
          <div class="fc-hd-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/>
            </svg>
          </div>
          <div>
            <div class="fc-hd-title">Nouveau rendez-vous</div>
            <div class="fc-hd-sub">Remplissez les informations du patient</div>
          </div>
        </div>
        <button class="fc-close" (click)="showAdd.set(false)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="fc-body">
        <div class="fc-grid-3">
          <div class="fg">
            <label class="fl">PATIENT</label>
            <div class="fi-wrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input class="fi" type="text" [(ngModel)]="newRdv.patientName" placeholder="Nom complet"/>
            </div>
          </div>
          <div class="fg">
            <label class="fl">TÉLÉPHONE</label>
            <div class="fi-wrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.11h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16c.003.307.003.613 0 .92z"/></svg>
              <input class="fi" type="tel" [(ngModel)]="newRdv.patientPhone" placeholder="+216 XX XXX XXX"/>
            </div>
          </div>
          <div class="fg">
            <label class="fl">TYPE DE VISITE</label>
            <div class="fi-wrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <select class="fi" [(ngModel)]="newRdv.type">
                <option>Consultation</option><option>Détartrage</option><option>Implant</option>
                <option>Chirurgie</option><option>Suivi</option><option>Urgence</option>
              </select>
            </div>
          </div>
        </div>

        <div class="fc-grid-2">
          <div class="fg">
            <label class="fl">DATE</label>
            <div class="fi-wrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input class="fi" type="date" [(ngModel)]="newRdv.date" (change)="onDateChange()"/>
            </div>
            @if (isSunday()) {
              <div class="f-warn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Le cabinet est fermé le dimanche
              </div>
            }
          </div>
          <div class="fg">
            <label class="fl">CRÉNEAU HORAIRE</label>
            @if (!newRdv.date) {
              <div class="slots-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Sélectionnez d'abord une date
              </div>
            } @else if (isSunday()) {
              <div class="slots-hint closed">Fermé le dimanche</div>
            } @else {
              <div class="slots-wrap">
                @for (slot of availableSlots(); track slot.time) {
                  <button class="slot"
                    [class.slot-taken]="slot.taken"
                    [class.slot-sel]="newRdv.time === slot.time"
                    [disabled]="slot.taken"
                    (click)="!slot.taken && (newRdv.time = slot.time)">
                    {{ slot.label }}
                    @if (slot.taken) { <span class="slot-x">Pris</span> }
                  </button>
                }
              </div>
            }
          </div>
        </div>

        <div class="fc-actions">
          <button class="btn-cta btn-cta-sm" (click)="submitRdv()" [disabled]="!newRdv.patientName || !newRdv.date || !newRdv.time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Confirmer le rendez-vous
            <div class="btn-cta-shine"></div>
          </button>
          <button class="btn-ghost-sm" (click)="showAdd.set(false)">Annuler</button>
        </div>
      </div>
    </div>
  }

  <!-- ══ FILTERS + SEARCH ══ -->
  <div class="filter-bar">
    <div class="filter-tabs">
      @for (tab of tabs; track tab.val) {
        <button class="ftab" [class.ftab-on]="activeTab()===tab.val" (click)="activeTab.set(tab.val)">
          <div class="ftab-dot" [style.background]="tab.color"></div>
          {{ tab.label }}
          <span class="ftab-count">{{ countByTab(tab.val) }}</span>
        </button>
      }
    </div>
    <div class="search-wrap">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="search-inp" [(ngModel)]="searchQ" placeholder="Rechercher un patient..."/>
      @if (searchQ) {
        <button class="search-clr" (click)="searchQ=''">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      }
    </div>
  </div>

  <!-- ══ RDV LIST ══ -->
  <div class="rdv-list">
    @for (rdv of filteredRdvs(); track rdv.id; let i = $index) {
      <div class="rdv-card" [style.animation-delay]="(i*0.055)+'s'">
        <div class="rdv-card-left">
          <div class="rdv-date-block">
            <div class="rdb-day">{{ formatDate(rdv.date) }}</div>
            <div class="rdb-time">{{ rdv.time }}</div>
          </div>
          <div class="rdv-vline"></div>
        </div>
        <div class="rdv-av" [style.background]="getGrad(rdv.patientName)">
          {{ rdv.patientName[0] }}{{ rdv.patientName.split(' ')[1]?.[0] ?? '' }}
        </div>
        <div class="rdv-info">
          <div class="rdv-name">{{ rdv.patientName }}</div>
          <div class="rdv-meta">
            <span class="rdv-type-tag">{{ rdv.type }}</span>
            @if (rdv.patientPhone) { <span class="rdv-phone">{{ rdv.patientPhone }}</span> }
          </div>
        </div>
        <div class="rdv-actions">
          <span class="badge" [class]="getBadgeClass(rdv.status)">
            <span class="badge-dot"></span>{{ statusLabel(rdv.status) }}
          </span>
          @if (rdv.status === 'pending') {
            <button class="action-confirm" (click)="confirm(rdv.id)">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Confirmer
            </button>
          }
          @if (rdv.status === 'confirmed') {
            <button class="action-done" (click)="markAsDone(rdv.id)">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Terminé
            </button>
          }
          @if (rdv.status !== 'cancelled' && rdv.status !== 'done') {
            <button class="action-cancel" (click)="cancel(rdv.id)">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Annuler
            </button>
          }
        </div>
      </div>
    }

    @if (filteredRdvs().length === 0) {
      <div class="empty-card">
        <div class="empty-ico">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="empty-title">Aucun rendez-vous trouvé</div>
        <div class="empty-sub">Essayez de modifier vos filtres ou créez un nouveau RDV</div>
        @if (searchQ) {
          <button class="btn-ghost-sm" (click)="searchQ=''">Effacer la recherche</button>
        }
      </div>
    }
  </div>
</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    :host { display: block; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

    :host {
      --P: #1d5fe0; --P2: #154dc8; --P3: #4d87f5;
      --Pl: rgba(29,95,224,0.08); --Pl2: rgba(29,95,224,0.15);
      --em: #0eb88a; --rose: #f0426a; --amber: #f0a020; --violet: #7c3aed;
      --bg: #edf1fb; --bg2: #e2e9f8; --bg3: #ffffff;
      --brd: rgba(29,95,224,0.1); --brd2: rgba(29,95,224,0.2);
      --txt: #07193b; --txt2: #213259; --txt3: #526080; --txt4: #8ba0bf;
      --glass: rgba(255,255,255,0.76); --gbrd: rgba(255,255,255,0.88);
      --sh1: 0 2px 12px rgba(29,95,224,0.08); --sh2: 0 8px 32px rgba(29,95,224,0.12);
    }

    .page-wrap {
      position: relative; min-height: 100%;
      display: flex; flex-direction: column; gap: 20px;
      animation: pgIn .45s cubic-bezier(.22,1,.36,1) both;
    }
    @keyframes pgIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }

    .page-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
    .pg-orb { position: absolute; border-radius: 50%; filter: blur(70px); }
    .pg-orb1 { width:500px;height:500px;top:-100px;right:5%;background:radial-gradient(circle,rgba(29,95,224,0.09),rgba(124,58,237,0.05) 60%,transparent 75%);animation:o1 20s ease-in-out infinite; }
    .pg-orb2 { width:350px;height:350px;bottom:50px;left:10%;background:radial-gradient(circle,rgba(14,184,138,0.08),transparent 70%);animation:o2 26s ease-in-out infinite; }
    @keyframes o1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
    @keyframes o2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-30px)} }
    .pg-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(29,95,224,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(29,95,224,0.025) 1px,transparent 1px);background-size:56px 56px; }
    .pg-ecg { position:absolute;bottom:40px;left:0;width:100%;height:60px;opacity:.06; }
    .pg-ecg-line { fill:none;stroke:var(--P);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2400;stroke-dashoffset:2400;animation:ecgAnim 5s ease-in-out infinite; }
    @keyframes ecgAnim { 0%{stroke-dashoffset:2400;opacity:0} 10%{opacity:1} 80%{stroke-dashoffset:0;opacity:.8} 100%{stroke-dashoffset:0;opacity:0} }
    .cross-float { position:absolute;color:var(--P);opacity:.04;font-size:18px;animation:cfloat 14s ease-in-out infinite;user-select:none; }
    .cf1 { top:12%;right:10%;font-size:22px;animation-duration:16s; }
    .cf2 { top:60%;right:30%;font-size:14px;animation-duration:11s;animation-delay:-5s; }
    @keyframes cfloat { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-16px) rotate(10deg)} }

    .pg-hd { position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap; }
    .pg-eyebrow { display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:.09em;margin-bottom:8px; }
    .pg-live-dot { width:7px;height:7px;border-radius:50%;background:var(--em);animation:ldot 2.5s ease-in-out infinite;flex-shrink:0; }
    @keyframes ldot { 0%,100%{box-shadow:0 0 0 0 rgba(14,184,138,.5)} 50%{box-shadow:0 0 0 5px rgba(14,184,138,0)} }
    .pg-title { display:flex;align-items:center;gap:11px;font-size:26px;font-weight:900;color:var(--txt);letter-spacing:-1px;margin:0 0 5px; }
    .pg-title svg { color:var(--P); }
    .pg-sub { font-size:13px;color:var(--txt4);margin:0; }

    .btn-cta {
      position:relative;overflow:hidden;
      display:inline-flex;align-items:center;gap:10px;
      padding:11px 22px;border-radius:14px;border:none;cursor:pointer;
      background:linear-gradient(135deg,var(--P),var(--violet));
      color:white;font-size:13.5px;font-weight:700;
      font-family:'Plus Jakarta Sans',sans-serif;
      box-shadow:0 6px 24px rgba(29,95,224,.35);
      transition:all .22s;
    }
    .btn-cta:hover { transform:translateY(-2px);box-shadow:0 10px 32px rgba(29,95,224,.45); }
    .btn-cta:disabled { opacity:.55;cursor:not-allowed;transform:none; }
    .btn-cta-sm { padding:10px 20px;font-size:13px; }
    .btn-cta-ico { width:24px;height:24px;border-radius:7px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center; }
    .btn-cta-shine { position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transition:left .45s; }
    .btn-cta:hover .btn-cta-shine { left:100%; }
    .btn-ghost-sm { padding:10px 18px;border-radius:12px;background:var(--bg2);border:1.5px solid var(--brd);color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s; }
    .btn-ghost-sm:hover { color:var(--txt);border-color:var(--brd2); }

    /* ══ STATS ══ */
    .stats-strip {
      position:relative;z-index:1;
      display:grid;grid-template-columns:repeat(4,1fr);gap:12px;
    }
    .ss-item {
      display:flex;align-items:center;gap:12px;
      padding:16px 18px;border-radius:16px;
      background:var(--glass);backdrop-filter:blur(16px);
      border:1.5px solid var(--gbrd);
      box-shadow:var(--sh1);
      border-top:3px solid var(--sc);
      transition:all .22s;
      animation:cardUp .5s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes cardUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    .ss-item:hover { transform:translateY(-4px);box-shadow:var(--sh2); }
    .ss-ico {
      width:42px;height:42px;border-radius:11px;
      background:var(--scb);color:var(--sc);
      display:flex;align-items:center;justify-content:center;flex-shrink:0;
    }
    .ss-ico svg { width:18px;height:18px; }
    .ss-val { font-size:28px;font-weight:900;color:var(--sc);letter-spacing:-1.5px;line-height:1; }
    .ss-lbl { font-size:10.5px;color:var(--txt4);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:3px; }

    /* ══ FORM ══ */
    .form-card {
      position:relative;z-index:1;overflow:hidden;
      background:var(--glass);backdrop-filter:blur(24px) saturate(160%);
      border:1.5px solid var(--gbrd);border-radius:20px;
      box-shadow:var(--sh2);
      animation:formIn .35s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes formIn { from{opacity:0;transform:translateY(-12px) scale(.98)} to{opacity:1;transform:none} }
    .form-card-stripe { height:4px;background:linear-gradient(90deg,var(--P),var(--violet),var(--em)); }
    .fc-hd { display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--brd); }
    .fc-hd-left { display:flex;align-items:center;gap:11px; }
    .fc-hd-ico { width:38px;height:38px;border-radius:11px;background:var(--Pl2);color:var(--P);display:flex;align-items:center;justify-content:center;border:1px solid rgba(29,95,224,.15); }
    .fc-hd-title { font-size:14.5px;font-weight:800;color:var(--txt); }
    .fc-hd-sub { font-size:11px;color:var(--txt4);margin-top:1px; }
    .fc-close { width:30px;height:30px;border-radius:9px;background:var(--bg2);border:1px solid var(--brd);color:var(--txt3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s; }
    .fc-close:hover { background:rgba(240,66,106,.1);color:var(--rose);border-color:rgba(240,66,106,.2); }
    .fc-body { padding:18px 22px;display:flex;flex-direction:column;gap:16px; }
    .fc-grid-3 { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
    .fc-grid-2 { display:grid;grid-template-columns:1fr 1.6fr;gap:14px; }
    .fc-actions { display:flex;gap:10px;padding-top:4px; }
    .fg { display:flex;flex-direction:column;gap:5px; }
    .fl { font-size:10px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em; }
    .fi-wrap { display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:12px;background:var(--Pl);border:1.5px solid var(--brd);color:var(--txt4);transition:all .2s; }
    .fi-wrap:focus-within { border-color:var(--P);background:rgba(29,95,224,.06);box-shadow:0 0 0 4px rgba(29,95,224,.08);color:var(--P); }
    .fi { border:none;background:transparent;outline:none;font-size:13px;color:var(--txt2);width:100%;font-family:'Plus Jakarta Sans',sans-serif; }
    .fi::placeholder { color:var(--txt4); }
    .fi option { background:var(--bg3); }
    .f-warn { display:flex;align-items:center;gap:7px;font-size:12px;color:var(--amber);background:rgba(240,160,32,.09);border:1px solid rgba(240,160,32,.2);border-radius:9px;padding:8px 12px;margin-top:6px; }
    .slots-hint { display:flex;align-items:center;gap:8px;font-size:13px;color:var(--txt4);padding:12px 0; }
    .slots-hint.closed { color:var(--rose); }
    .slots-wrap { display:flex;flex-wrap:wrap;gap:7px;padding-top:4px; }
    .slot { padding:7px 13px;border-radius:9px;font-size:12px;font-weight:600;border:1.5px solid var(--brd2);background:var(--bg2);color:var(--txt2);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s;position:relative; }
    .slot:hover:not(.slot-taken) { border-color:var(--P);background:var(--Pl);color:var(--P); }
    .slot-sel { background:var(--P)!important;color:white!important;border-color:var(--P)!important;box-shadow:0 4px 14px rgba(29,95,224,.35); }
    .slot-taken { opacity:.5;cursor:not-allowed;background:var(--bg2); }
    .slot-x { display:block;font-size:8.5px;color:var(--rose);margin-top:1px; }

    /* ══ FILTER BAR ══ */
    .filter-bar { position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap; }
    .filter-tabs { display:flex;gap:3px;background:var(--glass);border:1.5px solid var(--gbrd);border-radius:13px;padding:4px;backdrop-filter:blur(12px); }
    .ftab { display:flex;align-items:center;gap:7px;padding:8px 16px;border-radius:10px;border:none;background:transparent;color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s; }
    .ftab:hover { color:var(--txt2);background:rgba(29,95,224,.05); }
    .ftab-on { background:var(--Pl2)!important;color:var(--P)!important;box-shadow:inset 0 0 0 1px rgba(29,95,224,.2); }
    .ftab-dot { width:6px;height:6px;border-radius:50%;flex-shrink:0; }
    .ftab-count { font-size:10px;padding:2px 7px;border-radius:99px;background:var(--Pl);color:var(--txt4);font-weight:700; }
    .ftab-on .ftab-count { background:var(--Pl2);color:var(--P); }
    .search-wrap { display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:13px;background:var(--glass);border:1.5px solid var(--gbrd);min-width:240px;backdrop-filter:blur(12px);transition:all .2s;color:var(--txt4); }
    .search-wrap:focus-within { border-color:var(--P);box-shadow:0 0 0 4px rgba(29,95,224,.08); }
    .search-inp { border:none;background:transparent;outline:none;font-size:13px;color:var(--txt2);width:100%;font-family:'Plus Jakarta Sans',sans-serif; }
    .search-inp::placeholder { color:var(--txt4); }
    .search-clr { width:20px;height:20px;border-radius:50%;background:var(--bg2);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--txt4);transition:all .15s;flex-shrink:0; }
    .search-clr:hover { background:rgba(240,66,106,.1);color:var(--rose); }

    /* ══ LIST ══ */
    .rdv-list { position:relative;z-index:1;display:flex;flex-direction:column;gap:10px; }
    .rdv-card {
      display:flex;align-items:center;gap:16px;
      padding:16px 20px;border-radius:16px;
      background:var(--glass);backdrop-filter:blur(16px);
      border:1.5px solid var(--gbrd);box-shadow:var(--sh1);
      animation:rowIn .42s cubic-bezier(.34,1.56,.64,1) both;
      transition:all .22s;cursor:default;
    }
    @keyframes rowIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }
    .rdv-card:hover { transform:translateX(4px);box-shadow:var(--sh2);border-color:rgba(29,95,224,.25); }
    .rdv-card-left { display:flex;align-items:center;gap:12px;flex-shrink:0; }
    .rdv-date-block { min-width:82px; }
    .rdb-day { font-size:11px;font-weight:700;color:var(--P);text-transform:uppercase;letter-spacing:.04em; }
    .rdb-time { font-size:20px;font-weight:900;color:var(--txt);letter-spacing:-1px;line-height:1;margin-top:2px; }
    .rdv-vline { width:1px;height:44px;background:linear-gradient(180deg,transparent,var(--brd2),transparent); }
    .rdv-av { width:42px;height:42px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;box-shadow:0 4px 12px rgba(0,0,0,0.15); }
    .rdv-info { flex:1;min-width:0; }
    .rdv-name { font-size:15px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .rdv-meta { display:flex;align-items:center;gap:8px;margin-top:4px; }
    .rdv-type-tag { font-size:11px;font-weight:700;color:var(--P);background:var(--Pl);padding:2px 9px;border-radius:6px; }
    .rdv-phone { font-size:11.5px;color:var(--txt4); }
    .rdv-actions { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }

    .badge { display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;padding:4px 10px;border-radius:99px;white-space:nowrap; }
    .badge-dot { width:5px;height:5px;border-radius:50%;flex-shrink:0; }
    .badge-confirmed { background:rgba(14,184,138,.1);color:#0eb88a;border:1px solid rgba(14,184,138,.2); }
    .badge-confirmed .badge-dot { background:#0eb88a; }
    .badge-pending { background:rgba(240,160,32,.1);color:var(--amber);border:1px solid rgba(240,160,32,.2); }
    .badge-pending .badge-dot { background:var(--amber); }
    .badge-done { background:rgba(124,58,237,.1);color:var(--violet);border:1px solid rgba(124,58,237,.2); }
    .badge-done .badge-dot { background:var(--violet); }
    .badge-cancelled { background:rgba(240,66,106,.08);color:var(--rose);border:1px solid rgba(240,66,106,.15); }
    .badge-cancelled .badge-dot { background:var(--rose); }

    .action-confirm { display:flex;align-items:center;gap:6px;padding:6px 13px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;background:rgba(14,184,138,.1);color:var(--em);border:1px solid rgba(14,184,138,.22);transition:all .16s; }
    .action-confirm:hover { background:rgba(14,184,138,.2); }
    
    .action-done { display:flex;align-items:center;gap:6px;padding:6px 13px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;background:rgba(124,58,237,.1);color:var(--violet);border:1px solid rgba(124,58,237,.22);transition:all .16s; }
    .action-done:hover { background:rgba(124,58,237,.2); }
    
    .action-cancel { display:flex;align-items:center;gap:6px;padding:6px 13px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;background:rgba(240,66,106,.08);color:var(--rose);border:1px solid rgba(240,66,106,.18);transition:all .16s; }
    .action-cancel:hover { background:rgba(240,66,106,.18); }

    .empty-card { display:flex;flex-direction:column;align-items:center;gap:12px;padding:60px;border-radius:18px;background:var(--glass);backdrop-filter:blur(16px);border:1.5px solid var(--gbrd);text-align:center; }
    .empty-ico { width:60px;height:60px;border-radius:16px;background:var(--Pl);color:var(--P);display:flex;align-items:center;justify-content:center; }
    .empty-title { font-size:15px;font-weight:700;color:var(--txt); }
    .empty-sub { font-size:13px;color:var(--txt4); }

    @media (max-width:1000px) { .stats-strip { grid-template-columns:repeat(2,1fr); } }
    @media (max-width:800px) { .fc-grid-3 { grid-template-columns:1fr 1fr; } .fc-grid-2 { grid-template-columns:1fr; } .filter-bar { flex-direction:column;align-items:stretch; } .stats-strip { grid-template-columns:1fr 1fr; } }
    @media (max-width:580px) { .fc-grid-3 { grid-template-columns:1fr; } .stats-strip { grid-template-columns:1fr; } }
  `]
})
export class RdvComponent {
  rdvSvc = inject(RdvService);
  toast  = inject(ToastService);

  showAdd   = signal(false);
  activeTab = signal('all');
  searchQ   = '';

  newRdv = { patientName: '', patientPhone: '', date: '', time: '', type: 'Consultation' };

  readonly tabs = [
    { val: 'all',       label: 'Tous',       color: 'var(--P)' },
    
    { val: 'confirmed', label: 'Confirmés',  color: 'var(--em)' },
    { val: 'done',      label: 'Terminés',   color: 'var(--violet)' },
    { val: 'cancelled', label: 'Annulés',    color: 'var(--rose)' },
  ];

  // ══ COMPUTED STATS DYNAMIQUES ══
  totalRdv     = computed(() => this.rdvSvc.getAll().length);
  confirmedRdv = computed(() => this.rdvSvc.getAll().filter(r => r.status === 'confirmed').length);
  pendingRdv   = computed(() => this.rdvSvc.getAll().filter(r => r.status === 'pending').length);
  cancelledRdv = computed(() => this.rdvSvc.getAll().filter(r => r.status === 'cancelled').length);

  isSunday    = () => this.newRdv.date ? new Date(this.newRdv.date).getDay() === 0 : false;
  onDateChange() { this.newRdv.time = ''; }
  availableSlots = () => this.newRdv.date ? this.rdvSvc.getAvailableSlots(this.newRdv.date) : [];

  filteredRdvs = computed(() => {
    let l = this.rdvSvc.getAll();
    if (this.activeTab() !== 'all') l = l.filter(r => r.status === this.activeTab());
    if (this.searchQ.trim()) l = l.filter(r => r.patientName.toLowerCase().includes(this.searchQ.toLowerCase()));
    return l.sort((a, b) => b.date.localeCompare(a.date));
  });

  countByTab  = (t: string) => t === 'all' ? this.rdvSvc.getAll().length : this.rdvSvc.getAll().filter(r => r.status === t).length;
  statusLabel = (s: string) => ({ confirmed: 'Confirmé', pending: 'En attente', done: 'Terminé', cancelled: 'Annulé' } as any)[s] ?? s;
  getBadgeClass = (s: string) => ({ confirmed: 'badge-confirmed', pending: 'badge-pending', done: 'badge-done', cancelled: 'badge-cancelled' } as any)[s] ?? 'badge-done';
  formatDate = (d: string) => { if (!d) return ''; return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); };

  getGrad(name: string): string {
    const g = ['linear-gradient(135deg,#1d5fe0,#154dc8)', 'linear-gradient(135deg,#0891b2,#0e7490)', 'linear-gradient(135deg,#6366f1,#4f46e5)', 'linear-gradient(135deg,#0eb88a,#0d9a76)', 'linear-gradient(135deg,#f0426a,#c73055)', 'linear-gradient(135deg,#f0a020,#c8820a)'];
    return g[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % g.length];
  }

  submitRdv() {
    const result = this.rdvSvc.bookAppointment({ patientId: 'WALK_IN', patientName: this.newRdv.patientName, patientPhone: this.newRdv.patientPhone, date: this.newRdv.date, time: this.newRdv.time, type: this.newRdv.type, status: 'confirmed' });
    if (result.success) { this.toast.success('RDV créé !', result.message); this.newRdv = { patientName: '', patientPhone: '', date: '', time: '', type: 'Consultation' }; this.showAdd.set(false); }
    else { this.toast.error('Créneau indisponible', result.message); }
  }
  
  confirm(id: string) { 
    this.rdvSvc.confirmAppointment(id); 
    this.toast.success('RDV confirmé !'); 
  }
  
  markAsDone(id: string) {
    this.rdvSvc.markAppointmentAsDone(id);
    this.toast.success('Visite terminée !', 'Le rendez-vous a été marqué comme terminé');
  }
  
  cancel(id: string)  { 
    this.rdvSvc.cancelAppointment(id);  
    this.toast.info('RDV annulé'); 
  }
}