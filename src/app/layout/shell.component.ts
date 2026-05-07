import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
<div class="shell">

  <!-- SIDEBAR -->
  <nav class="sidebar">
    <div class="sb-brand">
      <div class="sb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
      <div>
        <div class="sb-name">MediCore</div>
        <div class="sb-tag">Clinic Pro</div>
      </div>
    </div>

    <div class="sb-doctor">
      <div class="sb-doc-av">{{ auth.user()?.avatar }}</div>
      <div class="sb-doc-info">
        <div class="sb-doc-name">{{ auth.user()?.name }}</div>
        <div class="sb-doc-role">{{ auth.user()?.specialty }}</div>
      </div>
      <div class="sb-online"></div>
    </div>

    <div class="sb-body">
      <div class="sb-section">Général</div>
      @for (item of mainNav; track item.route) {
        <a class="sb-link" [routerLink]="item.route" routerLinkActive="sb-link-on">
          <div class="sb-ico" [innerHTML]="item.icon"></div>
          <span>{{ item.label }}</span>
          @if (item.badge) { <span class="sb-badge">{{ item.badge }}</span> }
        </a>
      }
      <div class="sb-section" style="margin-top:12px">Médical</div>
      @for (item of medNav; track item.route) {
        <a class="sb-link" [routerLink]="item.route" routerLinkActive="sb-link-on">
          <div class="sb-ico" [innerHTML]="item.icon"></div>
          <span>{{ item.label }}</span>
        </a>
      }
      <div class="sb-section" style="margin-top:12px">Admin</div>
      @for (item of adminNav; track item.route) {
        <a class="sb-link" [routerLink]="item.route" routerLinkActive="sb-link-on">
          <div class="sb-ico" [innerHTML]="item.icon"></div>
          <span>{{ item.label }}</span>
        </a>
      }
    </div>

    <div class="sb-foot">
      <button class="sb-theme" (click)="theme.toggle()" [title]="theme.dark() ? 'Mode clair' : 'Mode sombre'">
        @if (theme.dark()) { ☀️ Mode clair } @else { 🌙 Mode sombre }
      </button>
      <button class="sb-logout" (click)="auth.logout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Déconnexion
      </button>
    </div>
  </nav>

  <!-- MAIN -->
  <main class="shell-main">
    <div class="topbar">
      <div class="tb-date">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {{ today }}
      </div>
      <div class="tb-right">
        <button class="tb-theme-btn" (click)="theme.toggle()">
          {{ theme.dark() ? '☀️' : '🌙' }}
        </button>
        <button class="tb-notif">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="tb-notif-dot"></span>
        </button>
        <div class="tb-av">{{ auth.user()?.avatar }}</div>
      </div>
    </div>
    <div class="shell-content">
      <router-outlet/>
    </div>
  </main>

