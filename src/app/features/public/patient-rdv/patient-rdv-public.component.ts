import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../../core/services/rdv.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-patient-rdv-public',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="prdv-page">

  <!-- HERO -->
  <section class="prdv-hero">
    <div class="hero-bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="prdv-hero-inner">
      <div class="hero-pill">
        <span class="hero-pill-dot"></span>
        Mon espace patient
      </div>
      <h1 class="prdv-title">Mes <span class="title-accent">rendez-vous</span></h1>
      <p class="prdv-sub">Bonjour <strong>{{ auth.user()?.name }}</strong> — Gérez vos rendez-vous avec le Dr. Khaddar</p>
    </div>
    <div class="hero-wave">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f7fafd"/>
      </svg>
    </div>
  </section>

  <section class="prdv-body">
    <div class="prdv-inner">

      <!-- BOOKING PANEL -->
      <div class="booking-panel" [class.panel-open]="showForm()">
        <div class="booking-panel-hd" (click)="showForm.set(!showForm())">
          <div class="bph-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="bph-texts">
            <div class="bph-title">Prendre un rendez-vous</div>
            <div class="bph-sub">Choisissez une date et un créneau disponible</div>
          </div>
          <div class="bph-toggle" [class.toggle-open]="showForm()">
            @if (!showForm()) {
              <span class="toggle-label">Nouveau RDV</span>
            } @else {
              <span class="toggle-label">Fermer</span>
            }
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline [attr.points]="showForm() ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
            </svg>
          </div>
        </div>

        @if (showForm()) {
          <div class="booking-form">

            <!-- Step 1 -->
            <div class="step-block">
              <div class="step-label">
                <div class="step-num">1</div>
                <span>Choisir une date</span>
              </div>
              <input class="pub-input" type="date" [(ngModel)]="booking.date" [min]="minDate" (change)="onDateChange()">
              @if (isSunday()) {
                <div class="form-alert alert-warn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Le cabinet est fermé le dimanche
                </div>
              }
            </div>

            <!-- Step 2 -->
            @if (booking.date && !isSunday()) {
              <div class="step-block" style="animation: formIn .3s ease both">
                <div class="step-label">
                  <div class="step-num">2</div>
                  <span>Choisir un créneau</span>
                  <span class="pause-tag">⏸ Pause 12h–14h</span>
                </div>
                <div class="slots-grid">
                  @for (slot of availableSlots(); track slot.time) {
                    <button
                      class="slot-btn"
                      [class.slot-taken]="slot.taken"
                      [class.slot-sel]="booking.time === slot.time"
                      [disabled]="slot.taken"
                      (click)="!slot.taken && (booking.time = slot.time)"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span>{{ slot.label }}</span>
                      @if (slot.taken) { <span class="taken-badge">Réservé</span> }
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Step 3 -->
            @if (booking.date && booking.time && !isSunday()) {
              <div class="step-block" style="animation: formIn .3s .1s ease both">
                <div class="step-label">
                  <div class="step-num">3</div>
                  <span>Type de consultation</span>
                </div>
                <div class="types-grid">
                  @for (t of types; track t) {
                    <button class="type-btn" [class.type-sel]="booking.type === t" (click)="booking.type = t">
                      {{ t }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Recap -->
            @if (booking.date && booking.time && !isSunday()) {
              <div class="booking-recap" style="animation: formIn .3s .2s ease both">
                <div class="recap-ico">✓</div>
                <div class="recap-detail">
                  <div class="recap-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <strong>{{ booking.date }}</strong> à <strong>{{ booking.time }}</strong>
                  </div>
                  <div class="recap-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Dr. Khaddar · <span>{{ booking.type }}</span>
                  </div>
                </div>
                <button class="confirm-btn" (click)="submitBooking()">
                  Confirmer
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            }

          </div>
        }
      </div>

      <!-- MY RDV LIST -->
      <div class="rdv-section">
        <div class="rdv-section-hd">
          <h2 class="rdv-section-title">Mes rendez-vous</h2>
          <div class="rdv-tabs">
            @for (tab of tabs; track tab.val) {
              <button class="rdv-tab" [class.active]="activeTab() === tab.val" (click)="activeTab.set(tab.val)">
                {{ tab.label }}
                <span class="rtab-badge">{{ countTab(tab.val) }}</span>
              </button>
            }
          </div>
        </div>

        @if (filteredRdvs().length === 0) {
          <div class="rdv-empty">
            <div class="rdv-empty-ico-wrap">
              <div class="rdv-empty-ico">📅</div>
            </div>
            <p class="rdv-empty-title">Aucun rendez-vous dans cette catégorie</p>
            <button class="empty-new-btn" (click)="showForm.set(true)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Prendre un rendez-vous
            </button>
          </div>
        }

        <div class="rdv-list">
          @for (rdv of filteredRdvs(); track rdv.id; let i = $index) {
            <div class="rdv-card" [style.--delay]="(i*0.07)+'s'">
              <div class="rdc-status-bar" [class]="'rsb-'+rdv.status"></div>
              <div class="rdc-date">
                <div class="rdc-time">{{ rdv.time }}</div>
                <div class="rdc-day">{{ rdv.date }}</div>
              </div>
              <div class="rdc-sep"></div>
              <div class="rdc-info">
                <div class="rdc-type">{{ rdv.type }}</div>
                <div class="rdc-doctor">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Dr. Zied Khaddar — Cabinet Belvédère
                </div>
              </div>
              <div class="rdc-right">
                <span class="status-badge" [class]="'sb-'+rdv.status">{{ statusLabel(rdv.status) }}</span>
                @if (rdv.status === 'confirmed' || rdv.status === 'pending') {
                  <button class="cancel-btn" (click)="cancelRdv(rdv.id)">Annuler</button>
                }
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  </section>
</div>
  `,
  styles: [`
    :host {
      --P: #1b7fc4; --PD: #0d5a96; --PL: #e8f4fd;
      --dark: #0f2744; --text: #3d4f61; --tl: #8899aa;
      --border: #e2ecf5; --bg: #f7fafd;
      --shadow-sm: 0 2px 8px rgba(15,39,68,.06);
      --shadow-md: 0 8px 32px rgba(15,39,68,.1);
      --shadow-lg: 0 20px 60px rgba(15,39,68,.14);
    }

    .prdv-page { background: var(--bg); min-height: 100vh; }

    /* ── HERO ── */
    .prdv-hero {
      position: relative; overflow: hidden;
      background: linear-gradient(140deg, #0d5a96 0%, #1b7fc4 45%, #1290b0 100%);
      padding: 80px 24px 100px; text-align: center;
    }
    .hero-bg-orbs { position: absolute; inset: 0; pointer-events: none; }
    .orb { position: absolute; border-radius: 50%; background: rgba(255,255,255,.06); animation: orbFloat 8s ease-in-out infinite; }
    .orb-1 { width: 360px; height: 360px; top: -100px; right: -60px; animation-delay: 0s; }
    .orb-2 { width: 250px; height: 250px; bottom: 10px; left: 5%; animation-delay: -3s; }
    .orb-3 { width: 180px; height: 180px; top: 20px; left: 35%; animation-delay: -5s; }
    @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.04)} }

    .hero-pill {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,.15); backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.3);
      color: white; font-size: 11px; font-weight: 700; letter-spacing: 1.8px;
      text-transform: uppercase; padding: 6px 16px; border-radius: 99px;
      margin-bottom: 20px;
    }
    .hero-pill-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #7eedc9; box-shadow: 0 0 6px #7eedc9;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }

    .prdv-title { font-size: 46px; font-weight: 900; color: white; letter-spacing: -1px; margin-bottom: 12px; }
    .title-accent { color: #7eedc9; }
    .prdv-sub { font-size: 15px; color: rgba(255,255,255,.8); }
    .prdv-sub strong { color: white; }

    .hero-wave { position: absolute; bottom: 0; left: 0; right: 0; line-height: 0; }
    .hero-wave svg { width: 100%; height: 60px; }

    /* ── BODY ── */
    .prdv-body  { padding: 32px 24px 80px; }
    .prdv-inner { max-width: 940px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }

    /* ── BOOKING PANEL ── */
    .booking-panel {
      background: white; border: 1px solid var(--border);
      border-radius: 20px; overflow: hidden;
      box-shadow: var(--shadow-sm); transition: box-shadow .3s;
    }
    .booking-panel.panel-open { box-shadow: var(--shadow-md); }
    .booking-panel-hd {
      display: flex; align-items: center; gap: 16px;
      background: linear-gradient(135deg, var(--PD), var(--P));
      padding: 22px 26px; cursor: pointer;
    }
    .bph-icon {
      width: 46px; height: 46px; border-radius: 12px;
      background: rgba(255,255,255,.2); flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; color: white;
    }
    .bph-texts { flex: 1; }
    .bph-title { font-size: 17px; font-weight: 800; color: white; }
    .bph-sub   { font-size: 12.5px; color: rgba(255,255,255,.75); margin-top: 2px; }
    .bph-toggle {
      display: flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 9px;
      background: rgba(255,255,255,.18); border: 1.5px solid rgba(255,255,255,.35);
      color: white; font-size: 13px; font-weight: 700; flex-shrink: 0;
      transition: all .2s;
    }
    .bph-toggle:hover { background: rgba(255,255,255,.28); }
    .toggle-label { white-space: nowrap; }

    @keyframes formIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:none} }

    .booking-form { padding: 28px 26px; display: flex; flex-direction: column; gap: 26px; animation: formIn .3s ease; }

    .step-block { display: flex; flex-direction: column; gap: 12px; }
    .step-label {
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; font-weight: 700; color: var(--dark);
    }
    .step-num {
      width: 26px; height: 26px; border-radius: 50%;
      background: linear-gradient(135deg, var(--P), var(--PD));
      color: white; font-size: 12px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      box-shadow: 0 3px 8px rgba(27,127,196,.4);
    }
    .pause-tag {
      margin-left: auto; font-size: 11px; font-weight: 600;
      color: #92400e; background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 99px; padding: 3px 12px;
    }

    .pub-input {
      width: 100%; max-width: 260px; padding: 11px 14px;
      border: 1.5px solid var(--border); border-radius: 10px;
      font-size: 14px; color: var(--dark); font-family: inherit;
      background: #f8fbfd; outline: none; transition: all .2s;
    }
    .pub-input:focus { border-color: var(--P); background: white; box-shadow: 0 0 0 4px rgba(27,127,196,.1); }

    .form-alert {
      display: flex; align-items: center; gap: 9px;
      padding: 10px 14px; border-radius: 9px; font-size: 13px;
    }
    .alert-warn { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }

    /* SLOTS */
    .slots-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .slot-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 9px 16px; border-radius: 9px;
      border: 1.5px solid var(--border); background: white;
      color: var(--text); font-size: 13px; font-weight: 600;
      cursor: pointer; font-family: inherit; transition: all .18s;
    }
    .slot-btn:hover:not(.slot-taken) {
      border-color: var(--P); background: var(--PL); color: var(--P);
      transform: translateY(-1px); box-shadow: 0 4px 12px rgba(27,127,196,.2);
    }
    .slot-sel {
      background: var(--P) !important; color: white !important;
      border-color: var(--P) !important;
      box-shadow: 0 4px 16px rgba(27,127,196,.4) !important;
      transform: translateY(-1px) !important;
    }
    .slot-taken { opacity: .45; cursor: not-allowed; background: #f5f5f5 !important; }
    .taken-badge { font-size: 9.5px; color: #dc2626; background: rgba(220,38,38,.1); border-radius: 4px; padding: 1px 5px; }

    /* TYPES */
    .types-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .type-btn {
      padding: 9px 20px; border-radius: 9px;
      border: 1.5px solid var(--border); background: white;
      color: var(--text); font-size: 13.5px; font-weight: 500;
      cursor: pointer; font-family: inherit; transition: all .18s;
    }
    .type-btn:hover { border-color: var(--P); color: var(--P); transform: translateY(-1px); }
    .type-sel { background: var(--PL); border-color: var(--P); color: var(--P); font-weight: 700; }

    /* RECAP */
    .booking-recap {
      display: flex; align-items: center; gap: 16px;
      background: linear-gradient(135deg, #e8f4fd, #d0eafb);
      border: 1.5px solid rgba(27,127,196,.25);
      border-radius: 14px; padding: 16px 20px;
    }
    .recap-ico {
      width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
      background: var(--P); color: white; font-size: 18px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(27,127,196,.4);
    }
    .recap-detail { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .recap-row { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--dark); }
    .recap-row svg { color: var(--P); flex-shrink: 0; }
    .confirm-btn {
      display: flex; align-items: center; gap: 8px;
      background: var(--P); color: white; border: none;
      padding: 11px 24px; border-radius: 10px;
      font-size: 14px; font-weight: 800; cursor: pointer;
      font-family: inherit; transition: all .22s; flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(27,127,196,.4);
    }
    .confirm-btn:hover { background: var(--PD); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,127,196,.5); }

    /* ── RDV SECTION ── */
    .rdv-section { display: flex; flex-direction: column; gap: 20px; }
    .rdv-section-hd { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .rdv-section-title { font-size: 24px; font-weight: 900; color: var(--dark); letter-spacing: -.3px; }

    .rdv-tabs {
      display: flex; gap: 4px; background: white;
      border: 1px solid var(--border); border-radius: 12px;
      padding: 4px; box-shadow: var(--shadow-sm);
    }
    .rdv-tab {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 16px; border-radius: 9px;
      font-size: 13px; font-weight: 600; color: var(--tl);
      border: none; background: none; cursor: pointer; font-family: inherit; transition: all .18s;
    }
    .rdv-tab:hover { color: var(--P); }
    .rdv-tab.active {
      background: var(--P); color: white;
      box-shadow: 0 3px 10px rgba(27,127,196,.35);
      transform: translateY(-1px);
    }
    .rtab-badge {
      font-size: 10px; background: rgba(255,255,255,.25); border-radius: 99px;
      padding: 1px 8px; font-weight: 700;
    }
    .rdv-tab:not(.active) .rtab-badge { background: var(--PL); color: var(--P); }

    /* EMPTY */
    .rdv-empty {
      text-align: center; padding: 56px 24px;
      background: white; border-radius: 18px;
      border: 2px dashed var(--border);
    }
    .rdv-empty-ico-wrap {
      width: 80px; height: 80px; border-radius: 50%;
      background: var(--PL); border: 2px solid rgba(27,127,196,.15);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; animation: floatIco 3s ease-in-out infinite;
    }
    @keyframes floatIco { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    .rdv-empty-ico   { font-size: 34px; }
    .rdv-empty-title { font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 16px; }
    .empty-new-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 22px; border-radius: 9px;
      background: var(--P); color: white; border: none;
      font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
      transition: all .2s; box-shadow: 0 4px 14px rgba(27,127,196,.35);
    }
    .empty-new-btn:hover { background: var(--PD); transform: translateY(-1px); }

    /* RDV CARDS */
    .rdv-list { display: flex; flex-direction: column; gap: 12px; }
    .rdv-card {
      display: flex; align-items: center;
      background: white; border: 1px solid var(--border); border-radius: 14px;
      overflow: hidden; box-shadow: var(--shadow-sm);
      transition: all .25s; animation: slideIn .4s var(--delay,0s) ease both;
    }
    @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
    .rdv-card:hover {
      transform: translateX(5px);
      box-shadow: var(--shadow-md); border-color: rgba(27,127,196,.25);
    }
    .rdc-status-bar { width: 5px; min-height: 78px; flex-shrink: 0; }
    .rsb-confirmed { background: linear-gradient(to bottom, #22c55e, #16a34a); }
    .rsb-pending   { background: linear-gradient(to bottom, #f59e0b, #d97706); }
    .rsb-done      { background: linear-gradient(to bottom, var(--P), var(--PD)); }
    .rsb-cancelled { background: linear-gradient(to bottom, #ef4444, #dc2626); }

    .rdc-date { padding: 16px 22px; min-width: 130px; flex-shrink: 0; }
    .rdc-time { font-size: 26px; font-weight: 900; color: var(--P); letter-spacing: -.5px; }
    .rdc-day  { font-size: 12px; color: var(--tl); font-weight: 600; margin-top: 3px; }
    .rdc-sep  { width: 1px; height: 50px; background: var(--border); flex-shrink: 0; }
    .rdc-info { flex: 1; padding: 16px 22px; }
    .rdc-type { font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
    .rdc-doctor { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--tl); }
    .rdc-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; padding: 16px 22px; flex-shrink: 0; }

    .status-badge { padding: 4px 13px; border-radius: 99px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
    .sb-confirmed { background: rgba(34,197,94,.1);  border: 1px solid rgba(34,197,94,.25);  color: #16a34a; }
    .sb-pending   { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.25); color: #d97706; }
    .sb-done      { background: var(--PL);           border: 1px solid rgba(27,127,196,.2);  color: var(--P); }
    .sb-cancelled { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2);   color: #dc2626; }

    .cancel-btn {
      font-size: 12px; font-weight: 700; color: #dc2626;
      background: rgba(220,38,38,.06); border: 1px solid rgba(220,38,38,.2);
      border-radius: 8px; padding: 5px 13px; cursor: pointer; font-family: inherit;
      transition: all .18s;
    }
    .cancel-btn:hover { background: rgba(220,38,38,.15); transform: scale(1.03); }

    @media (max-width: 640px) {
      .prdv-title { font-size: 34px; }
      .rdv-section-hd { flex-direction: column; align-items: flex-start; }
      .rdv-card { flex-wrap: wrap; }
      .booking-panel-hd { flex-wrap: wrap; }
    }
  `]
})
export class PatientRdvPublicComponent {
  rdvSvc = inject(RdvService);
  auth   = inject(AuthService);
  toast  = inject(ToastService);

  showForm  = signal(false);
  activeTab = signal('upcoming');
  minDate   = new Date().toISOString().slice(0, 10);

  booking = { date: '', time: '', type: 'Consultation' };

  readonly tabs  = [{ val:'upcoming', label:'À venir' }, { val:'past', label:'Passés' }, { val:'cancelled', label:'Annulés' }];
  readonly types = ['Consultation', 'Détartrage', 'Suivi', 'Urgence'];

  isSunday    = () => this.booking.date ? new Date(this.booking.date).getDay() === 0 : false;
  onDateChange() { this.booking.time = ''; }
  availableSlots = () => this.booking.date ? this.rdvSvc.getAvailableSlots(this.booking.date) : [];

  myRdvs = () => this.rdvSvc.getForPatient(this.auth.user()?.id ?? '');

  filteredRdvs = () => {
    const t = this.activeTab();
    return this.myRdvs().filter(r => {
      if (t === 'upcoming')  return r.status === 'confirmed' || r.status === 'pending';
      if (t === 'past')      return r.status === 'done';
      if (t === 'cancelled') return r.status === 'cancelled';
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  };

  countTab = (t: string) => this.myRdvs().filter(r => {
    if (t === 'upcoming')  return r.status === 'confirmed' || r.status === 'pending';
    if (t === 'past')      return r.status === 'done';
    if (t === 'cancelled') return r.status === 'cancelled';
    return false;
  }).length;

  statusLabel = (s: string) => ({ confirmed:'Confirmé', pending:'En attente', done:'Terminé', cancelled:'Annulé' }[s] ?? s);

  submitBooking() {
    const user = this.auth.user();
    if (!user) return;
    const result = this.rdvSvc.bookAppointment({
      patientId: user.id, patientName: user.name, patientPhone: user.phone,
      date: this.booking.date, time: this.booking.time, type: this.booking.type, status: 'pending',
    });
    if (result.success) {
      this.toast.success('Rendez-vous demandé !', result.message);
      this.booking = { date: '', time: '', type: 'Consultation' };
      this.showForm.set(false);
      this.activeTab.set('upcoming');
    } else {
      this.toast.error('Créneau indisponible', result.message);
    }
  }

  cancelRdv(id: string) {
    this.rdvSvc.cancelAppointment(id);
    this.toast.info('Rendez-vous annulé');
  }
}