// src/app/features/doctor/doctor-shell/doctor-shell.component.ts
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Permissions } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { DomSanitizer } from '@angular/platform-browser';

type PermissionKey = keyof Permissions;

@Component({
  selector: 'app-doctor-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  template: `
<div class="shell-root" [class.dark]="theme.isDark()">

  <!-- ══════════════════ ANIMATED BG ══════════════════ -->
  <div class="med-bg">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="orb orb-4"></div>
    <svg class="ecg-svg" viewBox="0 0 1400 120" preserveAspectRatio="none">
      <polyline class="ecg-line" points="0,60 80,60 100,60 110,20 120,100 130,60 160,60 240,60 260,60 270,20 280,100 290,60 320,60 400,60 420,60 430,20 440,100 450,60 480,60 560,60 580,60 590,20 600,100 610,60 640,60 720,60 740,60 750,20 760,100 770,60 800,60 880,60 900,60 910,20 920,100 930,60 960,60 1040,60 1060,60 1070,20 1080,100 1090,60 1120,60 1200,60 1220,60 1230,20 1240,100 1250,60 1280,60 1400,60"/>
      <polyline class="ecg-line ecg-2" points="0,60 80,60 100,60 110,20 120,100 130,60 160,60 240,60 260,60 270,20 280,100 290,60 320,60 400,60 420,60 430,20 440,100 450,60 480,60 560,60 580,60 590,20 600,100 610,60 640,60 720,60 740,60 750,20 760,100 770,60 800,60 880,60 900,60 910,20 920,100 930,60 960,60 1040,60 1060,60 1070,20 1080,100 1090,60 1120,60 1200,60 1220,60 1230,20 1240,100 1250,60 1280,60 1400,60"/>
    </svg>
    <div class="dna-field">
      @for (d of dnaPoints; track d.id) {
        <div class="dna-dot" [style.left]="d.x+'%'" [style.top]="d.y+'%'" [style.width]="d.s+'px'" [style.height]="d.s+'px'" [style.animation-delay]="d.delay+'s'"></div>
      }
    </div>
    <div class="cross cross-a">✚</div>
    <div class="cross cross-b">✚</div>
    <div class="cross cross-c">✚</div>
    <div class="bg-grid"></div>
    <div class="bg-vignette"></div>
  </div>

  <!-- ══════════════════ SECRETARY MODAL ══════════════════ -->
  @if (showSecretaryModal()) {
    <div class="modal-veil" (click)="closeModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-rainbow"></div>
        <div class="modal-hd">
          <div class="modal-hd-left">
            <div class="modal-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <div>
              <div class="modal-title">Ajouter une Secrétaire</div>
              <div class="modal-sub">Créer un compte avec accès limité au cabinet</div>
            </div>
          </div>
          <button class="modal-x" (click)="closeModal()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="f-row">
            <div class="f-group">
              <label class="f-label">Prénom</label>
              <div class="f-inp-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><input class="f-inp" [(ngModel)]="newSec.firstName" placeholder="Amira" type="text"/></div>
            </div>
            <div class="f-group">
              <label class="f-label">Nom</label>
              <div class="f-inp-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><input class="f-inp" [(ngModel)]="newSec.lastName" placeholder="Ben Salem" type="text"/></div>
            </div>
          </div>
          <div class="f-group">
            <label class="f-label">Email professionnel</label>
            <div class="f-inp-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><input class="f-inp" [(ngModel)]="newSec.email" placeholder="amira@cabinet.tn" type="email"/></div>
          </div>
          <div class="f-group">
            <label class="f-label">Téléphone</label>
            <div class="f-inp-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.11h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16c.003.307.003.613 0 .92z"/></svg><input class="f-inp" [(ngModel)]="newSec.phone" placeholder="+216 XX XXX XXX" type="tel"/></div>
          </div>
          <div class="f-row">
            <div class="f-group">
              <label class="f-label">Mot de passe</label>
              <div class="f-inp-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><input class="f-inp" [(ngModel)]="newSec.password" placeholder="••••••••" type="password"/></div>
            </div>
            <div class="f-group">
              <label class="f-label">Confirmer</label>
              <div class="f-inp-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><input class="f-inp" [(ngModel)]="newSec.confirmPassword" placeholder="••••••••" type="password"/></div>
            </div>
          </div>
          <div class="perm-section">
            <div class="perm-title"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Autorisations d'accès</div>
            <div class="perm-grid">
              @for (p of permissions; track p.key) {
                <label class="perm-item" [class.on]="newSec.permissions[p.key]">
                  <input type="checkbox" [(ngModel)]="newSec.permissions[p.key]" style="display:none"/>
                  <div class="perm-chk">@if (newSec.permissions[p.key]) {<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>}</div>
                  <div class="perm-ico" [innerHTML]="sanitizer.bypassSecurityTrustHtml(p.icon)"></div>
                  <span>{{ p.label }}</span>
                </label>
              }
            </div>
          </div>
          @if (secError()) {
            <div class="f-error"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{{ secError() }}</div>
          }
        </div>
        <div class="modal-ft">
          <button class="btn-cncl" (click)="closeModal()">Annuler</button>
          <button class="btn-sv" (click)="saveSec()" [disabled]="saving()">
            @if (saving()) { <span class="spin"></span> Création... }
            @else { <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Créer le compte }
          </button>
        </div>
      </div>
    </div>
  }

  <!-- ══════════════════ SIDEBAR ══════════════════ -->
  <aside class="sidebar" [class.mob-open]="mobOpen()">
    <div class="sb-particles"><div class="sbp sbp1"></div><div class="sbp sbp2"></div><div class="sbp sbp3"></div></div>

    <!-- Brand -->
    <div class="sb-brand">
      <div class="sb-logo">
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
          <path d="M12 2v20M7 7h10M5 12h14M7 17h10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <div class="sb-logo-glow"></div>
      </div>
      <div>
        <div class="sb-name">Med<span class="sb-accent">Space</span></div>
        <div class="sb-tag"><span class="sb-tag-dot"></span>Cabinet Médical Pro</div>
      </div>
    </div>

    <!-- Nav -->
    <div class="sb-lbl">NAVIGATION</div>
    <nav class="sb-nav">
      @for (item of visibleNavItems(); track item.path; let i = $index) {
        <a class="sb-item" [routerLink]="item.path" routerLinkActive="sb-on"
           [style.animation-delay]="(0.03+i*0.05)+'s'" (click)="mobOpen.set(false)">
          <div class="sb-item-shine"></div>
          <div class="sb-item-ico" [innerHTML]="item.icon"></div>
          <span class="sb-item-lbl">{{ item.label }}</span>
          @if (item.badge && item.badge > 0) { <span class="sb-badge">{{ item.badge }}</span> }
          <svg class="sb-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      }
    </nav>

    <!-- Team Section - Doctor Only -->
    @if (auth.isDoctor()) {
      <div class="sb-hr"></div>
      <div class="sb-lbl">ÉQUIPE</div>

      @if (secretariesList().length > 0) {
        <div class="sb-team">
          @for (s of secretariesList(); track s.email) {
            <div class="sb-team-row">
              <div class="sb-team-av">{{ s.avatar }}</div>
              <div class="sb-team-info">
                <div class="sb-team-name">{{ s.name }}</div>
                <div class="sb-team-role">Secrétaire</div>
              </div>
              <div class="sb-online-dot" [class.on]="s.online"></div>
            </div>
          }
        </div>
      }

      <button class="sb-add" (click)="showSecretaryModal.set(true)">
        <div class="sb-add-ico"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
        Ajouter une secrétaire
      </button>
    }

    <div class="sb-hr"></div>
    <div class="sb-footer">
      <a routerLink="/" class="sb-fitem"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Site public</a>
      <button class="sb-fitem sb-out" (click)="auth.logout()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Déconnexion</button>
    </div>
  </aside>

  <!-- ══════════════════ MAIN ══════════════════ -->
  <div class="main-area">
    <header class="topbar">
      <div class="tb-left">
        <button class="mob-btn" (click)="mobOpen.set(!mobOpen())">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="tb-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="tb-search-inp" placeholder="Rechercher patient, RDV, ordonnance..." [(ngModel)]="searchQuery"/>
          <span class="tb-kbd">⌘K</span>
        </div>
      </div>
      <div class="tb-right">
        <div class="tb-live">
          <svg class="tb-ecg-svg" viewBox="0 0 120 32">
            <polyline class="tb-ecg-line" points="0,16 20,16 28,16 32,4 36,28 40,16 55,16 63,16 67,4 71,28 75,16 90,16 98,16 102,4 106,28 110,16 120,16"/>
          </svg>
          <span>Système actif</span>
        </div>
        <button class="tb-icon" (click)="theme.toggle()">
          @if (theme.isDark()) {<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>}
          @else {<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
        </button>
        <div class="tb-notif">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="notif-pip"></span>
        </div>
        <div class="tb-user">
          <div class="tb-av">{{ getInitials() }}</div>
          <div class="tb-uinfo">
            <div class="tb-uname">{{ auth.user()?.name ?? 'Utilisateur' }}</div>
            <div class="tb-urole">{{ getUserRole() }}</div>
          </div>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--txt4)"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </header>
    <main class="page-content"><router-outlet/></main>
  </div>
</div>

<!-- TOASTS -->
<div class="toast-stack">
  @for (t of toast.toasts(); track t.id) {
    <div class="toast" [class]="'t-'+t.type">
      <div class="toast-ico" [class]="'ti-'+t.type">
        @if (t.type==='success') {<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>}
        @else if (t.type==='error') {<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
        @else {<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>}
      </div>
      <div class="toast-body"><div class="toast-title">{{ t.title }}</div>@if (t.message) {<div class="toast-msg">{{ t.message }}</div>}</div>
      <button class="toast-x" (click)="toast.dismiss(t.id)">✕</button>
      <div class="toast-prog"></div>
    </div>
  }
</div>
@if (mobOpen()) { <div class="mob-veil" (click)="mobOpen.set(false)"></div> }
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

    :host { display: block; height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

    /* ══════════════════════════════════
       CSS VARIABLES
    ══════════════════════════════════ */
    .shell-root {
      --sb-w:    256px;
      --sb-1:    #2c3a69;
      --sb-2:    #588cc9;
      --sb-3:    #040d30;
      --sb-hov:  rgba(255,255,255,0.09);
      --sb-act:  rgba(255,255,255,0.15);
      --sb-txt:  rgba(255,255,255,0.55);
      --sb-brd:  rgba(255,255,255,0.07);

      --bg:      #edf1fb;
      --bg2:     #e2e9f8;
      --bg3:     #ffffff;
      --brd:     rgba(26,86,224,0.1);
      --brd2:    rgba(26,86,224,0.18);
      --txt:     #07193b;
      --txt2:    #213259;
      --txt3:    #4d576d;
      --txt4:    #8ba0bf;

      --P:       #1d5fe0;
      --P2:      #154dc8;
      --P3:      #4d87f5;
      --Pl:      rgba(29,95,224,0.08);
      --Pl2:     rgba(29,95,224,0.15);

      --em:      #0eb88a;
      --rose:    #f0426a;
      --amber:   #f0a020;
      --violet:  #7c3aed;

      --glass:       rgba(255,255,255,0.76);
      --glass-brd:   rgba(255,255,255,0.88);

      --sh1:     0 2px 12px rgba(29,95,224,0.08);
      --sh2:     0 8px 32px rgba(29,95,224,0.12);
      --sh3:     0 24px 72px rgba(7,25,59,0.2);
    }

    .shell-root.dark {
      --sb-1:    rgb(24, 53, 119);
      --sb-2:    #030912;
      --sb-3:    #020609;
      --sb-hov:  rgba(28, 80, 177, 0.1);
      --sb-act:  rgba(77,135,245,0.2);

      --bg:      #050d1f;
      --bg2:     #184078;
      --bg3:     #0d1e38;
      --brd:     rgba(77,135,245,0.08);
      --brd2:    rgba(77,135,245,0.15);
      --txt:     #d6e5ff;
      --txt2:    #8aaad2;
      --txt3:    #486080;
      --txt4:    #2c4262;

      --P:       #4d87f5;
      --P2:      #3370de;
      --P3:      #7aacff;
      --Pl:      rgba(17, 48, 107, 0.1);
      --Pl2:     rgba(77,135,245,0.18);

      --glass:       rgba(13,30,56,0.85);
      --glass-brd:   rgba(77,135,245,0.15);

      --sh1:     0 2px 12px rgba(0,0,0,0.32);
      --sh2:     0 8px 32px rgba(0,0,0,0.42);
      --sh3:     0 24px 72px rgba(31, 45, 111, 0.6);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .shell-root { display: flex; height: 100vh; overflow: hidden; position: relative; background: var(--bg); }

    /* ══════════════════════════════════
       ANIMATED BG
    ══════════════════════════════════ */
    .med-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; background: var(--bg); }

    .orb { position: absolute; border-radius: 50%; filter: blur(80px); }
    .orb-1 { width: 700px; height: 700px; top: -220px; left: calc(var(--sb-w) - 60px); background: radial-gradient(circle, rgba(29,95,224,0.13), rgba(124,58,237,0.07) 55%, transparent 70%); animation: o1 22s ease-in-out infinite; }
    .orb-2 { width: 500px; height: 500px; bottom: -80px; right: 60px; background: radial-gradient(circle, rgba(14,184,138,0.11), transparent 70%); animation: o2 28s ease-in-out infinite; }
    .orb-3 { width: 360px; height: 360px; top: 38%; left: 52%; background: radial-gradient(circle, rgba(240,66,106,0.07), transparent 70%); animation: o3 18s ease-in-out infinite; }
    .orb-4 { width: 260px; height: 260px; top: 8%; right: 4%; background: radial-gradient(circle, rgba(240,160,32,0.09), transparent 70%); animation: o1 15s ease-in-out infinite reverse; }
    .shell-root.dark .orb-1 { background: radial-gradient(circle, rgba(29,95,224,0.18), rgba(124,58,237,0.1) 55%, transparent 70%); }
    .shell-root.dark .orb-2 { background: radial-gradient(circle, rgba(14,184,138,0.14), transparent 70%); }
    @keyframes o1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(50px,-40px) scale(1.04)} 66%{transform:translate(-25px,28px) scale(0.97)} }
    @keyframes o2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-55px,-45px) scale(1.06)} }
    @keyframes o3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(38px,28px) scale(1.1)} }

    /* ECG */
    .ecg-svg { position: absolute; bottom: 60px; left: var(--sb-w); width: calc(100% - var(--sb-w)); height: 120px; opacity: 0.07; }
    .shell-root.dark .ecg-svg { opacity: 0.05; }
    .ecg-line { fill: none; stroke: var(--P); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 3200; stroke-dashoffset: 3200; animation: ecgA 5s ease-in-out infinite; }
    .ecg-2 { stroke: var(--em); opacity: 0.55; animation: ecgA 5s ease-in-out infinite 2.5s; }
    @keyframes ecgA { 0%{stroke-dashoffset:3200;opacity:0} 10%{opacity:1} 80%{stroke-dashoffset:0;opacity:0.8} 100%{stroke-dashoffset:0;opacity:0} }

    /* DNA */
    .dna-field { position: absolute; inset: 0; }
    .dna-dot { position: absolute; border-radius: 50%; background: var(--P); opacity: 0; animation: dnaP 7s ease-in-out infinite; }
    @keyframes dnaP { 0%,100%{opacity:0;transform:scale(0.4)} 50%{opacity:0.12;transform:scale(1)} }

    /* Crosses */
    .cross { position: absolute; color: var(--P); opacity: 0.05; user-select: none; animation: crossF 14s ease-in-out infinite; }
    .shell-root.dark .cross { opacity: 0.04; }
    .cross-a { font-size: 22px; top: 14%; right: 17%; animation-duration: 16s; }
    .cross-b { font-size: 16px; top: 54%; right: 7%; animation-duration: 11s; animation-delay: -5s; }
    .cross-c { font-size: 13px; top: 28%; right: 34%; animation-duration: 20s; animation-delay: -9s; }
    @keyframes crossF { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(12deg)} }

    .bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(29,95,224,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(29,95,224,0.025) 1px,transparent 1px); background-size: 60px 60px; }
    .shell-root.dark .bg-grid { background-image: linear-gradient(rgba(77,135,245,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(77,135,245,0.04) 1px,transparent 1px); }
    .bg-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at 65% 25%, rgba(255,255,255,0.28), transparent 55%); }
    .shell-root.dark .bg-vignette { background: radial-gradient(ellipse at 65% 25%, rgba(29,95,224,0.04), transparent 55%); }

    /* ══════════════════════════════════
       SIDEBAR
    ══════════════════════════════════ */
    .sidebar {
      width: var(--sb-w); flex-shrink: 0;
      background: linear-gradient(172deg, var(--sb-1) 0%, var(--sb-2) 55%, var(--sb-3) 100%);
      display: flex; flex-direction: column;
      padding: 0 11px 16px;
      overflow-y: auto; overflow-x: hidden;
      z-index: 200; position: relative;
      transition: transform .32s cubic-bezier(.4,0,.2,1);
      box-shadow: 4px 0 48px rgba(5,12,30,0.35);
    }
    .sidebar::-webkit-scrollbar { width: 3px; }
    .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
    .sidebar::after { content:''; position:absolute; top:0; right:0; width:1px; height:100%; background:linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06) 50%,transparent); }
    .sidebar::before { content:''; position:absolute; top:0; left:0; right:0; height:220px; background:radial-gradient(ellipse at 50% 0%,rgba(77,135,245,0.14),transparent 70%); pointer-events:none; }

    /* Particles */
    .sb-particles { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
    .sbp { position:absolute; border-radius:50%; background:rgba(255,255,255,0.03); animation:sbpF 16s ease-in-out infinite; }
    .sbp1 { width:200px; height:200px; top:-70px; left:-70px; animation-duration:20s; }
    .sbp2 { width:130px; height:130px; top:42%; right:-45px; animation-duration:13s; animation-delay:-6s; }
    .sbp3 { width:100px; height:100px; bottom:18%; left:-25px; animation-duration:22s; animation-delay:-11s; }
    @keyframes sbpF { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.18) translate(8px,-8px)} }

    /* Brand */
    .sb-brand { display:flex; align-items:center; gap:11px; padding:22px 6px 18px; border-bottom:1px solid var(--sb-brd); margin-bottom:14px; position:relative; z-index:1; }
    .sb-logo {
      width:42px; height:42px; border-radius:13px; flex-shrink:0;
      background:linear-gradient(135deg,rgba(77,135,245,0.5),rgba(124,58,237,0.4));
      border:1px solid rgba(255,255,255,0.2);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 6px 20px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.18);
      position:relative; overflow:hidden;
    }
    .sb-logo::before { content:''; position:absolute; top:0; left:0; right:0; height:50%; background:linear-gradient(180deg,rgba(255,255,255,0.14),transparent); }
    .sb-logo-glow { position:absolute; inset:0; background:radial-gradient(circle at 50% 50%,rgba(77,135,245,0.3),transparent 70%); animation:logoG 3s ease-in-out infinite; }
    @keyframes logoG { 0%,100%{opacity:0.6} 50%{opacity:1} }
    .sb-name { font-size:16px; font-weight:900; color:white; letter-spacing:-.6px; line-height:1; }
    .sb-accent { color:rgba(130,190,255,0.9); }
    .sb-tag { display:flex; align-items:center; gap:5px; font-size:9.5px; font-weight:600; color:rgba(255,255,255,0.38); margin-top:3px; letter-spacing:.02em; }
    .sb-tag-dot { width:5px; height:5px; border-radius:50%; background:var(--em); animation:tdot 2s ease-in-out infinite; flex-shrink:0; }
    @keyframes tdot { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(14,184,138,0.5)} 50%{opacity:.5;box-shadow:0 0 0 4px rgba(14,184,138,0)} }

    /* Nav */
    .sb-lbl { font-size:8.5px; font-weight:800; letter-spacing:.14em; color:rgba(255,255,255,0.24); padding:0 8px; margin-bottom:4px; position:relative; z-index:1; }
    .sb-nav { display:flex; flex-direction:column; gap:2px; margin-bottom:10px; position:relative; z-index:1; }
    .sb-item { display:flex; align-items:center; gap:10px; padding:10px 11px; border-radius:12px; color:var(--sb-txt); text-decoration:none; font-size:13px; font-weight:600; transition:all .22s cubic-bezier(0.34,1.56,0.64,1); animation:sbIn .4s ease both; position:relative; overflow:hidden; }
    @keyframes sbIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
    .sb-item-shine { position:absolute; inset:0; border-radius:12px; background:linear-gradient(135deg,rgba(255,255,255,0.09),transparent); opacity:0; transition:opacity .2s; }
    .sb-item:hover { color:white; background:var(--sb-hov); transform:translateX(4px); }
    .sb-item:hover .sb-item-shine { opacity:1; }
    .sb-on { color:white !important; background:var(--sb-act) !important; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12); }
    .sb-on .sb-item-shine { opacity:1; }
    .sb-on::before { content:''; position:absolute; left:0; top:18%; height:64%; width:3px; background:linear-gradient(180deg,#7aacff,var(--em)); border-radius:0 3px 3px 0; box-shadow:0 0 12px rgba(122,172,255,0.85); }
    .sb-item-ico { width:16px; height:16px; display:flex; align-items:center; flex-shrink:0; }
    .sb-item-ico ::ng-deep svg { width:16px; height:16px; }
    .sb-item-lbl { flex:1; }
    .sb-badge { font-size:9px; font-weight:800; padding:2px 6px; border-radius:99px; background:rgba(240,66,106,0.9); color:white; min-width:18px; text-align:center; box-shadow:0 2px 8px rgba(240,66,106,0.45); animation:badgePop .4s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes badgePop { from{transform:scale(0)} to{transform:scale(1)} }
    .sb-arrow { color:rgba(255,255,255,0.18); opacity:0; transition:all .2s; }
    .sb-item:hover .sb-arrow { opacity:1; transform:translateX(2px); }

    .sb-hr { height:1px; background:var(--sb-brd); margin:10px 0; position:relative; z-index:1; }

    /* Team */
    .sb-team { display:flex; flex-direction:column; gap:2px; margin-bottom:8px; position:relative; z-index:1; }
    .sb-team-row { display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:10px; transition:background .15s; cursor:pointer; }
    .sb-team-row:hover { background:var(--sb-hov); }
    .sb-team-av { width:28px; height:28px; border-radius:8px; flex-shrink:0; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.14); display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:800; color:white; }
    .sb-team-name { font-size:11.5px; font-weight:600; color:white; }
    .sb-team-role { font-size:9.5px; color:rgba(255,255,255,0.35); }
    .sb-team-info { flex:1; }
    .sb-online-dot { width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,0.15); }
    .sb-online-dot.on { background:var(--em); box-shadow:0 0 7px rgba(14,184,138,0.65); }

    /* Add sec */
    .sb-add { display:flex; align-items:center; gap:9px; width:100%; padding:9px 11px; border-radius:12px; background:rgba(255,255,255,0.05); border:1px dashed rgba(255,255,255,0.14); color:rgba(255,255,255,0.55); font-size:12px; font-weight:600; cursor:pointer; transition:all .22s; font-family:'Plus Jakarta Sans',sans-serif; margin-bottom:4px; position:relative; z-index:1; }
    .sb-add:hover { background:rgba(77,135,245,0.14); color:white; border-color:rgba(77,135,245,0.4); transform:translateY(-1px); }
    .sb-add-ico { width:20px; height:20px; border-radius:6px; flex-shrink:0; background:rgba(77,135,245,0.18); border:1px solid rgba(77,135,245,0.3); display:flex; align-items:center; justify-content:center; color:rgba(122,172,255,0.9); }

    /* Footer */
    .sb-footer { display:flex; flex-direction:column; gap:2px; position:relative; z-index:1; }
    .sb-fitem { display:flex; align-items:center; gap:9px; padding:8px 11px; border-radius:10px; border:none; background:transparent; cursor:pointer; color:rgba(255,255,255,0.38); font-size:12px; font-weight:600; text-decoration:none; transition:all .15s; font-family:'Plus Jakarta Sans',sans-serif; width:100%; }
    .sb-fitem:hover { background:var(--sb-hov); color:white; }
    .sb-out:hover { background:rgba(240,66,106,0.14) !important; color:#fca5a5 !important; }

    /* ══════════════════════════════════
       MAIN
    ══════════════════════════════════ */
    .main-area { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; position:relative; z-index:1; }

    /* TOPBAR */
    .topbar { display:flex; align-items:center; justify-content:space-between; padding:10px 24px; gap:16px; flex-shrink:0; background:var(--glass); backdrop-filter:blur(24px) saturate(160%); -webkit-backdrop-filter:blur(24px) saturate(160%); border-bottom:1px solid rgba(29,95,224,0.1); box-shadow:0 2px 20px rgba(29,95,224,0.07),inset 0 -1px 0 rgba(255,255,255,0.55); position:relative; }
    .shell-root.dark .topbar { border-bottom-color:rgba(77,135,245,0.1); box-shadow:0 2px 20px rgba(0,0,0,0.3); }
    .topbar::after { content:''; position:absolute; bottom:0; left:6%; right:6%; height:1px; background:linear-gradient(90deg,transparent,rgba(29,95,224,0.18),transparent); }
    .tb-left { display:flex; align-items:center; gap:12px; flex:1; }
    .tb-search { display:flex; align-items:center; gap:9px; background:rgba(29,95,224,0.05); border:1.5px solid rgba(29,95,224,0.1); border-radius:13px; padding:8px 14px; max-width:320px; width:100%; color:var(--txt4); transition:all .22s; }
    .tb-search:focus-within { border-color:var(--P); background:var(--glass); box-shadow:0 0 0 4px rgba(29,95,224,0.08); }
    .tb-search-inp { border:none; background:transparent; outline:none; font-size:13px; color:var(--txt2); width:100%; font-family:'Plus Jakarta Sans',sans-serif; }
    .tb-search-inp::placeholder { color:var(--txt4); }
    .tb-kbd { font-size:9px; font-weight:700; color:var(--txt4); background:rgba(29,95,224,0.06); padding:2px 6px; border-radius:5px; border:1px solid rgba(29,95,224,0.12); white-space:nowrap; }
    .tb-right { display:flex; align-items:center; gap:10px; flex-shrink:0; }

    /* Live ECG chip */
    .tb-live { display:flex; align-items:center; gap:8px; padding:6px 13px; border-radius:99px; background:rgba(14,184,138,0.1); border:1px solid rgba(14,184,138,0.2); font-size:11px; font-weight:700; color:var(--em); }
    .shell-root.dark .tb-live { color:#34d399; }
    .tb-ecg-svg { width:60px; height:16px; }
    .tb-ecg-line { fill:none; stroke:var(--em); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:400; stroke-dashoffset:400; animation:ecgTb 2.2s ease-in-out infinite; }
    @keyframes ecgTb { 0%,100%{stroke-dashoffset:400;opacity:0} 18%{opacity:1} 72%{stroke-dashoffset:0;opacity:1} 90%{opacity:0} }

    .tb-icon { width:36px; height:36px; border-radius:11px; background:var(--glass); border:1.5px solid var(--brd); display:flex; align-items:center; justify-content:center; color:var(--txt3); cursor:pointer; transition:all .22s; backdrop-filter:blur(8px); }
    .tb-icon:hover { color:var(--P); border-color:var(--P); background:var(--Pl); transform:translateY(-1px); box-shadow:0 4px 14px rgba(29,95,224,0.15); }
    .tb-notif { position:relative; width:36px; height:36px; border-radius:11px; background:var(--glass); border:1.5px solid var(--brd); display:flex; align-items:center; justify-content:center; color:var(--txt3); cursor:pointer; transition:all .22s; backdrop-filter:blur(8px); }
    .tb-notif:hover { color:var(--P); border-color:var(--P); transform:translateY(-1px); }
    .notif-pip { position:absolute; top:7px; right:7px; width:8px; height:8px; border-radius:50%; background:var(--rose); border:2px solid var(--bg3); animation:pip .5s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 0 6px rgba(240,66,106,0.5); }
    @keyframes pip { from{transform:scale(0)} to{transform:scale(1)} }
    .tb-user { display:flex; align-items:center; gap:9px; cursor:pointer; padding:5px 12px 5px 6px; border-radius:13px; background:var(--glass); border:1.5px solid var(--brd); backdrop-filter:blur(8px); transition:all .22s; }
    .tb-user:hover { border-color:var(--P); background:var(--Pl); }
    .tb-av { width:32px; height:32px; border-radius:9px; background:linear-gradient(135deg,var(--P),var(--violet)); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:white; box-shadow:0 3px 12px rgba(29,95,224,0.38); }
    .tb-uname { font-size:12.5px; font-weight:700; color:var(--txt); }
    .tb-urole { font-size:10px; color:var(--txt4); }
    .tb-uinfo { display:flex; flex-direction:column; }

    .mob-btn { display:none; width:36px; height:36px; border-radius:11px; background:var(--glass); border:1.5px solid var(--brd); align-items:center; justify-content:center; color:var(--txt2); cursor:pointer; backdrop-filter:blur(8px); }

    .page-content { flex:1; overflow-y:auto; overflow-x:hidden; padding:24px; background:transparent; }
    .page-content::-webkit-scrollbar { width:4px; }
    .page-content::-webkit-scrollbar-thumb { background:rgba(29,95,224,0.15); border-radius:99px; }
    .page-content::-webkit-scrollbar-thumb:hover { background:rgba(29,95,224,0.28); }

    /* ══════════════════════════════════
       MODAL
    ══════════════════════════════════ */
    .modal-veil { position:fixed; inset:0; z-index:9000; background:rgba(7,25,59,0.52); backdrop-filter:blur(10px) saturate(130%); display:flex; align-items:center; justify-content:center; padding:20px; animation:vIn .2s ease; }
    @keyframes vIn { from{opacity:0} to{opacity:1} }
    .modal-box { background:var(--glass); backdrop-filter:blur(36px) saturate(180%); -webkit-backdrop-filter:blur(36px) saturate(180%); border:1.5px solid var(--glass-brd); border-radius:24px; box-shadow:var(--sh3); width:100%; max-width:520px; max-height:90vh; overflow-y:auto; animation:mPop .38s cubic-bezier(.34,1.56,.64,1); position:relative; }
    @keyframes mPop { from{opacity:0;transform:scale(.91) translateY(18px)} to{opacity:1;transform:none} }
    .modal-rainbow { height:4px; background:linear-gradient(90deg,var(--P),var(--violet),var(--em)); border-radius:24px 24px 0 0; }
    .modal-hd { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1px solid var(--brd); }
    .modal-hd-left { display:flex; align-items:center; gap:12px; }
    .modal-ico { width:42px; height:42px; border-radius:13px; background:linear-gradient(135deg,var(--Pl2),var(--Pl)); color:var(--P); display:flex; align-items:center; justify-content:center; border:1px solid rgba(29,95,224,0.15); }
    .modal-title { font-size:15px; font-weight:800; color:var(--txt); }
    .modal-sub { font-size:11px; color:var(--txt4); margin-top:2px; }
    .modal-x { width:30px; height:30px; border-radius:9px; background:var(--bg2); border:1px solid var(--brd); color:var(--txt3); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
    .modal-x:hover { background:rgba(240,66,106,0.1); color:var(--rose); border-color:rgba(240,66,106,0.2); }
    .modal-body { padding:18px 22px; display:flex; flex-direction:column; gap:14px; }
    .f-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .f-group { display:flex; flex-direction:column; gap:5px; }
    .f-label { font-size:10.5px; font-weight:700; color:var(--txt3); text-transform:uppercase; letter-spacing:.08em; }
    .f-inp-wrap { display:flex; align-items:center; gap:9px; padding:10px 13px; border-radius:12px; background:rgba(29,95,224,0.04); border:1.5px solid rgba(29,95,224,0.1); transition:all .2s; color:var(--txt4); }
    .f-inp-wrap:focus-within { border-color:var(--P); background:var(--glass); box-shadow:0 0 0 4px rgba(29,95,224,0.08); color:var(--P); }
    .f-inp { border:none; background:transparent; outline:none; font-size:13px; color:var(--txt2); width:100%; font-family:'Plus Jakarta Sans',sans-serif; }
    .f-inp::placeholder { color:var(--txt4); }
    .perm-section { display:flex; flex-direction:column; gap:8px; }
    .perm-title { display:flex; align-items:center; gap:7px; font-size:10.5px; font-weight:700; color:var(--txt3); text-transform:uppercase; letter-spacing:.08em; }
    .perm-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
    .perm-item { display:flex; align-items:center; gap:8px; padding:9px 11px; border-radius:11px; cursor:pointer; border:1.5px solid rgba(29,95,224,0.1); background:rgba(29,95,224,0.03); transition:all .18s; }
    .perm-item.on { border-color:var(--P); background:var(--Pl); box-shadow:0 0 0 3px rgba(29,95,224,0.08); }
    .perm-chk { width:15px; height:15px; border-radius:5px; flex-shrink:0; border:2px solid rgba(29,95,224,0.2); display:flex; align-items:center; justify-content:center; transition:all .18s; }
    .perm-item.on .perm-chk { background:linear-gradient(135deg,var(--P),var(--violet)); border-color:transparent; color:white; }
    .perm-ico { width:14px; height:14px; display:flex; color:var(--txt4); }
    .perm-ico ::ng-deep svg { width:14px; height:14px; }
    .perm-item span { font-size:12px; font-weight:600; color:var(--txt2); }
    .f-error { display:flex; align-items:center; gap:7px; padding:10px 13px; border-radius:12px; background:rgba(240,66,106,0.07); border:1px solid rgba(240,66,106,0.2); color:var(--rose); font-size:12.5px; font-weight:600; }
    .modal-ft { display:flex; justify-content:flex-end; gap:10px; padding:16px 22px; border-top:1px solid var(--brd); }
    .btn-cncl { padding:10px 18px; border-radius:12px; background:var(--bg2); border:1.5px solid var(--brd); color:var(--txt3); font-size:13px; font-weight:600; cursor:pointer; transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif; }
    .btn-cncl:hover { color:var(--txt); border-color:var(--brd2); }
    .btn-sv { display:flex; align-items:center; gap:7px; padding:10px 20px; border-radius:12px; background:linear-gradient(135deg,var(--P),var(--violet)); color:white; font-size:13px; font-weight:700; border:none; cursor:pointer; box-shadow:0 4px 18px rgba(29,95,224,.38); transition:all .22s; font-family:'Plus Jakarta Sans',sans-serif; }
    .btn-sv:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(29,95,224,.48); }
    .btn-sv:disabled { opacity:.6; cursor:not-allowed; transform:none; }
    .spin { width:13px; height:13px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:white; animation:rot .7s linear infinite; }
    @keyframes rot { to{transform:rotate(360deg)} }

    /* ══════════════════════════════════
       TOASTS
    ══════════════════════════════════ */
    .toast-stack { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:10px; pointer-events:none; }
    .toast { display:flex; align-items:flex-start; gap:10px; padding:13px 15px 17px; border-radius:18px; min-width:290px; pointer-events:all; background:var(--glass); backdrop-filter:blur(28px) saturate(180%); border:1.5px solid var(--glass-brd); box-shadow:var(--sh3); animation:tSlide .38s cubic-bezier(.34,1.56,.64,1); position:relative; overflow:hidden; }
    @keyframes tSlide { from{opacity:0;transform:translateX(40px) scale(.93)} to{opacity:1;transform:none} }
    .toast-ico { width:24px; height:24px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
    .ti-success { background:rgba(14,184,138,.15); color:var(--em); }
    .ti-error { background:rgba(240,66,106,.12); color:var(--rose); }
    .ti-info { background:var(--Pl2); color:var(--P); }
    .toast-title { font-size:13px; font-weight:700; color:var(--txt); }
    .toast-msg { font-size:11.5px; color:var(--txt3); margin-top:2px; }
    .toast-body { flex:1; }
    .toast-x { background:none; border:none; cursor:pointer; color:var(--txt4); font-size:12px; transition:color .15s; }
    .toast-x:hover { color:var(--txt); }
    .toast-prog { position:absolute; bottom:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--P),var(--violet)); border-radius:0 0 18px 18px; animation:tProg 4s linear forwards; }
    @keyframes tProg { from{width:100%} to{width:0%} }

    /* ══════════════════════════════════
       MOBILE
    ══════════════════════════════════ */
    .mob-veil { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:199; animation:vIn .2s ease; }
    @media (max-width:768px) {
      .sidebar { position:fixed; top:0; left:0; bottom:0; transform:translateX(-110%); }
      .sidebar.mob-open { transform:none; box-shadow:8px 0 60px rgba(0,0,0,0.5); }
      .mob-btn { display:flex !important; }
      .tb-live, .tb-uinfo, .tb-kbd { display:none; }
      .page-content { padding:14px; }
      .f-row { grid-template-columns:1fr; }
    }
  `]
})
export class DoctorShellComponent implements OnInit {
  sanitizer = inject(DomSanitizer);
  auth = inject(AuthService);
  toast = inject(ToastService);
  theme = inject(ThemeService);
  router = inject(Router);

  mobOpen = signal(false);
  searchQuery = '';
  showSecretaryModal = signal(false);
  saving = signal(false);
  secError = signal('');

  newSec = this.emptySec();

  readonly dnaPoints = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 88 + 6,
    y: Math.random() * 80 + 10,
    s: Math.random() * 7 + 3,
    delay: Math.random() * 7
  }));

  // ═══════════════════════════════════════════════════════════
  //  COMPUTED SIGNALS
  // ═══════════════════════════════════════════════════════════

  secretariesList = computed(() => {
    return this.auth.getSecretaries();
  });

  visibleNavItems = computed(() => {
    const user = this.auth.user();
    const isDoctor = user?.role === 'Doctor';
    const permissions = user?.permissions;

    const allItems = [
      {
        path: '/doctor/dashboard',
        label: 'Tableau de bord',
        badge: 0,
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`
        ),
        permission: null
      },
      {
        path: '/doctor/rdv',
        label: 'Rendez-vous',
        badge: 5,
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg>`
        ),
        permission: 'rdv' as PermissionKey
      },
      {
        path: '/doctor/patients',
        label: 'Patients',
        badge: 0,
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        ),
        permission: 'patients' as PermissionKey
      },
      {
        path: '/doctor/ordonnances',
        label: 'Ordonnances',
        badge: 0,
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>`
        ),
        permission: 'ordonnances' as PermissionKey
      },
      {
        path: '/doctor/parametres',
        label: 'Paramètres',
        badge: 0,
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
        ),
        permission: 'parametres' as PermissionKey
      }
    ];

    // Si médecin, tout afficher
    if (isDoctor) {
      return allItems;
    }

    // Si secrétaire, filtrer selon permissions
    return allItems.filter(item => {
      if (!item.permission) return true; // Dashboard toujours visible
      return permissions?.[item.permission] === true;
    });
  });

  // ═══════════════════════════════════════════════════════════
  //  PERMISSIONS
  // ═══════════════════════════════════════════════════════════

  readonly permissions: { key: PermissionKey; label: string; icon: string }[] = [
    {
      key: 'rdv',
      label: 'Rendez-vous',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
    },
    {
      key: 'patients',
      label: 'Patients',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`
    },
    {
      key: 'ordonnances',
      label: 'Ordonnances',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>`
    },
    {
      key: 'paiements',
      label: 'Paiements',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
    },
    {
      key: 'urgences',
      label: 'Urgences',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
    },
    {
      key: 'parametres',
      label: 'Paramètres',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg>`
    }
  ];

  // ═══════════════════════════════════════════════════════════
  //  LIFECYCLE
  // ═══════════════════════════════════════════════════════════

  ngOnInit() {
    this.updateDate();
    setInterval(() => this.updateDate(), 60000);
  }

  updateDate() {
    // Date update if needed
  }

  // ═══════════════════════════════════════════════════════════
  //  MODAL MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  emptySec() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      permissions: {
        rdv: true,
        patients: true,
        ordonnances: false,
        paiements: false,
        parametres: false,
        urgences: false
      } as Permissions
    };
  }

  closeModal() {
    this.showSecretaryModal.set(false);
    this.newSec = this.emptySec();
    this.secError.set('');
  }

  saveSec() {
    const s = this.newSec;

    // Validation
    if (!s.firstName || !s.lastName || !s.email || !s.password) {
      this.secError.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (s.password !== s.confirmPassword) {
      this.secError.set('Les mots de passe ne correspondent pas.');
      return;
    }

    if (s.password.length < 6) {
      this.secError.set('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    this.saving.set(true);
    this.secError.set('');

    // Simuler un délai de création
    setTimeout(() => {
      const result = this.auth.createSecretaryAccount({
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phone: s.phone,
        password: s.password,
        permissions: s.permissions
      });

      if (result.success) {
        this.saving.set(false);
        this.closeModal();
        this.toast.success(
          'Secrétaire ajoutée',
          `${s.firstName} ${s.lastName} peut maintenant se connecter.`
        );
      } else {
        this.secError.set(result.error || 'Erreur lors de la création du compte.');
        this.saving.set(false);
      }
    }, 1200);
  }

  // ═══════════════════════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════════════════════

  getInitials(): string {
    return this.auth.getUserAvatar();
  }

  getUserRole(): string {
    const user = this.auth.user();
    if (user?.role === 'Doctor') return 'Médecin Praticien';
    if (user?.role === 'Secretary') return 'Secrétaire Médicale';
    if (user?.role === 'Patient') return 'Patient';
    return 'Utilisateur';
  }
}