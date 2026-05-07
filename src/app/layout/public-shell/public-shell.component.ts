import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
<!-- ═══════════════════ NAVBAR ═══════════════════ -->
<header class="navbar" [class.scrolled]="scrolled()">
  <div class="nav-wrap">

    <!-- BRAND -->
    <a routerLink="/" class="brand">
      <div class="brand-logo">
        <span class="brand-zk">ZK</span>
        <div class="brand-pulse"></div>
      </div>
      <div class="brand-text">
        <span class="brand-name">Dr. Zied Khaddar</span>
        <span class="brand-spec">Parodontologie &amp; Implantologie</span>
      </div>
    </a>

    <!-- DESKTOP NAV -->
    <nav class="nav-links">
      <a routerLink="/" routerLinkActive="nav-act" [routerLinkActiveOptions]="{exact:true}" class="nav-lnk nav-home">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        Accueil
      </a>
      <a routerLink="/apropos"       routerLinkActive="nav-act" class="nav-lnk">À propos</a>
      <a routerLink="/cas-cliniques" routerLinkActive="nav-act" class="nav-lnk">Cas cliniques</a>
      <a routerLink="/contact"       routerLinkActive="nav-act" class="nav-lnk">Contact</a>

      @if (auth.isLoggedIn() && auth.user()?.role === 'Patient') {
        <div class="nav-divider"></div>
        <a routerLink="/rendez-vous" routerLinkActive="nav-act" class="nav-lnk nav-patient-lnk nav-rdv-lnk">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Rendez-vous
        </a>
        <a routerLink="/dossier-medical" routerLinkActive="nav-act" class="nav-lnk nav-patient-lnk nav-dossier-lnk">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/>
          </svg>
          Dossier médical
        </a>
        <div class="nav-user-chip">
          <div class="nav-user-av">{{ auth.user()?.avatar }}</div>
          <span class="nav-user-name">{{ auth.user()?.name?.split(' ')?.[0] || '' }}</span>
        </div>
        <button class="nav-logout-btn" (click)="auth.logout()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      }

      @if (!auth.isLoggedIn()) {
        <a routerLink="/login" class="nav-login-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Connexion
        </a>
      }

      @if (auth.isLoggedIn() && auth.user()?.role === 'Doctor') {
        <a routerLink="/doctor/dashboard" class="nav-lnk nav-doctor-lnk">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          Tableau de bord
        </a>
        <button class="nav-logout-btn" (click)="auth.logout()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      }
    </nav>

    <!-- BURGER -->
    <button class="burger" (click)="mob.set(!mob())" [attr.aria-expanded]="mob()">
      <span [class.open]="mob()"></span>
      <span [class.open]="mob()"></span>
      <span [class.open]="mob()"></span>
    </button>
  </div>

  <!-- MOBILE MENU -->
  @if (mob()) {
    <div class="mob-menu" (click)="mob.set(false)">
      <div class="mob-menu-inner">
        <a routerLink="/"              class="mob-lnk">🏠 Accueil</a>
        <a routerLink="/apropos"       class="mob-lnk">👨‍⚕️ À propos</a>
        <a routerLink="/cas-cliniques" class="mob-lnk">🦷 Cas cliniques</a>
        <a routerLink="/contact"       class="mob-lnk">📬 Contact</a>

        @if (auth.isLoggedIn() && auth.user()?.role === 'Patient') {
          <div class="mob-sep"></div>
          <div class="mob-user-banner">
            <div class="mob-user-av">{{ auth.user()?.avatar }}</div>
            <div>
              <div class="mob-user-name">{{ auth.user()?.name }}</div>
              <div class="mob-user-role">Patient</div>
            </div>
          </div>
          <a routerLink="/rendez-vous"     class="mob-lnk mob-rdv-lnk">📅 Rendez-vous</a>
          <a routerLink="/dossier-medical" class="mob-lnk mob-dossier-lnk">📋 Dossier médical</a>
          <div class="mob-sep"></div>
          <button class="mob-logout" (click)="auth.logout()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </button>
        }

        @if (auth.isLoggedIn() && auth.user()?.role === 'Doctor') {
          <div class="mob-sep"></div>
          <a routerLink="/doctor/dashboard" class="mob-lnk">📊 Tableau de bord</a>
          <button class="mob-logout" (click)="auth.logout()">Déconnexion</button>
        }

        @if (!auth.isLoggedIn()) {
          <div class="mob-sep"></div>
          <a routerLink="/login" class="mob-login-btn">Se connecter</a>
        }
      </div>
    </div>
  }
</header>

<!-- PAGE -->
<main class="main-body"><router-outlet/></main>

<!-- ═══════════════════ FOOTER ═══════════════════ -->
<footer class="footer">
  <div class="footer-top-bar"></div>
  <div class="footer-inner">

    <!-- Brand col -->
    <div class="f-col f-brand">
      <div class="f-brand-row">
        <div class="f-brand-logo">
          <span style="font-size:14px;font-weight:900;color:white;letter-spacing:.5px">ZK</span>
        </div>
        <div>
          <div class="f-brand-name">Dr. Zied Khaddar</div>
          <div class="f-brand-title">Chirurgien Dentiste</div>
        </div>
      </div>
      <p class="f-brand-spec">Spécialiste en Parodontologie &amp; Implantologie Orale — Tunis Belvédère</p>
      <div class="f-socials">
        <a href="#" class="f-soc">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="#" class="f-soc">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
      </div>
    </div>

    <!-- Contact col -->
    <div class="f-col">
      <div class="f-col-title">
        <div class="f-col-title-ico">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        Coordonnées
      </div>
      <div class="f-contacts">
        <div class="f-contact-item">
          <div class="f-c-ico">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.3 19.79 19.79 0 0 1 1.61 2.68 2 2 0 0 1 3.58.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.05a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 15.5l.42 1.42z"/></svg>
          </div>
          <span>+216 71 846 556 · +216 20 551 124</span>
        </div>
        <div class="f-contact-item">
          <div class="f-c-ico">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <span>zied.khaddar&#64;gmail.com</span>
        </div>
        <div class="f-contact-item">
          <div class="f-c-ico">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <span>Tunis Belvédère, Tunisie</span>
        </div>
      </div>
    </div>

    <!-- Horaires col -->
    <div class="f-col">
      <div class="f-col-title">
        <div class="f-col-title-ico">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        Horaires
      </div>
      <div class="f-horaires">
        @for (h of horaires; track h.day) {
          <div class="f-h-row" [class.f-h-closed]="h.closed">
            <span class="f-h-day">{{ h.day }}</span>
            <span class="f-h-sep"></span>
            <span class="f-h-val">{{ h.closed ? 'Fermé' : h.hours }}</span>
          </div>
        }
      </div>
      <a routerLink="/rendez-vous" class="f-rdv-cta" *ngIf="auth.isLoggedIn() && auth.user()?.role==='Patient'">
        Prendre un rendez-vous
      </a>
      <a routerLink="/login" class="f-rdv-cta" *ngIf="!auth.isLoggedIn()">
        Prendre un rendez-vous
      </a>
    </div>

  </div>

  <div class="footer-bottom">
    <span>© 2026 Dr. Zied Khaddar · Tous droits réservés</span>
    <span class="footer-bottom-right">Parodontologie &amp; Implantologie · Tunis</span>
  </div>
</footer>

<!-- ═══════════════════ TOASTS ═══════════════════ -->
<div class="toast-stack">
  @for (t of toast.toasts(); track t.id) {
    <div class="toast-item" [class]="'toast-'+t.type">
      <div class="toast-icon-wrap" [class]="'ti-'+t.type">
        {{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ' }}
      </div>
      <div class="toast-body">
        <div class="toast-title">{{ t.title }}</div>
        @if (t.message) { <div class="toast-msg">{{ t.message }}</div> }
      </div>
      <button class="toast-close" (click)="toast.dismiss(t.id)">✕</button>
    </div>
  }
</div>
  `,
  styles: [`/* ═══════════════════════════════════════════════════════════════════
   DR. ZIED KHADDAR — PUBLIC SHELL STYLES
   Medical Glass Theme · Premium Navbar · Dark Footer
   ═══════════════════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

:host {
  --P:    #1a6eb5;
  --PD:   #0f4d8a;
  --PL:   #daeeff;
  --teal: #0fb8c9;
  --dark: #071829;
  --text: #1e3a54;
  --tl:   #6b8fa8;
  --border: #dce8f5;
  --nav-h: 72px;
  font-family: 'DM Sans', sans-serif;
}

/* ══════════════ NAVBAR ══════════════ */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(26, 110, 181, 0.1);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.96);
  border-bottom-color: rgba(26, 110, 181, 0.18);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.9) inset,
    0 8px 40px rgba(7, 24, 41, 0.1);
}

/* Animated top accent line */
.navbar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--P), var(--teal), #67e8f9, var(--P));
  background-size: 200% auto;
  animation: navAccent 5s linear infinite;
}

