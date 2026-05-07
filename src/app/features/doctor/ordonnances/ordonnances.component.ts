import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierService } from '../../../core/services/dossier.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-ordonnances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="page-wrap">

  <!-- ══ BG ══ -->
  <div class="page-bg" aria-hidden="true">
    <div class="pg-orb pg-orb1"></div>
    <div class="pg-orb pg-orb2"></div>
    <div class="pg-orb pg-orb3"></div>
    <div class="pg-grid"></div>
    <svg class="pg-ecg" viewBox="0 0 900 60" preserveAspectRatio="none">
      <polyline class="pg-ecg-line" points="0,30 60,30 75,30 82,8 90,52 97,30 120,30 180,30 195,30 202,8 210,52 217,30 240,30 300,30 315,30 322,8 330,52 337,30 360,30 420,30 435,30 442,8 450,52 457,30 480,30 540,30 555,30 562,8 570,52 577,30 600,30 660,30 675,30 682,8 690,52 697,30 720,30 780,30 795,30 802,8 810,52 817,30 840,30 900,30"/>
    </svg>
    <div class="cross-float cf1">✚</div>
    <div class="cross-float cf2">✚</div>
    <div class="cross-float cf3">💊</div>
  </div>

  <!-- ══ DETAIL MODAL ══ -->
  @if (detailOrd()) {
    <div class="modal-veil" (click)="detailOrd.set(null)">
      <div class="modal-box detail-box" (click)="$event.stopPropagation()">
        <div class="modal-rainbow" [style.background]="'linear-gradient(90deg,'+getGrad(detailOrd()!.patientName).replace('linear-gradient(135deg,','').replace(')','')+')'"></div>
        <div class="modal-hd">
          <div class="modal-hd-left">
            <div class="modal-av" [style.background]="getGrad(detailOrd()!.patientName)">
              {{ detailOrd()!.patientName[0] }}{{ detailOrd()!.patientName.split(' ')[1]?.[0] ?? '' }}
            </div>
            <div>
              <div class="modal-title">{{ detailOrd()!.patientName }}</div>
              <div class="modal-sub">{{ detailOrd()!.id }} · {{ detailOrd()!.date }} · {{ detailOrd()!.doctorName }}</div>
            </div>
          </div>
          <button class="modal-x" (click)="detailOrd.set(null)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="detail-body">
          <div class="detail-section-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
            Médicaments prescrits
          </div>
          @for (med of detailOrd()!.medications; track med.name) {
            <div class="detail-med-row">
              <div class="detail-med-num">{{ $index + 1 }}</div>
              <div class="detail-med-info">
                <div class="detail-med-name">{{ med.name }}</div>
                <div class="detail-med-sub">{{ med.dosage ?? med.dose }} · {{ med.freq }}</div>
              </div>
              <div class="detail-med-dur">{{ med.duration ?? med.duree }}</div>
            </div>
          }
          @if (detailOrd()!.notes) {
            <div class="detail-notes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ detailOrd()!.notes }}
            </div>
          }
        </div>
        <div class="detail-ft">
          <button class="ord-btn ord-btn-print" (click)="printOrd(detailOrd()!)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Imprimer
          </button>
          <button class="ord-btn ord-btn-download" (click)="downloadOrd(detailOrd()!)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Télécharger PDF
          </button>
          <button class="ord-btn-close" (click)="detailOrd.set(null)">Fermer</button>
        </div>
      </div>
    </div>
  }

  <!-- ══ ADD FORM MODAL ══ -->
  @if (showAdd()) {
    <div class="modal-veil" (click)="showAdd.set(false)">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-rainbow"></div>
        <div class="modal-hd">
          <div class="modal-hd-left">
            <div class="modal-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
              </svg>
            </div>
            <div>
              <div class="modal-title">Nouvelle Ordonnance</div>
              <div class="modal-sub">Rédiger et enregistrer une prescription médicale</div>
            </div>
          </div>
          <button class="modal-x" (click)="showAdd.set(false)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-body">
          <div class="fc-grid-2">
            <div class="fg">
              <label class="fl">PATIENT</label>
              <div class="fi-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <select class="fi" [(ngModel)]="form.patientId" (change)="onPatientChange()">
                  <option value="">-- Sélectionner un patient --</option>
                  @for (p of patients; track p.id) { <option [value]="p.id">{{ p.name }}</option> }
                </select>
              </div>
            </div>
            <div class="fg">
              <label class="fl">DATE</label>
              <div class="fi-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input class="fi" type="date" [(ngModel)]="form.date"/>
              </div>
            </div>
          </div>

          <div class="meds-section">
            <div class="meds-hd">
              <div class="meds-hd-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
                Médicaments prescrits
              </div>
              <button class="btn-add-med" (click)="addMed()">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Ajouter
              </button>
            </div>
            <div class="meds-list">
              @for (med of form.medications; track $index; let i = $index) {
                <div class="med-row">
                  <div class="med-num">{{ i + 1 }}</div>
                  <div class="med-fields">
                    <div class="fi-wrap"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg><input class="fi" type="text" [(ngModel)]="med.name" placeholder="Médicament"/></div>
                    <div class="fi-wrap"><input class="fi" type="text" [(ngModel)]="med.dose" placeholder="Dose (500mg)"/></div>
                    <div class="fi-wrap"><input class="fi" type="text" [(ngModel)]="med.freq" placeholder="Fréquence"/></div>
                    <div class="fi-wrap"><input class="fi" type="text" [(ngModel)]="med.duree" placeholder="Durée"/></div>
                  </div>
                  <button class="med-rm" (click)="removeMed(i)" [disabled]="form.medications.length === 1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              }
            </div>
          </div>

          <div class="fg">
            <label class="fl">NOTES / INSTRUCTIONS</label>
            <div class="fi-wrap fi-wrap-ta">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <textarea class="fi" [(ngModel)]="form.notes" rows="2" placeholder="Instructions particulières…" style="resize:vertical"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-ft">
          <button class="btn-cancel" (click)="showAdd.set(false)">Annuler</button>
          <button class="btn-save" (click)="submitOrd()" [disabled]="!form.patientId || !form.medications[0].name">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Enregistrer l'ordonnance
            <div class="btn-save-shine"></div>
          </button>
        </div>
      </div>
    </div>
  }

  <!-- ══ HEADER ══ -->
  <div class="pg-hd">
    <div class="pg-hd-left">
      <div class="pg-eyebrow"><span class="pg-live-dot"></span>Gestion des prescriptions</div>
      <h1 class="pg-title">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
        </svg>
        Ordonnances
      </h1>
      <p class="pg-sub">{{ filteredOrdonnances().length }} ordonnance(s) · {{ activeCount() }} actives</p>
    </div>
    <button class="btn-cta" (click)="showAdd.set(true)">
      <div class="btn-cta-ico">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      Nouvelle ordonnance
      <div class="btn-cta-shine"></div>
    </button>
  </div>

  <!-- ══ SEARCH + FILTER ══ -->
  <div class="top-bar">
    <div class="search-wrap" [class.search-focused]="searchFocused">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="search-inp"
        [(ngModel)]="searchQ"
        (focus)="searchFocused=true"
        (blur)="searchFocused=false"
        placeholder="Rechercher par patient, médicament..."/>
      @if (searchQ) {
        <button class="search-clr" (click)="searchQ=''">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      }
    </div>
    <div class="filter-chips">
      <button class="chip" [class.chip-on]="filterStatus()==='all'" (click)="filterStatus.set('all')">
        Toutes <span class="chip-count">{{ ordonnances().length }}</span>
      </button>
      <button class="chip" [class.chip-on]="filterStatus()==='active'" (click)="filterStatus.set('active')">
        <span class="chip-dot chip-dot-green"></span>Actives <span class="chip-count">{{ activeCount() }}</span>
      </button>
      <button class="chip" [class.chip-on]="filterStatus()==='expired'" (click)="filterStatus.set('expired')">
        <span class="chip-dot chip-dot-red"></span>Expirées <span class="chip-count">{{ expiredCount() }}</span>
      </button>
    </div>
    <div class="result-count">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
      {{ filteredOrdonnances().length }} résultat(s)
    </div>
  </div>

  <!-- ══ ORDONNANCES GRID ══ -->
  <div class="ord-grid">
    @for (ord of filteredOrdonnances(); track ord.id; let i = $index) {
      <div class="ord-card" [style.animation-delay]="(i*0.07)+'s'">
        <div class="ord-card-top-band" [style.background]="getGrad(ord.patientName)"></div>
        <div class="ord-shine"></div>
        <div class="ord-hover-glow"></div>

        <!-- Header -->
        <div class="ord-hd">
          <div class="ord-av" [style.background]="getGrad(ord.patientName)">
            {{ ord.patientName[0] }}{{ ord.patientName.split(' ')[1]?.[0] ?? '' }}
          </div>
          <div class="ord-hd-info">
            <div class="ord-patient">{{ ord.patientName }}</div>
            <div class="ord-date-meta">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ ord.date }}
            </div>
          </div>
          <span class="badge" [class]="(ord.status ?? 'active') === 'active' ? 'badge-active' : 'badge-expired'">
            <span class="badge-dot"></span>
            {{ (ord.status ?? 'active') === 'active' ? 'Active' : 'Expirée' }}
          </span>
        </div>

        <div class="ord-divider"></div>

        <!-- Meds -->
        <div class="ord-meds">
          <div class="ord-meds-label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
            Médicaments prescrits
          </div>
          @for (med of ord.medications.slice(0, 3); track med.name) {
            <div class="ord-med-row">
              <div class="ord-med-bullet"></div>
              <div class="ord-med-name">{{ med.name }}</div>
              <span class="ord-med-tag">{{ med.dosage ?? med.dose }}</span>
              <span class="ord-med-dur">{{ med.duration ?? med.duree }}</span>
            </div>
          }
          @if (ord.medications.length > 3) {
            <div class="ord-more-meds">+{{ ord.medications.length - 3 }} médicament(s) de plus</div>
          }
        </div>

        @if (ord.notes) {
          <div class="ord-notes">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ ord.notes }}
          </div>
        }

        <!-- Actions - ALL FUNCTIONAL -->
        <div class="ord-actions">
          <button class="ord-btn ord-btn-print" (click)="printOrd(ord)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Imprimer
          </button>
          <button class="ord-btn ord-btn-download" (click)="downloadOrd(ord)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Télécharger
          </button>
          <button class="ord-btn ord-btn-view" (click)="detailOrd.set(ord)">
            Voir détails
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    }

    @if (filteredOrdonnances().length === 0) {
      <div class="empty-card">
        <div class="empty-ico">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
        </div>
        <div class="empty-title">Aucune ordonnance trouvée</div>
        <div class="empty-sub">{{ searchQ ? 'Essayez un autre terme' : 'Créez votre première ordonnance' }}</div>
        @if (searchQ) {
          <button class="empty-btn" (click)="searchQ=''">Effacer la recherche</button>
        } @else {
          <button class="btn-cta btn-cta-sm" (click)="showAdd.set(true)">
            <div class="btn-cta-ico-sm"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
            Créer une ordonnance
          </button>
        }
      </div>
    }
  </div>

  <!-- ══ TOAST ══ -->
  @if (showToast()) {
    <div class="toast-notif">
      <div class="toast-ico-wrap">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <div class="toast-title">{{ toastMsg().title }}</div>
        <div class="toast-desc">{{ toastMsg().desc }}</div>
      </div>
    </div>
  }