</div>
  `,
  styles: [`
    :host { display: contents; }
    .shell { display:flex; min-height:100vh; }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 240px; min-height: 100vh; position: fixed; left:0; top:0; bottom:0;
      background: var(--surface);
      border-right: 1px solid var(--border);
      backdrop-filter: blur(20px);
      display: flex; flex-direction: column;
      z-index: 100; overflow-y: auto;
      box-shadow: 2px 0 20px rgba(27,127,196,.06);
      transition: background .3s, border-color .3s;
    }

    .sb-brand {
      display:flex; align-items:center; gap:10px;
      padding: 20px 16px 14px;
      border-bottom: 1px solid var(--border);
    }
    .sb-logo {
      width:36px; height:36px; border-radius:10px; flex-shrink:0;
      background: linear-gradient(135deg,#1b7fc4,#0d4a80);
      display:flex; align-items:center; justify-content:center; color:#fff;
      box-shadow: 0 4px 14px rgba(27,127,196,.4);
    }
    .sb-name { font-size:16px; font-weight:800; color:var(--txt); }
    .sb-tag  { font-size:9px; color:var(--txt3); letter-spacing:1.2px; text-transform:uppercase; }

    .sb-doctor {
      display:flex; align-items:center; gap:9px;
      padding: 12px 14px;
      margin: 10px 8px;
      border-radius: 12px;
      background: var(--pl);
      border: 1px solid var(--border);
    }
    .sb-doc-av {
      width:34px; height:34px; border-radius:9px;
      background: linear-gradient(135deg,#1b7fc4,#0d4a80);
      display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:800; color:#fff; flex-shrink:0;
    }
    .sb-doc-name { font-size:12px; font-weight:700; color:var(--txt); }
    .sb-doc-role { font-size:10px; color:var(--txt3); margin-top:1px; }
    .sb-online { width:7px; height:7px; border-radius:50%; background:#22c55e; margin-left:auto; flex-shrink:0; }

    .sb-body { padding:8px; flex:1; }
    .sb-section { font-size:9.5px; font-weight:700; color:var(--txt3); text-transform:uppercase; letter-spacing:1.5px; padding:8px 10px 4px; }

    .sb-link {
      display:flex; align-items:center; gap:9px;
      padding: 9px 10px; border-radius:9px;
      text-decoration:none; color:var(--txt2);
      font-size:13px; font-weight:500;
      transition:all .15s; margin-bottom:1px;
      position:relative;
    }
    .sb-link:hover { background:var(--pl); color:var(--txt); }
    .sb-link-on {
      background: linear-gradient(135deg,rgba(27,127,196,.15),rgba(27,127,196,.08));
      color: var(--primary);
      font-weight: 700;
      border: 1px solid var(--border2);
    }
    .sb-link-on::before {
      content:''; position:absolute; left:0; top:20%; bottom:20%;
      width:3px; border-radius:99px; background:var(--primary);
    }
    .sb-ico { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sb-ico ::ng-deep svg { width:14px; height:14px; }
    .sb-badge { font-size:9px; font-weight:800; padding:2px 6px; border-radius:99px; background:var(--primary); color:#fff; margin-left:auto; }

    .sb-foot { padding:8px 8px 12px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:6px; }
    .sb-theme {
      display:flex; align-items:center; gap:7px; width:100%; padding:8px 10px;
      border-radius:9px; background:var(--surface2); border:1px solid var(--border);
      color:var(--txt2); font-size:12px; font-weight:600;
      cursor:pointer; font-family:'Outfit',sans-serif; transition:all .15s;
    }
    .sb-theme:hover { border-color:var(--primary); color:var(--primary); }
    .sb-logout {
      display:flex; align-items:center; gap:7px; width:100%; padding:8px 10px;
      border-radius:9px; background:none; border:1px solid rgba(239,68,68,.15);
      color:#ef4444; font-size:12px; font-weight:600;
      cursor:pointer; font-family:'Outfit',sans-serif; transition:all .15s;
    }
    .sb-logout:hover { background:rgba(239,68,68,.08); border-color:#ef4444; }

    /* ── TOPBAR ── */
    .shell-main { margin-left:240px; flex:1; display:flex; flex-direction:column; background:var(--bg); min-height:100vh; transition:background .3s; }
    .topbar {
      height:58px; display:flex; align-items:center; justify-content:space-between;
      padding:0 26px;
      background: var(--glass);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      position: sticky; top:0; z-index:50;
      transition: background .3s, border-color .3s;
    }
    .tb-date { display:flex; align-items:center; gap:7px; font-size:12px; color:var(--txt3); }
    .tb-right { display:flex; align-items:center; gap:8px; }
    .tb-theme-btn { width:32px; height:32px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); cursor:pointer; font-size:14px; transition:all .15s; }
    .tb-theme-btn:hover { border-color:var(--primary); }
    .tb-notif { width:32px; height:32px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; color:var(--txt2); transition:all .15s; }
    .tb-notif:hover { border-color:var(--primary); }
    .tb-notif-dot { position:absolute; top:7px; right:7px; width:6px; height:6px; border-radius:50%; background:#ef4444; border:1.5px solid var(--bg); }
    .tb-av { width:32px; height:32px; border-radius:9px; background:linear-gradient(135deg,#1b7fc4,#0d4a80); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#fff; cursor:pointer; }

    .shell-content { padding:24px 26px; flex:1; }
  `]
})
export class ShellComponent {
  auth  = inject(AuthService);
  theme = inject(ThemeService);

  today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  mainNav = [
    { label:'Tableau de bord', route:'/app/dashboard',    badge:0, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>` },
    { label:'Rendez-vous',     route:'/app/appointments', badge:3, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
    { label:'Patients',        route:'/app/patients',     badge:0, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
  ];
  medNav = [
    { label:'Ordonnances', route:'/app/ordonnances', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>` },
    { label:'Dossiers',    route:'/app/dossiers',    icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>` },
    { label:'Analytiques', route:'/app/analytiques', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
  ];
  adminNav = [
    { label:'Facturation', route:'/app/billing',    icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>` },
    { label:'Messages',    route:'/app/messages',   icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
    { label:'Paramètres',  route:'/app/parametres', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>` },
  ];
}