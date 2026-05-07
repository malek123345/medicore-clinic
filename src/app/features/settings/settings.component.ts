import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="st-page">
  <div class="st-header">
    <div>
      <div class="st-eyebrow"><span class="st-dot"></span>Configuration</div>
      <h1 class="st-title">Paramètres</h1>
      <p class="st-sub">Personnalisez votre expérience MediCore</p>
    </div>
  </div>

  <div class="st-layout">

    <!-- SIDEBAR NAV -->
    <div class="st-card st-nav">
      @for (section of sections; track section.id) {
        <button class="st-nav-btn" [class.st-nav-on]="activeSection()===section.id" (click)="activeSection.set(section.id)">
          <div class="st-nav-ico" [innerHTML]="section.icon"></div>
          <span>{{ section.label }}</span>
          <div class="st-nav-arrow">›</div>
        </button>
      }
    </div>

    <!-- CONTENT -->
    <div class="st-content">

      <!-- PROFIL -->
      @if (activeSection()==='profile') {
        <div class="st-card st-section" style="animation:sectionIn .3s ease both">
          <div class="st-sec-hd"><div class="st-sec-eyebrow">Mon compte</div><h2 class="st-sec-title">Profil médical</h2></div>
          <div class="st-profile-av-row">
            <div class="st-profile-av">MD</div>
            <div>
              <div class="st-profile-name">Dr. Marie Dupont</div>
              <div class="st-profile-role">Cardiologue · N° RPPS: 10003456789</div>
            </div>
            <button class="st-av-change">Changer la photo</button>
          </div>
          <div class="st-form-grid">
            <div class="st-fg"><label class="st-fl">PRÉNOM</label><input class="st-fi" type="text" value="Marie"></div>
            <div class="st-fg"><label class="st-fl">NOM</label><input class="st-fi" type="text" value="Dupont"></div>
            <div class="st-fg"><label class="st-fl">SPÉCIALITÉ</label><input class="st-fi" type="text" value="Cardiologie"></div>
            <div class="st-fg"><label class="st-fl">N° RPPS</label><input class="st-fi" type="text" value="10003456789"></div>
            <div class="st-fg st-fg-full"><label class="st-fl">EMAIL PROFESSIONNEL</label><input class="st-fi" type="email" value="dr.dupont@medicore.tn"></div>
            <div class="st-fg"><label class="st-fl">TÉLÉPHONE</label><input class="st-fi" type="tel" value="+216 71 234 567"></div>
            <div class="st-fg"><label class="st-fl">ÉTABLISSEMENT</label><input class="st-fi" type="text" value="Clinique du Lac, Tunis"></div>
          </div>
          <div class="st-actions"><button class="st-save-btn">Enregistrer les modifications</button></div>
        </div>
      }

      <!-- NOTIFICATIONS -->
      @if (activeSection()==='notifications') {
        <div class="st-card st-section" style="animation:sectionIn .3s ease both">
          <div class="st-sec-hd"><div class="st-sec-eyebrow">Alertes</div><h2 class="st-sec-title">Notifications</h2></div>
          @for (group of notifGroups; track group.title) {
            <div class="st-notif-group">
              <div class="st-ng-title">{{ group.title }}</div>
              @for (item of group.items; track item.key) {
                <div class="st-toggle-row">
                  <div class="st-toggle-info">
                    <div class="st-toggle-label">{{ item.label }}</div>
                    <div class="st-toggle-desc">{{ item.desc }}</div>
                  </div>
                  <div class="st-toggle" [class.st-toggle-on]="item.enabled" (click)="item.enabled = !item.enabled">
                    <div class="st-toggle-knob"></div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- SÉCURITÉ -->
      @if (activeSection()==='security') {
        <div class="st-card st-section" style="animation:sectionIn .3s ease both">
          <div class="st-sec-hd"><div class="st-sec-eyebrow">Protection</div><h2 class="st-sec-title">Sécurité</h2></div>
          <div class="st-security-item">
            <div class="st-sec-item-ico" style="background:rgba(52,211,153,.1);color:#34d399"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div class="st-sec-item-info"><div class="st-sec-item-label">Authentification à deux facteurs</div><div class="st-sec-item-desc">Sécurisez votre compte avec un code SMS</div></div>
            <div class="st-toggle st-toggle-on"><div class="st-toggle-knob"></div></div>
          </div>
          <div class="st-security-item">
            <div class="st-sec-item-ico" style="background:rgba(59,130,246,.1);color:#60a5fa"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
            <div class="st-sec-item-info"><div class="st-sec-item-label">Modifier le mot de passe</div><div class="st-sec-item-desc">Dernière modification: il y a 3 mois</div></div>
            <button class="st-sec-btn">Modifier</button>
          </div>
          <div class="st-security-item">
            <div class="st-sec-item-ico" style="background:rgba(251,191,36,.1);color:#fbbf24"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
            <div class="st-sec-item-info"><div class="st-sec-item-label">Sessions actives</div><div class="st-sec-item-desc">2 appareils connectés</div></div>
            <button class="st-sec-btn">Gérer</button>
          </div>
          <div class="st-pw-section">
            <div class="st-ng-title" style="margin-bottom:14px">Changer le mot de passe</div>
            <div class="st-form-grid">
              <div class="st-fg st-fg-full"><label class="st-fl">MOT DE PASSE ACTUEL</label><input class="st-fi" type="password" placeholder="••••••••"></div>
              <div class="st-fg"><label class="st-fl">NOUVEAU</label><input class="st-fi" type="password" placeholder="••••••••"></div>
              <div class="st-fg"><label class="st-fl">CONFIRMER</label><input class="st-fi" type="password" placeholder="••••••••"></div>
            </div>
            <button class="st-save-btn" style="margin-top:14px;width:auto;padding:10px 24px">Mettre à jour</button>
          </div>
        </div>
      }

      <!-- APPARENCE -->
      @if (activeSection()==='appearance') {
        <div class="st-card st-section" style="animation:sectionIn .3s ease both">
          <div class="st-sec-hd"><div class="st-sec-eyebrow">Interface</div><h2 class="st-sec-title">Apparence</h2></div>
          <div class="st-ng-title">Thème</div>
          <div class="st-theme-grid">
            @for (t of themes; track t.id) {
              <div class="st-theme-card" [class.st-theme-sel]="activeTheme()===t.id" (click)="activeTheme.set(t.id)">
                <div class="st-theme-preview" [style.background]="t.bg">
                  <div class="st-theme-sb" [style.background]="t.sb"></div>
                  <div class="st-theme-content">
                    <div class="st-theme-bar" [style.background]="t.accent"></div>
                    <div class="st-theme-bar st-theme-bar-sm"></div>
                  </div>
                </div>
                <div class="st-theme-name">{{ t.name }}</div>
                @if (activeTheme()===t.id) { <div class="st-theme-check">✓</div> }
              </div>
            }
          </div>
          <div class="st-ng-title" style="margin-top:22px">Densité d'affichage</div>
          <div class="st-density-opts">
            @for (d of densities; track d.val) {
              <div class="st-density-opt" [class.st-density-sel]="activeDensity()===d.val" (click)="activeDensity.set(d.val)">
                <div class="st-density-icon">
                  @for (line of d.lines; track $index) { <div class="st-d-line" [style.width]="line"></div> }
                </div>
                <span>{{ d.label }}</span>
              </div>
            }
          </div>
        </div>
      }

      <!-- CLINIQUE -->
      @if (activeSection()==='clinic') {
        <div class="st-card st-section" style="animation:sectionIn .3s ease both">
          <div class="st-sec-hd"><div class="st-sec-eyebrow">Établissement</div><h2 class="st-sec-title">Ma clinique</h2></div>
          <div class="st-form-grid">
            <div class="st-fg st-fg-full"><label class="st-fl">NOM DE LA CLINIQUE</label><input class="st-fi" type="text" value="Clinique du Lac"></div>
            <div class="st-fg st-fg-full"><label class="st-fl">ADRESSE</label><input class="st-fi" type="text" value="Rue du Lac Biwa, Les Berges du Lac, Tunis 1053"></div>
            <div class="st-fg"><label class="st-fl">TÉLÉPHONE</label><input class="st-fi" type="tel" value="+216 71 960 000"></div>
            <div class="st-fg"><label class="st-fl">EMAIL</label><input class="st-fi" type="email" value="contact@cliniquedu lac.tn"></div>
            <div class="st-fg"><label class="st-fl">HORAIRES MATIN</label><input class="st-fi" type="text" value="08:00 - 13:00"></div>
            <div class="st-fg"><label class="st-fl">HORAIRES APRÈS-MIDI</label><input class="st-fi" type="text" value="14:00 - 18:00"></div>
          </div>
          <div class="st-actions"><button class="st-save-btn">Enregistrer</button></div>
        </div>
      }

    </div>
  </div>
</div>
  `,
  styles: [`
    :host {
      --bg:#04050a; --b:#2563eb; --b2:#3b82f6; --b3:#60a5fa; --b4:#93c5fd;
      --bD:rgba(59,130,246,.1); --bdrB:rgba(59,130,246,.26);
      --card:rgba(255,255,255,.032); --bdr:rgba(255,255,255,.062);
      --t1:#dde6f5; --t2:#6272a0; --t3:#323a58;
      --grn:#34d399;
    }
    .st-page { padding:28px 30px; display:flex; flex-direction:column; gap:18px; background:var(--bg); min-height:100%; animation:pgIn .5s ease both; }
    @keyframes pgIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
    .st-header { padding-bottom:20px; border-bottom:1px solid rgba(59,130,246,.1); }
    .st-eyebrow { display:flex; align-items:center; gap:7px; font-size:10px; font-weight:700; letter-spacing:2px; color:var(--b3); text-transform:uppercase; margin-bottom:8px; }
    .st-dot { width:6px; height:6px; border-radius:50%; background:var(--b2); box-shadow:0 0 8px var(--b2); animation:dotP 2s ease infinite; }
    @keyframes dotP { 0%,100%{opacity:1} 50%{opacity:.3} }
    .st-title { font-size:34px; font-weight:800; color:var(--t1); letter-spacing:-1.5px; background:linear-gradient(135deg,var(--t1) 20%,var(--b4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .st-sub { font-size:12.5px; color:var(--t3); margin-top:5px; }

    .st-layout { display:grid; grid-template-columns:220px 1fr; gap:16px; align-items:start; }
    .st-card { background:var(--card); border:1px solid var(--bdr); border-radius:16px; backdrop-filter:blur(24px); position:relative; overflow:hidden; }
    .st-card::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,.18),transparent); pointer-events:none; }

    .st-nav { padding:8px; }
    .st-nav-btn { display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px; border-radius:10px; background:none; border:1px solid transparent; color:var(--t2); font-size:13px; font-weight:500; cursor:pointer; font-family:inherit; transition:all .18s; margin-bottom:1px; }
    .st-nav-btn:hover { background:rgba(59,130,246,.06); color:var(--t1); border-color:rgba(59,130,246,.12); }
    .st-nav-on { background:rgba(59,130,246,.14); border-color:var(--bdrB); color:var(--b3); font-weight:700; }
    .st-nav-ico { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .st-nav-on .st-nav-ico { background:var(--bD); }
    .st-nav-ico ::ng-deep svg { width:15px; height:15px; }
    .st-nav-arrow { margin-left:auto; color:var(--t3); font-size:14px; transition:transform .16s; }
    .st-nav-on .st-nav-arrow { color:var(--b3); transform:translateX(2px); }

    @keyframes sectionIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:none} }
    .st-section { padding:24px; }
    .st-sec-hd { margin-bottom:22px; }
    .st-sec-eyebrow { font-size:9px; font-weight:700; letter-spacing:2px; color:var(--b3); text-transform:uppercase; margin-bottom:5px; }
    .st-sec-title { font-size:18px; font-weight:800; color:var(--t1); letter-spacing:-.3px; }

    .st-profile-av-row { display:flex; align-items:center; gap:16px; margin-bottom:22px; padding:16px; background:rgba(59,130,246,.06); border-radius:12px; border:1px solid var(--bdrB); }
    .st-profile-av { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg,var(--b2),var(--b)); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:white; flex-shrink:0; box-shadow:0 4px 16px rgba(59,130,246,.4); }
    .st-profile-name { font-size:16px; font-weight:800; color:var(--t1); }
    .st-profile-role { font-size:12px; color:var(--t3); margin-top:3px; }
    .st-av-change { margin-left:auto; padding:7px 14px; border-radius:8px; background:var(--bD); border:1px solid var(--bdrB); color:var(--b3); font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .16s; }
    .st-av-change:hover { background:rgba(59,130,246,.2); }

    .st-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
    .st-fg { display:flex; flex-direction:column; gap:5px; }
    .st-fg-full { grid-column:1/-1; }
    .st-fl { font-size:9px; font-weight:700; color:var(--t3); letter-spacing:1.2px; text-transform:uppercase; }
    .st-fi { background:rgba(255,255,255,.038); border:1px solid var(--bdr); border-radius:9px; padding:9px 12px; font-size:13px; color:var(--t1); font-family:inherit; outline:none; transition:all .18s; width:100%; box-sizing:border-box; }
    .st-fi:focus { border-color:rgba(59,130,246,.48); box-shadow:0 0 0 3px rgba(59,130,246,.1); background:rgba(59,130,246,.06); }
    .st-actions { display:flex; }
    .st-save-btn { background:linear-gradient(135deg,var(--b2),var(--b)); border:none; border-radius:10px; padding:11px 24px; font-size:13px; font-weight:700; color:white; cursor:pointer; font-family:inherit; box-shadow:0 4px 16px rgba(59,130,246,.35); transition:all .2s; }
    .st-save-btn:hover { transform:translateY(-1px); box-shadow:0 7px 22px rgba(59,130,246,.5); }

    .st-notif-group { margin-bottom:20px; }
    .st-ng-title { font-size:10px; font-weight:700; letter-spacing:1.5px; color:var(--t3); text-transform:uppercase; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,.04); }
    .st-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid rgba(255,255,255,.03); }
    .st-toggle-row:last-child { border-bottom:none; }
    .st-toggle-label { font-size:13px; font-weight:600; color:var(--t1); }
    .st-toggle-desc { font-size:11.5px; color:var(--t3); margin-top:2px; }
    .st-toggle { width:40px; height:22px; border-radius:99px; background:rgba(255,255,255,.08); border:1px solid var(--bdr); cursor:pointer; transition:all .22s; position:relative; flex-shrink:0; }
    .st-toggle-on { background:linear-gradient(135deg,var(--b2),var(--b)); border-color:var(--b2); box-shadow:0 0 12px rgba(59,130,246,.4); }
    .st-toggle-knob { position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:rgba(255,255,255,.4); transition:all .22s; }
    .st-toggle-on .st-toggle-knob { left:20px; background:white; box-shadow:0 2px 6px rgba(0,0,0,.3); }

    .st-security-item { display:flex; align-items:center; gap:14px; padding:14px; background:rgba(255,255,255,.025); border:1px solid var(--bdr); border-radius:11px; margin-bottom:10px; }
    .st-sec-item-ico { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .st-sec-item-label { font-size:13px; font-weight:600; color:var(--t1); }
    .st-sec-item-desc { font-size:11.5px; color:var(--t3); margin-top:2px; }
    .st-sec-btn { margin-left:auto; padding:7px 16px; border-radius:8px; background:var(--bD); border:1px solid var(--bdrB); color:var(--b3); font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .16s; flex-shrink:0; }
    .st-sec-btn:hover { background:rgba(59,130,246,.2); }
    .st-pw-section { margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,.05); }

    .st-theme-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    .st-theme-card { border-radius:11px; overflow:hidden; cursor:pointer; border:2px solid transparent; transition:all .18s; position:relative; }
    .st-theme-sel { border-color:var(--b2); box-shadow:0 0 18px rgba(59,130,246,.3); }
    .st-theme-preview { height:60px; display:flex; overflow:hidden; }
    .st-theme-sb { width:22px; height:100%; flex-shrink:0; }
    .st-theme-content { flex:1; padding:8px 10px; display:flex; flex-direction:column; gap:5px; }
    .st-theme-bar { height:5px; border-radius:3px; background:rgba(255,255,255,.15); }
    .st-theme-bar-sm { width:60%; }
    .st-theme-name { padding:7px 10px; font-size:11.5px; font-weight:600; color:var(--t2); background:rgba(0,0,0,.3); text-align:center; }
    .st-theme-check { position:absolute; top:6px; right:6px; width:18px; height:18px; border-radius:50%; background:var(--b2); display:flex; align-items:center; justify-content:center; font-size:10px; color:white; font-weight:800; }
    .st-density-opts { display:flex; gap:10px; }
    .st-density-opt { flex:1; padding:14px; border-radius:11px; background:rgba(255,255,255,.03); border:1px solid var(--bdr); cursor:pointer; transition:all .16s; display:flex; flex-direction:column; align-items:center; gap:10px; }
    .st-density-opt:hover { border-color:var(--bdrB); }
    .st-density-sel { background:var(--bD); border-color:var(--bdrB); }
    .st-density-icon { display:flex; flex-direction:column; gap:3px; width:40px; }
    .st-d-line { height:3px; background:rgba(255,255,255,.2); border-radius:99px; }
    .st-density-sel .st-d-line { background:var(--b3); }
    .st-density-opt span { font-size:12px; font-weight:600; color:var(--t2); }
    .st-density-sel span { color:var(--b3); }
  `]
})
export class SettingsComponent {
  activeSection = signal('profile');
  activeTheme = signal('dark-blue');
  activeDensity = signal('normal');

  readonly sections = [
    { id:'profile', label:'Profil', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
    { id:'notifications', label:'Notifications', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>` },
    { id:'security', label:'Sécurité', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>` },
    { id:'appearance', label:'Apparence', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>` },
    { id:'clinic', label:'Ma clinique', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
  ];

  readonly notifGroups = [
    { title:'Rendez-vous', items:[
      { key:'rdv_confirm', label:'Confirmation de RDV', desc:'Notifier quand un patient confirme', enabled:true },
      { key:'rdv_cancel', label:'Annulation de RDV', desc:'Notifier en cas d\'annulation', enabled:true },
      { key:'rdv_remind', label:'Rappels automatiques', desc:'Rappels 24h avant le RDV', enabled:false },
    ]},
    { title:'Patients', items:[
      { key:'new_patient', label:'Nouveau patient', desc:'Notifier à l\'ajout d\'un nouveau patient', enabled:true },
      { key:'critical', label:'Patients critiques', desc:'Alertes sur l\'état des patients critiques', enabled:true },
      { key:'results', label:'Résultats disponibles', desc:'Nouveaux résultats de laboratoire', enabled:false },
    ]},
    { title:'Système', items:[
      { key:'email_digest', label:'Résumé quotidien par email', desc:'Synthèse des activités du jour', enabled:false },
      { key:'security_alerts', label:'Alertes de sécurité', desc:'Connexions suspectes, changements de compte', enabled:true },
    ]},
  ];

  readonly themes = [
    { id:'dark-blue', name:'Dark Blue', bg:'#04050a', sb:'#07091a', accent:'#3b82f6' },
    { id:'dark-purple', name:'Dark Purple', bg:'#080510', sb:'#0e0820', accent:'#8b5cf6' },
    { id:'dark-teal', name:'Dark Teal', bg:'#040a0a', sb:'#071415', accent:'#14b8a6' },
    { id:'midnight', name:'Midnight', bg:'#020204', sb:'#050508', accent:'#6366f1' },
  ];

  readonly densities = [
    { val:'compact', label:'Compact', lines:['100%','100%','100%','100%'] },
    { val:'normal', label:'Normal', lines:['100%','100%','100%'] },
    { val:'comfortable', label:'Confort', lines:['100%','100%'] },
  ];
}