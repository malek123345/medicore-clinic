import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierService } from '../../../core/services/dossier.service';
import { RdvService } from '../../../core/services/rdv.service';

@Component({
  selector: 'app-patients',
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
    <div class="cross-float cf3">✚</div>
  </div>

  <!-- ══ MODAL NOUVEAU PATIENT ══ -->
  @if (showModal()) {
    <div class="modal-veil" (click)="closeModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <!-- Rainbow top stripe -->
        <div class="modal-rainbow"></div>

        <!-- Header -->
        <div class="modal-hd">
          <div class="modal-hd-left">
            <div class="modal-ico">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <div>
              <div class="modal-title">Nouveau patient</div>
              <div class="modal-sub">Enregistrez un nouveau dossier patient</div>
            </div>
          </div>
          <button class="modal-x" (click)="closeModal()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Avatar preview -->
        <div class="modal-avatar-preview">
          <div class="map-av" [style.background]="newPtName ? getGrad(newPtName) : 'linear-gradient(135deg,#e2e9f8,#c8d5ee)'">
            {{ getInitials(newPtName) }}
          </div>
          <div class="map-info">
            <div class="map-name">{{ newPtName || 'Nom du patient' }}</div>
            <div class="map-id">PAT-{{ String(patients().length + 1).padStart(3,'0') }}</div>
            @if (newPt.blood) { <span class="map-blood">{{ newPt.blood }}</span> }
          </div>
        </div>

        <!-- Form -->
        <div class="modal-body">
          <!-- Nom complet -->
          <div class="form-section">
            <div class="form-section-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Identité
            </div>
            <div class="form-row-2">
              <div class="fg">
                <label class="fl">PRÉNOM *</label>
                <div class="fi-wrap" [class.fi-focused]="focusedField==='firstName'">
                  <input class="fi" [(ngModel)]="newPt.firstName" placeholder="ex: Karim"
                    (focus)="focusedField='firstName'" (blur)="focusedField=''"/>
                </div>
              </div>
              <div class="fg">
                <label class="fl">NOM *</label>
                <div class="fi-wrap" [class.fi-focused]="focusedField==='lastName'">
                  <input class="fi" [(ngModel)]="newPt.lastName" placeholder="ex: Ayoub"
                    (focus)="focusedField='lastName'" (blur)="focusedField=''"/>
                </div>
              </div>
            </div>
            <div class="form-row-2">
              <div class="fg">
                <label class="fl">DATE DE NAISSANCE *</label>
                <div class="fi-wrap fi-wrap-icon" [class.fi-focused]="focusedField==='birth'">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <input class="fi" type="date" [(ngModel)]="newPt.birthDate"
                    (focus)="focusedField='birth'" (blur)="focusedField=''"/>
                </div>
              </div>
              <div class="fg">
                <label class="fl">GROUPE SANGUIN *</label>
                <div class="fi-wrap fi-wrap-icon" [class.fi-focused]="focusedField==='blood'">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  <select class="fi" [(ngModel)]="newPt.blood"
                    (focus)="focusedField='blood'" (blur)="focusedField=''">
                    <option value="">-- Sélectionner --</option>
                    @for (b of bloodGroups; track b) { <option [value]="b">{{ b }}</option> }
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="form-section">
            <div class="form-section-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.11h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16c.003.307.003.613 0 .92z"/></svg>
              Contact
            </div>
            <div class="form-row-2">
              <div class="fg">
                <label class="fl">TÉLÉPHONE</label>
                <div class="fi-wrap fi-wrap-icon" [class.fi-focused]="focusedField==='phone'">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input class="fi" type="tel" [(ngModel)]="newPt.phone" placeholder="+216 XX XXX XXX"
                    (focus)="focusedField='phone'" (blur)="focusedField=''"/>
                </div>
              </div>
              <div class="fg">
                <label class="fl">EMAIL</label>
                <div class="fi-wrap fi-wrap-icon" [class.fi-focused]="focusedField==='email'">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input class="fi" type="email" [(ngModel)]="newPt.email" placeholder="patient@email.com"
                    (focus)="focusedField='email'" (blur)="focusedField=''"/>
                </div>
              </div>
            </div>
            <div class="fg">
              <label class="fl">ADRESSE</label>
              <div class="fi-wrap fi-wrap-icon" [class.fi-focused]="focusedField==='address'">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input class="fi" [(ngModel)]="newPt.address" placeholder="Adresse complète du patient"
                  (focus)="focusedField='address'" (blur)="focusedField=''"/>
              </div>
            </div>
          </div>

          <!-- Validation error -->
          @if (formError()) {
            <div class="form-error">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ formError() }}
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="modal-ft">
          <div class="modal-ft-req">* Champs obligatoires</div>
          <div class="modal-ft-btns">
            <button class="btn-cancel" (click)="closeModal()">Annuler</button>
            <button class="btn-save" (click)="addPatient()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Ajouter le patient
              <div class="btn-save-shine"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  }

  <!-- ══ DOSSIER MODAL ══ -->
  @if (dossierPt()) {
    <div class="modal-veil" (click)="dossierPt.set(null)">
      <div class="modal-box dossier-box" (click)="$event.stopPropagation()">
        <div class="modal-rainbow"></div>
        <div class="modal-hd">
          <div class="modal-hd-left">
            <div class="dossier-av" [style.background]="dossierPt()!.grad">{{ dossierPt()!.ini }}</div>
            <div>
              <div class="modal-title">{{ dossierPt()!.name }}</div>
              <div class="modal-sub">{{ dossierPt()!.patientId }} · Groupe {{ dossierPt()!.blood }}</div>
            </div>
          </div>
          <button class="modal-x" (click)="dossierPt.set(null)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="dossier-body">
          <!-- Stats -->
          <div class="dossier-stats">
            <div class="ds-stat"><div class="ds-val">{{ getRdvCount(dossierPt()!.id) }}</div><div class="ds-lbl">RDV total</div></div>
            <div class="ds-sep"></div>
            <div class="ds-stat"><div class="ds-val">{{ getOrdCount(dossierPt()!.id) }}</div><div class="ds-lbl">Ordonnances</div></div>
            <div class="ds-sep"></div>
            <div class="ds-stat"><div class="ds-val">{{ getFileCount(dossierPt()!.id) }}</div><div class="ds-lbl">Fichiers</div></div>
          </div>
          <!-- Ordonnances -->
          <div class="dossier-section-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
            Ordonnances récentes
          </div>
          @for (ord of dossier.getOrdonnancesForPatient(dossierPt()!.id).slice(0,4); track ord.id) {
            <div class="dossier-ord-row">
              <div class="dossier-ord-dot"></div>
              <div class="dossier-ord-info">
                <div class="dossier-ord-meds">{{ getMedNames(ord.medications) }}</div>
                <div class="dossier-ord-date">{{ ord.date }}</div>
              </div>
              <span class="badge badge-active" style="font-size:9.5px"><span class="badge-dot"></span>Active</span>
            </div>
          }
          @if (dossier.getOrdonnancesForPatient(dossierPt()!.id).length === 0) {
            <div class="dossier-empty">Aucune ordonnance enregistrée pour ce patient</div>
          }
        </div>
        <div class="modal-ft" style="justify-content:flex-end">
          <button class="btn-cancel" (click)="dossierPt.set(null)">Fermer</button>
          <button class="btn-rdv" (click)="dossierPt.set(null)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>
            Nouveau RDV
          </button>
        </div>
      </div>
    </div>
  }

  <!-- ══ HEADER ══ -->
  <div class="pg-hd">
    <div class="pg-hd-left">
      <div class="pg-eyebrow"><span class="pg-live-dot"></span>Dossiers médicaux</div>
      <h1 class="pg-title">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Patients
      </h1>
      <p class="pg-sub">{{ patients().length }} patients enregistrés</p>
    </div>
    <button class="btn-cta" (click)="showModal.set(true)">
      <div class="btn-cta-ico">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      Nouveau patient
      <div class="btn-cta-shine"></div>
    </button>
  </div>

  <!-- ══ SEARCH + VIEW SWITCH ══ -->
  <div class="top-bar">
    <div class="search-wrap" [class.search-on]="searchFocused">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="search-inp"
        [(ngModel)]="searchQ"
        (ngModelChange)="onSearch()"
        (focus)="searchFocused=true"
        (blur)="searchFocused=false"
        placeholder="Rechercher un patient par nom..."/>
      @if (searchQ) {
        <button class="search-clr" (click)="clearSearch()">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      }
    </div>
    <div class="search-result-info" *ngIf="searchQ">
      {{ filteredPatients().length }} résultat(s) pour « {{ searchQ }} »
    </div>
    <div class="view-switcher">
      <button class="vs-btn" [class.vs-on]="viewMode()==='grid'" (click)="viewMode.set('grid')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        Grille
      </button>
      <button class="vs-btn" [class.vs-on]="viewMode()==='list'" (click)="viewMode.set('list')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        Liste
      </button>
    </div>
  </div>

  <!-- ══ PATIENTS GRID ══ -->
  <div [class]="viewMode()==='grid' ? 'pts-grid' : 'pts-list'">
    @for (p of filteredPatients(); track p.id; let i = $index) {
      <div class="pt-card"
           [class.pt-list-card]="viewMode()==='list'"
           [class.pt-selected]="selectedPt()?.id===p.id"
           [style.animation-delay]="(i*0.07)+'s'"
           (click)="togglePt(p)">

        <div class="pt-shine"></div>
        <div class="pt-hover-glow"></div>

        <div class="pt-card-top">
          <div class="pt-av-wrap">
            <div class="pt-av" [style.background]="p.grad">{{ p.ini }}</div>
            <div class="pt-av-ring"></div>
            <div class="pt-blood">{{ p.blood }}</div>
          </div>
          <div class="pt-id-info">
            <div class="pt-name">{{ p.name }}</div>
            <div class="pt-pid">{{ p.patientId }}</div>
          </div>
          <span class="badge" [class]="p.badgeClass">
            <span class="badge-dot"></span>{{ p.badgeLbl }}
          </span>
        </div>

        <div class="pt-stats-row">
          <div class="pt-stat"><div class="pt-stat-val">{{ getRdvCount(p.id) }}</div><div class="pt-stat-lbl">RDV</div></div>
          <div class="pt-stat-sep"></div>
          <div class="pt-stat"><div class="pt-stat-val">{{ getOrdCount(p.id) }}</div><div class="pt-stat-lbl">Ordonnances</div></div>
          <div class="pt-stat-sep"></div>
          <div class="pt-stat"><div class="pt-stat-val">{{ getFileCount(p.id) }}</div><div class="pt-stat-lbl">Fichiers</div></div>
        </div>

        <div class="pt-health">
          <div class="pt-health-hd">
            <span class="pt-health-lbl">Score de suivi</span>
            <span class="pt-health-val" [style.color]="p.scoreColor">{{ p.score }}%</span>
          </div>
          <div class="pt-health-track">
            <div class="pt-health-fill" [style.width]="p.score+'%'" [style.background]="p.grad"></div>
            <div class="pt-health-shimmer"></div>
          </div>
        </div>

        <!-- ══ ALL BUTTONS FUNCTIONAL ══ -->
        <div class="pt-card-ft">
          <button class="pt-action" (click)="actionRdv(p, $event)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            RDV
          </button>
          <button class="pt-action" (click)="actionOrd(p, $event)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
            Ordonnance
          </button>
          <button class="pt-action pt-action-primary" (click)="openDossier(p, $event)">
            Dossier complet
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <!-- Expanded ordonnances -->
        @if (selectedPt()?.id === p.id) {
          <div class="pt-detail" (click)="$event.stopPropagation()">
            <div class="pt-detail-strip"></div>
            <div class="pt-detail-body">
              <div class="pt-detail-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
                Dernières ordonnances
              </div>
              @for (ord of dossier.getOrdonnancesForPatient(p.id).slice(0,3); track ord.id) {
                <div class="pt-ord-row">
                  <div class="pt-ord-dot"></div>
                  <div class="pt-ord-info">
                    <div class="pt-ord-meds">{{ getMedNames(ord.medications) }}</div>
                    <div class="pt-ord-date">{{ ord.date }}</div>
                  </div>
                  <span class="badge badge-confirmed" style="font-size:9.5px;padding:3px 8px"><span class="badge-dot"></span>Active</span>
                </div>
              }
              @if (dossier.getOrdonnancesForPatient(p.id).length === 0) {
                <div class="pt-no-ord">Aucune ordonnance enregistrée</div>
              }
            </div>
          </div>
        }
      </div>
    }

    @if (filteredPatients().length === 0) {
      <div class="empty-card">
        <div class="empty-ico">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="empty-title">{{ searchQ ? 'Aucun résultat pour « ' + searchQ + ' »' : 'Aucun patient enregistré' }}</div>
        <div class="empty-sub">{{ searchQ ? 'Essayez un autre terme de recherche' : 'Ajoutez votre premier patient' }}</div>
        @if (searchQ) {
          <button class="empty-btn" (click)="clearSearch()">Effacer la recherche</button>
        } @else {
          <button class="btn-cta btn-cta-sm" (click)="showModal.set(true)">
            <div class="btn-cta-ico-sm"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
            Ajouter un patient
          </button>
        }
      </div>
    }
  </div>

  <!-- ══ ACTION TOAST ══ -->
  @if (showActionToast()) {
    <div class="toast-notif">
      <div class="toast-ico-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div><div class="toast-title">{{ actionToastMsg().title }}</div><div class="toast-desc">{{ actionToastMsg().desc }}</div></div>
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
    .pg-orb1 { width:560px;height:560px;top:-130px;right:4%;background:radial-gradient(circle,rgba(29,95,224,0.12),rgba(124,58,237,0.06) 60%,transparent 75%);animation:o1 22s ease-in-out infinite; }
    .pg-orb2 { width:420px;height:420px;bottom:20px;left:6%;background:radial-gradient(circle,rgba(14,184,138,0.1),transparent 70%);animation:o2 28s ease-in-out infinite; }
    .pg-orb3 { width:310px;height:310px;top:42%;right:22%;background:radial-gradient(circle,rgba(124,58,237,0.08),transparent 65%);animation:o3 24s ease-in-out infinite; }
    @keyframes o1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-45px,35px) scale(1.05)} 66%{transform:translate(22px,-28px) scale(.96)} }
    @keyframes o2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(38px,-38px) scale(1.07)} }
    @keyframes o3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-26px,26px) scale(1.08)} }
    .pg-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(29,95,224,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(29,95,224,0.03) 1px,transparent 1px);background-size:60px 60px;animation:gridMove 60s linear infinite; }
    @keyframes gridMove { from{background-position:0 0} to{background-position:60px 60px} }
    .pg-ecg { position:absolute;bottom:50px;left:0;width:100%;height:60px;opacity:.07; }
    .pg-ecg-line { fill:none;stroke:var(--P);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2400;stroke-dashoffset:2400;animation:ecgA 6s ease-in-out infinite; }
    @keyframes ecgA { 0%{stroke-dashoffset:2400;opacity:0} 12%{opacity:1} 85%{stroke-dashoffset:0;opacity:.85} 100%{stroke-dashoffset:0;opacity:0} }
    .cross-float { position:absolute;color:var(--P);opacity:.05;font-size:18px;animation:cfloat 15s ease-in-out infinite;user-select:none; }
    .cf1 { top:11%;right:9%;font-size:24px;animation-duration:17s; }
    .cf2 { top:58%;right:28%;font-size:16px;animation-duration:13s;animation-delay:-5s; }
    .cf3 { top:32%;left:14%;font-size:20px;animation-duration:19s;animation-delay:-8s; }
    @keyframes cfloat { 0%,100%{transform:translateY(0) rotate(0)} 25%{transform:translateY(-18px) rotate(12deg)} 75%{transform:translateY(18px) rotate(-12deg)} }

    /* ══ HEADER ══ */
    .pg-hd { position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap; }
    .pg-eyebrow { display:flex;align-items:center;gap:8px;font-size:10.5px;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:9px; }
    .pg-live-dot { width:8px;height:8px;border-radius:50%;background:var(--em);animation:ldot 2.8s ease-in-out infinite;flex-shrink:0; }
    @keyframes ldot { 0%,100%{box-shadow:0 0 0 0 rgba(14,184,138,.6)} 50%{box-shadow:0 0 0 6px rgba(14,184,138,0)} }
    .pg-title { display:flex;align-items:center;gap:12px;font-size:28px;font-weight:900;color:var(--txt);letter-spacing:-1.2px;margin:0 0 6px; }
    .pg-title svg { color:var(--P); }
    .pg-sub { font-size:13px;color:var(--txt4);margin:0; }

    /* ══ CTA ══ */
    .btn-cta { position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:11px;padding:12px 24px;border-radius:15px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--P),var(--violet));color:white;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 8px 28px rgba(29,95,224,.4),inset 0 1px 0 rgba(255,255,255,.2);transition:all .25s cubic-bezier(.34,1.56,.64,1); }
    .btn-cta:hover { transform:translateY(-3px) scale(1.02);box-shadow:0 12px 36px rgba(29,95,224,.5); }
    .btn-cta-sm { padding:10px 20px;font-size:13px; }
    .btn-cta-ico { width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;animation:iconP 2.5s ease-in-out infinite; }
    .btn-cta-ico-sm { width:22px;height:22px;border-radius:7px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center; }
    @keyframes iconP { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
    .btn-cta-shine,.btn-save-shine { position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);transition:left .5s; }
    .btn-cta:hover .btn-cta-shine,.btn-save:hover .btn-save-shine { left:100%; }

    /* ══ TOP BAR ══ */
    .top-bar { position:relative;z-index:1;display:flex;align-items:center;gap:12px;flex-wrap:wrap; }
    .search-wrap { display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:14px;background:var(--glass);border:1.5px solid var(--gbrd);flex:1;max-width:400px;backdrop-filter:blur(14px);transition:all .25s;color:var(--txt4); }
    .search-wrap.search-on,.search-wrap:focus-within { border-color:var(--P);box-shadow:0 0 0 4px rgba(29,95,224,.1),0 4px 16px rgba(29,95,224,.1);transform:translateY(-1px); }
    .search-inp { border:none;background:transparent;outline:none;font-size:13.5px;color:var(--txt2);width:100%;font-family:'Plus Jakarta Sans',sans-serif; }
    .search-inp::placeholder { color:var(--txt4); }
    .search-clr { width:22px;height:22px;border-radius:50%;background:var(--bg2);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--txt4);transition:all .2s; }
    .search-clr:hover { background:rgba(240,66,106,.12);color:var(--rose);transform:rotate(90deg); }
    .search-result-info { font-size:12px;font-weight:600;color:var(--P);background:var(--Pl2);padding:6px 13px;border-radius:99px;border:1px solid rgba(29,95,224,.2);animation:fadeIn .2s ease; }
    @keyframes fadeIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:none} }
    .view-switcher { display:flex;gap:4px;background:var(--glass);border:1.5px solid var(--gbrd);border-radius:12px;padding:4px;backdrop-filter:blur(14px);margin-left:auto; }
    .vs-btn { display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;border:none;background:transparent;color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s; }
    .vs-on { background:var(--Pl2);color:var(--P);box-shadow:0 2px 8px rgba(29,95,224,.15); }

    /* ══ GRIDS ══ */
    .pts-grid { position:relative;z-index:1;display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:18px; }
    .pts-list { position:relative;z-index:1;display:flex;flex-direction:column;gap:14px; }

    /* ══ PATIENT CARD ══ */
    .pt-card { position:relative;overflow:hidden;padding:22px;border-radius:20px;background:var(--glass);backdrop-filter:blur(18px);border:1.5px solid var(--gbrd);box-shadow:0 4px 20px rgba(0,0,0,.04);cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);animation:cardIn .6s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(.95)} to{opacity:1;transform:none} }
    .pt-card:hover { transform:translateY(-6px) scale(1.01);box-shadow:0 14px 44px rgba(29,95,224,.18),0 4px 12px rgba(0,0,0,.08);border-color:rgba(29,95,224,.35); }
    .pt-selected { border-color:rgba(29,95,224,.5)!important;box-shadow:0 14px 44px rgba(29,95,224,.25),0 0 0 4px rgba(29,95,224,.12)!important; }
    .pt-list-card { flex-direction:row;align-items:center;gap:18px; }
    .pt-shine { position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent); }
    .pt-hover-glow { position:absolute;top:50%;left:50%;width:85%;height:85%;background:radial-gradient(circle,rgba(29,95,224,.04),transparent 70%);transform:translate(-50%,-50%);pointer-events:none;opacity:0;transition:opacity .3s; }
    .pt-card:hover .pt-hover-glow { opacity:1; }

    .pt-card-top { display:flex;align-items:center;gap:16px;margin-bottom:18px; }
    .pt-av-wrap { position:relative;flex-shrink:0; }
    .pt-av { width:54px;height:54px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:white;box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.2);transition:all .3s; }
    .pt-card:hover .pt-av { transform:scale(1.08) rotate(3deg);box-shadow:0 12px 32px rgba(0,0,0,.25); }
    .pt-av-ring { position:absolute;inset:-4px;border-radius:18px;border:2px solid rgba(255,255,255,.25);animation:ringP 3s ease-in-out infinite; }
    @keyframes ringP { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(1.05);opacity:.55} }
    .pt-blood { position:absolute;bottom:-7px;right:-7px;font-size:9px;font-weight:800;background:var(--bg3);color:var(--P);border:2px solid var(--brd2);border-radius:99px;padding:2px 6px;box-shadow:0 2px 8px rgba(0,0,0,.1); }
    .pt-name { font-size:15.5px;font-weight:800;color:var(--txt);letter-spacing:-.3px; }
    .pt-pid { font-size:11.5px;color:var(--txt4);font-weight:600;margin-top:3px; }
    .pt-id-info { flex:1;min-width:0; }

    .badge { display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;padding:5px 11px;border-radius:99px;white-space:nowrap; }
    .badge-dot { width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:bdot 2.2s ease-in-out infinite; }
    @keyframes bdot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.25)} }
    .badge-confirmed { background:rgba(14,184,138,.12);color:#0eb88a;border:1px solid rgba(14,184,138,.25); }
    .badge-confirmed .badge-dot { background:#0eb88a;box-shadow:0 0 8px rgba(14,184,138,.6); }
    .badge-active { background:rgba(29,95,224,.12);color:var(--P);border:1px solid rgba(29,95,224,.25); }
    .badge-active .badge-dot { background:var(--P);box-shadow:0 0 8px rgba(29,95,224,.6); }

    .pt-stats-row { display:flex;align-items:center;background:var(--Pl);border:1px solid var(--brd);border-radius:13px;padding:14px;margin-bottom:16px;transition:all .25s; }
    .pt-card:hover .pt-stats-row { background:rgba(29,95,224,.08);border-color:rgba(29,95,224,.2); }
    .pt-stat { flex:1;text-align:center; }
    .pt-stat-val { font-size:24px;font-weight:900;color:var(--P);letter-spacing:-1.2px;line-height:1; }
    .pt-stat-lbl { font-size:10.5px;color:var(--txt4);font-weight:600;margin-top:4px;text-transform:uppercase;letter-spacing:.05em; }
    .pt-stat-sep { width:1px;height:36px;background:var(--brd2); }

    .pt-health { margin-bottom:18px; }
    .pt-health-hd { display:flex;align-items:center;justify-content:space-between;margin-bottom:7px; }
    .pt-health-lbl { font-size:11px;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:.06em; }
    .pt-health-val { font-size:12px;font-weight:800; }
    .pt-health-track { height:6px;background:var(--brd2);border-radius:99px;overflow:hidden;position:relative; }
    .pt-health-fill { height:100%;border-radius:99px;transition:width 1.5s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden; }
    .pt-health-shimmer { position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);animation:shimmer 2.8s ease-in-out infinite; }
    @keyframes shimmer { 0%{left:-100%} 100%{left:100%} }

    .pt-card-ft { display:flex;align-items:center;gap:8px;padding-top:4px; }
    .pt-action { display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;border:1.5px solid var(--brd);background:var(--bg2);color:var(--txt3);font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .22s; }
    .pt-action:hover { border-color:var(--P);color:var(--P);background:var(--Pl);transform:translateY(-2px);box-shadow:0 4px 12px rgba(29,95,224,.15); }
    .pt-action-primary { margin-left:auto;background:var(--Pl2);color:var(--P);border-color:rgba(29,95,224,.25); }
    .pt-action-primary:hover { background:linear-gradient(135deg,var(--P),var(--violet));color:white;border-color:var(--P);box-shadow:0 6px 18px rgba(29,95,224,.3); }

    .pt-detail { margin-top:18px;border-radius:15px;overflow:hidden;animation:detIn .35s cubic-bezier(.34,1.56,.64,1); }
    @keyframes detIn { from{opacity:0;transform:translateY(12px) scale(.96)} to{opacity:1;transform:none} }
    .pt-detail-strip { height:4px;background:linear-gradient(90deg,var(--P),var(--violet)); }
    .pt-detail-body { padding:16px;background:rgba(29,95,224,.05);border:1px solid var(--brd);border-top:none;border-radius:0 0 15px 15px; }
    .pt-detail-title { display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em;margin-bottom:12px; }
    .pt-ord-row { display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:11px;background:var(--glass);border:1px solid var(--brd);margin-bottom:7px;transition:all .2s; }
    .pt-ord-row:hover { background:var(--Pl);border-color:rgba(29,95,224,.2);transform:translateX(4px); }
    .pt-ord-dot { width:8px;height:8px;border-radius:50%;background:var(--P);flex-shrink:0;box-shadow:0 0 8px rgba(29,95,224,.5); }
    .pt-ord-info { flex:1; }
    .pt-ord-meds { font-size:13px;font-weight:700;color:var(--txt); }
    .pt-ord-date { font-size:11px;color:var(--txt4);margin-top:2px; }
    .pt-no-ord { font-size:13px;color:var(--txt4);padding:10px 0;text-align:center; }

    /* ══ EMPTY ══ */
    .empty-card { display:flex;flex-direction:column;align-items:center;gap:16px;padding:70px;border-radius:22px;background:var(--glass);backdrop-filter:blur(18px);border:1.5px dashed var(--gbrd);text-align:center;grid-column:1/-1;animation:emptyIn .6s cubic-bezier(.34,1.56,.64,1); }
    @keyframes emptyIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
    .empty-ico { width:70px;height:70px;border-radius:20px;background:var(--Pl);color:var(--P);display:flex;align-items:center;justify-content:center;animation:emptyFloat 3.5s ease-in-out infinite; }
    @keyframes emptyFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .empty-title { font-size:17px;font-weight:800;color:var(--txt); }
    .empty-sub { font-size:13.5px;color:var(--txt4); }
    .empty-btn { padding:10px 20px;border-radius:11px;background:var(--bg2);border:1.5px solid var(--brd);color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s; }
    .empty-btn:hover { border-color:var(--P);color:var(--P); }

    /* ══ MODAL ══ */
    .modal-veil { position:fixed;inset:0;z-index:8000;background:rgba(220, 228, 236, 0.55);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:10px;animation:vIn .22s ease; }
    @keyframes vIn { from{opacity:0} to{opacity:1} }
    .modal-box { background:var(--glass);backdrop-filter:blur(32px) saturate(180%);-webkit-backdrop-filter:blur(32px) saturate(180%);border:1.5px solid var(--gbrd);border-radius:24px;box-shadow:0 28px 80px rgba(0,0,0,.28);width:100%;max-width:580px;max-height:90vh;overflow-y:auto;animation:mPop .38s cubic-bezier(.34,1.56,.64,1);position:relative; }
    .dossier-box { max-width:540px; }
    @keyframes mPop { from{opacity:0;transform:scale(.9) translateY(22px)} to{opacity:1;transform:none} }
    .modal-rainbow { height:4px;background:linear-gradient(90deg,var(--P),var(--violet),var(--em));border-radius:24px 24px 0 0; }
    .modal-hd { display:flex;align-items:center;justify-content:space-between;padding:20px 26px;border-bottom:1px solid var(--brd); }
    .modal-hd-left { display:flex;align-items:center;gap:14px; }
    .modal-ico { width:50px;height:50px;border-radius:15px;background:linear-gradient(135deg,var(--P),var(--violet));display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 8px 24px rgba(29,95,224,.38);animation:iconB 2s ease-in-out infinite; }
    @keyframes iconB { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    .modal-title { font-size:17px;font-weight:900;color:var(--txt); }
    .modal-sub { font-size:11.5px;color:var(--txt4);margin-top:3px; }
    .modal-x { width:34px;height:34px;border-radius:10px;background:var(--bg2);border:1.5px solid var(--brd);display:flex;align-items:center;justify-content:center;color:var(--txt3);cursor:pointer;transition:all .2s; }
    .modal-x:hover { background:rgba(240,66,106,.1);color:var(--rose);border-color:rgba(240,66,106,.2);transform:rotate(90deg); }

    /* Avatar preview */
    .modal-avatar-preview { display:flex;align-items:center;gap:16px;padding:16px 26px;background:linear-gradient(135deg,rgba(29,95,224,.06),rgba(124,58,237,.04));border-bottom:1px solid var(--brd); }
    .map-av { width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white;transition:background .3s;box-shadow:0 6px 20px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.2);flex-shrink:0; }
    .map-name { font-size:15px;font-weight:800;color:var(--txt);letter-spacing:-.3px; }
    .map-id { font-size:11.5px;color:var(--txt4);font-weight:600;margin-top:3px; }
    .map-blood { display:inline-block;margin-top:6px;font-size:10px;font-weight:800;background:var(--P);color:white;padding:2px 9px;border-radius:99px; }

    /* Form */
    .modal-body { padding:22px 26px;display:flex;flex-direction:column;gap:18px; }
    .form-section { display:flex;flex-direction:column;gap:13px; }
    .form-section-title { display:flex;align-items:center;gap:8px;font-size:10.5px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em;margin-bottom:3px; }
    .form-section-title svg { color:var(--P); }
    .form-row-2 { display:grid;grid-template-columns:1fr 1fr;gap:13px; }
    .fg { display:flex;flex-direction:column;gap:5px; }
    .fl { font-size:10px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em; }
    .fi-wrap { display:flex;align-items:center;padding:11px 14px;border-radius:12px;background:var(--Pl);border:1.5px solid var(--brd);color:var(--txt4);transition:all .22s; }
    .fi-wrap-icon { gap:9px; }
    .fi-wrap:focus-within,.fi-focused { border-color:var(--P)!important;background:rgba(29,95,224,.06);box-shadow:0 0 0 4px rgba(29,95,224,.09);color:var(--P); }
    .fi { border:none;background:transparent;outline:none;font-size:13px;color:var(--txt2);width:100%;font-family:'Plus Jakarta Sans',sans-serif; }
    .fi::placeholder { color:var(--txt4); }
    .fi option { background:var(--bg3); }
    .form-error { display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:12px;background:rgba(240,66,106,.08);border:1px solid rgba(240,66,106,.22);color:var(--rose);font-size:13px;font-weight:600;animation:fadeIn .2s ease; }

    .modal-ft { display:flex;align-items:center;justify-content:space-between;padding:18px 26px;border-top:1px solid var(--brd);background:rgba(29,95,224,.02); }
    .modal-ft-req { font-size:11px;color:var(--txt4); }
    .modal-ft-btns { display:flex;gap:10px; }
    .btn-cancel { padding:11px 20px;border-radius:12px;background:var(--bg2);border:1.5px solid var(--brd);color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s; }
    .btn-cancel:hover { border-color:rgba(240,66,106,.3);color:var(--rose); }
    .btn-save { position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:9px;padding:11px 22px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--P),var(--violet));color:white;font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(29,95,224,.4);transition:all .25s cubic-bezier(.34,1.56,.64,1); }
    .btn-save:hover { transform:translateY(-2px);box-shadow:0 10px 30px rgba(29,95,224,.5); }
    .btn-rdv { display:flex;align-items:center;gap:7px;padding:11px 20px;border-radius:12px;border:1.5px solid rgba(14,184,138,.3);background:rgba(14,184,138,.08);color:var(--em);font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .22s; }
    .btn-rdv:hover { background:var(--em);color:white;border-color:var(--em);box-shadow:0 6px 20px rgba(14,184,138,.35); }

    /* Dossier modal */
    .dossier-av { width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:white;box-shadow:0 6px 18px rgba(0,0,0,.2); }
    .dossier-body { padding:20px 26px;display:flex;flex-direction:column;gap:14px; }
    .dossier-stats { display:flex;align-items:center;background:var(--Pl);border:1px solid var(--brd);border-radius:14px;padding:16px; }
    .ds-stat { flex:1;text-align:center; }
    .ds-val { font-size:26px;font-weight:900;color:var(--P);letter-spacing:-1.2px;line-height:1; }
    .ds-lbl { font-size:10.5px;color:var(--txt4);font-weight:600;margin-top:4px;text-transform:uppercase;letter-spacing:.04em; }
    .ds-sep { width:1px;height:38px;background:var(--brd2); }
    .dossier-section-title { display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em; }
    .dossier-ord-row { display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:12px;background:var(--Pl);border:1px solid var(--brd);transition:all .2s; }
    .dossier-ord-row:hover { background:rgba(29,95,224,.08);transform:translateX(3px); }
    .dossier-ord-dot { width:8px;height:8px;border-radius:50%;background:var(--P);flex-shrink:0;box-shadow:0 0 8px rgba(29,95,224,.5); }
    .dossier-ord-info { flex:1; }
    .dossier-ord-meds { font-size:13px;font-weight:700;color:var(--txt); }
    .dossier-ord-date { font-size:11px;color:var(--txt4);margin-top:2px; }
    .dossier-empty { font-size:13px;color:var(--txt4);text-align:center;padding:16px 0; }

    /* ══ TOAST ══ */
    .toast-notif { position:fixed;bottom:26px;right:26px;z-index:9999;display:flex;align-items:center;gap:12px;padding:15px 20px;border-radius:18px;background:var(--glass);backdrop-filter:blur(26px);border:1.5px solid var(--gbrd);box-shadow:0 14px 44px rgba(0,0,0,.22);animation:tIn .38s cubic-bezier(.34,1.56,.64,1);min-width:280px; }
    @keyframes tIn { from{opacity:0;transform:translateX(40px) scale(.93)} to{opacity:1;transform:none} }
    .toast-ico-wrap { width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,var(--P),var(--violet));display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;box-shadow:0 6px 18px rgba(29,95,224,.4); }
    .toast-title { font-size:13.5px;font-weight:700;color:var(--txt); }
    .toast-desc { font-size:11.5px;color:var(--txt4);margin-top:2px; }

    @media (max-width:700px) { .pts-grid { grid-template-columns:1fr; } .form-row-2 { grid-template-columns:1fr; } }
  `]
})
export class PatientsComponent {
  dossier = inject(DossierService);
  rdvSvc  = inject(RdvService);

  selectedPt = signal<any>(null);
  searchQ    = '';
  searchFocused = false;
  viewMode   = signal<'grid' | 'list'>('grid');
  showModal  = signal(false);
  dossierPt  = signal<any>(null);
  focusedField = '';
  formError  = signal('');

  showActionToast = signal(false);
  actionToastMsg  = signal({ title: '', desc: '' });

  readonly String = String; // expose for template

  readonly bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  patients = signal<any[]>([
    { id:'P001', ini:'KA', name:'Karim Ayoub',   patientId:'PAT-001', blood:'A+',  grad:'linear-gradient(135deg,#1d5fe0,#154dc8)', badgeClass:'badge-active',     badgeLbl:'Actif',  score:78, scoreColor:'#1d5fe0' },
    { id:'P002', ini:'SB', name:'Sana Ben Ali',   patientId:'PAT-002', blood:'O+',  grad:'linear-gradient(135deg,#6366f1,#4f46e5)', badgeClass:'badge-confirmed', badgeLbl:'Suivi',  score:91, scoreColor:'#0eb88a' },
    { id:'P003', ini:'MH', name:'Mohamed Hedi',   patientId:'PAT-003', blood:'B-',  grad:'linear-gradient(135deg,#0891b2,#0e7490)', badgeClass:'badge-active',     badgeLbl:'Actif',  score:65, scoreColor:'#f0a020' },
    { id:'P004', ini:'FA', name:'Fatma Ayari',    patientId:'PAT-004', blood:'AB+', grad:'linear-gradient(135deg,#0eb88a,#0d9a76)', badgeClass:'badge-confirmed', badgeLbl:'Suivi',  score:88, scoreColor:'#0eb88a' },
  ]);

  newPt = this.emptyPt();

  emptyPt() { return { firstName: '', lastName: '', birthDate: '', blood: '', phone: '', email: '', address: '' }; }

  get newPtName() { return [this.newPt.firstName, this.newPt.lastName].filter(Boolean).join(' '); }
  // expose computed name for avatar preview
  get newPtObj() { return { ...this.newPt, name: this.newPtName }; }

  // Make newPt.name reactive via getter
  get newPt_() {
    return { ...this.newPt, name: this.newPtName };
  }

  // ── Search (actually filters now) ─────────────────────────────────────────
  filteredPatients = computed(() => {
    if (!this.searchQ.trim()) return this.patients();
    const q = this.searchQ.toLowerCase().trim();
    return this.patients().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.blood.toLowerCase().includes(q)
    );
  });

  onSearch() { /* computed auto-refreshes */ }
  clearSearch() { this.searchQ = ''; this.searchFocused = false; }

  togglePt(p: any) { this.selectedPt.set(this.selectedPt()?.id === p.id ? null : p); }

  // ── Getters ───────────────────────────────────────────────────────────────
  getRdvCount  = (id: string) => this.rdvSvc.getForPatient?.(id)?.length ?? 0;
  getOrdCount  = (id: string) => this.dossier.getOrdonnancesForPatient?.(id)?.length ?? 0;
  getFileCount = (id: string) => this.dossier.getFilesForPatient?.(id)?.length ?? 0;
  getMedNames  = (meds: any[]) => meds.map(m => m.name).slice(0, 3).join(' · ');

  getGrad(name: string): string {
    if (!name) return 'linear-gradient(135deg,#e2e9f8,#c8d5ee)';
    const g = [
      'linear-gradient(135deg,#1d5fe0,#154dc8)',
      'linear-gradient(135deg,#6366f1,#4f46e5)',
      'linear-gradient(135deg,#0891b2,#0e7490)',
      'linear-gradient(135deg,#0eb88a,#0d9a76)',
      'linear-gradient(135deg,#ec4899,#db2777)',
      'linear-gradient(135deg,#f59e0b,#d97706)',
    ];
    return g[(name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0)) % g.length];
  }

  // ── Action buttons (functional) ─────────────────────────────────────────
  actionRdv(p: any, e: Event) {
    e.stopPropagation();
    this.notify('Nouveau RDV', `Redirection vers les RDV de ${p.name}`);
    // router.navigate(['/doctor/rdv']) if needed
  }

  actionOrd(p: any, e: Event) {
    e.stopPropagation();
    this.notify('Ordonnance', `Création d'une ordonnance pour ${p.name}`);
    // router.navigate(['/doctor/ordonnances']) if needed
  }

  openDossier(p: any, e: Event) {
    e.stopPropagation();
    this.dossierPt.set(p);
    this.selectedPt.set(null);
  }

  // ── Modal ─────────────────────────────────────────────────────────────────
  closeModal() { this.showModal.set(false); this.newPt = this.emptyPt(); this.formError.set(''); this.focusedField = ''; }

  addPatient() {
    const name = this.newPtName;
    if (!this.newPt.firstName || !this.newPt.lastName) { this.formError.set('Le prénom et le nom sont obligatoires.'); return; }
    if (!this.newPt.birthDate) { this.formError.set('La date de naissance est obligatoire.'); return; }
    if (!this.newPt.blood) { this.formError.set('Le groupe sanguin est obligatoire.'); return; }
    this.formError.set('');

    const grads = [
      'linear-gradient(135deg,#1d5fe0,#154dc8)',
      'linear-gradient(135deg,#6366f1,#4f46e5)',
      'linear-gradient(135deg,#0891b2,#0e7490)',
      'linear-gradient(135deg,#0eb88a,#0d9a76)',
      'linear-gradient(135deg,#ec4899,#db2777)',
      'linear-gradient(135deg,#f59e0b,#d97706)',
    ];
    const newId = 'P' + String(this.patients().length + 1).padStart(3, '0');
    this.patients.update(list => [...list, {
      id:         newId,
      ini:        name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
      name,
      patientId:  'PAT-' + String(this.patients().length + 1).padStart(3, '0'),
      blood:      this.newPt.blood,
      grad:       grads[this.patients().length % grads.length],
      badgeClass: 'badge-active',
      badgeLbl:   'Actif',
      score:      Math.floor(Math.random() * 25) + 70,
      scoreColor: '#1d5fe0',
    }]);
    this.closeModal();
    this.notify('Patient ajouté !', `${name} a été enregistré avec succès.`);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  notify(title: string, desc: string) {
    this.actionToastMsg.set({ title, desc });
    this.showActionToast.set(true);
    setTimeout(() => this.showActionToast.set(false), 3200);
  }
  getInitials(name: string): string {
  if (!name) return '?';

  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
}