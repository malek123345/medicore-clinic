import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CasCliniquesService, CasClinique } from '../../../core/services/cas-cliniques.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-secretaire-cas-cliniques',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="scc-page" [class.dark]="theme.isDark()">

  <!-- AMBIENT -->
  <div class="ambient-bg">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="grid-overlay"></div>
  </div>

  <!-- HEADER -->
  <div class="page-hd">
    <div class="page-hd-left">
      <div class="page-eyebrow">
        <a routerLink="/doctor/dashboard" class="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Dashboard
        </a>
        <span class="sep">·</span>
        <span class="role-chip">Gestion Cas Cliniques</span>
      </div>
      <h1 class="page-title">
        Cas <span class="accent-text">Cliniques</span>
      </h1>
      <p class="page-sub">Gérez la galerie avant/après visible sur le site public</p>
    </div>
    <button class="btn-primary" (click)="openModal()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Nouveau Cas
    </button>
  </div>

  <!-- STATS BAR -->
  <div class="stats-row">
    <div class="stat-pill">
      <div class="stat-pill-val">{{ svc.cases().length }}</div>
      <div class="stat-pill-lbl">Total cas</div>
    </div>
    <div class="stat-pill" style="--pc:#1b7fc4;--pcb:rgba(27,127,196,0.12)">
      <div class="stat-pill-val">{{ countCat('parodontologie') }}</div>
      <div class="stat-pill-lbl">Parodontologie</div>
    </div>
    <div class="stat-pill" style="--pc:#17a2b8;--pcb:rgba(23,162,184,0.12)">
      <div class="stat-pill-val">{{ countCat('implantologie') }}</div>
      <div class="stat-pill-lbl">Implantologie</div>
    </div>
    <div class="stat-pill" style="--pc:#155f9a;--pcb:rgba(21,95,154,0.12)">
      <div class="stat-pill-val">{{ countCat('chirurgie') }}</div>
      <div class="stat-pill-lbl">Chirurgie</div>
    </div>
  </div>

  <!-- FILTERS -->
  <div class="filter-bar">
    @for (f of filters; track f.id) {
      <button class="fbtn" [class.active]="activeFilter()===f.id" (click)="activeFilter.set(f.id)">
        {{ f.label }}
      </button>
    }
  </div>

  <!-- CARDS GRID -->
  <div class="cases-grid">
    @for (cas of filteredCases(); track cas.id; let i = $index) {
      <div class="case-card" [style.animation-delay]="(i*0.08)+'s'">

        <!-- COMPARISON SLIDER -->
        <div class="comparison-wrap" #ctnr
          (mousedown)="startDrag($event, cas, ctnr)"
          (touchstart)="startDrag($event, cas, ctnr)">
          <!-- After -->
          <div class="img-layer img-after"
            [style.background-image]="cas.afterImg ? 'url('+cas.afterImg+')' : 'none'"
            [style.background]="!cas.afterImg ? 'linear-gradient(135deg,#059669,#047857)' : ''">
            @if (!cas.afterImg) {
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            }
          </div>
          <!-- Before overlay -->
          <div class="img-before-overlay" [style.width]="cas.sliderPos+'%'">
            <div class="img-layer img-before"
              [style.background-image]="cas.beforeImg ? 'url('+cas.beforeImg+')' : 'none'"
              [style.background]="!cas.beforeImg ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : ''">
              @if (!cas.beforeImg) {
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              }
            </div>
          </div>
          <!-- Handle -->
          <div class="slider-handle" [style.left]="cas.sliderPos+'%'">
            <div class="slider-line"></div>
            <div class="slider-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1b7fc4" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1b7fc4" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <!-- Labels -->
          <div class="img-labels">
            <span class="img-label avant-lbl">AVANT</span>
            <span class="img-label apres-lbl">APRÈS</span>
          </div>
          <!-- Delete btn -->
          <button class="del-btn" (click)="deleteCase(cas.id)" title="Supprimer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>

        <!-- INFO -->
        <div class="case-info">
          <span class="case-cat" [style.color]="cas.catColor" [style.background]="cas.catColor+'18'">{{ cas.category }}</span>
          <div class="case-title">{{ cas.titre }}</div>
          <div class="case-meta">
            <span class="case-meta-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              {{ cas.traitement }}
            </span>
            <span class="case-meta-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ cas.duree }}
            </span>
          </div>
          <div class="case-tags">
            @for (tag of cas.tags.slice(0,3); track tag) {
              <span class="ctag">{{ tag }}</span>
            }
          </div>
          <div class="case-date">Ajouté le {{ formatDate(cas.createdAt) }}</div>
        </div>
      </div>
    }

    <!-- EMPTY -->
    @if (filteredCases().length === 0) {
      <div class="empty-full">
        <div class="empty-ico">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <p class="empty-t">Aucun cas clinique</p>
        <p class="empty-s">Cliquez sur "Nouveau Cas" pour commencer</p>
        <button class="btn-primary" style="margin-top:12px" (click)="openModal()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Ajouter un cas
        </button>
      </div>
    }
  </div>

  <!-- ════════════════ MODAL AJOUT ════════════════ -->
  @if (showModal()) {
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">

        <div class="modal-hd">
          <div>
            <div class="modal-eye">Nouvelle entrée</div>
            <div class="modal-title">Ajouter un Cas Clinique</div>
          </div>
          <button class="modal-close" (click)="closeModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- TITRE -->
          <div class="field">
            <label class="field-lbl">Titre du cas *</label>
            <input class="field-inp" type="text" [(ngModel)]="form.titre" placeholder="Ex: Correction du sourire gingival"/>
          </div>

          <!-- CATEGORIE -->
          <div class="field">
            <label class="field-lbl">Catégorie *</label>
            <div class="radio-group">
              @for (cat of categories; track cat.id) {
                <label class="radio-item" [class.active]="form.categorie===cat.id" (click)="form.categorie=cat.id; form.category=cat.label; form.catColor=cat.color">
                  <span class="radio-dot" [style.background]="cat.color"></span>
                  {{ cat.label }}
                </label>
              }
            </div>
          </div>

          <!-- IMAGES UPLOAD -->
          <div class="upload-row">
            <div class="upload-zone" [class.has-img]="form.beforeImg" (click)="triggerUpload('before')">
              @if (form.beforeImg) {
                <img [src]="form.beforeImg" alt="Avant" class="upload-preview"/>
                <div class="upload-overlay">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Changer
                </div>
              } @else {
                <div class="upload-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span>Photo AVANT</span>
                  <span class="upload-hint">Cliquez pour uploader</span>
                </div>
              }
              <div class="upload-badge avant-badge">AVANT</div>
            </div>
            <input #beforeInput type="file" accept="image/*" style="display:none" (change)="onFileChange($event, 'before')"/>

            <div class="upload-zone" [class.has-img]="form.afterImg" (click)="triggerUpload('after')">
              @if (form.afterImg) {
                <img [src]="form.afterImg" alt="Après" class="upload-preview"/>
                <div class="upload-overlay">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Changer
                </div>
              } @else {
                <div class="upload-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span>Photo APRÈS</span>
                  <span class="upload-hint">Cliquez pour uploader</span>
                </div>
              }
              <div class="upload-badge apres-badge">APRÈS</div>
            </div>
            <input #afterInput type="file" accept="image/*" style="display:none" (change)="onFileChange($event, 'after')"/>
          </div>

          <!-- TRAITEMENT + DUREE -->
          <div class="field-row">
            <div class="field">
              <label class="field-lbl">Traitement *</label>
              <input class="field-inp" type="text" [(ngModel)]="form.traitement" placeholder="Ex: Greffe gingivale"/>
            </div>
            <div class="field">
              <label class="field-lbl">Durée *</label>
              <input class="field-inp" type="text" [(ngModel)]="form.duree" placeholder="Ex: 3 mois"/>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <div class="field">
            <label class="field-lbl">Description</label>
            <textarea class="field-inp field-ta" [(ngModel)]="form.description" placeholder="Description du cas clinique..." rows="3"></textarea>
          </div>

          <!-- TAGS -->
          <div class="field">
            <label class="field-lbl">Tags (séparés par virgule)</label>
            <input class="field-inp" type="text" [(ngModel)]="tagsInput" placeholder="Ex: Implant, Greffe osseuse, Couronne"/>
          </div>

          <!-- ERROR -->
          @if (formError()) {
            <div class="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ formError() }}
            </div>
          }
        </div>

        <div class="modal-ft">
          <button class="btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn-primary" (click)="submitForm()" [disabled]="submitting()">
            @if (submitting()) {
              <div class="spinner"></div>
              Enregistrement...
            } @else {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Ajouter le cas
            }
          </button>
        </div>
      </div>
    </div>
  }

  <!-- CONFIRM DELETE -->
  @if (confirmDeleteId()) {
    <div class="modal-overlay" (click)="confirmDeleteId.set(null)">
      <div class="confirm-box" (click)="$event.stopPropagation()">
        <div class="confirm-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <div class="confirm-title">Supprimer ce cas ?</div>
        <div class="confirm-sub">Cette action est irréversible. Le cas sera retiré de la galerie publique.</div>
        <div class="confirm-actions">
          <button class="btn-ghost" (click)="confirmDeleteId.set(null)">Annuler</button>
          <button class="btn-danger" (click)="confirmDelete()">Supprimer</button>
        </div>
      </div>
    </div>
  }

