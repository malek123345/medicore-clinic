import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-secretary-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
<div class="shell">
  <aside class="sidebar">
    <div class="logo"><span>⚕</span><span *ngIf="!collapsed()">MediCore</span></div>
    <div class="user-card" *ngIf="!collapsed()">
      <div class="av">{{ user()?.avatar }}</div>
      <div><p class="uname">{{ user()?.name }}</p><p class="urole">Secrétaire</p></div>
    </div>
    <nav class="nav">
      <a routerLink="home"     routerLinkActive="active" class="ni"><span>🏠</span><span *ngIf="!collapsed()">Accueil</span></a>
      <a routerLink="agenda"   routerLinkActive="active" class="ni"><span>📅</span><span *ngIf="!collapsed()">Agenda</span></a>
      <a routerLink="patients" routerLinkActive="active" class="ni"><span>👥</span><span *ngIf="!collapsed()">Patients</span></a>
    </nav>
    <button class="logout" (click)="auth.logout()"><span>🚪</span><span *ngIf="!collapsed()">Déconnexion</span></button>
  </aside>
  <main><router-outlet></router-outlet></main>
</div>
  `,
  styles: [`
    * { box-sizing:border-box; margin:0; padding:0; }
    .shell { display:flex; min-height:100vh; font-family:'Segoe UI',sans-serif; }
    .sidebar { width:240px; background:linear-gradient(180deg,#7c3aed,#4f46e5); color:white; display:flex; flex-direction:column; padding:1.25rem; gap:1rem; }
    .logo { display:flex; align-items:center; gap:.75rem; font-size:1.2rem; font-weight:700; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,.15); }
    .user-card { display:flex; gap:.75rem; align-items:center; background:rgba(255,255,255,.12); border-radius:10px; padding:.75rem; }
    .av { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.25); display:flex; align-items:center; justify-content:center; font-weight:700; }
    .uname { font-size:.88rem; font-weight:600; }
    .urole { font-size:.72rem; opacity:.7; }
    .nav { flex:1; display:flex; flex-direction:column; gap:.25rem; }
    .ni { display:flex; align-items:center; gap:.7rem; padding:.65rem .75rem; border-radius:8px; color:rgba(255,255,255,.8); text-decoration:none; font-size:.88rem; }
    .ni:hover, .ni.active { background:rgba(255,255,255,.15); color:white; font-weight:600; }
    .logout { background:rgba(255,255,255,.1); border:none; color:white; padding:.65rem .75rem; border-radius:8px; display:flex; align-items:center; gap:.7rem; font-size:.88rem; cursor:pointer; }
    main { flex:1; overflow:auto; background:#f5f3ff; }
  `]
})
export class SecretaryShellComponent {
  auth = inject(AuthService);
  user = this.auth.user;
  collapsed = signal(false);
}