import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SecretaryService, Secretary } from '../../../core/services/secretary.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="pm-root">

  <!-- ══ AMBIENT BG ══ -->
  <div class="pm-bg" aria-hidden="true">
    <div class="pm-orb pm-orb1"></div>
    <div class="pm-orb pm-orb2"></div>
    <div class="pm-orb pm-orb3"></div>
    <div class="pm-grid"></div>
    <svg class="pm-ecg" viewBox="0 0 900 60" preserveAspectRatio="none">
      <polyline class="pm-ecg-line" points="0,30 60,30 75,30 82,8 90,52 97,30 120,30 180,30 195,30 202,8 210,52 217,30 240,30 300,30 315,30 322,8 330,52 337,30 360,30 420,30 435,30 442,8 450,52 457,30 480,30 540,30 555,30 562,8 570,52 577,30 600,30 660,30 675,30 682,8 690,52 697,30 720,30 780,30 795,30 802,8 810,52 817,30 840,30 900,30"/>
    </svg>
    <div class="cf cf1">✚</div>
    <div class="cf cf2">✚</div>
  </div>

  <!-- ══ HERO HEADER ══ -->
  <div class="pm-hero">
    <div class="pm-hero-left">
      <div class="pm-hero-eyebrow">
        <span class="pm-live-dot"></span>Administration
      </div>
      <h1 class="pm-hero-title">
        <div class="pm-hero-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/>
          </svg>
        </div>
        Paramètres
      </h1>
      <p class="pm-hero-sub">Configuration de votre cabinet et gestion des accès</p>
    </div>

    <!-- Identité docteur (pill flottant) -->
    <div class="pm-doc-card">
      <div class="pm-doc-av">{{ docIni() }}</div>
      <div class="pm-doc-info">
        <div class="pm-doc-name">{{ docName() }}</div>
        <div class="pm-doc-role">Médecin · Accès complet</div>
      </div>
      <div class="pm-doc-status">
        <span class="pm-live-dot" style="width:6px;height:6px"></span>
      </div>
    </div>
  </div>

  <!-- ══ NAV PILLS ══ -->
  <div class="pm-nav-pills">
    <button class="pm-pill" [class.pm-pill-on]="tab()==='cabinet'" (click)="tab.set('cabinet')">
      <div class="pm-pill-ico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      Cabinet
    </button>
    <button class="pm-pill" [class.pm-pill-on]="tab()==='profil'" (click)="tab.set('profil')">
      <div class="pm-pill-ico">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      Profil &amp; Accès
      @if (secretaries().length > 0) {
        <span class="pm-pill-badge">{{ secretaries().length + 1 }}</span>
      }
    </button>
  </div>

  <!-- ══════════════════════════════════
       TAB : CABINET
  ══════════════════════════════════ -->
  @if (tab()==='cabinet') {

    @if (cabinetLoading()) {
      <div class="pm-skel-wrap">
        @for (i of [1,2,3,4]; track i) { <div class="pm-skel"></div> }
      </div>
    } @else {
      <div class="pm-content-split" style="animation:slideIn .4s cubic-bezier(.34,1.56,.64,1) both">

        <!-- LEFT — infos principales -->
        <div class="pm-col-main">
          <div class="pm-pcard">
            <div class="pm-pcard-rainbow"></div>
            <div class="pm-pcard-head">
              <div class="pm-pcard-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div class="pm-pcard-title">Coordonnées</div>
                <div class="pm-pcard-sub">Visibles par vos patients</div>
              </div>
            </div>
            <div class="pm-pcard-body">
              <div class="pm-field pm-field-full">
                <label class="pm-lbl">NOM DU CABINET</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  <input class="pm-inp" type="text" [(ngModel)]="cab.nom" placeholder="Cabinet Dentaire Ben Salem">
                </div>
              </div>
              <div class="pm-field pm-field-full">
                <label class="pm-lbl">ADRESSE</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <input class="pm-inp" type="text" [(ngModel)]="cab.adresse" placeholder="Adresse, ville, code postal">
                </div>
              </div>
              <div class="pm-field">
                <label class="pm-lbl">TÉLÉPHONE</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.11h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16c0 .31 0 .62-.08.92z"/></svg>
                  <input class="pm-inp" type="tel" [(ngModel)]="cab.telephone" placeholder="+216 7X XXX XXX">
                </div>
              </div>
              <div class="pm-field">
                <label class="pm-lbl">EMAIL</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input class="pm-inp" type="email" [(ngModel)]="cab.email" placeholder="contact@cabinet.tn">
                </div>
              </div>
              <div class="pm-field">
                <label class="pm-lbl">SITE WEB</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <input class="pm-inp" type="url" [(ngModel)]="cab.siteWeb" placeholder="www.cabinet.tn">
                </div>
              </div>
              <div class="pm-field">
                <label class="pm-lbl">HORAIRES</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <input class="pm-inp" type="text" [(ngModel)]="cab.horaires" placeholder="Lun–Ven 08:00–18:00">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT — infos légales + actions -->
        <div class="pm-col-side">
          <div class="pm-pcard pm-pcard-side" style="animation-delay:.08s">
            <div class="pm-pcard-head">
              <div class="pm-pcard-ico" style="background:rgba(240,160,32,.12);color:var(--amber)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div>
                <div class="pm-pcard-title">Infos légales</div>
                <div class="pm-pcard-sub">Numéros officiels</div>
              </div>
            </div>
            <div class="pm-pcard-body">
              <div class="pm-field pm-field-full">
                <label class="pm-lbl">NUMÉRO D'ORDRE</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  <input class="pm-inp" type="text" [(ngModel)]="cab.numeroOrdre" placeholder="TN-XXXXX-D">
                </div>
              </div>
              <div class="pm-field pm-field-full">
                <label class="pm-lbl">MATRICULE FISCAL</label>
                <div class="pm-inp-wrap">
                  <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <input class="pm-inp" type="text" [(ngModel)]="cab.matriculeFiscal" placeholder="XXXXXXX/A">
                </div>
              </div>
            </div>
          </div>

          <!-- Save card -->
          <div class="pm-save-card" style="animation-delay:.14s">
            <div class="pm-save-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            </div>
            <div class="pm-save-text">
              <div class="pm-save-title">Enregistrer</div>
              <div class="pm-save-sub">Toutes les modifications</div>
            </div>
            <button class="pm-btn-save" (click)="saveCabinet()" [disabled]="cabSaving()">
              @if (cabSaving()) { <span class="pm-spin"></span> }
              @else { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> }
              <div class="pm-btn-shine"></div>
            </button>
          </div>
        </div>

      </div>
    }
  }

  <!-- ══════════════════════════════════
       TAB : PROFIL & ACCÈS
  ══════════════════════════════════ -->
  @if (tab()==='profil') {
    <div class="pm-profil-wrap" style="animation:slideIn .4s cubic-bezier(.34,1.56,.64,1) both">

      <!-- ── MOT DE PASSE DOCTEUR ── -->
      <div class="pm-pcard">
        <div class="pm-pcard-rainbow"></div>
        <div class="pm-pcard-head">
          <div class="pm-pcard-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <div class="pm-pcard-title">Mot de passe — Docteur</div>
            <div class="pm-pcard-sub">Votre accès personnel sécurisé</div>
          </div>
          <div class="pm-pcard-badge-right">
            <div class="pm-mini-av">{{ docIni() }}</div>
            <span>{{ docName() }}</span>
          </div>
        </div>
        <div class="pm-pcard-body pm-pwd-grid">
          <div class="pm-field">
            <label class="pm-lbl">MOT DE PASSE ACTUEL</label>
            <div class="pm-inp-wrap">
              <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="pm-inp" [type]="sOld()?'text':'password'" [(ngModel)]="dp.old" placeholder="••••••••">
              <button class="pm-eye" type="button" (click)="sOld.set(!sOld())">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  @if (sOld()) { <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  } @else { <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/> }
                </svg>
              </button>
            </div>
          </div>
          <div></div>
          <div class="pm-field">
            <label class="pm-lbl">NOUVEAU MOT DE PASSE</label>
            <div class="pm-inp-wrap">
              <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <input class="pm-inp" [type]="sNew()?'text':'password'" [(ngModel)]="dp.new" placeholder="Min. 8 caractères" (input)="cs(dp.new,'d')">
              <button class="pm-eye" type="button" (click)="sNew.set(!sNew())">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            @if (dp.new) { <div class="pm-str"><div class="pm-str-t"><div class="pm-str-f" [style.width]="dS()+'%'" [style.background]="scol(dS())"></div></div><span [style.color]="scol(dS())">{{ slbl(dS()) }}</span></div> }
          </div>
          <div class="pm-field">
            <label class="pm-lbl">CONFIRMER</label>
            <div class="pm-inp-wrap" [class.pm-inp-err]="dp.confirm && dp.new !== dp.confirm">
              <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input class="pm-inp" type="password" [(ngModel)]="dp.confirm" placeholder="Répéter">
            </div>
            @if (dp.confirm && dp.new !== dp.confirm) { <span class="pm-ferr">Les mots de passe ne correspondent pas</span> }
          </div>
        </div>
        <div class="pm-pcard-ft">
          <button class="pm-btn-cta" (click)="saveDocPwd()" [disabled]="docSaving() || !dp.old || !dp.new || dp.new !== dp.confirm">
            <div class="pm-btn-cta-ico">
              @if (docSaving()) { <span class="pm-spin pm-spin-w"></span> }
              @else { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
            </div>
            {{ docSaving() ? 'Mise à jour…' : 'Mettre à jour le mot de passe' }}
            <div class="pm-btn-shine"></div>
          </button>
        </div>
      </div>

      <!-- ── SECRÉTAIRES ── -->
      <div class="pm-pcard" style="animation-delay:.08s">
        <div class="pm-pcard-rainbow" style="background:linear-gradient(90deg,var(--em),var(--violet),var(--P))"></div>
        <div class="pm-pcard-head">
          <div class="pm-pcard-ico" style="background:rgba(14,184,138,.12);color:var(--em)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <div class="pm-pcard-title">Secrétaires</div>
            <div class="pm-pcard-sub">Modifier les accès et permissions</div>
          </div>
          @if (!secLoading() && secretaries().length > 0) {
            <div class="pm-count-chip">
              <span class="pm-live-dot" style="background:var(--em);width:6px;height:6px"></span>
              {{ secretaries().length }}
            </div>
          }
        </div>

        @if (secLoading()) {
          <div class="pm-pcard-body"><div class="pm-loading"><span class="pm-spin pm-spin-p"></span> Chargement…</div></div>
        } @else if (secretaries().length === 0) {
          <div class="pm-pcard-body">
            <div class="pm-empty">
              <div class="pm-empty-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="26" height="26"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
              <p>Aucune secrétaire enregistrée</p>
            </div>
          </div>
        } @else {
          <div class="pm-pcard-body" style="gap:6px;padding-top:0">

            @for (s of secretaries(); track s.id; let i = $index) {
              <!-- ROW -->
              <div class="pm-sec-row" [class.pm-sec-open]="picked()?.id === s.id"
                   (click)="pick(s)" [style.animation-delay]="(i*0.06)+'s'">
                <div class="pm-sec-av" [style.background]="GRADS[i % GRADS.length]">{{ ini(s.firstName, s.lastName) }}</div>
                <div class="pm-sec-body">
                  <div class="pm-sec-name">{{ s.firstName }} {{ s.lastName }}</div>
                  <div class="pm-sec-tags">
                    <span class="pm-tag-email">{{ s.email }}</span>
                    <span class="pm-tag-status" [class.online]="s.online">
                      <span class="pm-tag-dot"></span>{{ s.online ? 'En ligne' : 'Hors ligne' }}
                    </span>
                  </div>
                </div>
                <svg class="pm-sec-arrow" [class.pm-sec-arrow-open]="picked()?.id === s.id"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              <!-- PANEL INLINE -->
              @if (picked()?.id === s.id) {
                <div class="pm-sec-panel">
                  <div class="pm-sec-panel-top">
                    <div class="pm-sec-panel-av" [style.background]="GRADS[i % GRADS.length]">{{ ini(s.firstName, s.lastName) }}</div>
                    <div>
                      <div class="pm-sec-panel-name">{{ s.firstName }} {{ s.lastName }}</div>
                      <div class="pm-sec-panel-sub">Modifier les accès de cette secrétaire</div>
                    </div>
                  </div>

                  <div class="pm-sec-panel-grid">
                    <div class="pm-field pm-field-full">
                      <label class="pm-lbl">ADRESSE EMAIL</label>
                      <div class="pm-inp-wrap">
                        <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <input class="pm-inp" type="email" [(ngModel)]="ed.email" placeholder="email@cabinet.tn">
                      </div>
                    </div>
                    <div class="pm-field">
                      <label class="pm-lbl">NOUVEAU MOT DE PASSE <span class="pm-lbl-opt">(optionnel)</span></label>
                      <div class="pm-inp-wrap">
                        <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <input class="pm-inp" [type]="sSec()?'text':'password'" [(ngModel)]="ed.pwd" placeholder="Laisser vide si inchangé" (input)="cs(ed.pwd,'s')">
                        <button class="pm-eye" type="button" (click)="sSec.set(!sSec())">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </div>
                      @if (ed.pwd) { <div class="pm-str"><div class="pm-str-t"><div class="pm-str-f" [style.width]="sS()+'%'" [style.background]="scol(sS())"></div></div><span [style.color]="scol(sS())">{{ slbl(sS()) }}</span></div> }
                    </div>
                    <div class="pm-field">
                      <label class="pm-lbl">CONFIRMER</label>
                      <div class="pm-inp-wrap" [class.pm-inp-err]="ed.confirm && ed.pwd !== ed.confirm">
                        <svg class="pm-inp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <input class="pm-inp" type="password" [(ngModel)]="ed.confirm" placeholder="Répéter">
                      </div>
                      @if (ed.confirm && ed.pwd !== ed.confirm) { <span class="pm-ferr">Les mots de passe ne correspondent pas</span> }
                    </div>
                  </div>

                  <!-- Permissions -->
                  <div class="pm-perms-wrap">
                    <div class="pm-perms-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Autorisations d'accès
                    </div>
                    <div class="pm-perms-grid">
                      @for (p of PERMS; track p.key) {
                        <label class="pm-perm" [class.pm-perm-on]="ed.permissions[p.key]">
                          <input type="checkbox" style="display:none" [(ngModel)]="ed.permissions[p.key]">
                          <div class="pm-perm-ico" [style.color]="p.color" [innerHTML]="p.icon"></div>
                          <span>{{ p.label }}</span>
                          <div class="pm-perm-chk">
                            @if (ed.permissions[p.key]) {
                              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" width="8" height="8"><polyline points="20 6 9 17 4 12"/></svg>
                            }
                          </div>
                        </label>
                      }
                    </div>
                  </div>

                  <div class="pm-sec-panel-ft">
                    <button class="pm-btn-cta pm-btn-cta-sm" (click)="saveSec()"
                      [disabled]="secSaving() || (!!ed.pwd && ed.pwd !== ed.confirm)">
                      <div class="pm-btn-cta-ico pm-btn-cta-ico-sm">
                        @if (secSaving()) { <span class="pm-spin pm-spin-w"></span> }
                        @else { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg> }
                      </div>
                      {{ secSaving() ? 'Enregistrement…' : 'Enregistrer' }}
                      <div class="pm-btn-shine"></div>
                    </button>
                    <button class="pm-btn-danger" (click)="revoke()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="23" y2="14"/><line x1="23" y1="8" x2="17" y2="14"/></svg>
                      Révoquer l'accès
                    </button>
                  </div>
                </div>
              }
            }
          </div>
        }
      </div>
    </div>
  }

  <!-- ══ TOAST ══ -->
  <div class="pm-toast" [class.pm-toast-in]="toastOn()" [class.pm-toast-err]="toastErr()">
    @if (toastErr()) { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> }
    @else { <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
    {{ toastMsg() }}
  </div>

</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

    :host {
      display: block;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      --P: #1d5fe0; --P2: #154dc8; --P3: #4d87f5;
      --Pl: rgba(29,95,224,.08); --Pl2: rgba(29,95,224,.15);
      --em: #0eb88a; --rose: #f0426a; --amber: #f0a020; --violet: #7c3aed;
      --bg: #edf1fb; --bg2: #e2e9f8; --bg3: #ffffff;
      --brd: rgba(29,95,224,.1); --brd2: rgba(29,95,224,.2);
      --txt: #07193b; --txt2: #213259; --txt3: #526080; --txt4: #8ba0bf;
      --glass: rgba(255,255,255,.78); --gbrd: rgba(255,255,255,.9);
      --sh1: 0 2px 16px rgba(29,95,224,.08); --sh2: 0 10px 40px rgba(29,95,224,.14);
      --sh3: 0 24px 72px rgba(7,25,59,.18);
    }

    * { box-sizing: border-box; }

    .pm-root {
      position: relative; min-height: 100%; padding: 28px 30px;
      display: flex; flex-direction: column; gap: 22px;
      animation: pgIn .45s cubic-bezier(.22,1,.36,1) both;
    }
    @keyframes pgIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    @keyframes slideIn { from{opacity:0;transform:translateY(12px) scale(.99)} to{opacity:1;transform:none} }

    /* ── BG ── */
    .pm-bg { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
    .pm-orb { position:absolute;border-radius:50%;filter:blur(72px); }
    .pm-orb1 { width:520px;height:520px;top:-120px;right:3%;background:radial-gradient(circle,rgba(29,95,224,.09),rgba(124,58,237,.05) 60%,transparent 75%);animation:o1 22s ease-in-out infinite; }
    .pm-orb2 { width:380px;height:380px;bottom:40px;left:8%;background:radial-gradient(circle,rgba(14,184,138,.08),transparent 70%);animation:o2 28s ease-in-out infinite; }
    .pm-orb3 { width:300px;height:300px;top:35%;left:38%;background:radial-gradient(circle,rgba(240,66,106,.05),transparent 70%);animation:o1 19s ease-in-out infinite reverse; }
    @keyframes o1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-44px,32px)} }
    @keyframes o2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-30px)} }
    .pm-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(29,95,224,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(29,95,224,.025) 1px,transparent 1px);background-size:56px 56px; }
    .pm-ecg { position:absolute;bottom:36px;left:0;width:100%;height:60px;opacity:.055; }
    .pm-ecg-line { fill:none;stroke:var(--P);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2400;stroke-dashoffset:2400;animation:ecg 5s ease-in-out infinite; }
    @keyframes ecg { 0%{stroke-dashoffset:2400;opacity:0} 10%{opacity:1} 80%{stroke-dashoffset:0;opacity:.8} 100%{stroke-dashoffset:0;opacity:0} }
    .cf { position:absolute;color:var(--P);opacity:.038;font-size:18px;animation:cfloat 14s ease-in-out infinite;user-select:none; }
    .cf1 { top:11%;right:9%;font-size:22px;animation-duration:17s; }
    .cf2 { top:58%;right:28%;font-size:13px;animation-duration:12s;animation-delay:-6s; }
    @keyframes cfloat { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-16px) rotate(10deg)} }

    /* ── HERO ── */
    .pm-hero { position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap; }
    .pm-hero-eyebrow { display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:.09em;margin-bottom:8px; }
    .pm-live-dot { width:7px;height:7px;border-radius:50%;background:var(--em);animation:ldot 2.5s ease-in-out infinite;flex-shrink:0; }
    @keyframes ldot { 0%,100%{box-shadow:0 0 0 0 rgba(14,184,138,.5)} 50%{box-shadow:0 0 0 5px rgba(14,184,138,0)} }
    .pm-hero-title { display:flex;align-items:center;gap:13px;font-size:28px;font-weight:900;color:var(--txt);letter-spacing:-1.2px;margin:0 0 6px; }
    .pm-hero-ico { width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,var(--Pl2),rgba(124,58,237,.12));border:1.5px solid rgba(29,95,224,.2);display:flex;align-items:center;justify-content:center;color:var(--P);flex-shrink:0;box-shadow:0 4px 18px rgba(29,95,224,.18); }
    .pm-hero-sub { font-size:13.5px;color:var(--txt4); }
    .pm-doc-card { display:flex;align-items:center;gap:12px;padding:12px 18px 12px 12px;background:var(--glass);border:1.5px solid var(--gbrd);border-radius:18px;box-shadow:var(--sh1);backdrop-filter:blur(20px);flex-shrink:0; }
    .pm-doc-av { width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,var(--P),var(--violet));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0;box-shadow:0 4px 16px rgba(29,95,224,.3); }
    .pm-doc-name { font-size:14px;font-weight:700;color:var(--txt); }
    .pm-doc-role { font-size:11.5px;color:var(--txt4);margin-top:2px; }
    .pm-doc-info { flex:1; }
    .pm-doc-status { display:flex;align-items:center; }

    /* ── NAV PILLS ── */
    .pm-nav-pills { position:relative;z-index:1;display:flex;gap:6px; }
    .pm-pill { display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:99px;border:1.5px solid var(--brd);background:var(--glass);backdrop-filter:blur(16px);color:var(--txt3);font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .22s; }
    .pm-pill:hover { color:var(--txt2);border-color:var(--brd2);background:rgba(255,255,255,.88); }
    .pm-pill-on { background:linear-gradient(135deg,var(--P),var(--violet))!important;border-color:transparent!important;color:white!important;box-shadow:0 6px 22px rgba(29,95,224,.36); }
    .pm-pill-ico { width:22px;height:22px;border-radius:6px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center; }
    .pm-pill:not(.pm-pill-on) .pm-pill-ico { background:var(--Pl); }
    .pm-pill-badge { background:rgba(255,255,255,.25);border-radius:99px;font-size:10px;font-weight:700;padding:2px 7px; }
    .pm-pill:not(.pm-pill-on) .pm-pill-badge { background:var(--Pl2);color:var(--P); }

    /* ── PCARD ── */
    .pm-pcard { position:relative;z-index:1;overflow:hidden;background:var(--glass);backdrop-filter:blur(28px) saturate(160%);border:1.5px solid var(--gbrd);border-radius:22px;box-shadow:var(--sh2);animation:slideIn .38s cubic-bezier(.34,1.56,.64,1) both; }
    .pm-pcard-rainbow { height:4px;background:linear-gradient(90deg,var(--P),var(--violet),var(--em)); }
    .pm-pcard-head { display:flex;align-items:center;gap:12px;padding:18px 22px 14px;border-bottom:1px solid rgba(29,95,224,.08);flex-wrap:wrap;gap:10px; }
    .pm-pcard-ico { width:38px;height:38px;border-radius:11px;background:var(--Pl2);color:var(--P);display:flex;align-items:center;justify-content:center;border:1px solid rgba(29,95,224,.15);flex-shrink:0; }
    .pm-pcard-title { font-size:15px;font-weight:800;color:var(--txt); }
    .pm-pcard-sub { font-size:11.5px;color:var(--txt4);margin-top:2px; }
    .pm-pcard-body { padding:18px 22px;display:grid;grid-template-columns:1fr 1fr;gap:13px; }
    .pm-pcard-ft { padding:14px 22px 18px;border-top:1px solid rgba(29,95,224,.08);display:flex;align-items:center;gap:10px; }
    .pm-pcard-badge-right { margin-left:auto;display:flex;align-items:center;gap:8px;background:var(--Pl);border:1.5px solid var(--brd2);border-radius:99px;padding:5px 14px 5px 5px;font-size:12.5px;font-weight:600;color:var(--txt2); }
    .pm-mini-av { width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--P),var(--P2));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:white; }

    /* ── SPLIT LAYOUT ── */
    .pm-content-split { position:relative;z-index:1;display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:start; }
    .pm-col-main { display:flex;flex-direction:column;gap:0; }
    .pm-col-side { display:flex;flex-direction:column;gap:14px; }
    .pm-pcard-side { animation-delay:.06s; }

    /* ── SAVE CARD ── */
    .pm-save-card { position:relative;overflow:hidden;background:linear-gradient(135deg,var(--P),var(--violet));border-radius:20px;padding:20px;box-shadow:0 10px 40px rgba(29,95,224,.38);display:flex;align-items:center;gap:14px;animation:slideIn .38s .12s cubic-bezier(.34,1.56,.64,1) both; }
    .pm-save-icon { width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0; }
    .pm-save-title { font-size:14px;font-weight:800;color:white; }
    .pm-save-sub { font-size:11.5px;color:rgba(255,255,255,.65);margin-top:2px; }
    .pm-btn-save { width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.22);border:1.5px solid rgba(255,255,255,.32);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:auto;transition:all .2s;position:relative;overflow:hidden; }
    .pm-btn-save:hover:not(:disabled) { background:rgba(255,255,255,.32);transform:scale(1.08); }
    .pm-btn-save:disabled { opacity:.55;cursor:not-allowed; }

    /* ── PROFIL LAYOUT ── */
    .pm-profil-wrap { position:relative;z-index:1;display:flex;flex-direction:column;gap:16px; }
    .pm-pwd-grid { grid-template-columns:1fr 1fr; }

    /* ── FORM ── */
    .pm-field { display:flex;flex-direction:column;gap:5px; }
    .pm-field-full { grid-column:1/-1; }
    .pm-lbl { font-size:10px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.09em; }
    .pm-lbl-opt { font-weight:400;text-transform:none;letter-spacing:0;color:var(--txt4);font-size:9.5px; }
    .pm-inp-wrap { display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:13px;background:var(--Pl);border:1.5px solid var(--brd);color:var(--txt4);transition:all .2s;position:relative; }
    .pm-inp-wrap:focus-within { border-color:var(--P);background:rgba(29,95,224,.06);box-shadow:0 0 0 4px rgba(29,95,224,.09);color:var(--P); }
    .pm-inp-err { border-color:var(--rose)!important;background:rgba(240,66,106,.05)!important; }
    .pm-inp-ico { flex-shrink:0; }
    .pm-inp { border:none;background:transparent;outline:none;font-size:13px;color:var(--txt2);width:100%;font-family:'Plus Jakarta Sans',sans-serif; }
    .pm-inp::placeholder { color:var(--txt4); }
    .pm-eye { background:none;border:none;color:var(--txt4);cursor:pointer;padding:2px;display:flex;flex-shrink:0;transition:color .15s; }
    .pm-eye:hover { color:var(--txt2); }
    .pm-ferr { font-size:11px;color:var(--rose); }

    /* ── STRENGTH ── */
    .pm-str { display:flex;align-items:center;gap:8px;margin-top:2px; }
    .pm-str-t { flex:1;height:3px;background:var(--brd);border-radius:99px;overflow:hidden; }
    .pm-str-f { height:100%;border-radius:99px;transition:width .3s,background .3s; }
    .pm-str span { font-size:10px;font-weight:700;min-width:34px; }

    /* ── BUTTONS ── */
    .pm-btn-cta { position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:10px;padding:11px 22px;border-radius:14px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--P),var(--violet));color:white;font-size:13.5px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 6px 24px rgba(29,95,224,.35);transition:all .22s; }
    .pm-btn-cta:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 10px 34px rgba(29,95,224,.48); }
    .pm-btn-cta:disabled { opacity:.55;cursor:not-allowed;transform:none; }
    .pm-btn-cta-sm { padding:9px 18px;font-size:13px; }
    .pm-btn-cta-ico { width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .pm-btn-cta-ico-sm { width:22px;height:22px;border-radius:6px; }
    .pm-btn-shine { position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transition:left .45s; }
    .pm-btn-cta:hover .pm-btn-shine { left:100%; }
    .pm-btn-danger { display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;background:rgba(240,66,106,.08);color:var(--rose);border:1.5px solid rgba(240,66,106,.2);transition:all .18s; }
    .pm-btn-danger:hover { background:rgba(240,66,106,.16);border-color:rgba(240,66,106,.35); }

    /* ── SEC LIST ── */
    .pm-sec-row { display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;background:var(--glass);backdrop-filter:blur(12px);border:1.5px solid var(--gbrd);box-shadow:var(--sh1);cursor:pointer;transition:all .22s;animation:rowIn .42s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes rowIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }
    .pm-sec-row:hover { transform:translateX(5px);box-shadow:var(--sh2);border-color:rgba(29,95,224,.22); }
    .pm-sec-open { border-color:var(--P)!important;background:rgba(29,95,224,.04)!important; }
    .pm-sec-av { width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;box-shadow:0 4px 14px rgba(0,0,0,.15);flex-shrink:0; }
    .pm-sec-body { flex:1;min-width:0; }
    .pm-sec-name { font-size:14px;font-weight:700;color:var(--txt); }
    .pm-sec-tags { display:flex;align-items:center;gap:8px;margin-top:4px;flex-wrap:wrap; }
    .pm-tag-email { font-size:11px;font-weight:600;color:var(--P);background:var(--Pl);padding:2px 8px;border-radius:6px; }
    .pm-tag-status { display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--txt4); }
    .pm-tag-status.online { color:var(--em); }
    .pm-tag-dot { width:5px;height:5px;border-radius:50%;background:var(--txt4);flex-shrink:0; }
    .pm-tag-status.online .pm-tag-dot { background:var(--em);box-shadow:0 0 5px var(--em); }
    .pm-sec-arrow { color:var(--txt4);transition:transform .24s cubic-bezier(.34,1.56,.64,1),color .18s;flex-shrink:0; }
    .pm-sec-arrow-open { transform:rotate(180deg);color:var(--P); }
    .pm-count-chip { margin-left:auto;display:flex;align-items:center;gap:6px;background:rgba(14,184,138,.1);border:1.5px solid rgba(14,184,138,.2);border-radius:99px;padding:5px 12px;font-size:11.5px;font-weight:700;color:var(--em); }

    /* ── SEC PANEL ── */
    .pm-sec-panel { border-radius:16px;border:1.5px solid var(--brd2);overflow:hidden;background:rgba(29,95,224,.03);box-shadow:var(--sh1);animation:panelDown .26s cubic-bezier(.34,1.56,.64,1) both;margin-bottom:2px; }
    @keyframes panelDown { from{opacity:0;transform:translateY(-10px) scale(.985)} to{opacity:1;transform:none} }
    .pm-sec-panel-top { display:flex;align-items:center;gap:12px;padding:16px 18px 12px;border-bottom:1px solid rgba(29,95,224,.08); }
    .pm-sec-panel-av { width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0; }
    .pm-sec-panel-name { font-size:14px;font-weight:800;color:var(--txt); }
    .pm-sec-panel-sub { font-size:11.5px;color:var(--txt4);margin-top:2px; }
    .pm-sec-panel-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px 18px 0; }
    .pm-sec-panel-ft { display:flex;align-items:center;gap:10px;padding:14px 18px 16px;border-top:1px solid rgba(29,95,224,.08); }

    /* ── PERMISSIONS ── */
    .pm-perms-wrap { padding:14px 18px 0; }
    .pm-perms-title { display:flex;align-items:center;gap:7px;font-size:10px;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px; }
    .pm-perms-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:7px; }
    .pm-perm { display:flex;align-items:center;gap:8px;cursor:pointer;padding:9px 11px;border-radius:11px;background:var(--glass);border:1.5px solid var(--gbrd);transition:all .16s;user-select:none;font-size:12px;font-weight:600;color:var(--txt3); }
    .pm-perm:hover { border-color:var(--brd2);transform:translateY(-1px);box-shadow:var(--sh1); }
    .pm-perm-on { background:var(--Pl)!important;border-color:rgba(29,95,224,.3)!important;color:var(--txt)!important; }
    .pm-perm-ico { width:16px;height:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .pm-perm span { flex:1; }
    .pm-perm-chk { width:16px;height:16px;border-radius:5px;flex-shrink:0;background:var(--bg2);border:1.5px solid var(--brd2);display:flex;align-items:center;justify-content:center;transition:all .16s; }
    .pm-perm-on .pm-perm-chk { background:var(--P);border-color:var(--P2); }

    /* ── SPIN ── */
    .pm-spin { display:inline-block;width:13px;height:13px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:white;animation:spin .65s linear infinite;flex-shrink:0; }
    .pm-spin-w { border-color:rgba(255,255,255,.3);border-top-color:white; }
    .pm-spin-p { border-color:var(--brd2);border-top-color:var(--P); }
    @keyframes spin { to{transform:rotate(360deg)} }

    /* ── STATES ── */
    .pm-loading { display:flex;align-items:center;gap:10px;padding:24px 0;color:var(--txt4);font-size:13px; }
    .pm-empty { display:flex;flex-direction:column;align-items:center;gap:10px;padding:36px;color:var(--txt4);font-size:13px; }
    .pm-empty-ico { width:52px;height:52px;border-radius:14px;background:rgba(14,184,138,.1);color:var(--em);display:flex;align-items:center;justify-content:center; }
    .pm-skel-wrap { position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:13px;animation:pgIn .3s ease both; }
    .pm-skel { height:48px;border-radius:13px;background:linear-gradient(90deg,var(--brd),var(--brd2) 50%,var(--brd));background-size:200%;animation:shimmer 1.5s infinite; }
    @keyframes shimmer { to{background-position:-200%;} }

    /* ── TOAST ── */
    .pm-toast { position:fixed;bottom:24px;right:28px;z-index:9999;display:flex;align-items:center;gap:10px;padding:13px 20px;border-radius:16px;background:var(--em);color:white;font-size:13.5px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 10px 40px rgba(14,184,138,.45);transform:translateY(90px) scale(.95);opacity:0;transition:all .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none; }
    .pm-toast-in { transform:translateY(0) scale(1);opacity:1; }
    .pm-toast-err { background:var(--rose)!important;box-shadow:0 10px 40px rgba(240,66,106,.4)!important; }

    @media (max-width:900px) {
      .pm-content-split { grid-template-columns:1fr; }
      .pm-col-side { flex-direction:row;flex-wrap:wrap; }
      .pm-pcard-side,.pm-save-card { flex:1;min-width:280px; }
    }
    @media (max-width:650px) {
      .pm-pcard-body,.pm-pwd-grid,.pm-sec-panel-grid { grid-template-columns:1fr; }
      .pm-perms-grid { grid-template-columns:1fr 1fr; }
    }
  `]
})
export class ParametresComponent implements OnInit {

  private http   = inject(HttpClient);
  private auth   = inject(AuthService);
  private secSvc = inject(SecretaryService);
  private readonly API = environment.apiUrl;

  tab            = signal<'cabinet'|'profil'>('cabinet');
  docName        = signal('');
  docIni         = signal('DR');
  cabinetLoading = signal(false);
  cabSaving      = signal(false);
  cab = { nom:'', adresse:'', telephone:'', email:'', siteWeb:'', horaires:'', numeroOrdre:'', matriculeFiscal:'' };
  docSaving = signal(false);
  sOld = signal(false); sNew = signal(false); sSec = signal(false);
  dS = signal(0); sS = signal(0);
  dp = { old:'', new:'', confirm:'' };
  secLoading = signal(false); secSaving = signal(false);
  secretaries = signal<Secretary[]>([]);
  picked = signal<Secretary|null>(null);
  ed = { email:'', pwd:'', confirm:'', permissions:{ rdv:false, patients:false, ordonnances:false, paiements:false, parametres:false, urgences:false } };
  toastOn = signal(false); toastMsg = signal(''); toastErr = signal(false);
  private _tt: any;

  readonly GRADS = ['linear-gradient(135deg,#1d5fe0,#154dc8)','linear-gradient(135deg,#6366f1,#4f46e5)','linear-gradient(135deg,#0891b2,#0e7490)','linear-gradient(135deg,#0eb88a,#0d9a76)','linear-gradient(135deg,#ec4899,#db2777)','linear-gradient(135deg,#f59e0b,#d97706)'];
  readonly PERMS = [
    { key:'rdv'         as const, label:'Rendez-vous', color:'#4d87f5', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
    { key:'patients'    as const, label:'Patients',    color:'#7c3aed', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>` },
    { key:'ordonnances' as const, label:'Ordonnances', color:'#0eb88a', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>` },
    { key:'paiements'   as const, label:'Paiements',   color:'#f0a020', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>` },
    { key:'parametres'  as const, label:'Paramètres',  color:'#fb923c', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>` },
    { key:'urgences'    as const, label:'Urgences',    color:'#f0426a', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>` },
  ];

  ngOnInit() {
    const u = this.auth.user();
    if (u) {
      this.docName.set(u.name);
      const p = u.name.split(' ');
      this.docIni.set(p.length >= 2 ? (p[0][0]+p[p.length-1][0]).toUpperCase() : u.name.substring(0,2).toUpperCase());
    }
    this.loadCabinet();
    this.loadSec();
  }

  async loadCabinet() {
    this.cabinetLoading.set(true);
    try {
      const d: any = await firstValueFrom(this.http.get(`${this.API}/settings/cabinet`));
      if (d) {
        this.cab.nom             = d.nom            || d.name        || '';
        this.cab.adresse         = d.adresse         || d.address     || '';
        this.cab.telephone       = d.telephone       || d.phone       || '';
        this.cab.email           = d.email           || '';
        this.cab.siteWeb         = d.siteWeb         || d.website     || '';
        this.cab.horaires        = d.horaires        || d.schedule    || '';
        this.cab.numeroOrdre     = d.numeroOrdre     || d.orderNumber || '';
        this.cab.matriculeFiscal = d.matriculeFiscal || d.taxNumber   || '';
      }
    } catch {}
    finally { this.cabinetLoading.set(false); }
  }

  async saveCabinet() {
    this.cabSaving.set(true);
    try {
      await firstValueFrom(this.http.put(`${this.API}/settings/cabinet`, this.cab));
      this.toast('Informations du cabinet mises à jour');
    } catch (e: any) { this.toast(e?.error?.message || 'Erreur lors de la sauvegarde', true); }
    finally { this.cabSaving.set(false); }
  }

  async saveDocPwd() {
    if (!this.dp.old || !this.dp.new || this.dp.new !== this.dp.confirm) return;
    this.docSaving.set(true);
    try {
      await firstValueFrom(this.http.put(`${this.API}/auth/change-password`, { userId: this.auth.user()?.id, currentPassword: this.dp.old, newPassword: this.dp.new }));
      this.dp = { old:'', new:'', confirm:'' }; this.dS.set(0);
      this.toast('Mot de passe mis à jour');
    } catch (e: any) { this.toast(e?.error?.message || 'Mot de passe actuel incorrect', true); }
    finally { this.docSaving.set(false); }
  }

  async loadSec() {
    this.secLoading.set(true);
    try { this.secretaries.set(await firstValueFrom(this.secSvc.getAll())); }
    catch { this.secretaries.set([]); }
    finally { this.secLoading.set(false); }
  }

  pick(s: Secretary) {
    if (this.picked()?.id === s.id) { this.picked.set(null); return; }
    this.picked.set(s);
    this.ed = { email: s.email, pwd:'', confirm:'', permissions: { ...s.permissions } };
    this.sS.set(0);
  }

  async saveSec() {
    const s = this.picked();
    if (!s || (this.ed.pwd && this.ed.pwd !== this.ed.confirm)) return;
    this.secSaving.set(true);
    try {
      const payload: any = { email: this.ed.email, permissions: this.ed.permissions };
      if (this.ed.pwd) payload.password = this.ed.pwd;
      await firstValueFrom(this.secSvc.update(s.id, payload));
      this.secretaries.update(l => l.map(x => x.id === s.id ? { ...x, email: this.ed.email, permissions: { ...this.ed.permissions } } : x));
      this.ed.pwd = ''; this.ed.confirm = ''; this.sS.set(0);
      this.toast(`Accès de ${s.firstName} mis à jour`);
    } catch (e: any) { this.toast(e?.error?.message || 'Erreur lors de la mise à jour', true); }
    finally { this.secSaving.set(false); }
  }

  async revoke() {
    const s = this.picked();
    if (!s || !confirm(`Révoquer l'accès de ${s.firstName} ${s.lastName} ?`)) return;
    try {
      await firstValueFrom(this.secSvc.delete(s.email));
      this.secretaries.update(l => l.filter(x => x.id !== s.id));
      this.picked.set(null);
      this.toast(`Accès de ${s.firstName} révoqué`);
    } catch (e: any) { this.toast(e?.error?.message || 'Erreur lors de la révocation', true); }
  }

  ini(f?: string, l?: string) { return ((f?.[0]??'')+(l?.[0]??'')).toUpperCase()||'??'; }
  scol(v: number) { return v < 40 ? 'var(--rose)' : v < 70 ? 'var(--amber)' : 'var(--em)'; }
  slbl(v: number) { return v < 40 ? 'Faible' : v < 70 ? 'Moyen' : 'Fort'; }
  cs(pwd: string, who: 'd'|'s') {
    let s = 0;
    if (pwd.length >= 8) s += 25; if (pwd.length >= 12) s += 15;
    if (/[A-Z]/.test(pwd)) s += 20; if (/[0-9]/.test(pwd)) s += 20; if (/[^A-Za-z0-9]/.test(pwd)) s += 20;
    who === 'd' ? this.dS.set(Math.min(s,100)) : this.sS.set(Math.min(s,100));
  }
  private toast(msg: string, err = false) {
    clearTimeout(this._tt);
    this.toastMsg.set(msg); this.toastErr.set(err); this.toastOn.set(true);
    this._tt = setTimeout(() => this.toastOn.set(false), 3200);
  }
}