</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    :host { display: block; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

    .page-wrap { position:relative;min-height:100%;display:flex;flex-direction:column;gap:22px;animation:pgIn .55s cubic-bezier(.22,1,.36,1) both; }
    @keyframes pgIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }

    /* ══ BG ══ */
    .page-bg { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
    .pg-orb { position:absolute;border-radius:50%;filter:blur(85px); }
    .pg-orb1 { width:560px;height:560px;top:-130px;right:4%;background:radial-gradient(circle,rgba(124,58,237,0.13),rgba(29,95,224,0.07) 60%,transparent 75%);animation:o1 22s ease-in-out infinite; }
    .pg-orb2 { width:420px;height:420px;bottom:20px;left:6%;background:radial-gradient(circle,rgba(29,95,224,0.11),transparent 70%);animation:o2 28s ease-in-out infinite; }
    .pg-orb3 { width:310px;height:310px;top:40%;right:22%;background:radial-gradient(circle,rgba(14,184,138,0.09),transparent 65%);animation:o3 24s ease-in-out infinite; }
    @keyframes o1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-45px,35px) scale(1.05)} 66%{transform:translate(22px,-28px) scale(.96)} }
    @keyframes o2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(38px,-38px) scale(1.07)} }
    @keyframes o3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-26px,26px) scale(1.08)} }
    .pg-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px);background-size:60px 60px;animation:gridMove 60s linear infinite; }
    @keyframes gridMove { from{background-position:0 0} to{background-position:60px 60px} }
    .pg-ecg { position:absolute;bottom:50px;left:0;width:100%;height:60px;opacity:.07; }
    .pg-ecg-line { fill:none;stroke:var(--violet);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2400;stroke-dashoffset:2400;animation:ecgA 6s ease-in-out infinite; }
    @keyframes ecgA { 0%{stroke-dashoffset:2400;opacity:0} 12%{opacity:1} 85%{stroke-dashoffset:0;opacity:.85} 100%{stroke-dashoffset:0;opacity:0} }
    .cross-float { position:absolute;opacity:.05;animation:cfloat 15s ease-in-out infinite;user-select:none; }
    .cf1 { top:11%;right:9%;font-size:24px;color:var(--violet);animation-duration:17s; }
    .cf2 { top:58%;right:28%;font-size:16px;color:var(--P);animation-duration:13s;animation-delay:-5s; }
    .cf3 { top:32%;left:14%;font-size:26px;animation-duration:19s;animation-delay:-8s; }
    @keyframes cfloat { 0%,100%{transform:translateY(0) rotate(0)} 25%{transform:translateY(-18px) rotate(12deg)} 75%{transform:translateY(18px) rotate(-12deg)} }

    /* ══ HEADER ══ */
    .pg-hd { position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap; }
    .pg-eyebrow { display:flex;align-items:center;gap:8px;font-size:10.5px;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:9px; }
    .pg-live-dot { width:8px;height:8px;border-radius:50%;background:var(--violet);animation:ldot 2.8s ease-in-out infinite;flex-shrink:0; }
    @keyframes ldot { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.6)} 50%{box-shadow:0 0 0 6px rgba(124,58,237,0)} }
    .pg-title { display:flex;align-items:center;gap:12px;font-size:28px;font-weight:900;color:var(--txt);letter-spacing:-1.2px;margin:0 0 6px; }
    .pg-title svg { color:var(--violet); }
    .pg-sub { font-size:13px;color:var(--txt4);margin:0; }

    /* ══ CTA ══ */
    .btn-cta { position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:11px;padding:12px 24px;border-radius:15px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--violet),var(--P));color:white;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 8px 28px rgba(124,58,237,.4),inset 0 1px 0 rgba(255,255,255,.2);transition:all .25s cubic-bezier(.34,1.56,.64,1); }
    .btn-cta:hover { transform:translateY(-3px) scale(1.02);box-shadow:0 12px 36px rgba(124,58,237,.5); }
    .btn-cta-sm { padding:10px 20px;font-size:13px; }
    .btn-cta-ico { width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;animation:iconP 2.5s ease-in-out infinite; }
    .btn-cta-ico-sm { width:22px;height:22px;border-radius:7px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center; }
    @keyframes iconP { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
    .btn-cta-shine,.btn-save-shine { position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);transition:left .5s; }
    .btn-cta:hover .btn-cta-shine,.btn-save:hover .btn-save-shine { left:100%; }

    /* ══ TOP BAR ══ */
    .top-bar { position:relative;z-index:1;display:flex;align-items:center;gap:12px;flex-wrap:wrap; }
    .search-wrap { display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:14px;background:var(--glass);border:1.5px solid var(--gbrd);flex:1;max-width:420px;backdrop-filter:blur(14px);transition:all .25s;color:var(--txt4); }
    .search-wrap:focus-within,.search-focused { border-color:var(--violet)!important;box-shadow:0 0 0 4px rgba(124,58,237,.1),0 4px 16px rgba(124,58,237,.1);transform:translateY(-1px); }
    .search-inp { border:none;background:transparent;outline:none;font-size:13.5px;color:var(--txt2);width:100%;font-family:'Plus Jakarta Sans',sans-serif; }
    .search-inp::placeholder { color:var(--txt4); }
    .search-clr { width:22px;height:22px;border-radius:50%;background:var(--bg2);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--txt4);transition:all .2s; }
    .search-clr:hover { background:rgba(240,66,106,.12);color:var(--rose);transform:rotate(90deg); }
    .filter-chips { display:flex;gap:7px;flex-wrap:wrap; }
    .chip { display:flex;align-items:center;gap:6px;padding:8px 15px;border-radius:11px;border:1.5px solid var(--brd);background:var(--bg2);color:var(--txt3);font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s; }
    .chip:hover { background:var(--Pl);color:var(--P);border-color:rgba(29,95,224,.2); }
    .chip-on { background:var(--Pl2);color:var(--P);border-color:rgba(29,95,224,.3);box-shadow:0 2px 10px rgba(29,95,224,.15); }
    .chip-dot { width:6px;height:6px;border-radius:50%;flex-shrink:0; }
    .chip-dot-green { background:#0eb88a;box-shadow:0 0 6px rgba(14,184,138,.5); }
    .chip-dot-red { background:var(--rose);box-shadow:0 0 6px rgba(240,66,106,.5); }
    .chip-count { font-size:10px;padding:1px 7px;border-radius:99px;background:rgba(29,95,224,.1);color:var(--P);font-weight:700; }
    .result-count { display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--txt4);white-space:nowrap; }

    /* ══ GRID ══ */
    .ord-grid { position:relative;z-index:1;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px; }

    /* ══ ORD CARD ══ */
    .ord-card { position:relative;overflow:hidden;border-radius:20px;background:var(--glass);backdrop-filter:blur(18px);border:1.5px solid var(--gbrd);box-shadow:0 4px 20px rgba(0,0,0,.04);transition:all .3s cubic-bezier(.34,1.56,.64,1);animation:cardIn .6s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(.95)} to{opacity:1;transform:none} }
    .ord-card:hover { transform:translateY(-6px) scale(1.01);box-shadow:0 14px 44px rgba(124,58,237,.18),0 4px 12px rgba(0,0,0,.08);border-color:rgba(124,58,237,.35); }
    .ord-card-top-band { height:4px; }
    .ord-shine { position:absolute;top:4px;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent); }
    .ord-hover-glow { position:absolute;top:50%;left:50%;width:85%;height:85%;background:radial-gradient(circle,rgba(124,58,237,.04),transparent 70%);transform:translate(-50%,-50%);pointer-events:none;opacity:0;transition:opacity .3s; }
    .ord-card:hover .ord-hover-glow { opacity:1; }

    .ord-hd { display:flex;align-items:center;gap:13px;padding:18px 20px 14px; }
    .ord-av { width:46px;height:46px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;box-shadow:0 6px 18px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.2); }
    .ord-patient { font-size:15.5px;font-weight:800;color:var(--txt);letter-spacing:-.3px; }
    .ord-date-meta { display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--txt4);font-weight:600;margin-top:3px; }
    .ord-hd-info { flex:1;min-width:0; }

    .badge { display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;padding:5px 11px;border-radius:99px;white-space:nowrap; }
    .badge-dot { width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:bdot 2.2s ease-in-out infinite; }
    @keyframes bdot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.25)} }
    .badge-active { background:rgba(14,184,138,.12);color:#0eb88a;border:1px solid rgba(14,184,138,.25); }
    .badge-active .badge-dot { background:#0eb88a;box-shadow:0 0 8px rgba(14,184,138,.6); }
    .badge-expired { background:rgba(240,66,106,.1);color:var(--rose);border:1px solid rgba(240,66,106,.22); }
    .badge-expired .badge-dot { background:var(--rose);box-shadow:0 0 8px rgba(240,66,106,.6); }

    .ord-divider { height:1px;background:var(--brd);margin:0 20px; }

    .ord-meds { padding:14px 20px; }
    .ord-meds-label { display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px; }
    .ord-med-row { display:flex;align-items:center;gap:9px;padding:9px 11px;margin-bottom:7px;border-radius:11px;background:var(--Pl);border:1px solid var(--brd);transition:all .2s; }
    .ord-med-row:hover { background:rgba(124,58,237,.08);border-color:rgba(124,58,237,.2);transform:translateX(4px); }
    .ord-med-bullet { width:7px;height:7px;border-radius:50%;background:var(--violet);box-shadow:0 0 7px rgba(124,58,237,.5);flex-shrink:0; }
    .ord-med-name { font-size:13px;font-weight:700;color:var(--txt);flex:1; }
    .ord-med-tag { font-size:10.5px;font-weight:700;color:var(--violet);background:rgba(124,58,237,.1);padding:2px 8px;border-radius:99px;white-space:nowrap; }
    .ord-med-dur { font-size:10.5px;font-weight:600;color:var(--P);background:var(--Pl2);padding:2px 8px;border-radius:99px;white-space:nowrap; }
    .ord-more-meds { font-size:11px;color:var(--txt4);font-style:italic;padding:4px 0; }

    .ord-notes { display:flex;align-items:flex-start;gap:8px;padding:10px 14px;margin:0 20px 14px;background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.15);border-radius:11px;font-size:12px;color:var(--txt3);line-height:1.55; }
    .ord-notes svg { color:var(--violet);flex-shrink:0;margin-top:1px; }

    .ord-actions { display:flex;align-items:center;gap:8px;padding:14px 20px;border-top:1.5px solid var(--brd); }
    .ord-btn { display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:11px;border:1.5px solid var(--brd);background:var(--bg2);color:var(--txt3);font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .22s;flex:1;justify-content:center; }
    .ord-btn:hover { transform:translateY(-2px);box-shadow:0 4px 14px rgba(0,0,0,.1); }
    .ord-btn-print:hover { border-color:var(--P);color:var(--P);background:var(--Pl);box-shadow:0 4px 14px rgba(29,95,224,.2); }
    .ord-btn-download:hover { border-color:#0eb88a;color:#0eb88a;background:rgba(14,184,138,.08);box-shadow:0 4px 14px rgba(14,184,138,.2); }
    .ord-btn-view { background:var(--Pl2);color:var(--P);border-color:rgba(29,95,224,.25); }
    .ord-btn-view:hover { background:linear-gradient(135deg,var(--P),var(--violet));color:white;border-color:var(--P);box-shadow:0 6px 20px rgba(29,95,224,.35); }

    /* ══ EMPTY ══ */
    .empty-card { display:flex;flex-direction:column;align-items:center;gap:16px;padding:70px;border-radius:22px;background:var(--glass);backdrop-filter:blur(18px);border:1.5px dashed var(--gbrd);text-align:center;grid-column:1/-1;animation:emptyIn .6s cubic-bezier(.34,1.56,.64,1); }
    @keyframes emptyIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
    .empty-ico { width:70px;height:70px;border-radius:20px;background:rgba(124,58,237,.1);color:var(--violet);display:flex;align-items:center;justify-content:center;animation:emptyFloat 3.5s ease-in-out infinite; }
    @keyframes emptyFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .empty-title { font-size:17px;font-weight:800;color:var(--txt); }
    .empty-sub { font-size:13.5px;color:var(--txt4); }
    .empty-btn { padding:10px 20px;border-radius:11px;background:var(--bg2);border:1.5px solid var(--brd);color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s; }
    .empty-btn:hover { border-color:var(--P);color:var(--P); }

    /* ══ MODAL ══ */
    .modal-veil { position:fixed;inset:0;z-index:8000;background:rgba(220, 228, 236, 0.55);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;animation:vIn .22s ease; }
    @keyframes vIn { from{opacity:0} to{opacity:1} }
    .modal-box { background:var(--glass);backdrop-filter:blur(32px) saturate(180%);-webkit-backdrop-filter:blur(32px) saturate(180%);border:1.5px solid var(--gbrd);border-radius:24px;box-shadow:0 28px 80px rgba(0,0,0,.28);width:100%;max-width:560px;max-height:88vh;overflow-y:auto;animation:mPop .38s cubic-bezier(.34,1.56,.64,1);position:relative; }
    .detail-box { max-width:600px; }
    @keyframes mPop { from{opacity:0;transform:scale(.9) translateY(22px)} to{opacity:1;transform:none} }
    .modal-rainbow { height:4px;background:linear-gradient(90deg,var(--P),var(--violet),var(--em));border-radius:24px 24px 0 0; }
    .modal-hd { display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--brd); }
    .modal-hd-left { display:flex;align-items:center;gap:13px; }
    .modal-av { width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;box-shadow:0 6px 18px rgba(0,0,0,.2); }
    .modal-ico { width:44px;height:44px;border-radius:13px;background:linear-gradient(135deg,var(--violet),var(--P));display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 6px 20px rgba(124,58,237,.35); }
    .modal-title { font-size:16px;font-weight:800;color:var(--txt); }
    .modal-sub { font-size:11.5px;color:var(--txt4);margin-top:2px; }
    .modal-x { width:32px;height:32px;border-radius:10px;background:var(--bg2);border:1.5px solid var(--brd);color:var(--txt3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s; }
    .modal-x:hover { background:rgba(240,66,106,.1);color:var(--rose);border-color:rgba(240,66,106,.2);transform:rotate(90deg); }

    /* Form inside modal */
    .form-body { padding:20px 24px;display:flex;flex-direction:column;gap:16px; }
    .fc-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
    .fg { display:flex;flex-direction:column;gap:5px; }
    .fl { font-size:10px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em; }
    .fi-wrap { display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:12px;background:rgba(124,58,237,.04);border:1.5px solid var(--brd);color:var(--txt4);transition:all .2s; }
    .fi-wrap-ta { align-items:flex-start; }
    .fi-wrap:focus-within { border-color:var(--violet);background:rgba(124,58,237,.06);box-shadow:0 0 0 4px rgba(124,58,237,.09);color:var(--violet); }
    .fi { border:none;background:transparent;outline:none;font-size:13px;color:var(--txt2);width:100%;font-family:'Plus Jakarta Sans',sans-serif; }
    .fi::placeholder { color:var(--txt4); }
    .fi option { background:var(--bg3); }
    .meds-section { border-radius:14px;border:1.5px solid rgba(124,58,237,.12);background:rgba(124,58,237,.03);overflow:hidden; }
    .meds-hd { display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid rgba(124,58,237,.1); }
    .meds-hd-title { display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.07em; }
    .btn-add-med { display:flex;align-items:center;gap:6px;padding:6px 13px;border-radius:8px;background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.22);color:var(--violet);font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s; }
    .btn-add-med:hover { background:rgba(124,58,237,.18); }
    .meds-list { padding:12px 16px;display:flex;flex-direction:column;gap:9px; }
    .med-row { display:flex;align-items:center;gap:8px; }
    .med-num { width:24px;height:24px;border-radius:7px;background:rgba(124,58,237,.12);color:var(--violet);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0; }
    .med-fields { flex:1;display:grid;grid-template-columns:2fr 1fr 1.2fr 1.2fr;gap:7px; }
    .med-rm { width:32px;height:38px;border-radius:9px;background:rgba(240,66,106,.07);border:1px solid rgba(240,66,106,.18);color:var(--rose);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s; }
    .med-rm:hover:not(:disabled) { background:rgba(240,66,106,.18); }
    .med-rm:disabled { opacity:.3;cursor:not-allowed; }
    .modal-ft { display:flex;justify-content:flex-end;gap:10px;padding:16px 24px;border-top:1px solid var(--brd); }
    .btn-cancel { padding:11px 20px;border-radius:12px;background:var(--bg2);border:1.5px solid var(--brd);color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s; }
    .btn-cancel:hover { color:var(--txt);border-color:var(--brd2); }
    .btn-save { position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:12px;background:linear-gradient(135deg,var(--violet),var(--P));color:white;font-size:13px;font-weight:700;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 5px 18px rgba(124,58,237,.38);transition:all .22s; }
    .btn-save:hover { transform:translateY(-2px);box-shadow:0 8px 26px rgba(124,58,237,.48); }
    .btn-save:disabled { opacity:.5;cursor:not-allowed;transform:none; }

    /* Detail modal content */
    .detail-body { padding:20px 24px;display:flex;flex-direction:column;gap:10px; }
    .detail-section-title { display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em;margin-bottom:4px; }
    .detail-med-row { display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:13px;background:var(--Pl);border:1px solid var(--brd);transition:all .2s; }
    .detail-med-row:hover { background:rgba(124,58,237,.08);transform:translateX(3px); }
    .detail-med-num { width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--violet),var(--P));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:white;flex-shrink:0; }
    .detail-med-name { font-size:14px;font-weight:700;color:var(--txt); }
    .detail-med-sub { font-size:11px;color:var(--txt4);margin-top:2px; }
    .detail-med-info { flex:1; }
    .detail-med-dur { font-size:11px;font-weight:700;color:var(--P);background:var(--Pl2);padding:3px 10px;border-radius:99px;white-space:nowrap; }
    .detail-notes { display:flex;align-items:flex-start;gap:8px;padding:12px 14px;background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.15);border-radius:11px;font-size:12.5px;color:var(--txt3);line-height:1.55; }
    .detail-notes svg { color:var(--violet);flex-shrink:0;margin-top:1px; }
    .detail-ft { display:flex;align-items:center;gap:9px;padding:16px 24px;border-top:1px solid var(--brd); }
    .ord-btn-close { margin-left:auto;padding:10px 18px;border-radius:11px;background:var(--bg2);border:1.5px solid var(--brd);color:var(--txt3);font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s; }
    .ord-btn-close:hover { color:var(--txt); }

    /* ══ TOAST ══ */
    .toast-notif { position:fixed;bottom:26px;right:26px;z-index:9999;display:flex;align-items:center;gap:12px;padding:15px 20px;border-radius:18px;background:var(--glass);backdrop-filter:blur(26px);border:1.5px solid var(--gbrd);box-shadow:0 14px 44px rgba(0,0,0,.22);animation:tIn .38s cubic-bezier(.34,1.56,.64,1);min-width:280px; }
    @keyframes tIn { from{opacity:0;transform:translateX(40px) scale(.93)} to{opacity:1;transform:none} }
    .toast-ico-wrap { width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#0eb88a,#0d9a76);display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;box-shadow:0 6px 18px rgba(14,184,138,.4); }
    .toast-title { font-size:13.5px;font-weight:700;color:var(--txt); }
    .toast-desc { font-size:11.5px;color:var(--txt4);margin-top:2px; }

    @media (max-width:760px) { .ord-grid { grid-template-columns:1fr; } .ord-actions { flex-direction:column; } .ord-btn { width:100%; } .fc-grid-2,.med-fields { grid-template-columns:1fr; } }
  `]
})
export class OrdonnancesComponent {
  dossier = inject(DossierService);
  auth    = inject(AuthService);
  toast   = inject(ToastService);

  searchQ      = '';
  searchFocused = false;
  showAdd      = signal(false);
  filterStatus = signal<'all' | 'active' | 'expired'>('all');
  detailOrd    = signal<any>(null);
  showToast    = signal(false);
  toastMsg     = signal({ title: '', desc: '' });

  // ─── Data ───────────────────────────────────────────────────────────────────
  ordonnances = signal<any[]>([
    {
      id: 'ORD-001', patientName: 'Karim Ayoub', patientId: 'P001',
      date: '15 Avril 2025', status: 'active',
      doctorName: 'Dr. Khaddar',
      medications: [
        { name: 'Doliprane 1000mg',   dosage: '3x/jour',        duration: '7 jours' },
        { name: 'Amoxicilline 500mg', dosage: '2x/jour',        duration: '10 jours' },
      ],
      notes: 'Prendre avec de la nourriture. Éviter l\'alcool pendant le traitement.'
    },
    {
      id: 'ORD-002', patientName: 'Sana Ben Ali', patientId: 'P002',
      date: '12 Avril 2025', status: 'active',
      doctorName: 'Dr. Khaddar',
      medications: [
        { name: 'Ventoline Spray',   dosage: '2 bouffées si nécessaire', duration: '30 jours' },
        { name: 'Seretide 250',      dosage: '2x/jour',                  duration: '30 jours' },
      ],
      notes: 'Rincer la bouche après utilisation du Seretide.'
    },
    {
      id: 'ORD-003', patientName: 'Mohamed Hedi', patientId: 'P003',
      date: '08 Mars 2025', status: 'expired',
      doctorName: 'Dr. Khaddar',
      medications: [
        { name: 'Aspirine 100mg', dosage: '1x/jour', duration: '30 jours' },
      ],
      notes: null
    },
    {
      id: 'ORD-004', patientName: 'Fatma Ayari', patientId: 'P004',
      date: '20 Avril 2025', status: 'active',
      doctorName: 'Dr. Khaddar',
      medications: [
        { name: 'Levothyrox 50µg',         dosage: '1x matin à jeun',  duration: '90 jours' },
        { name: 'Vitamine D 100000 UI',     dosage: '1 ampoule/mois',   duration: '3 mois'   },
      ],
      notes: 'Prendre Levothyrox 30 min avant le petit-déjeuner.'
    },
  ]);

  readonly patients = [
    { id: 'P001', name: 'Karim Ayoub' },
    { id: 'P002', name: 'Sana Ben Ali' },
    { id: 'P003', name: 'Mohamed Hedi' },
    { id: 'P004', name: 'Fatma Ayari' },
  ];

  form = { patientId: '', patientName: '', date: new Date().toISOString().slice(0, 10), medications: [{ name: '', dose: '', freq: '', duree: '' }], notes: '' };

  // ─── Computed ────────────────────────────────────────────────────────────────
  filteredOrdonnances = computed(() => {
    let list = this.ordonnances();
    if (this.filterStatus() !== 'all') list = list.filter(o => (o.status ?? 'active') === this.filterStatus());
    if (this.searchQ.trim()) {
      const q = this.searchQ.toLowerCase();
      list = list.filter(o =>
        o.patientName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.medications.some((m: any) => m.name.toLowerCase().includes(q))
      );
    }
    return list;
  });

  activeCount  = computed(() => this.ordonnances().filter(o => (o.status ?? 'active') === 'active').length);
  expiredCount = computed(() => this.ordonnances().filter(o => o.status === 'expired').length);

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  getGrad(name: string): string {
    const g = [
      'linear-gradient(135deg,#1d5fe0,#154dc8)',
      'linear-gradient(135deg,#6366f1,#4f46e5)',
      'linear-gradient(135deg,#0891b2,#0e7490)',
      'linear-gradient(135deg,#0eb88a,#0d9a76)',
      'linear-gradient(135deg,#f0426a,#c73055)',
    ];
    return g[(name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0)) % g.length];
  }

  onPatientChange() { this.form.patientName = this.patients.find(p => p.id === this.form.patientId)?.name ?? ''; }
  addMed()          { this.form.medications.push({ name: '', dose: '', freq: '', duree: '' }); }
  removeMed(i: number) { if (this.form.medications.length > 1) this.form.medications.splice(i, 1); }

  submitOrd() {
    const meds = this.form.medications.filter(m => m.name.trim());
    if (!meds.length) return;
    const id = 'ORD-' + String(this.ordonnances().length + 1).padStart(3, '0');
    this.ordonnances.update(list => [...list, {
      id, patientId: this.form.patientId, patientName: this.form.patientName,
      date: this.form.date, status: 'active',
      doctorName: this.auth.user()?.name ?? 'Dr. Khaddar',
      medications: meds.map(m => ({ name: m.name, dosage: m.dose, duration: m.duree, freq: m.freq })),
      notes: this.form.notes || null
    }]);
    this.showAdd.set(false);
    this.form = { patientId: '', patientName: '', date: new Date().toISOString().slice(0, 10), medications: [{ name: '', dose: '', freq: '', duree: '' }], notes: '' };
    this.notify('Ordonnance créée !', `Ordonnance ${id} enregistrée avec succès.`);
  }

  // ─── Print / Download (REAL) ─────────────────────────────────────────────────
  printOrd(ord: any) {
    const w = window.open('', '_blank')!;
    w.document.write(this.buildPrintHtml(ord));
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 300);
    this.notify('Impression lancée', `Ordonnance ${ord.id} envoyée à l'imprimante.`);
  }

  downloadOrd(ord: any) {
    const content = [
      '═══════════════════════════════════════════════════',
      `        ORDONNANCE MÉDICALE  –  ${ord.id}`,
      '═══════════════════════════════════════════════════',
      '',
      `Patient   : ${ord.patientName}`,
      `Médecin   : ${ord.doctorName}`,
      `Date      : ${ord.date}`,
      `Statut    : ${(ord.status ?? 'active') === 'active' ? 'Active ✅' : 'Expirée ⏰'}`,
      '',
      '───────────────────────────────────────────────────',
      'MÉDICAMENTS',
      '───────────────────────────────────────────────────',
      ...ord.medications.map((m: any, idx: number) =>
        `${idx + 1}. ${m.name}\n   Dosage: ${m.dosage ?? m.dose}\n   Durée:  ${m.duration ?? m.duree}`
      ),
      '',
      ...(ord.notes ? ['───────────────────────────────────────────────────', 'NOTES', '───────────────────────────────────────────────────', ord.notes, ''] : []),
      `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
      'Ce document est confidentiel.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Ordonnance_${ord.id}_${ord.patientName.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    this.notify('Téléchargement réussi', `Ordonnance ${ord.id} téléchargée.`);
  }

  buildPrintHtml(ord: any): string {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Ordonnance ${ord.id}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:48px;color:#0d1b3e;max-width:700px;margin:0 auto}
      .logo{font-size:22px;font-weight:900;color:#1d5fe0;margin-bottom:4px}
      .divider{height:3px;background:linear-gradient(90deg,#1d5fe0,#7c3aed,#0eb88a);border-radius:2px;margin:18px 0}
      .badge{display:inline-block;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:700;background:rgba(14,184,138,.12);color:#0eb88a;border:1px solid rgba(14,184,138,.3)}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#f5f7fc;padding:18px;border-radius:10px;margin:18px 0}
      .info-item label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#8ba0bf;font-weight:700;display:block;margin-bottom:3px}
      .info-item span{font-size:14px;font-weight:700;color:#0d1b3e}
      .section-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#8ba0bf;margin:22px 0 10px}
      .med{padding:12px 16px;border-left:4px solid #1d5fe0;background:#f5f7fc;border-radius:0 8px 8px 0;margin-bottom:10px}
      .med-name{font-size:15px;font-weight:800;color:#0d1b3e}
      .med-details{font-size:12px;color:#526080;margin-top:4px}
      .notes-box{background:#fff4f8;border:1px solid rgba(124,58,237,.2);padding:14px;border-radius:8px;font-size:13px;color:#526080}
      .footer{margin-top:40px;text-align:center;font-size:11px;color:#8ba0bf;border-top:1px solid #e2e9f8;padding-top:16px}
      @media print{*{-webkit-print-color-adjust:exact!important}}
    </style></head><body>
    <div class="logo">MedSpace Pro</div>
    <div style="font-size:12px;color:#8ba0bf;margin-bottom:6px">Système de gestion médicale avancé</div>
    <div class="divider"></div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:20px;font-weight:900;color:#0d1b3e">Ordonnance Médicale</div>
      <span class="badge">${(ord.status ?? 'active') === 'active' ? 'Active ✅' : 'Expirée ⏰'}</span>
    </div>
    <div class="info-grid">
      <div class="info-item"><label>Patient</label><span>${ord.patientName}</span></div>
      <div class="info-item"><label>N° Ordonnance</label><span>${ord.id}</span></div>
      <div class="info-item"><label>Médecin prescripteur</label><span>${ord.doctorName}</span></div>
      <div class="info-item"><label>Date de prescription</label><span>${ord.date}</span></div>
    </div>
    <div class="section-title">Médicaments prescrits</div>
    ${ord.medications.map((m: any, i: number) => `
      <div class="med">
        <div class="med-name">${i + 1}. ${m.name}</div>
        <div class="med-details">Dosage: ${m.dosage ?? m.dose} &nbsp;·&nbsp; Durée: ${m.duration ?? m.duree}</div>
      </div>`).join('')}
    ${ord.notes ? `<div class="section-title">Notes importantes</div><div class="notes-box">⚠️ ${ord.notes}</div>` : ''}
    <div class="footer">
      Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}<br>
      Ce document est confidentiel et destiné uniquement au patient concerné — MedSpace Pro © 2025
    </div></body></html>`;
  }

  notify(title: string, desc: string) {
    this.toastMsg.set({ title, desc });
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3500);
  }
}