@keyframes navAccent {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.nav-wrap {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 28px;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* ── Brand ── */
.brand {
  display: flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.brand:hover { transform: translateY(-1px); }

.brand-logo {
  position: relative;
  width: 46px; height: 46px;
  border-radius: 13px;
  background: linear-gradient(135deg, var(--P) 0%, var(--PD) 60%, #0a2540 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(26, 110, 181, 0.45);
  overflow: hidden;
}

.brand-logo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
}

.brand-zk {
  font-size: 15px;
  font-weight: 900;
  color: white;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
  font-family: 'DM Sans', sans-serif;
}

.brand-pulse {
  position: absolute;
  inset: -3px;
  border-radius: 16px;
  border: 2px solid rgba(26, 110, 181, 0.35);
  animation: brandPulse 3.5s ease-in-out infinite;
}

@keyframes brandPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.9; transform: scale(1.06); }
}

.brand-text { display: flex; flex-direction: column; }

.brand-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--dark);
  line-height: 1.2;
  letter-spacing: -0.2px;
}

.brand-spec {
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--tl);
  margin-top: 2px;
}

/* ── Nav Links ── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
  justify-content: flex-end;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-links::-webkit-scrollbar { display: none; }

.nav-lnk {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 15px;
  height: var(--nav-h);
  font-size: 13.5px;
  font-weight: 500;
  color: #3d5166;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
  transition: color 0.22s;
}

.nav-lnk::after {
  content: '';
  position: absolute;
  bottom: 0; left: 15px; right: 15px;
  height: 2.5px;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(90deg, var(--P), var(--teal));
  transform: scaleX(0);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.nav-lnk:hover { color: var(--P); }
.nav-lnk:hover::after { transform: scaleX(1); }

.nav-act { color: var(--P) !important; font-weight: 700; }
.nav-act::after { transform: scaleX(1) !important; }

.nav-home {
  background: linear-gradient(135deg, var(--P), var(--PD));
  color: white !important;
  border-radius: 0;
  margin-right: 6px;
  position: relative;
  overflow: hidden;
}

.nav-home::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
}

.nav-home::after { display: none; }

.nav-home:hover {
  background: linear-gradient(135deg, var(--PD), #0a3a6e) !important;
  color: white !important;
}

.nav-divider {
  width: 1px; height: 24px;
  background: var(--border);
  margin: 0 6px;
  flex-shrink: 0;
}

.nav-patient-lnk { font-weight: 600; }
.nav-rdv-lnk     { color: var(--P) !important; }
.nav-rdv-lnk::after { background: linear-gradient(90deg, var(--P), var(--teal)); }
.nav-dossier-lnk  { color: var(--teal) !important; }
.nav-dossier-lnk::after { background: linear-gradient(90deg, var(--teal), #67e8f9); }
.nav-doctor-lnk   { color: #7c3aed !important; font-weight: 600; }
.nav-doctor-lnk::after { background: linear-gradient(90deg, #7c3aed, #a855f7); }

.nav-user-chip {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 10px;
  height: var(--nav-h);
  flex-shrink: 0;
}

.nav-user-av {
  width: 34px; height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--P), var(--teal));
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: white;
  box-shadow: 0 4px 12px rgba(26, 110, 181, 0.45);
}

.nav-user-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--dark);
  white-space: nowrap;
}

.nav-login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--P), var(--PD));
  color: white;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 18px rgba(26, 110, 181, 0.4);
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.nav-login-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
}

.nav-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(26, 110, 181, 0.55);
}

.nav-logout-btn {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(220, 38, 38, 0.06);
  border: 1.5px solid rgba(220, 38, 38, 0.18);
  color: #dc2626;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-left: 6px;
}

.nav-logout-btn:hover {
  background: rgba(220, 38, 38, 0.12);
  border-color: rgba(220, 38, 38, 0.35);
  transform: scale(1.08);
}

/* ── Burger ── */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.burger span {
  width: 22px; height: 2px;
  background: var(--P);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

.burger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.burger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Mobile Menu ── */
.mob-menu {
  position: fixed;
  top: var(--nav-h); left: 0; right: 0; bottom: 0;
  z-index: 999;
  background: rgba(7, 24, 41, 0.5);
  backdrop-filter: blur(6px);
  animation: fadeIn 0.22s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.mob-menu-inner {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  border-radius: 0 0 22px 22px;
  padding: 14px 18px 24px;
  box-shadow: 0 24px 60px rgba(7, 24, 41, 0.22);
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: slideDown 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideDown {
  from { transform: translateY(-14px); opacity: 0; }
  to   { transform: none; opacity: 1; }
}

.mob-lnk {
  padding: 12px 18px;
  border-radius: 11px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  transition: all 0.18s;
}

.mob-lnk:hover { background: var(--PL); color: var(--P); }

.mob-rdv-lnk     { color: var(--P); font-weight: 700; }
.mob-dossier-lnk { color: var(--teal); font-weight: 700; }

.mob-sep { height: 1px; background: var(--border); margin: 6px 0; }

.mob-user-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #071829, #0f2d4a);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 8px;
}

.mob-user-av {
  width: 40px; height: 40px;
  border-radius: 11px;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--P), var(--teal));
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  font-weight: 900;
  color: white;
}