</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

    .scc-page {
      --P: #1d6ae5; --P2: #1558c9; --P3: #4d8ef0;
      --Pl: rgba(29,106,229,0.07); --Pl2: rgba(29,106,229,0.13);
      --bg: #f0f4fc; --bg3: #ffffff;
      --border: rgba(29,106,229,0.1); --border2: rgba(29,106,229,0.18);
      --txt: #0c1b3d; --txt2: #2d3f6b; --txt3: #5a6f9a; --txt4: #8d9fbb;
      --glass-bg: rgba(255,255,255,0.65);
      --glass-border: rgba(255,255,255,0.9);
      --card-shadow: 0 2px 12px rgba(29,106,229,0.08), 0 20px 40px rgba(29,106,229,0.06);
      --pc: #8b5cf6; --pcb: rgba(139,92,246,0.12);

      font-family: 'Outfit', system-ui, sans-serif;
      display: flex; flex-direction: column; gap: 24px;
      min-height: calc(100vh - 48px);
      position: relative;
      animation: pageIn .6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .scc-page.dark {
      --P: #4d8ef0; --Pl: rgba(77,142,240,0.1); --Pl2: rgba(77,142,240,0.18);
      --bg: #080e1e; --bg3: #111f35;
      --border: rgba(77,142,240,0.1); --border2: rgba(77,142,240,0.2);
      --txt: #e8f0ff; --txt2: #b0c4e8; --txt3: #607898; --txt4: #3d5070;
      --glass-bg: rgba(17,31,53,0.8); --glass-border: rgba(77,142,240,0.15);
      --card-shadow: 0 4px 24px rgba(0,0,0,0.35);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes pageIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }

    /* AMBIENT */
    .ambient-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
    .orb { position:absolute; border-radius:100%; filter:blur(70px); opacity:.35; }
    .scc-page.dark .orb { opacity:.15; }
    .orb-1 { width:450px; height:450px; top:-80px; left:-60px; background:radial-gradient(circle,#c7d9fc,#93b4f8); animation:o1 18s ease-in-out infinite; }
    .scc-page.dark .orb-1 { background:radial-gradient(circle,#1a3a6e,#0d2147); }
    .orb-2 { width:350px; height:350px; bottom:10%; right:-40px; background:radial-gradient(circle,#e8d5ff,#c4a9f9); animation:o2 22s ease-in-out infinite; }
    .scc-page.dark .orb-2 { background:radial-gradient(circle,#1e1045,#110929); }
    @keyframes o1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
    @keyframes o2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,25px)} }
    .grid-overlay { position:absolute; inset:0; background-image:linear-gradient(rgba(29,106,229,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(29,106,229,0.04) 1px,transparent 1px); background-size:48px 48px; }

    /* HEADER */
    .page-hd { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap; position:relative; z-index:1; }
    .page-eyebrow { display:flex; align-items:center; gap:10px; font-size:11px; font-weight:700; color:var(--txt4); text-transform:uppercase; letter-spacing:.09em; margin-bottom:10px; }
    .back-btn { display:flex; align-items:center; gap:5px; color:var(--P); text-decoration:none; font-size:12px; font-weight:700; transition:all .2s; }
    .back-btn:hover { opacity:.8; transform:translateX(-2px); }
    .sep { color:var(--border2); }
    .role-chip { background:var(--Pl2); color:var(--P); padding:2px 10px; border-radius:99px; border:1px solid var(--border2); font-size:10px; }
    .page-title { font-size:32px; font-weight:900; color:var(--txt); letter-spacing:-1.2px; margin-bottom:6px; }
    .accent-text { background:linear-gradient(135deg,var(--P),#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .page-sub { font-size:13px; color:var(--txt3); }

    .btn-primary { display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:14px; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif; background:linear-gradient(135deg,var(--P),#6366f1); color:#fff; border:none; cursor:pointer; box-shadow:0 4px 16px rgba(29,106,229,.35); transition:all .3s cubic-bezier(0.34,1.56,0.64,1); }
    .btn-primary:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 24px rgba(29,106,229,.45); }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
    .btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:14px; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif; background:var(--glass-bg); color:var(--txt2); border:1.5px solid var(--glass-border); cursor:pointer; transition:all .25s; }
    .btn-ghost:hover { color:var(--P); border-color:var(--P); }
    .btn-danger { display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:14px; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif; background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; border:none; cursor:pointer; box-shadow:0 4px 16px rgba(239,68,68,.3); transition:all .25s; }
    .btn-danger:hover { transform:translateY(-2px); }

    /* STATS ROW */
    .stats-row { display:flex; gap:14px; position:relative; z-index:1; flex-wrap:wrap; }
    .stat-pill { background:var(--glass-bg); backdrop-filter:blur(16px); border:1.5px solid var(--glass-border); border-radius:16px; padding:16px 22px; display:flex; flex-direction:column; gap:4px; min-width:120px; box-shadow:var(--card-shadow); transition:all .3s; }
    .stat-pill:hover { transform:translateY(-3px); }
    .stat-pill-val { font-size:28px; font-weight:900; color:var(--pc, var(--P)); letter-spacing:-1px; }
    .stat-pill-lbl { font-size:10px; color:var(--txt4); font-weight:700; text-transform:uppercase; letter-spacing:.07em; }

    /* FILTERS */
    .filter-bar { display:flex; gap:8px; flex-wrap:wrap; position:relative; z-index:1; }
    .fbtn { padding:8px 18px; border-radius:99px; border:1.5px solid var(--border); background:var(--glass-bg); font-size:12.5px; font-weight:600; color:var(--txt3); cursor:pointer; font-family:'Outfit',sans-serif; transition:all .2s; backdrop-filter:blur(8px); }
    .fbtn:hover { border-color:var(--P); color:var(--P); }
    .fbtn.active { background:var(--P); color:white; border-color:var(--P); box-shadow:0 3px 12px rgba(29,106,229,.3); }

    /* GRID */
    .cases-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:22px; position:relative; z-index:1; padding-bottom:32px; }

    /* CASE CARD */
    .case-card { background:var(--glass-bg); backdrop-filter:blur(20px); border:1.5px solid var(--glass-border); border-radius:20px; overflow:hidden; box-shadow:var(--card-shadow); animation:cardIn .6s cubic-bezier(0.34,1.56,0.64,1) both; transition:transform .3s cubic-bezier(0.34,1.56,0.64,1),box-shadow .3s; }
    @keyframes cardIn { from{opacity:0;transform:translateY(20px) scale(.96)} to{opacity:1;transform:none} }
    .case-card:hover { transform:translateY(-5px); box-shadow:0 16px 44px rgba(29,106,229,.14); }

    /* COMPARISON */
    .comparison-wrap { position:relative; width:100%; aspect-ratio:16/10; overflow:hidden; cursor:ew-resize; user-select:none; }
    .img-layer { position:absolute; inset:0; background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; }
    .img-after { background:linear-gradient(135deg,#059669,#047857); }
    .img-before-overlay { position:absolute; top:0; left:0; bottom:0; overflow:hidden; }
    .img-before { position:absolute; inset:0; background:linear-gradient(135deg,#dc2626,#b91c1c); background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; width:100%; height:100%; }
    .slider-handle { position:absolute; top:0; bottom:0; width:3px; transform:translateX(-50%); z-index:5; pointer-events:none; }
    .slider-line { position:absolute; top:0; bottom:0; width:3px; background:white; box-shadow:0 0 8px rgba(0,0,0,.3); }
    .slider-btn { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:38px; height:38px; background:white; border-radius:50%; box-shadow:0 4px 14px rgba(0,0,0,.2); display:flex; align-items:center; justify-content:center; gap:1px; }
    .img-labels { position:absolute; top:10px; left:10px; right:10px; display:flex; justify-content:space-between; pointer-events:none; z-index:6; }
    .img-label { background:rgba(0,0,0,.6); color:white; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700; backdrop-filter:blur(6px); }
    .avant-lbl { color:#fca5a5; }
    .apres-lbl { color:#86efac; }
    .del-btn { position:absolute; top:10px; right:10px; width:32px; height:32px; border-radius:9px; background:rgba(239,68,68,.85); backdrop-filter:blur(8px); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:white; z-index:7; transition:all .2s; box-shadow:0 2px 8px rgba(239,68,68,.3); }
    .del-btn:hover { background:#dc2626; transform:scale(1.1); }

    /* CASE INFO */
    .case-info { padding:16px 18px 18px; }
    .case-cat { display:inline-block; font-size:10.5px; font-weight:700; padding:3px 10px; border-radius:99px; margin-bottom:8px; }
    .case-title { font-size:15px; font-weight:800; color:var(--txt); margin-bottom:8px; line-height:1.35; }
    .case-meta { display:flex; gap:14px; margin-bottom:10px; }
    .case-meta-item { display:flex; align-items:center; gap:5px; font-size:12px; color:var(--txt4); }
    .case-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
    .ctag { background:var(--Pl); color:var(--P); padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; border:1px solid var(--border2); }
    .case-date { font-size:10.5px; color:var(--txt4); }

    /* EMPTY */
    .empty-full { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; gap:12px; padding:60px 20px; text-align:center; }
    .empty-ico { width:64px; height:64px; border-radius:18px; background:var(--Pl); display:flex; align-items:center; justify-content:center; color:var(--P); }
    .empty-t { font-size:16px; font-weight:700; color:var(--txt2); }
    .empty-s { font-size:13px; color:var(--txt4); }

    /* MODAL */
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(8px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn .2s; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .modal-box { background:var(--bg3); border-radius:24px; width:100%; max-width:580px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 80px rgba(0,0,0,.3); animation:slideUp .35s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes slideUp { from{opacity:0;transform:translateY(30px) scale(.96)} to{opacity:1;transform:none} }
    .modal-hd { display:flex; align-items:flex-start; justify-content:space-between; padding:24px 24px 18px; border-bottom:1px solid var(--border); }
    .modal-eye { font-size:10px; font-weight:700; color:var(--txt4); text-transform:uppercase; letter-spacing:.1em; margin-bottom:4px; }
    .modal-title { font-size:18px; font-weight:900; color:var(--txt); }
    .modal-close { width:34px; height:34px; border-radius:10px; border:1px solid var(--border); background:var(--Pl); color:var(--txt3); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
    .modal-close:hover { background:rgba(239,68,68,.1); color:#ef4444; border-color:rgba(239,68,68,.3); }
    .modal-body { padding:22px 24px; display:flex; flex-direction:column; gap:18px; }
    .modal-ft { display:flex; gap:12px; justify-content:flex-end; padding:18px 24px; border-top:1px solid var(--border); }

    /* FIELDS */
    .field { display:flex; flex-direction:column; gap:7px; }
    .field-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .field-lbl { font-size:12px; font-weight:700; color:var(--txt2); }
    .field-inp { padding:11px 14px; border-radius:12px; border:1.5px solid var(--border2); background:var(--Pl); color:var(--txt); font-size:13.5px; font-family:'Outfit',sans-serif; outline:none; transition:border-color .2s; width:100%; }
    .field-inp:focus { border-color:var(--P); box-shadow:0 0 0 3px rgba(29,106,229,.1); }
    .field-ta { resize:vertical; min-height:80px; }

    /* RADIO */
    .radio-group { display:flex; gap:10px; flex-wrap:wrap; }
    .radio-item { display:flex; align-items:center; gap:8px; padding:9px 16px; border-radius:12px; border:1.5px solid var(--border2); cursor:pointer; font-size:13px; font-weight:600; color:var(--txt3); background:var(--Pl); transition:all .2s; }
    .radio-item.active { border-color:var(--P); color:var(--P); background:var(--Pl2); }
    .radio-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

    /* UPLOAD */
    .upload-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .upload-zone { position:relative; aspect-ratio:4/3; border-radius:14px; border:2px dashed var(--border2); background:var(--Pl); cursor:pointer; overflow:hidden; transition:all .2s; display:flex; align-items:center; justify-content:center; }
    .upload-zone:hover { border-color:var(--P); background:var(--Pl2); }
    .upload-zone.has-img { border-style:solid; border-color:var(--border2); }
    .upload-placeholder { display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--txt4); }
    .upload-placeholder span { font-size:12.5px; font-weight:700; color:var(--txt3); }
    .upload-hint { font-size:10.5px; color:var(--txt4); font-weight:500 !important; }
    .upload-preview { width:100%; height:100%; object-fit:cover; }
    .upload-overlay { position:absolute; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; gap:6px; color:white; font-size:12px; font-weight:700; opacity:0; transition:opacity .2s; }
    .upload-zone.has-img:hover .upload-overlay { opacity:1; }
    .upload-badge { position:absolute; top:8px; left:8px; padding:3px 9px; border-radius:99px; font-size:10px; font-weight:700; }
    .avant-badge { background:rgba(220,38,38,.75); color:white; }
    .apres-badge { background:rgba(5,150,105,.75); color:white; }

    /* ERROR / SPINNER */
    .form-error { display:flex; align-items:center; gap:8px; padding:12px 14px; border-radius:12px; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25); color:#dc2626; font-size:13px; font-weight:600; }
    .spinner { width:16px; height:16px; border:2.5px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }

    /* CONFIRM */
    .confirm-box { background:var(--bg3); border-radius:20px; padding:32px; width:100%; max-width:380px; box-shadow:0 24px 60px rgba(0,0,0,.25); display:flex; flex-direction:column; align-items:center; gap:14px; text-align:center; animation:slideUp .3s cubic-bezier(0.34,1.56,0.64,1); }
    .confirm-ico { width:56px; height:56px; border-radius:16px; background:rgba(239,68,68,.1); display:flex; align-items:center; justify-content:center; }
    .confirm-title { font-size:17px; font-weight:900; color:var(--txt); }
    .confirm-sub { font-size:13px; color:var(--txt3); line-height:1.6; }
    .confirm-actions { display:flex; gap:10px; width:100%; }
    .confirm-actions .btn-ghost, .confirm-actions .btn-danger { flex:1; justify-content:center; }

    @media (max-width:600px) { .upload-row { grid-template-columns:1fr; } .field-row { grid-template-columns:1fr; } .cases-grid { grid-template-columns:1fr; } .stats-row { grid-template-columns:1fr 1fr; } }
  `]
})
export class SecretaireCasCliniquesComponent {
  svc   = inject(CasCliniquesService);
  theme = inject(ThemeService);

  activeFilter = signal('tous');
  showModal    = signal(false);
  submitting   = signal(false);
  formError    = signal('');
  confirmDeleteId = signal<number | null>(null);
  tagsInput = '';

  readonly filters = [
    { id:'tous',           label:'Tous les cas' },
    { id:'parodontologie', label:'Parodontologie' },
    { id:'implantologie',  label:'Implantologie' },
    { id:'chirurgie',      label:'Chirurgie' },
  ];

  readonly categories = [
    { id:'parodontologie' as const, label:'Parodontologie', color:'#1b7fc4' },
    { id:'implantologie'  as const, label:'Implantologie',  color:'#17a2b8' },
    { id:'chirurgie'      as const, label:'Chirurgie',      color:'#155f9a' },
  ];

  form = this.emptyForm();

  private emptyForm() {
    return {
      titre: '', categorie: 'parodontologie' as 'parodontologie'|'implantologie'|'chirurgie',
      category: 'Parodontologie', catColor: '#1b7fc4',
      beforeImg: '', afterImg: '', description: '',
      traitement: '', duree: '', tags: [] as string[],
    };
  }

  filteredCases = computed(() => {
    const f = this.activeFilter();
    return f === 'tous' ? this.svc.cases() : this.svc.cases().filter(c => c.categorie === f);
  });

  countCat(cat: string) { return this.svc.cases().filter(c => c.categorie === cat).length; }

  openModal()  { this.form = this.emptyForm(); this.tagsInput = ''; this.formError.set(''); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  // FILE UPLOAD
  private beforeInputEl: HTMLInputElement | null = null;
  private afterInputEl: HTMLInputElement | null = null;

  triggerUpload(which: 'before' | 'after') {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = (e) => this.onFileChange(e as any, which);
    inp.click();
  }

  onFileChange(event: Event, which: 'before' | 'after') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (which === 'before') this.form.beforeImg = e.target?.result as string;
      else this.form.afterImg = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitForm() {
    this.formError.set('');
    if (!this.form.titre.trim())      { this.formError.set('Le titre est requis.'); return; }
    if (!this.form.traitement.trim()) { this.formError.set('Le traitement est requis.'); return; }
    if (!this.form.duree.trim())      { this.formError.set('La durée est requise.'); return; }
    if (!this.form.beforeImg)         { this.formError.set('La photo AVANT est requise.'); return; }
    if (!this.form.afterImg)          { this.formError.set('La photo APRÈS est requise.'); return; }

    this.submitting.set(true);
    const tags = this.tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    setTimeout(() => {
      this.svc.add({ ...this.form, tags });
      this.submitting.set(false);
      this.closeModal();
    }, 600);
  }

  deleteCase(id: number) { this.confirmDeleteId.set(id); }
  confirmDelete() {
    const id = this.confirmDeleteId();
    if (id !== null) { this.svc.remove(id); this.confirmDeleteId.set(null); }
  }

  formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
  }

  // SLIDER DRAG
  private isDragging = false;
  private currentCase: CasClinique | null = null;
  private currentContainer: HTMLElement | null = null;

  startDrag(event: MouseEvent | TouchEvent, cas: CasClinique, container: HTMLElement) {
    event.preventDefault();
    this.isDragging = true; this.currentCase = cas; this.currentContainer = container;
    const move = (e: MouseEvent | TouchEvent) => {
      if (!this.isDragging || !this.currentCase || !this.currentContainer) return;
      const rect = this.currentContainer.getBoundingClientRect();
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const pos = ((clientX - rect.left) / rect.width) * 100;
      this.svc.updateSlider(this.currentCase.id, Math.max(2, Math.min(98, pos)));
    };
    const end = () => {
      this.isDragging = false; this.currentCase = null; this.currentContainer = null;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', end);
  }
}