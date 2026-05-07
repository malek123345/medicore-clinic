import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="pm-page">

  <!-- HEADER -->
  <div class="pm-header">
    <div class="pm-header-left">
      <div class="pm-hico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
        <div class="pm-hglow"></div>
      </div>
      <div>
        <h1 class="pm-title">Paramètres</h1>
        <p class="pm-sub">Configurez votre espace MediCore</p>
      </div>
    </div>
    <button class="pm-btn-save" (click)="saveAll()">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
      Sauvegarder
      <div class="pm-shine"></div>
    </button>
  </div>

  <!-- LAYOUT: sidebar nav + content -->
  <div class="pm-layout">

    <!-- NAV -->
    <nav class="pm-nav">
      @for (s of sections; track s.key) {
        <button class="pm-nav-item" [class.pm-nav-on]="activeSection()===s.key" (click)="activeSection.set(s.key)">
          <div class="pm-nav-ico" [innerHTML]="s.icon" [style.color]="activeSection()===s.key?'#38bdf8':'#3d6480'"></div>
          <span>{{ s.label }}</span>
          @if (activeSection()===s.key) { <div class="pm-nav-accent"></div> }
        </button>
      }
    </nav>

    <!-- CONTENT -->
    <div class="pm-content">

      <!-- ── PROFIL ── -->
      @if (activeSection()==='profil') {
        <div class="pm-section">
          <div class="pm-section-title">Profil médecin</div>

          <div class="pm-avatar-zone">
            <div class="pm-avatar">
              <div class="pm-av-initials">MD</div>
              <div class="pm-av-ring"></div>
            </div>
            <div>
              <div class="pm-av-name">Dr. Marie Dupont</div>
              <div class="pm-av-role">Cardiologue · Bloc B</div>
              <button class="pm-btn-sm">Changer la photo</button>
            </div>
          </div>

          <div class="pm-form-grid">
            <div class="pm-fg"><label class="pm-fl">PRÉNOM</label><input class="pm-fi" type="text" value="Marie"></div>
            <div class="pm-fg"><label class="pm-fl">NOM</label><input class="pm-fi" type="text" value="Dupont"></div>
            <div class="pm-fg"><label class="pm-fl">EMAIL</label><input class="pm-fi" type="email" value="dr.dupont@medicore.tn"></div>
            <div class="pm-fg"><label class="pm-fl">TÉLÉPHONE</label><input class="pm-fi" type="tel" value="+216 71 000 000"></div>
            <div class="pm-fg"><label class="pm-fl">SPÉCIALITÉ</label>
              <select class="pm-fi"><option>Cardiologie</option><option>Neurologie</option><option>Pédiatrie</option><option>Générale</option></select>
            </div>
            <div class="pm-fg"><label class="pm-fl">BLOC / SERVICE</label><input class="pm-fi" type="text" value="Bloc B — Étage 3"></div>
            <div class="pm-fg pm-fg-full"><label class="pm-fl">BIO / PRÉSENTATION</label>
              <textarea class="pm-fi pm-ta" rows="3" placeholder="Votre présentation pour les patients…">Cardiologue avec 15 ans d'expérience. Spécialisée en cardiologie interventionnelle.</textarea>
            </div>
          </div>
        </div>
      }

      <!-- ── CLINIQUE ── -->
      @if (activeSection()==='clinique') {
        <div class="pm-section">
          <div class="pm-section-title">Informations de la clinique</div>
          <div class="pm-form-grid">
            <div class="pm-fg"><label class="pm-fl">NOM DE LA CLINIQUE</label><input class="pm-fi" type="text" value="MediCore Clinic"></div>
            <div class="pm-fg"><label class="pm-fl">NUMÉRO RPPS</label><input class="pm-fi" type="text" value="10003456789"></div>
            <div class="pm-fg pm-fg-full"><label class="pm-fl">ADRESSE</label><input class="pm-fi" type="text" value="12 Avenue Habib Bourguiba, Sfax 3000"></div>
            <div class="pm-fg"><label class="pm-fl">TÉLÉPHONE</label><input class="pm-fi" type="tel" value="+216 74 000 000"></div>
            <div class="pm-fg"><label class="pm-fl">EMAIL CLINIQUE</label><input class="pm-fi" type="email" value="contact@medicore.tn"></div>
            <div class="pm-fg"><label class="pm-fl">SITE WEB</label><input class="pm-fi" type="url" value="www.medicore.tn"></div>
            <div class="pm-fg"><label class="pm-fl">HORAIRES D'OUVERTURE</label><input class="pm-fi" type="text" value="Lun-Ven 08:00 - 18:00"></div>
          </div>

          <div class="pm-divider"></div>
          <div class="pm-section-sub">Logo et branding</div>
          <div class="pm-logo-zone">
            <div class="pm-logo-preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" width="28" height="28"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <div style="font-size:13px;color:var(--txt2);margin-bottom:8px">Logo actuel · MediCore</div>
              <button class="pm-btn-sm">Changer le logo</button>
            </div>
          </div>
        </div>
      }

      <!-- ── NOTIFICATIONS ── -->
      @if (activeSection()==='notifications') {
        <div class="pm-section">
          <div class="pm-section-title">Notifications</div>
          <div class="pm-notif-list">
            @for (n of notifSettings; track n.key) {
              <div class="pm-notif-row">
                <div class="pm-notif-ico" [style.background]="n.color+'18'" [style.color]="n.color" [innerHTML]="n.icon"></div>
                <div class="pm-notif-info">
                  <div class="pm-notif-label">{{ n.label }}</div>
                  <div class="pm-notif-sub">{{ n.sub }}</div>
                </div>
                <div class="pm-notif-toggles">
                  <div class="pm-tog-item">
                    <span class="pm-tog-lbl">Email</span>
                    <div class="pm-toggle" [class.pm-tog-on]="n.email" (click)="n.email=!n.email">
                      <div class="pm-tog-thumb"></div>
                    </div>
                  </div>
                  <div class="pm-tog-item">
                    <span class="pm-tog-lbl">SMS</span>
                    <div class="pm-toggle" [class.pm-tog-on]="n.sms" (click)="n.sms=!n.sms">
                      <div class="pm-tog-thumb"></div>
                    </div>
                  </div>
                  <div class="pm-tog-item">
                    <span class="pm-tog-lbl">Push</span>
                    <div class="pm-toggle" [class.pm-tog-on]="n.push" (click)="n.push=!n.push">
                      <div class="pm-tog-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ── SÉCURITÉ ── -->
      @if (activeSection()==='securite') {
        <div class="pm-section">
          <div class="pm-section-title">Sécurité & Accès</div>

          <div class="pm-sec-block">
            <div class="pm-sec-hd">
              <div class="pm-sec-ico" style="background:rgba(14,165,201,.12);color:#38bdf8">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div><div class="pm-sec-title">Mot de passe</div><div class="pm-sec-sub">Dernière modification: il y a 30 jours</div></div>
            </div>
            <div class="pm-form-grid">
              <div class="pm-fg"><label class="pm-fl">MOT DE PASSE ACTUEL</label><input class="pm-fi" type="password" placeholder="••••••••"></div>
              <div></div>
              <div class="pm-fg"><label class="pm-fl">NOUVEAU MOT DE PASSE</label><input class="pm-fi" type="password" placeholder="Min. 8 caractères"></div>
              <div class="pm-fg"><label class="pm-fl">CONFIRMER</label><input class="pm-fi" type="password" placeholder="Répéter le mot de passe"></div>
            </div>
            <button class="pm-btn-action">Mettre à jour le mot de passe</button>
          </div>

          <div class="pm-divider"></div>

          <div class="pm-sec-block">
            <div class="pm-sec-hd">
              <div class="pm-sec-ico" style="background:rgba(139,92,246,.12);color:#a78bfa">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div><div class="pm-sec-title">Double authentification (2FA)</div><div class="pm-sec-sub">Sécurisez votre compte avec un code SMS ou une app</div></div>
              <div class="pm-toggle pm-tog-on" style="margin-left:auto">
                <div class="pm-tog-thumb"></div>
              </div>
            </div>
          </div>

          <div class="pm-divider"></div>

          <div class="pm-sec-block">
            <div class="pm-sec-hd">
              <div class="pm-sec-ico" style="background:rgba(245,158,11,.1);color:#f59e0b">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              </div>
              <div><div class="pm-sec-title">Sessions actives</div><div class="pm-sec-sub">2 appareils connectés</div></div>
              <button class="pm-btn-sm pm-btn-danger">Déconnecter tout</button>
            </div>
            @for (sess of sessions; track sess.device) {
              <div class="pm-session-row">
                <div class="pm-session-ico" [innerHTML]="sess.icon"></div>
                <div class="pm-session-info">
                  <div class="pm-session-device">{{ sess.device }}</div>
                  <div class="pm-session-meta">{{ sess.ip }} · {{ sess.time }}</div>
                </div>
                @if (sess.current) { <span class="pm-session-badge">Actuel</span> }
                @else { <button class="pm-btn-sm pm-btn-danger">Déconnecter</button> }
              </div>
            }
          </div>
        </div>
      }

      <!-- ── APPARENCE ── -->
      @if (activeSection()==='apparence') {
        <div class="pm-section">
          <div class="pm-section-title">Apparence & Thème</div>

          <div class="pm-section-sub">Thème</div>
          <div class="pm-theme-grid">
            @for (t of themes; track t.key) {
              <div class="pm-theme-card" [class.pm-theme-on]="activeTheme()===t.key" (click)="activeTheme.set(t.key)">
                <div class="pm-theme-preview" [style.background]="t.bg">
                  <div class="pm-theme-sidebar" [style.background]="t.sb"></div>
                  <div class="pm-theme-content">
                    <div class="pm-theme-bar" [style.background]="t.acc"></div>
                    <div class="pm-theme-bars">
                      @for (b of [1,2,3]; track b) {
                        <div class="pm-theme-line" [style.background]="t.txt+'40'"></div>
                      }
                    </div>
                  </div>
                </div>
                <div class="pm-theme-label">{{ t.name }}</div>
                @if (activeTheme()===t.key) {
                  <div class="pm-theme-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                }
              </div>
            }
          </div>

          <div class="pm-divider"></div>
          <div class="pm-section-sub">Couleur d'accent</div>
          <div class="pm-accent-grid">
            @for (c of accentColors; track c) {
              <div class="pm-accent-dot" [style.background]="c" [style.box-shadow]="activeAccent()===c?'0 0 14px '+c:'none'" [class.pm-accent-on]="activeAccent()===c" (click)="activeAccent.set(c)"></div>
            }
          </div>

          <div class="pm-divider"></div>
          <div class="pm-section-sub">Taille du texte</div>
          <div class="pm-size-row">
            @for (s of textSizes; track s) {
              <button class="pm-size-btn" [class.pm-size-on]="textSize()===s" (click)="textSize.set(s)">{{ s }}</button>
            }
          </div>
        </div>
      }

      <!-- ── AGENDA ── -->
      @if (activeSection()==='agenda') {
        <div class="pm-section">
          <div class="pm-section-title">Agenda & Disponibilités</div>
          <div class="pm-agenda-grid">
            @for (day of agendaDays; track day.label) {
              <div class="pm-day-row">
                <div class="pm-day-toggle">
                  <div class="pm-toggle" [class.pm-tog-on]="day.active" (click)="day.active=!day.active">
                    <div class="pm-tog-thumb"></div>
                  </div>
                  <span class="pm-day-label" [style.color]="day.active?'var(--txt)':'var(--txt3)'">{{ day.label }}</span>
                </div>
                @if (day.active) {
                  <div class="pm-day-hours">
                    <input class="pm-fi pm-fi-sm" type="time" [(ngModel)]="day.start">
                    <span style="color:var(--txt3)">—</span>
                    <input class="pm-fi pm-fi-sm" type="time" [(ngModel)]="day.end">
                  </div>
                } @else {
                  <div class="pm-day-closed">Fermé</div>
                }
              </div>
            }
          </div>

          <div class="pm-divider"></div>
          <div class="pm-section-sub">Durée par défaut d'un RDV</div>
          <div class="pm-duration-row">
            @for (d of durations; track d) {
              <button class="pm-size-btn" [class.pm-size-on]="rdvDuration()===d" (click)="rdvDuration.set(d)">{{ d }} min</button>
            }
          </div>
        </div>
      }

    </div>
  </div>
</div>
  `,
  styles: [`
    :host{--bg:#03080f;--card:rgba(255,255,255,.038);--cardh:rgba(14,165,201,.08);--bdr:rgba(14,165,201,.11);--bdr2:rgba(14,165,201,.26);--txt:#e8f4fd;--txt2:#7ba8c4;--txt3:#3d6480;--sky:#0ea5e9;--sky2:#38bdf8;--grn:#10b981;}
    :host{display:block}
    .pm-page{padding:24px 26px;display:flex;flex-direction:column;gap:20px;min-height:100%;animation:pmIn .5s cubic-bezier(.22,1,.36,1)}
    .pm-header{display:flex;align-items:center;justify-content:space-between;animation:pmDown .4s .04s ease both}
    .pm-header-left{display:flex;align-items:center;gap:16px}
    .pm-hico{position:relative;width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,rgba(14,165,201,.22),rgba(26,86,219,.18));border:1px solid rgba(14,165,201,.3);display:flex;align-items:center;justify-content:center;color:#38bdf8;box-shadow:0 0 28px rgba(14,165,201,.2)}
    .pm-hglow{position:absolute;inset:-10px;border-radius:26px;background:radial-gradient(circle,rgba(14,165,201,.1),transparent 70%);pointer-events:none}
    .pm-title{font-size:26px;font-weight:800;color:var(--txt);letter-spacing:-.6px}
    .pm-sub{font-size:13px;color:var(--txt2);margin-top:4px}
    .pm-btn-save{position:relative;overflow:hidden;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#1a56db,#0ea5e9);border:none;border-radius:12px;padding:11px 20px;font-size:13.5px;font-weight:700;color:white;cursor:pointer;font-family:'Outfit',sans-serif;box-shadow:0 4px 22px rgba(14,165,201,.45);transition:all .22s}
    .pm-btn-save:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(14,165,201,.55)}
    .pm-shine{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .45s}
    .pm-btn-save:hover .pm-shine{left:100%}
    .pm-layout{display:grid;grid-template-columns:220px 1fr;gap:16px;align-items:start}
    .pm-nav{background:var(--card);border:1px solid var(--bdr);border-radius:18px;padding:10px;backdrop-filter:blur(28px);display:flex;flex-direction:column;gap:2px;position:sticky;top:80px}
    .pm-nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:11px;background:none;border:none;color:var(--txt2);font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .16s;text-align:left;position:relative;overflow:hidden}
    .pm-nav-item:hover{background:rgba(14,165,201,.06);color:var(--txt)}
    .pm-nav-on{background:rgba(14,165,201,.1) !important;color:var(--sky2) !important}
    .pm-nav-ico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .pm-nav-accent{position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,#0ea5e9,#1a56db);border-radius:0 2px 2px 0}
    .pm-content{display:flex;flex-direction:column;gap:0}
    .pm-section{background:var(--card);border:1px solid var(--bdr);border-radius:20px;padding:24px;backdrop-filter:blur(28px);position:relative;overflow:hidden;animation:pmUp .4s .1s ease both}
    .pm-section::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,201,.2),transparent)}
    .pm-section-title{font-size:17px;font-weight:800;color:var(--txt);letter-spacing:-.3px;margin-bottom:20px}
    .pm-section-sub{font-size:12px;font-weight:700;color:var(--txt3);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px}
    .pm-divider{height:1px;background:rgba(14,165,201,.08);margin:22px 0}
    .pm-avatar-zone{display:flex;align-items:center;gap:18px;padding:18px;background:rgba(14,165,201,.05);border:1px solid rgba(14,165,201,.1);border-radius:14px;margin-bottom:22px}
    .pm-avatar{position:relative;flex-shrink:0}
    .pm-av-initials{width:68px;height:68px;border-radius:18px;background:linear-gradient(135deg,#0891b2,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:white;box-shadow:0 8px 24px rgba(14,165,201,.4)}
    .pm-av-ring{position:absolute;inset:-3px;border-radius:21px;border:2px solid rgba(14,165,201,.3)}
    .pm-av-name{font-size:16px;font-weight:800;color:var(--txt);margin-bottom:3px}
    .pm-av-role{font-size:12px;color:var(--txt2);margin-bottom:10px}
    .pm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .pm-fg{display:flex;flex-direction:column;gap:6px}
    .pm-fg-full{grid-column:1/-1}
    .pm-fl{font-size:9.5px;font-weight:700;color:var(--txt3);letter-spacing:.9px}
    .pm-fi{background:rgba(14,165,201,.05);border:1px solid var(--bdr);border-radius:12px;padding:11px 14px;font-size:13px;color:var(--txt);font-family:'Outfit',sans-serif;outline:none;transition:all .2s;width:100%;box-sizing:border-box}
    .pm-fi:focus{border-color:rgba(14,165,201,.52);box-shadow:0 0 0 3px rgba(14,165,201,.14);background:rgba(14,165,201,.08)}
    .pm-fi::placeholder{color:var(--txt3)}
    .pm-fi option{background:#060e1c}
    .pm-ta{resize:vertical;min-height:80px}
    .pm-fi-sm{padding:7px 10px;font-size:12px;width:auto}
    .pm-btn-sm{padding:7px 14px;border-radius:8px;background:rgba(14,165,201,.1);border:1px solid rgba(14,165,201,.22);color:var(--sky2);font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .16s}
    .pm-btn-sm:hover{background:rgba(14,165,201,.18)}
    .pm-btn-danger{background:rgba(239,68,68,.08) !important;border-color:rgba(239,68,68,.2) !important;color:#f87171 !important}
    .pm-btn-action{display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:11px;background:rgba(14,165,201,.1);border:1px solid rgba(14,165,201,.22);color:var(--sky2);font-size:13px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .18s;margin-top:14px}
    .pm-btn-action:hover{background:rgba(14,165,201,.18);transform:translateY(-1px)}
    .pm-logo-zone{display:flex;align-items:center;gap:18px;padding:16px;background:rgba(14,165,201,.04);border:1px solid rgba(14,165,201,.1);border-radius:12px}
    .pm-logo-preview{width:60px;height:60px;border-radius:14px;background:linear-gradient(135deg,rgba(14,165,201,.2),rgba(26,86,219,.15));border:1px solid rgba(14,165,201,.25);display:flex;align-items:center;justify-content:center}
    .pm-notif-list{display:flex;flex-direction:column;gap:12px}
    .pm-notif-row{display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(14,165,201,.04);border:1px solid rgba(14,165,201,.08);border-radius:14px;transition:all .18s}
    .pm-notif-row:hover{background:rgba(14,165,201,.07);border-color:rgba(14,165,201,.15)}
    .pm-notif-ico{width:38px;height:38px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
    .pm-notif-info{flex:1;min-width:0}
    .pm-notif-label{font-size:13.5px;font-weight:700;color:var(--txt)}
    .pm-notif-sub{font-size:11.5px;color:var(--txt3);margin-top:2px}
    .pm-notif-toggles{display:flex;gap:16px;flex-shrink:0}
    .pm-tog-item{display:flex;flex-direction:column;align-items:center;gap:4px}
    .pm-tog-lbl{font-size:9.5px;font-weight:700;color:var(--txt3);letter-spacing:.5px}
    .pm-toggle{width:38px;height:22px;border-radius:99px;background:rgba(255,255,255,.08);border:1px solid var(--bdr);cursor:pointer;position:relative;transition:all .22s}
    .pm-tog-on{background:rgba(14,165,201,.3) !important;border-color:rgba(14,165,201,.5) !important}
    .pm-tog-thumb{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--txt3);transition:all .22s}
    .pm-tog-on .pm-tog-thumb{left:18px;background:var(--sky2)}
    .pm-sec-block{padding:18px;background:rgba(14,165,201,.04);border:1px solid rgba(14,165,201,.08);border-radius:14px}
    .pm-sec-hd{display:flex;align-items:center;gap:12px;margin-bottom:16px}
    .pm-sec-ico{width:38px;height:38px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
    .pm-sec-title{font-size:14px;font-weight:700;color:var(--txt)}
    .pm-sec-sub{font-size:11.5px;color:var(--txt3);margin-top:2px}
    .pm-session-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-top:1px solid rgba(14,165,201,.07)}
    .pm-session-ico{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;color:var(--txt2);flex-shrink:0}
    .pm-session-info{flex:1}
    .pm-session-device{font-size:13px;font-weight:600;color:var(--txt)}
    .pm-session-meta{font-size:11px;color:var(--txt3);margin-top:1px}
    .pm-session-badge{background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.22);color:#34d399;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px}
    .pm-theme-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:4px}
    .pm-theme-card{cursor:pointer;border-radius:14px;border:2px solid transparent;overflow:hidden;position:relative;transition:all .18s}
    .pm-theme-on{border-color:rgba(14,165,201,.5) !important;box-shadow:0 0 20px rgba(14,165,201,.2)}
    .pm-theme-preview{height:80px;display:flex;overflow:hidden;border-radius:12px}
    .pm-theme-sidebar{width:30%;flex-shrink:0}
    .pm-theme-content{flex:1;padding:8px;display:flex;flex-direction:column;gap:5px}
    .pm-theme-bar{height:8px;border-radius:3px;width:60%}
    .pm-theme-bars{display:flex;flex-direction:column;gap:4px}
    .pm-theme-line{height:4px;border-radius:2px}
    .pm-theme-label{font-size:12px;font-weight:600;color:var(--txt2);text-align:center;padding:8px 0 4px}
    .pm-theme-check{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:50%;background:rgba(14,165,201,.9);display:flex;align-items:center;justify-content:center}
    .pm-accent-grid{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:4px}
    .pm-accent-dot{width:34px;height:34px;border-radius:50%;cursor:pointer;transition:all .18s;border:2px solid transparent}
    .pm-accent-on{border-color:white !important;transform:scale(1.15)}
    .pm-size-row{display:flex;gap:8px}
    .pm-size-btn{padding:8px 18px;border-radius:9px;background:var(--card);border:1px solid var(--bdr);color:var(--txt2);font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .16s}
    .pm-size-btn:hover{border-color:var(--bdr2);color:var(--sky2)}
    .pm-size-on{background:rgba(14,165,201,.14);border-color:rgba(14,165,201,.35);color:var(--sky2)}
    .pm-agenda-grid{display:flex;flex-direction:column;gap:10px}
    .pm-day-row{display:flex;align-items:center;gap:16px;padding:12px 16px;background:rgba(14,165,201,.04);border:1px solid rgba(14,165,201,.08);border-radius:12px}
    .pm-day-toggle{display:flex;align-items:center;gap:10px;min-width:130px}
    .pm-day-label{font-size:13.5px;font-weight:600;transition:color .16s}
    .pm-day-hours{display:flex;align-items:center;gap:10px}
    .pm-day-closed{font-size:12px;color:var(--txt3);font-style:italic}
    .pm-duration-row{display:flex;gap:8px;flex-wrap:wrap}
    @keyframes pmIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @keyframes pmDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
    @keyframes pmUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  `]
})
export class ParametresComponent {
  activeSection = signal('profil');
  activeTheme   = signal('dark-blue');
  activeAccent  = signal('#0ea5e9');
  textSize      = signal('Moyen');
  rdvDuration   = signal(30);

  sections = [
    {key:'profil',        label:'Profil',       icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`},
    {key:'clinique',      label:'Clinique',     icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`},
    {key:'notifications', label:'Notifications',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`},
    {key:'securite',      label:'Sécurité',     icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`},
    {key:'apparence',     label:'Apparence',    icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>`},
    {key:'agenda',        label:'Agenda',       icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`},
  ];

  notifSettings = [
    {key:'rdv',   label:'Nouveau rendez-vous',    sub:'Notifié à chaque nouveau RDV',       color:'#0ea5e9', email:true,  sms:true,  push:true,  icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`},
    {key:'pat',   label:'Nouveau patient',         sub:'À chaque enregistrement patient',    color:'#a78bfa', email:true,  sms:false, push:true,  icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`},
    {key:'msg',   label:'Message reçu',            sub:'Notifié pour chaque nouveau message',color:'#34d399', email:false, sms:false, push:true,  icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`},
    {key:'urgence',label:'Urgence signalée',       sub:'Alerte immédiate pour les urgences', color:'#f87171', email:true,  sms:true,  push:true,  icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>`},
    {key:'ord',   label:'Ordonnance expirée',      sub:'Rappel 3 jours avant expiration',   color:'#f59e0b', email:true,  sms:false, push:false, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>`},
  ];

  sessions = [
    {device:'Chrome · Windows 11', ip:'196.23.45.12', time:'Actif maintenant', current:true,  icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`},
    {device:'Safari · iPhone 14',  ip:'196.23.45.15', time:'Il y a 2h',        current:false, icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`},
  ];

  themes = [
    {key:'dark-blue',  name:'Bleu Royal',  bg:'#03080f', sb:'#060e1c', acc:'#0ea5e9', txt:'#e8f4fd'},
    {key:'dark-purple', name:'Violet',     bg:'#0a0314', sb:'#100520', acc:'#a78bfa', txt:'#f3e8ff'},
    {key:'dark-green',  name:'Émeraude',   bg:'#021409', sb:'#031a0f', acc:'#34d399', txt:'#ecfdf5'},
    {key:'light',       name:'Clair',      bg:'#f0f4f8', sb:'#ffffff', acc:'#0ea5e9', txt:'#0d1b2a'},
  ];

  accentColors = ['#0ea5e9','#a78bfa','#34d399','#f59e0b','#f472b6','#f87171','#38bdf8','#818cf8'];
  textSizes    = ['Petit','Moyen','Grand'];
  durations    = [15,20,30,45,60];

  agendaDays = [
    {label:'Lundi',    active:true,  start:'08:00', end:'18:00'},
    {label:'Mardi',    active:true,  start:'08:00', end:'18:00'},
    {label:'Mercredi', active:true,  start:'08:00', end:'17:00'},
    {label:'Jeudi',    active:true,  start:'08:00', end:'18:00'},
    {label:'Vendredi', active:true,  start:'08:00', end:'16:00'},
    {label:'Samedi',   active:false, start:'09:00', end:'13:00'},
    {label:'Dimanche', active:false, start:'09:00', end:'12:00'},
  ];

  saveAll() { console.log('Settings saved!'); }
}