.mob-user-name { font-size: 14px; font-weight: 700; color: white; }

.mob-user-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 3px;
}

.mob-login-btn {
  display: block;
  padding: 13px;
  text-align: center;
  background: linear-gradient(135deg, var(--P), var(--PD));
  color: white;
  border-radius: 11px;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 6px 18px rgba(26, 110, 181, 0.4);
}

.mob-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 11px;
  background: rgba(220, 38, 38, 0.06);
  border: 1.5px solid rgba(220, 38, 38, 0.18);
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.18s;
}

.mob-logout:hover { background: rgba(220, 38, 38, 0.1); }

@media (max-width: 1040px) {
  .nav-links { display: none; }
  .burger { display: flex; }
}

/* ══════════════ MAIN ══════════════ */
.main-body { margin-top: var(--nav-h); }

/* ══════════════ FOOTER ══════════════ */
.footer {
  background: linear-gradient(160deg, #030d1a 0%, #071829 50%, #030d1a 100%);
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 80% at 10% 50%, rgba(26, 110, 181, 0.06), transparent),
    radial-gradient(ellipse 40% 80% at 90% 50%, rgba(15, 184, 201, 0.04), transparent);
  pointer-events: none;
}

.footer-top-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--P), var(--teal), #67e8f9, var(--teal), var(--P));
  background-size: 200% auto;
  animation: navAccent 6s linear infinite;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 230px 1fr 220px;
  gap: 48px;
  padding: 52px 28px 44px;
  position: relative;
  z-index: 1;
}

