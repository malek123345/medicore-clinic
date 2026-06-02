import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { DocumentsService } from '../../../core/services/documents.service';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface Ordonnance {
  id: number;
  patientId: string;
  patientName: string;
  date: string;
  instructions?: string;
  status: string;
  meds: { name: string; dose: string; freq?: string; duree: string }[];
}

@Component({
  selector: 'app-patient-dossier-public',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="doss-page">

  <!-- HERO -->
  <section class="doss-hero">
    <div class="hero-bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="doss-hero-inner">
      <div class="hero-pill">
        <span class="hero-pill-dot"></span>
        Mon espace patient
      </div>
      <h1 class="doss-title">Dossier <span class="title-accent">médical</span></h1>
      <p class="doss-sub">{{ auth.user()?.name }} &nbsp;·&nbsp; {{ auth.user()?.patientId }}</p>
    </div>
    <div class="hero-wave">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
      </svg>
    </div>
  </section>

  <section class="doss-body">
    <div class="doss-inner">

      <!-- PATIENT INFO CARD -->
      <div class="patient-card">
        <div class="pc-content">
          <div class="pc-avatar">
            <div class="pc-av-ring"></div>
            <div class="pc-av-inner">{{ auth.user()?.avatar }}</div>
          </div>
          <div class="pc-data">
            <div class="pc-name">{{ auth.user()?.name }}</div>
            <div class="pc-chips">
              <span class="pc-chip">📋 {{ auth.user()?.patientId }}</span>
              <span class="pc-chip chip-blood">🩸 {{ auth.user()?.groupeSanguin }}</span>
              <span class="pc-chip">📅 {{ auth.user()?.dateNaissance }}</span>
              <span class="pc-chip">📞 {{ auth.user()?.phone }}</span>
            </div>
          </div>
          <div class="pc-doctor">
            <div class="pcd-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="pcd-info">
              <div class="pcd-label">Médecin traitant</div>
              <div class="pcd-name">Dr. Zied Khaddar</div>
              <div class="pcd-spec">Parodontologie &amp; Implantologie</div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABS -->
      <div class="doss-tabs-wrap">
        <div class="doss-tabs">
          <button class="doss-tab" [class.active]="activeTab() === 'ordonnances'" (click)="activeTab.set('ordonnances')">
            <div class="tab-ico">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
            </div>
            Ordonnances
            <span class="tab-badge">{{ ordonnances().length }}</span>
          </button>
          <button class="doss-tab" [class.active]="activeTab() === 'fichiers'" (click)="activeTab.set('fichiers')">
            <div class="tab-ico">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
            Fichiers &amp; Scanners
            <span class="tab-badge">{{ docsSvc.docs().length }}</span>
          </button>
        </div>
      </div>

      <!-- ── ORDONNANCES ── -->
      @if (activeTab() === 'ordonnances') {
        @if (loadingOrds()) {
          <div class="loading-state">Chargement des ordonnances...</div>
        } @else if (ordonnances().length === 0) {
          <div class="empty-state">
            <div class="empty-icon-wrap"><div class="empty-icon">💊</div></div>
            <p class="empty-title">Aucune ordonnance disponible</p>
            <p class="empty-sub">Vos ordonnances apparaîtront ici après votre consultation</p>
          </div>
        } @else {
          <div class="ords-list">
            @for (ord of ordonnances(); track ord.id; let i = $index) {
              <div class="ord-card" [style.--delay]="(i*0.1)+'s'">
                <div class="ord-card-stripe"></div>
                <div class="ord-header">
                  <div class="ord-rx-badge">℞</div>
                  <div class="ord-header-info">
                    <div class="ord-id">Ordonnance #{{ ord.id }}</div>
                    <div class="ord-meta">{{ ord.date }}</div>
                  </div>
                  <span class="ord-status" [class.active]="ord.status === 'active'">{{ ord.status === 'active' ? 'Active' : 'Expirée' }}</span>
                </div>
                <div class="ord-meds">
                  @for (med of ord.meds; track med.name) {
                    <div class="med-row">
                      <div class="med-bullet"></div>
                      <div class="med-name">{{ med.name }}</div>
                      <span class="med-dose">{{ med.dose }}</span>
                      <span class="med-info">{{ med.freq }} · {{ med.duree }}</span>
                    </div>
                  }
                </div>
                @if (ord.instructions) {
                  <div class="ord-notes">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {{ ord.instructions }}
                  </div>
                }
              </div>
            }
          </div>
        }
      }

      <!-- ── FICHIERS ── -->
      @if (activeTab() === 'fichiers') {
        <!-- Upload Zone -->
        <div class="upload-zone" (click)="fileInput.click()" [class.uploading]="uploading()">
          <input #fileInput type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style="display:none" (change)="onFileSelect($event)">
          @if (uploading()) {
            <div class="upload-zone-circle uploading-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div class="upload-zone-text">Envoi en cours...</div>
          } @else {
            <div class="upload-zone-circle">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="upload-zone-text">Glissez un fichier ou cliquez pour parcourir</div>
            <div class="upload-zone-types">
              <span>PDF</span><span>JPG</span><span>PNG</span><span>Scanner médical</span>
            </div>
          }
        </div>

        @if (docsSvc.docs().length === 0) {
          <div class="empty-state">
            <div class="empty-icon-wrap"><div class="empty-icon">📁</div></div>
            <p class="empty-title">Aucun fichier pour l'instant</p>
            <p class="empty-sub">Ajoutez vos scanners et documents médicaux</p>
          </div>
        } @else {
          <div class="files-grid">
            @for (file of docsSvc.docs(); track file.id; let i = $index) {
              <div class="file-card" [style.--delay]="(i*0.07)+'s'">
                <div class="file-ico" [class]="getFileClass(file.fileType)">
                  @if (file.fileType?.includes('pdf')) {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  }
                </div>
                <div class="file-info">
                  <div class="file-name">{{ file.fileName }}</div>
                  <div class="file-meta">{{ docsSvc.formatSize(file.fileSize) }} · {{ file.uploadedAt | date:'dd/MM/yyyy' }}</div>
                </div>
                <div class="file-actions">
                  <a [href]="getFileUrl(file.filePath)" target="_blank" class="fa-btn" title="Voir">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </a>
                  <button class="fa-btn fa-del" title="Supprimer" (click)="deleteFile(file.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      }

    </div>
  </section>
</div>
  `,
  styles: [`
    :host {
      --P: #1b7fc4; --PD: #0d5a96; --PL: #e8f4fd;
      --dark: #0f2744; --text: #3d4f61; --tl: #8899aa;
      --border: #e2ecf5;
      --shadow-sm: 0 2px 8px rgba(15,39,68,.06);
      --shadow-md: 0 8px 32px rgba(15,39,68,.1);
    }
    .doss-page { background: #f7fafd; min-height: 100vh; }
    .doss-hero { position:relative;overflow:hidden;background:linear-gradient(140deg,#0d5a96 0%,#1b7fc4 45%,#17a2b8 100%);padding:80px 24px 100px;text-align:center; }
    .hero-bg-orbs { position:absolute;inset:0;pointer-events:none; }
    .orb { position:absolute;border-radius:50%;background:rgba(255,255,255,.06);animation:orbFloat 8s ease-in-out infinite; }
    .orb-1 { width:400px;height:400px;top:-120px;left:-80px; }
    .orb-2 { width:280px;height:280px;top:-40px;right:10%;animation-delay:-3s; }
    .orb-3 { width:200px;height:200px;bottom:20px;left:40%;animation-delay:-5s; }
    @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.04)} }
    .hero-pill { display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.3);color:white;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;padding:6px 16px;border-radius:99px;margin-bottom:20px; }
    .hero-pill-dot { width:6px;height:6px;border-radius:50%;background:#7eedc9;box-shadow:0 0 6px #7eedc9;animation:pulse 2s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }
    .doss-title { font-size:46px;font-weight:900;color:white;letter-spacing:-1px;margin-bottom:12px; }
    .title-accent { color:#7eedc9; }
    .doss-sub { font-size:14px;color:rgba(255,255,255,.75); }
    .hero-wave { position:absolute;bottom:0;left:0;right:0;line-height:0; }
    .hero-wave svg { width:100%;height:60px; }
    .doss-body { padding:32px 24px 80px; }
    .doss-inner { max-width:940px;margin:0 auto;display:flex;flex-direction:column;gap:28px; }
    .patient-card { background:linear-gradient(135deg,#0f2744,#1b3a60);border-radius:20px;padding:28px;box-shadow:var(--shadow-md); }
    .pc-content { display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap; }
    .pc-avatar { position:relative;flex-shrink:0; }
    .pc-av-ring { position:absolute;inset:-4px;border-radius:22px;background:linear-gradient(135deg,#1b7fc4,#7eedc9);opacity:.5; }
    .pc-av-inner { position:relative;width:72px;height:72px;border-radius:18px;background:linear-gradient(135deg,#1b7fc4,#0d5a96);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:white; }
    .pc-data { flex:1;min-width:200px; }
    .pc-name { font-size:22px;font-weight:800;color:white;margin-bottom:14px; }
    .pc-chips { display:flex;flex-wrap:wrap;gap:8px; }
    .pc-chip { font-size:12.5px;color:rgba(255,255,255,.8);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:99px;padding:4px 12px; }
    .chip-blood { color:#fca5a5;border-color:rgba(252,165,165,.3);background:rgba(252,165,165,.08); }
    .pc-doctor { display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px 18px;flex-shrink:0;min-width:220px; }
    .pcd-icon { width:38px;height:38px;border-radius:10px;background:rgba(27,127,196,.4);color:#7eedc9;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .pcd-label { font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,.45);margin-bottom:3px; }
    .pcd-name { font-size:14px;font-weight:700;color:white; }
    .pcd-spec { font-size:11px;color:rgba(255,255,255,.5);margin-top:2px; }
    .doss-tabs-wrap { display:flex; }
    .doss-tabs { display:flex;background:white;border:1px solid var(--border);border-radius:14px;padding:5px;gap:4px;box-shadow:var(--shadow-sm); }
    .doss-tab { display:flex;align-items:center;gap:9px;padding:10px 22px;border-radius:10px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:600;color:var(--tl);font-family:inherit;transition:all .22s; }
    .doss-tab:hover { color:var(--P); }
    .doss-tab.active { background:var(--P);color:white;box-shadow:0 4px 16px rgba(27,127,196,.35);transform:translateY(-1px); }
    .tab-ico { width:26px;height:26px;border-radius:7px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center; }
    .doss-tab:not(.active) .tab-ico { background:var(--PL);color:var(--P); }
    .tab-badge { font-size:11px;font-weight:700;background:rgba(255,255,255,.25);border-radius:99px;padding:2px 9px; }
    .doss-tab:not(.active) .tab-badge { background:var(--PL);color:var(--P); }
    .loading-state { text-align:center;padding:40px;color:var(--tl);font-size:14px; }
    .ords-list { display:flex;flex-direction:column;gap:16px; }
    .ord-card { position:relative;background:white;border-radius:16px;border:1px solid var(--border);overflow:hidden;box-shadow:var(--shadow-sm);transition:all .28s;animation:slideUp .45s var(--delay,0s) ease both; }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .ord-card:hover { transform:translateY(-3px);box-shadow:var(--shadow-md);border-color:rgba(27,127,196,.3); }
    .ord-card-stripe { position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(to bottom,var(--P),var(--PD)); }
    .ord-header { display:flex;align-items:center;gap:14px;padding:18px 20px 18px 24px;border-bottom:1px solid var(--border); }
    .ord-rx-badge { width:46px;height:46px;border-radius:13px;flex-shrink:0;background:linear-gradient(135deg,var(--P),var(--PD));display:flex;align-items:center;justify-content:center;font-size:24px;color:white;font-weight:900;font-family:Georgia,serif;box-shadow:0 4px 12px rgba(27,127,196,.4); }
    .ord-id { font-size:16px;font-weight:700;color:var(--dark); }
    .ord-meta { font-size:12px;color:var(--tl);margin-top:2px; }
    .ord-status { margin-left:auto;padding:5px 13px;border-radius:99px;font-size:11px;font-weight:700;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#dc2626; }
    .ord-status.active { background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.25);color:#16a34a; }
    .ord-meds { padding:16px 20px 16px 24px;display:flex;flex-direction:column;gap:10px; }
    .med-row { display:flex;align-items:center;gap:10px; }
    .med-bullet { width:8px;height:8px;border-radius:50%;background:var(--P);flex-shrink:0;box-shadow:0 0 0 3px rgba(27,127,196,.15); }
    .med-name { font-size:14px;font-weight:600;color:var(--dark);flex:1; }
    .med-dose { font-size:12px;color:var(--P);font-weight:700;background:var(--PL);border-radius:99px;padding:2px 10px;white-space:nowrap; }
    .med-info { font-size:12px;color:var(--tl);white-space:nowrap; }
    .ord-notes { display:flex;align-items:center;gap:9px;font-size:13px;color:#92400e;background:#fffbeb;border-top:1px solid #fde68a;padding:12px 24px; }
    .upload-zone { display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px 24px;background:white;border:2px dashed var(--border);border-radius:18px;cursor:pointer;transition:all .25s; }
    .upload-zone:hover { border-color:var(--P);background:linear-gradient(135deg,#f0f8ff,#e8f4fd);transform:scale(1.005); }
    .upload-zone.uploading { opacity:.7;cursor:not-allowed; }
    .upload-zone-circle { width:68px;height:68px;border-radius:50%;background:var(--PL);border:2px solid rgba(27,127,196,.2);display:flex;align-items:center;justify-content:center;color:var(--P);transition:all .25s; }
    .upload-zone:hover .upload-zone-circle { background:var(--P);color:white;box-shadow:0 8px 24px rgba(27,127,196,.35);transform:scale(1.1); }
    .uploading-circle { background:var(--P);color:white; }
    .upload-zone-text { font-size:15px;font-weight:700;color:var(--dark); }
    .upload-zone-types { display:flex;gap:8px;flex-wrap:wrap;justify-content:center; }
    .upload-zone-types span { font-size:11px;font-weight:700;color:var(--tl);background:#f5f7fa;border:1px solid var(--border);border-radius:99px;padding:3px 12px; }
    .spin { animation:spinAnim 1s linear infinite; }
    @keyframes spinAnim { to{transform:rotate(360deg)} }
    .files-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px; }
    .file-card { display:flex;align-items:center;gap:14px;padding:16px 18px;background:white;border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow-sm);transition:all .25s;animation:slideUp .4s var(--delay,0s) ease both; }
    .file-card:hover { transform:translateY(-2px);box-shadow:var(--shadow-md);border-color:rgba(27,127,196,.3); }
    .file-ico { width:46px;height:46px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center; }
    .fi-pdf { background:rgba(220,38,38,.08);border:1.5px solid rgba(220,38,38,.2);color:#dc2626; }
    .fi-image { background:rgba(34,197,94,.08);border:1.5px solid rgba(34,197,94,.2);color:#16a34a; }
    .fi-doc { background:var(--PL);border:1.5px solid rgba(27,127,196,.2);color:var(--P); }
    .file-info { flex:1;min-width:0; }
    .file-name { font-size:13px;font-weight:600;color:var(--dark);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .file-meta { font-size:11.5px;color:var(--tl);margin-top:2px; }
    .file-actions { display:flex;gap:5px;flex-shrink:0; }
    .fa-btn { width:32px;height:32px;border-radius:8px;background:#f5f7fa;border:1px solid var(--border);color:var(--tl);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;text-decoration:none; }
    .fa-btn:hover { background:var(--PL);border-color:var(--P);color:var(--P);transform:scale(1.1); }
    .fa-del:hover { background:rgba(220,38,38,.08);border-color:rgba(220,38,38,.3);color:#dc2626; }
    .empty-state { text-align:center;padding:60px 24px;background:white;border-radius:18px;border:1px solid var(--border);box-shadow:var(--shadow-sm); }
    .empty-icon-wrap { width:80px;height:80px;border-radius:50%;background:var(--PL);border:2px solid rgba(27,127,196,.15);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;animation:floatIco 3s ease-in-out infinite; }
    @keyframes floatIco { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    .empty-icon { font-size:36px; }
    .empty-title { font-size:17px;font-weight:700;color:var(--dark);margin-bottom:6px; }
    .empty-sub { font-size:14px;color:var(--tl); }
    @media (max-width:700px) { .doss-title{font-size:34px} .pc-content{flex-direction:column} .pc-doctor{width:100%} .files-grid{grid-template-columns:1fr} .doss-tabs{flex-direction:column} }
  `]
})
export class PatientDossierPublicComponent implements OnInit {
  auth    = inject(AuthService);
  toast   = inject(ToastService);
  docsSvc = inject(DocumentsService);
  http    = inject(HttpClient);

  activeTab    = signal('ordonnances');
  ordonnances  = signal<Ordonnance[]>([]);
  loadingOrds  = signal(false);
  uploading    = signal(false);

  private readonly BASE = 'http://localhost:5000';

 ngOnInit() {
  this.loadOrdonnances();
  const user = this.auth.user();
  const pid = user?.patientId ?? user?.id?.toString() ?? '';
  if (pid) {
    this.docsSvc.loadForPatient(pid);
  }
}

  async loadOrdonnances() {
    const user = this.auth.user();
    if (!user) return;

    this.loadingOrds.set(true);
    try {
      const patientId = user.patientId ?? user.id;
      const data = await firstValueFrom(
        this.http.get<Ordonnance[]>(`${environment.apiUrl}/ordonnances/patient/${patientId}`)
      );
      this.ordonnances.set(data);
    } catch {
      this.ordonnances.set([]);
    }
    this.loadingOrds.set(false);
  }

async onFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const user = this.auth.user();
  console.log('USER:', user);
  console.log('patientId:', user?.patientId);
  console.log('file:', file.name, file.size);

  if (!user) {
    this.toast.error('Erreur', 'Utilisateur non connecté');
    return;
  }

  const patientId = user.patientId ?? user.id?.toString() ?? '';
  console.log('patientId used:', patientId);

  if (!patientId) {
    this.toast.error('Erreur', 'PatientId introuvable');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    this.toast.error('Fichier trop volumineux', 'Max 10MB');
    return;
  }

  this.uploading.set(true);
  const doc = await this.docsSvc.upload(file, patientId, 'patient');
  this.uploading.set(false);

  console.log('doc result:', doc);

  if (doc) {
    this.toast.success('Fichier envoyé !', file.name + ' — le médecin peut maintenant le consulter');
  } else {
    this.toast.error('Erreur', 'Impossible d\'envoyer le fichier.');
  }
  (event.target as HTMLInputElement).value = '';
}
  async deleteFile(id: number) {
    const ok = await this.docsSvc.delete(id);
    if (ok) {
      this.toast.success('Fichier supprimé');
    }
  }

  getFileUrl(path: string): string {
    return `${this.BASE}${path}`;
  }
  

  getFileClass(fileType: string): string {
    if (fileType?.includes('pdf')) return 'file-ico fi-pdf';
    if (fileType?.includes('image')) return 'file-ico fi-image';
    return 'file-ico fi-doc';
  }
}