/* ── Brand col ── */
.f-brand-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.f-brand-logo {
  width: 44px; height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--P), var(--PD));
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 18px rgba(26, 110, 181, 0.4);
}

.f-brand-name {
  font-size: 15px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.f-brand-title {
  font-size: 11px;
  color: var(--P);
  margin-top: 2px;
  letter-spacing: 0.5px;
}

.f-brand-spec {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.7;
  margin-bottom: 18px;
}

.f-socials { display: flex; gap: 10px; }

.f-soc {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.f-soc:hover {
  background: rgba(26, 110, 181, 0.3);
  border-color: rgba(26, 110, 181, 0.5);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(26, 110, 181, 0.3);
}

/* ── Column titles ── */
.f-col-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  font-family: 'DM Sans', sans-serif;
}

.f-col-title-ico {
  width: 32px; height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(26, 110, 181, 0.5), rgba(15, 184, 201, 0.3));
  border: 1px solid rgba(26, 110, 181, 0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ── Contacts ── */
.f-contacts { display: flex; flex-direction: column; gap: 14px; }

.f-contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.f-c-ico {
  width: 30px; height: 30px;
  border-radius: 8px;
  flex-shrink: 0;
  background: rgba(26, 110, 181, 0.12);
  border: 1px solid rgba(26, 110, 181, 0.2);
  display: flex; align-items: center; justify-content: center;
  color: #60a5fa;
}

/* ── Horaires ── */
.f-horaires {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 18px;
}

.f-h-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.15s;
}

.f-h-row:last-child { border-bottom: none; }

.f-h-row:hover {
  padding-left: 4px;
}

.f-h-day {
  font-weight: 700;
  color: white;
  min-width: 32px;
  font-size: 12px;
  letter-spacing: 0.3px;
}

.f-h-sep {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

.f-h-val {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.f-h-closed .f-h-day { color: rgba(255, 255, 255, 0.4); }
.f-h-closed .f-h-val { color: #f87171; font-weight: 600; }

.f-rdv-cta {
  display: block;
  padding: 11px 18px;
  text-align: center;
  background: linear-gradient(135deg, var(--P), var(--PD));
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 18px rgba(26, 110, 181, 0.4);
  position: relative;
  overflow: hidden;
}

.f-rdv-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
}

.f-rdv-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(26, 110, 181, 0.55);
}

.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.22);
  position: relative;
  z-index: 1;
}

.footer-bottom-right { color: rgba(255, 255, 255, 0.15); }

@media (max-width: 1100px) {
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
}

@media (max-width: 600px) {
  .footer-inner { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 6px; text-align: center; }
}

/* ══════════════ TOASTS ══════════════ */
.toast-stack {
  position: fixed;
  bottom: 28px; right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px 20px;
  min-width: 290px; max-width: 370px;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0,0,0,0.04);
  animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes toastIn {
  from { transform: translateX(40px) scale(0.9); opacity: 0; }
  to   { transform: none; opacity: 1; }
}

.toast-success { border-left: 3px solid #22c55e; }
.toast-error   { border-left: 3px solid #ef4444; }
.toast-info    { border-left: 3px solid var(--P); }

.toast-icon-wrap {
  width: 26px; height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  font-weight: 900;
  color: white;
}

.ti-success { background: linear-gradient(135deg, #22c55e, #16a34a); box-shadow: 0 4px 12px rgba(34,197,94,.4); }
.ti-error   { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 12px rgba(239,68,68,.4); }
.ti-info    { background: linear-gradient(135deg, var(--P), var(--teal)); box-shadow: 0 4px 12px rgba(26,110,181,.4); }

.toast-body { flex: 1; }

.toast-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e2a38;
}

.toast-msg {
  font-size: 12px;
  color: #8899aa;
  margin-top: 3px;
  line-height: 1.5;
}

.toast-close {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  transition: color 0.15s;
  line-height: 1;
}

.toast-close:hover { color: #666; }
`]
})
export class PublicShellComponent {
  auth  = inject(AuthService);
  toast = inject(ToastService);
  scrolled = signal(false);
  mob      = signal(false);

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 30); }

  readonly horaires = [
    { day:'Lun', hours:'09:00 – 19:00', closed:false },
    { day:'Mar', hours:'09:00 – 19:00', closed:false },
    { day:'Mer', hours:'09:00 – 19:00', closed:false },
    { day:'Jeu', hours:'09:00 – 19:00', closed:false },
    { day:'Ven', hours:'09:00 – 19:00', closed:false },
    { day:'Sam', hours:'08:00 – 14:00', closed:false },
    { day:'Dim', hours:'Fermé',          closed:true  },
  ];
}