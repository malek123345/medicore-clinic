import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

type Tab    = 'login' | 'signup';
type Stage  = 'form' | 'otp' | 'done';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<div class="scene">

  <!-- ══ ANIMATED BG ══ -->
  <div class="scene-bg">
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
    <div class="orb orb3"></div>
    <div class="bg-grid"></div>
    <!-- ECG line -->
    <svg class="ecg-bg" viewBox="0 0 1400 80" preserveAspectRatio="none">
      <polyline class="ecg-line" points="0,40 100,40 120,40 132,8 144,72 156,40 200,40 300,40 320,40 332,8 344,72 356,40 400,40 500,40 520,40 532,8 544,72 556,40 600,40 700,40 720,40 732,8 744,72 756,40 800,40 900,40 920,40 932,8 944,72 956,40 1000,40 1100,40 1120,40 1132,8 1144,72 1156,40 1200,40 1400,40"/>
    </svg>
    <!-- Floating medical crosses -->
    <div class="med-cross mc1">✚</div>
    <div class="med-cross mc2">✚</div>
    <div class="med-cross mc3">✚</div>
  </div>

  <!-- ══ CARD ══ -->
  <div class="card" [class.signup-mode]="tab()==='signup'">

    <!-- ══ LEFT PANEL ══ -->
    <div class="left">
      <div class="left-shimmer"></div>
      <div class="left-shine"></div>

      <!-- Brand -->
      <div class="brand">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path d="M12 2v20M7 7h10M5 12h14M7 17h10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <div class="brand-logo-pulse"></div>
        </div>
        <div>
          <div class="brand-name">Med<span class="brand-accent">Space</span></div>
          <div class="brand-sub">Cabinet Médical Pro</div>
        </div>
      </div>

      <!-- Center orbit -->
      <div class="left-center">
        <div class="orbit-scene">
          <div class="orbit-ring or1"><div class="orbit-dot od1"></div></div>
          <div class="orbit-ring or2"><div class="orbit-dot od2"></div></div>
          <div class="orbit-ring or3"><div class="orbit-dot od3"></div></div>
          <div class="orbit-core">
            <svg viewBox="0 0 64 64" width="34" height="34" fill="white">
              <path d="M32 6c-10 0-18 7-18 18 0 8 4 13 7 18 2 4 2 10 4 12 2 2 4-2 5-6l2-7 2 7c1 4 3 8 5 6 2-2 2-8 4-12 3-5 7-10 7-18 0-11-8-18-18-18z" opacity=".95"/>
              <path d="M22 34c4 5 16 5 20 0" stroke="white" stroke-width="2" fill="none" opacity=".7"/>
            </svg>
          </div>
        </div>

        <!-- Features list -->
        
      </div>

      <!-- Footer -->
      <div class="left-foot">
        
        <button class="left-switch-btn" (click)="toggleTab()">
          {{ tab()==='login' ? "Créer un compte →" : "← Se connecter" }}
        </button>
      </div>
    </div>

    <!-- ══ RIGHT PANEL ══ -->
    <div class="right">

      <!-- Top bar -->
      <div class="right-topbar">
        <div class="tab-pills">
          <button class="tab-pill" [class.tp-on]="tab()==='login'" (click)="setTab('login')">Connexion</button>
          <button class="tab-pill" [class.tp-on]="tab()==='signup'" (click)="setTab('signup')">Inscription</button>
        </div>
        <a routerLink="/" class="back-home">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </a>
      </div>

      <!-- ══════════════════════════════
           LOGIN FORM
      ══════════════════════════════ -->
      <div class="form-panel" [class.fp-hidden]="tab()==='signup'">

        <div class="form-head">
          <div class="form-eyebrow">
            <span class="eyebrow-dot"></span>Espace sécurisé
          </div>
          <h1 class="form-h1">Connexion</h1>
          <p class="form-p">Accédez à votre tableau de bord médical</p>
        </div>

        <!-- Demo accounts -->
        <div class="demos">
          <div class="demos-label">Connexion rapide ·</div>
          
        </div>

        <div class="or-sep"><span>Ou entrez vos identifiants</span></div>

        <form [formGroup]="loginForm" (ngSubmit)="submitLogin()">
          <div class="fg">
            <label class="fl">EMAIL</label>
            <div class="iw" [class.iw-err]="linv('email')" [class.iw-ok]="loginForm.get('email')?.valid && loginForm.get('email')?.touched">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input formControlName="email" type="email" placeholder="votre@email.com"/>
              @if (loginForm.get('email')?.valid && loginForm.get('email')?.touched) {
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              }
            </div>
          </div>
          <div class="fg">
            <div class="fg-top">
              <label class="fl">MOT DE PASSE</label>
              <button type="button" class="forgot-link">Mot de passe oublié ?</button>
            </div>
            <div class="iw" [class.iw-err]="linv('password')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input formControlName="password" [type]="showPass ? 'text' : 'password'" placeholder="••••••••"/>
              <button type="button" class="eye-btn" (click)="showPass=!showPass">
                @if (showPass) { <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> }
                @else { <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
              </button>
            </div>
          </div>

          <label class="remember-row">
            <input type="checkbox" formControlName="remember"/>
            <div class="chk-box">
              @if (loginForm.get('remember')?.value) {
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              }
            </div>
            <span>Se souvenir de moi</span>
          </label>

          @if (loginError()) {
            <div class="alert-err">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ loginError() }}
            </div>
          }

          <button type="submit" class="btn-submit" [class.btn-loading]="loading()">
            @if (loading()) { <span class="loader-ring"></span> Connexion en cours… }
            @else {
              Se connecter
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            }
          </button>
        </form>

        <div class="mobile-switch">Pas de compte ? <button (click)="toggleTab()">S'inscrire →</button></div>
      </div>

      <!-- ══════════════════════════════
           SIGNUP — STAGE: FORM
      ══════════════════════════════ -->
      <div class="form-panel" [class.fp-hidden]="tab()==='login' || signupStage()==='otp' || signupStage()==='done'">

        <div class="form-head">
          <div class="form-eyebrow"><span class="eyebrow-dot" style="background:var(--violet)"></span>Nouveau compte</div>
          <h1 class="form-h1">Inscription</h1>
          <p class="form-p">Créez votre espace médical en quelques secondes</p>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="submitSignupStep1()">
          <div class="two-col">
            <div class="fg">
              <label class="fl">PRÉNOM *</label>
              <div class="iw" [class.iw-err]="sinv('firstName')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input formControlName="firstName" type="text" placeholder="Prénom"/>
              </div>
            </div>
            <div class="fg">
              <label class="fl">NOM *</label>
              <div class="iw" [class.iw-err]="sinv('lastName')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input formControlName="lastName" type="text" placeholder="Nom"/>
              </div>
            </div>
          </div>

          <div class="fg">
            <label class="fl">EMAIL *</label>
            <div class="iw" [class.iw-err]="sinv('email')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input formControlName="email" type="email" placeholder="votre@email.com"/>
            </div>
          </div>

          <!-- ══ PHONE NUMBER - OBLIGATOIRE ══ -->
          <div class="fg">
            <label class="fl">NUMÉRO DE TÉLÉPHONE * <span class="fl-note">(pour recevoir le code de vérification)</span></label>
            <div class="phone-wrap" [class.iw-err]="sinv('phone')">
              <div class="phone-prefix">
                <div class="flag">🇹🇳</div>
                <span>+216</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <input class="phone-inp" formControlName="phone" type="tel" placeholder="XX XXX XXX" maxlength="9"/>
              <div class="phone-verify-icon">
                @if (signupForm.get('phone')?.valid && signupForm.get('phone')?.touched) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                } @else {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                }
              </div>
            </div>
            <div class="phone-hint">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Vous recevrez un SMS avec un code de vérification à 6 chiffres
            </div>
          </div>

          <div class="two-col">
            <div class="fg">
              <label class="fl">MOT DE PASSE *</label>
              <div class="iw" [class.iw-err]="sinv('password')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input formControlName="password" [type]="showPass ? 'text' : 'password'" placeholder="Min. 8 caractères" (input)="updateStrength()"/>
                <button type="button" class="eye-btn" (click)="showPass=!showPass">
                  @if (showPass) { <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> }
                  @else { <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
                </button>
              </div>
              <!-- Strength meter -->
              <div class="pw-meter">
                @for (i of [1,2,3,4]; track i) {
                  <div class="pw-seg" [style.background]="pwColor(i)"></div>
                }
                @if (pwStr() > 0) {
                  <span class="pw-lbl" [style.color]="pwColor(pwStr())">{{ pwLabel() }}</span>
                }
              </div>
            </div>
            <div class="fg">
              <label class="fl">CONFIRMER *</label>
              <div class="iw" [class.iw-err]="sinv('confirm')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input formControlName="confirm" [type]="showPass ? 'text' : 'password'" placeholder="Répétez"/>
              </div>
            </div>
          </div>

          @if (signupError()) {
            <div class="alert-err">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ signupError() }}
            </div>
          }

          <button type="submit" class="btn-submit btn-violet" [class.btn-loading]="loading()">
            @if (loading()) { <span class="loader-ring"></span> Envoi du code… }
            @else {
              Recevoir le code SMS
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            }
          </button>

          <p class="terms-txt">En vous inscrivant, vous acceptez nos <a href="#">Conditions d'utilisation</a> et notre <a href="#">Politique de confidentialité</a>.</p>
        </form>

        <div class="mobile-switch">Déjà un compte ? <button (click)="toggleTab()">← Se connecter</button></div>
      </div>

      <!-- ══════════════════════════════
           SIGNUP — STAGE: OTP
      ══════════════════════════════ -->
      <div class="form-panel otp-panel" [class.fp-hidden]="tab()==='login' || signupStage()!=='otp'">

        <div class="otp-back-btn-wrap">
          <button class="otp-back" (click)="backToForm()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
        </div>

        <div class="otp-header">
          <div class="otp-phone-ico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            <div class="otp-ico-ring"></div>
          </div>
          <h2 class="otp-title">Vérification SMS</h2>
          <p class="otp-desc">
            Un code de vérification à <strong>6 chiffres</strong> a été envoyé au<br/>
            <span class="otp-phone-num">+216 {{ formatPhone(signupForm.get('phone')?.value) }}</span>
          </p>
          <!-- Demo hint -->
          <div class="otp-demo-hint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Mode démo : le code est <strong>{{ generatedOtp() }}</strong>
          </div>
        </div>

        <!-- OTP Boxes -->
        <div class="otp-boxes-wrap">
          <div class="otp-boxes">
            @for (i of [0,1,2,3,4,5]; track i) {
              <input
                class="otp-box"
                [class.otp-box-filled]="otpDigits()[i]"
                [class.otp-box-err]="otpError()"
                type="text"
                inputmode="numeric"
                maxlength="1"
                [value]="otpDigits()[i] || ''"
                (input)="onOtpInput($event, i)"
                (keydown)="onOtpKeydown($event, i)"
                (paste)="onOtpPaste($event)"
                [id]="'otp-'+i"
              />
            }
          </div>
          @if (otpError()) {
            <div class="otp-err-msg">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Code incorrect. Il vous reste {{ otpAttempts() }} tentative(s).
            </div>
          }
        </div>

        <!-- Timer & Resend -->
        <div class="otp-timer-row">
          @if (otpCountdown() > 0) {
            <div class="otp-countdown">
              <div class="otp-progress" [style.background]="'conic-gradient(var(--P) '+Math.round((1-otpCountdown()/120)*360)+'deg, var(--brd2) 0deg)'">
                <div class="otp-progress-inner">{{ otpCountdown() }}</div>
              </div>
              Renvoi dans {{ otpCountdown() }}s
            </div>
          } @else {
            <button class="otp-resend" (click)="resendOtp()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Renvoyer le code
            </button>
          }
        </div>

        <button class="btn-submit btn-violet" (click)="verifyOtp()" [class.btn-loading]="loading()" [disabled]="otpDigits().join('').length < 6">
          @if (loading()) { <span class="loader-ring"></span> Vérification… }
          @else {
            Vérifier et créer mon compte
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          }
        </button>
      </div>

      <!-- ══════════════════════════════
           SIGNUP — STAGE: DONE
      ══════════════════════════════ -->
      <div class="form-panel done-panel" [class.fp-hidden]="tab()==='login' || signupStage()!=='done'">
        <div class="done-wrap">
          <div class="done-ico">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <div class="done-ico-ring done-ring1"></div>
            <div class="done-ico-ring done-ring2"></div>
          </div>
          <h2 class="done-title">Compte créé !</h2>
          <p class="done-desc">
            Bienvenue <strong>{{ signupForm.get('firstName')?.value }}</strong> !<br/>
            Votre numéro <strong>+216 {{ formatPhone(signupForm.get('phone')?.value) }}</strong><br/>
            a été vérifié avec succès.
          </p>
          <div class="done-progress">
            <div class="done-bar" [style.animation-duration]="'3s'"></div>
          </div>
          <p class="done-redirect">Redirection vers la connexion…</p>
        </div>
      </div>

    </div><!-- /right -->
  </div><!-- /card -->
</div><!-- /scene -->
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

    :host { display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Plus Jakarta Sans',sans-serif; }

    /* ══ CSS VARS ══ */
    * { box-sizing:border-box; margin:0; padding:0; }
    :host {
      --P:      #1d5fe0;
      --P2:     #154dc8;
      --violet: #7c3aed;
      --em:     #10b981;
      --rose:   #f0426a;
      --amber:  #f0a020;
      --bg3:    #ffffff;
      --brd:    rgba(29,95,224,0.12);
      --brd2:   #e2e9f8;
      --txt:    #07193b;
      --txt2:   #213259;
      --txt3:   #526080;
      --txt4:   #8ba0bf;
      --Pl:     rgba(29,95,224,0.08);
      --Pl2:    rgba(29,95,224,0.14);
    }

    /* ══ SCENE ══ */
    .scene {
      position:relative; width:100%; min-height:100vh;
      display:flex; align-items:center; justify-content:center;
      overflow:hidden; padding:24px;
      background:linear-gradient(150deg, #060f2a 0%, #0d1f5c 35%, #1040b0 65%, #0a2575 100%);
    }

    /* Animated BG */
    .scene-bg { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
    .orb { position:absolute; border-radius:50%; filter:blur(90px); }
    .orb1 { width:600px;height:600px;top:-200px;left:-100px;background:radial-gradient(circle,rgba(77,141,245,0.15),rgba(124,58,237,0.08),transparent 70%);animation:orb1 22s ease-in-out infinite; }
    .orb2 { width:500px;height:500px;bottom:-100px;right:-100px;background:radial-gradient(circle,rgba(16,185,129,0.1),transparent 70%);animation:orb2 28s ease-in-out infinite; }
    .orb3 { width:350px;height:350px;top:40%;left:40%;background:radial-gradient(circle,rgba(240,66,106,0.07),transparent 70%);animation:orb3 18s ease-in-out infinite; }
    @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.05)} 66%{transform:translate(-30px,40px) scale(.96)} }
    @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,-50px) scale(1.07)} }
    @keyframes orb3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px) scale(1.1)} }
    .bg-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:44px 44px; }
    .ecg-bg { position:absolute;bottom:60px;left:0;width:100%;height:80px;opacity:.07; }
    .ecg-line { fill:none;stroke:#60a5fa;stroke-width:1.5;stroke-linecap:round;stroke-dasharray:3500;stroke-dashoffset:3500;animation:ecgDraw 7s ease-in-out infinite; }
    @keyframes ecgDraw { 0%{stroke-dashoffset:3500;opacity:0} 10%{opacity:1} 80%{stroke-dashoffset:0;opacity:.85} 100%{stroke-dashoffset:0;opacity:0} }
    .med-cross { position:absolute;color:rgba(255,255,255,.06);font-size:20px;animation:crossF 16s ease-in-out infinite;user-select:none; }
    .mc1 { top:10%;right:8%;font-size:26px; } .mc2 { top:60%;right:25%;font-size:16px;animation-delay:-6s; } .mc3 { top:30%;left:10%;font-size:18px;animation-delay:-11s; }
    @keyframes crossF { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-20px) rotate(12deg)} }

    /* ══ CARD ══ */
    .card {
      position:relative; z-index:10;
      display:flex; width:940px; max-width:100%;
      border-radius:26px; overflow:hidden;
      box-shadow:0 50px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.1);
      animation:cardIn .8s cubic-bezier(.22,1,.36,1) both;
    }
    @keyframes cardIn { from{opacity:0;transform:translateY(36px) scale(.97)} to{opacity:1;transform:none} }

    /* ══ LEFT PANEL ══ */
    .left {
      width:42%; flex-shrink:0;
      background:linear-gradient(168deg, #0a1840 0%, #0d2a6e 45%, #1040b0 80%, #1555c8 100%);
      display:flex; flex-direction:column; padding:40px 36px;
      position:relative; overflow:hidden;
    }
    .left-shimmer { position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(100,160,255,.12) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(14,184,138,.07) 0%,transparent 60%);pointer-events:none; }
    .left-shine { position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent); }

    /* Brand */
    .brand { position:relative;z-index:1;display:flex;align-items:center;gap:12px;margin-bottom:40px; }
    .brand-logo { position:relative;width:44px;height:44px;border-radius:13px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.18);flex-shrink:0; }
    .brand-logo-pulse { position:absolute;inset:-4px;border-radius:17px;border:1.5px solid rgba(255,255,255,.2);animation:logoPulse 3s ease-in-out infinite; }
    @keyframes logoPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:0;transform:scale(1.15)} }
    .brand-name { font-size:17px;font-weight:900;color:white;letter-spacing:-.5px;line-height:1; }
    .brand-accent { color:rgba(140,200,255,.9); }
    .brand-sub { font-size:10.5px;color:rgba(255,255,255,.45);margin-top:3px; }

    /* Orbit */
    .left-center { position:relative;z-index:1;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px; }
    .orbit-scene { position:relative;width:190px;height:190px;display:flex;align-items:center;justify-content:center; }
    .orbit-ring { position:absolute;border-radius:50%;border:1px dashed rgba(255,255,255,.14);animation:orbitSpin linear infinite; }
    .or1 { width:190px;height:190px;animation-duration:22s; }
    .or2 { width:140px;height:140px;animation-duration:16s;animation-direction:reverse; }
    .or3 { width:90px;height:90px;animation-duration:10s; }
    @keyframes orbitSpin { to{transform:rotate(360deg)} }
    .orbit-dot { position:absolute;border-radius:50%;animation:dotGlow 2s ease-in-out infinite; }
    .od1 { width:9px;height:9px;background:#60a5fa;box-shadow:0 0 14px #60a5fa;top:-4.5px;left:50%;transform:translateX(-50%); }
    .od2 { width:7px;height:7px;background:#34d399;box-shadow:0 0 12px #34d399;bottom:-3.5px;left:50%;transform:translateX(-50%); }
    .od3 { width:6px;height:6px;background:#f472b6;box-shadow:0 0 10px #f472b6;top:50%;right:-3px;transform:translateY(-50%); }
    @keyframes dotGlow { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.3)} }
    .orbit-core { width:88px;height:88px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 36px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.18); }

    /* Features */
    .feat-list { display:flex;flex-direction:column;gap:9px;width:100%; }
    .feat-item { display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);transition:all .2s; }
    .feat-item:hover { background:rgba(255,255,255,.1); }
    .feat-ico { width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .feat-ico ::ng-deep svg { width:14px;height:14px; }
    .feat-text { font-size:12.5px;font-weight:600;color:rgba(255,255,255,.75); }

    /* Left footer */
    .left-foot { position:relative;z-index:1;margin-top:auto;padding-top:20px; }
    .left-tagline { font-size:14px;font-weight:700;color:rgba(255,255,255,.85);line-height:1.6;margin-bottom:14px; }
    .left-switch-btn { display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:99px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:white;font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s; }
    .left-switch-btn:hover { background:rgba(255,255,255,.17);transform:translateY(-1px); }

    /* ══ RIGHT PANEL ══ */
    .right { flex:1;background:#fff;display:flex;flex-direction:column;position:relative;overflow:hidden; }

    .right-topbar { display:flex;align-items:center;justify-content:space-between;padding:18px 28px 0; }
    .tab-pills { display:flex;background:#f1f5fb;border-radius:11px;padding:3px; }
    .tab-pill { padding:8px 20px;border-radius:9px;border:none;background:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:12.5px;font-weight:600;cursor:pointer;color:#64748b;transition:all .2s; }
    .tp-on { background:#fff;color:var(--P);box-shadow:0 1px 6px rgba(29,95,224,.14); }
    .back-home { display:flex;align-items:center;gap:5px;font-size:11.5px;color:#94a3b8;text-decoration:none;font-weight:500;transition:color .15s; }
    .back-home:hover { color:var(--P); }

    /* Form panels */
    .form-panel { padding:22px 32px 28px;overflow-y:auto;flex:1;transition:opacity .3s,transform .3s; }
    .fp-hidden { opacity:0;transform:translateX(14px);pointer-events:none;position:absolute;width:100%; }

    /* Form head */
    .form-head { margin-bottom:18px; }
    .form-eyebrow { display:flex;align-items:center;gap:7px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--P);margin-bottom:7px; }
    .eyebrow-dot { width:7px;height:7px;border-radius:50%;background:var(--P);animation:edot 2.5s ease-in-out infinite; }
    @keyframes edot { 0%,100%{box-shadow:0 0 0 0 rgba(29,95,224,.5)} 50%{box-shadow:0 0 0 5px rgba(29,95,224,0)} }
    .form-h1 { font-size:26px;font-weight:900;color:var(--txt);letter-spacing:-1px;margin-bottom:5px; }
    .form-p  { font-size:12.5px;color:var(--txt4);line-height:1.6; }

    /* Demo chips */
    .demos { display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:14px; }
    .demos-label { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--txt4);white-space:nowrap; }
    .demo-chip { display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:11px;border:1.5px solid #e8edf5;background:#f8fafd;cursor:pointer;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif; }
    .demo-chip:hover,.dc-on { border-color:var(--P);background:var(--Pl); }
    .dc-av { width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:800;color:white;flex-shrink:0; }
    .dc-name { font-size:11.5px;font-weight:700;color:var(--txt);line-height:1; }
    .dc-role { font-size:9.5px;color:var(--txt4);margin-top:2px; }

    /* Or sep */
    .or-sep { display:flex;align-items:center;gap:10px;font-size:11px;color:#c8d5e8;margin:0 0 14px; }
    .or-sep::before,.or-sep::after { content:'';flex:1;height:1px;background:#edf2f9; }
    .or-sep span { white-space:nowrap;color:#94a3b8;font-weight:500; }

    /* Form group */
    .fg { display:flex;flex-direction:column;gap:5px;margin-bottom:12px; }
    .fg-top { display:flex;align-items:center;justify-content:space-between; }
    .fl { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--txt3); }
    .fl-note { text-transform:none;letter-spacing:0;font-weight:500;color:var(--txt4); }
    .forgot-link { background:none;border:none;font-size:11px;color:var(--P);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;padding:0; }
    .two-col { display:grid;grid-template-columns:1fr 1fr;gap:10px; }

    /* Input wrap */
    .iw { display:flex;align-items:center;gap:9px;background:#f7f9fd;border:1.5px solid #e4eaf5;border-radius:12px;padding:10px 13px;transition:all .22s;color:#b0bec5; }
    .iw:focus-within { border-color:var(--P);background:#fff;box-shadow:0 0 0 4px rgba(29,95,224,.08); }
    .iw.iw-err { border-color:var(--rose);background:#fff9fb; }
    .iw.iw-ok { border-color:var(--em); }
    .iw input { flex:1;border:none;background:none;outline:none;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:var(--txt); }
    .iw input::placeholder { color:#c4cdd6; }
    .eye-btn { background:none;border:none;cursor:pointer;color:#94a3b8;display:flex;align-items:center;justify-content:center;transition:color .15s; }
    .eye-btn:hover { color:var(--P); }

    /* ══ PHONE INPUT ══ */
    .phone-wrap { display:flex;align-items:center;background:#f7f9fd;border:1.5px solid #e4eaf5;border-radius:12px;overflow:hidden;transition:all .22s; }
    .phone-wrap:focus-within { border-color:var(--P);background:#fff;box-shadow:0 0 0 4px rgba(29,95,224,.08); }
    .phone-wrap.iw-err { border-color:var(--rose);background:#fff9fb; }
    .phone-prefix { display:flex;align-items:center;gap:7px;padding:10px 12px;background:rgba(29,95,224,.05);border-right:1.5px solid #e4eaf5;white-space:nowrap;flex-shrink:0; }
    .flag { font-size:16px;line-height:1; }
    .phone-prefix span { font-size:13px;font-weight:700;color:var(--P); }
    .phone-inp { flex:1;border:none;background:none;outline:none;font-size:14px;font-weight:600;color:var(--txt);font-family:'Plus Jakarta Sans',sans-serif;padding:10px 12px;letter-spacing:.05em; }
    .phone-inp::placeholder { color:#c4cdd6;font-weight:400;letter-spacing:0; }
    .phone-verify-icon { padding:0 12px;display:flex;align-items:center; }
    .phone-hint { display:flex;align-items:center;gap:6px;font-size:11px;color:var(--txt4);margin-top:4px; }

    /* Password strength */
    .pw-meter { display:flex;align-items:center;gap:4px;margin-top:6px; }
    .pw-seg { flex:1;height:3px;border-radius:99px;background:#e8edf5;transition:background .3s; }
    .pw-lbl { font-size:10.5px;font-weight:700;margin-left:6px;white-space:nowrap; }

    /* Remember */
    .remember-row { display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12.5px;color:var(--txt3);margin-bottom:14px;user-select:none; }
    .remember-row input { display:none; }
    .chk-box { width:16px;height:16px;border-radius:5px;border:1.5px solid #d0dbed;background:#f7f9fd;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .18s; }
    .remember-row:has(input:checked) .chk-box { background:var(--P);border-color:var(--P); }

    /* Alerts */
    .alert-err { display:flex;align-items:center;gap:8px;background:#fff1f4;border:1px solid #fecdd3;color:#e11d48;border-radius:10px;padding:10px 13px;font-size:12px;font-weight:600;margin-bottom:12px; }

    /* Submit button */
    .btn-submit {
      position:relative; overflow:hidden;
      width:100%; padding:13px; border:none; border-radius:13px;
      background:linear-gradient(135deg,var(--P),var(--P2));
      color:white; font-family:'Plus Jakarta Sans',sans-serif;
      font-size:14px; font-weight:700; cursor:pointer; letter-spacing:.1px;
      box-shadow:0 8px 24px rgba(29,95,224,.35);
      transition:all .25s cubic-bezier(.34,1.56,.64,1);
      display:flex; align-items:center; justify-content:center; gap:9px;
    }
    .btn-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);transform:translateX(-100%);transition:transform .55s; }
    .btn-submit:hover::before { transform:translateX(100%); }
    .btn-submit:hover { transform:translateY(-2px);box-shadow:0 12px 32px rgba(29,95,224,.45); }
    .btn-submit:disabled { opacity:.55;cursor:not-allowed;transform:none; }
    .btn-violet { background:linear-gradient(135deg,var(--violet),var(--P));box-shadow:0 8px 24px rgba(124,58,237,.35); }
    .btn-violet:hover { box-shadow:0 12px 32px rgba(124,58,237,.45); }
    .btn-loading { opacity:.75;pointer-events:none; }

    .loader-ring { width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .6s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }

    .terms-txt { font-size:11px;color:var(--txt4);text-align:center;margin-top:12px;line-height:1.75; }
    .terms-txt a { color:var(--P);text-decoration:none;font-weight:600; }

    .mobile-switch { display:none;text-align:center;margin-top:14px;font-size:13px;color:var(--txt4); }
    .mobile-switch button { background:none;border:none;color:var(--P);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer; }

    /* ══ OTP PANEL ══ */
    .otp-panel { display:flex;flex-direction:column; }
    .otp-back-btn-wrap { padding-bottom:12px; }
    .otp-back { display:inline-flex;align-items:center;gap:6px;background:none;border:1.5px solid #e4eaf5;border-radius:9px;padding:7px 13px;font-size:12px;font-weight:600;color:var(--txt3);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s; }
    .otp-back:hover { border-color:var(--P);color:var(--P); }
    .otp-header { text-align:center;margin-bottom:24px; }
    .otp-phone-ico { position:relative;width:70px;height:70px;border-radius:20px;background:linear-gradient(135deg,var(--Pl2),var(--Pl));color:var(--P);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:1.5px solid rgba(29,95,224,.18); }
    .otp-ico-ring { position:absolute;inset:-5px;border-radius:24px;border:1.5px solid rgba(29,95,224,.2);animation:icoRing 2.5s ease-in-out infinite; }
    @keyframes icoRing { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:0;transform:scale(1.12)} }
    .otp-title { font-size:22px;font-weight:900;color:var(--txt);letter-spacing:-.6px;margin-bottom:8px; }
    .otp-desc { font-size:13px;color:var(--txt4);line-height:1.7; }
    .otp-phone-num { display:inline-block;margin-top:4px;font-size:15px;font-weight:800;color:var(--P); }
    .otp-demo-hint { display:inline-flex;align-items:center;gap:7px;margin-top:14px;padding:9px 16px;border-radius:99px;background:rgba(16,185,129,.09);border:1px solid rgba(16,185,129,.22);font-size:12px;color:#059669; }

    /* OTP Boxes */
    .otp-boxes-wrap { display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:20px; }
    .otp-boxes { display:flex;gap:10px;justify-content:center; }
    .otp-box {
      width:52px; height:62px;
      border:2px solid #e4eaf5; border-radius:14px;
      background:#f7f9fd; text-align:center;
      font-size:24px; font-weight:900; color:var(--txt);
      font-family:'Plus Jakarta Sans',sans-serif;
      outline:none; transition:all .2s; caret-color:transparent;
    }
    .otp-box:focus { border-color:var(--P);background:#fff;box-shadow:0 0 0 4px rgba(29,95,224,.1);transform:scale(1.05); }
    .otp-box-filled { border-color:var(--P);background:var(--Pl);color:var(--P); }
    .otp-box-err { border-color:var(--rose)!important;background:#fff5f7!important;animation:shake .4s ease; }
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
    .otp-err-msg { display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:var(--rose); }

    /* Timer */
    .otp-timer-row { display:flex;justify-content:center;align-items:center;gap:10px;margin-bottom:20px;font-size:12.5px;color:var(--txt4);font-weight:600; }
    .otp-countdown { display:flex;align-items:center;gap:10px; }
    .otp-progress { width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0;transition:background .1s; }
    .otp-progress-inner { width:28px;height:28px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:var(--P); }
    .otp-resend { display:inline-flex;align-items:center;gap:7px;background:none;border:1.5px solid rgba(124,58,237,.2);border-radius:10px;padding:9px 18px;color:var(--violet);font-size:12.5px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s; }
    .otp-resend:hover { background:rgba(124,58,237,.07);transform:translateY(-1px); }

    /* Done */
    .done-panel { display:flex;align-items:center;justify-content:center; }
    .done-wrap { text-align:center;padding:30px 20px; }
    .done-ico { position:relative;width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--em),#0d9a76);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 12px 40px rgba(16,185,129,.45); }
    .done-ico-ring { position:absolute;inset:0;border-radius:50%;animation:doneRing 1.2s cubic-bezier(0,0,.2,1) both; }
    .done-ring1 { border:3px solid rgba(16,185,129,.3);animation-delay:.1s; }
    .done-ring2 { border:3px solid rgba(16,185,129,.15);animation-delay:.25s; }
    @keyframes doneRing { from{transform:scale(.6);opacity:0} to{transform:scale(1.6);opacity:0} }
    .done-title { font-size:26px;font-weight:900;color:var(--txt);letter-spacing:-.8px;margin-bottom:12px; }
    .done-desc { font-size:13.5px;color:var(--txt4);line-height:1.9;margin-bottom:24px; }
    .done-progress { height:4px;background:#e8edf5;border-radius:99px;overflow:hidden;margin-bottom:12px; }
    .done-bar { height:100%;background:linear-gradient(90deg,var(--em),var(--P));border-radius:99px;animation:doneBar linear forwards; }
    @keyframes doneBar { from{width:0} to{width:100%} }
    .done-redirect { font-size:11.5px;color:var(--txt4); }

    /* ══ RESPONSIVE ══ */
    @media (max-width:800px) {
      .card { flex-direction:column; width:100%; min-height:100svh; border-radius:0; }
      .left { width:100%; min-height:220px; padding:28px 24px; }
      .orbit-scene { display:none; }
      .feat-list { flex-direction:row; flex-wrap:wrap; }
      .feat-item { flex:1; min-width:140px; }
      .left-switch-btn { display:none; }
      .right { flex:1; }
      .form-panel { padding:18px 20px 24px; }
      .two-col { grid-template-columns:1fr; }
      .demos { flex-wrap:wrap; }
      .mobile-switch { display:block; }
      .otp-box { width:44px; height:54px; font-size:20px; }
    }
  `]
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private fb     = inject(FormBuilder);

  readonly Math = Math;

  tab            = signal<Tab>('login');
  loading        = signal(false);
  loginError     = signal('');
  signupError    = signal('');
  signupStage    = signal<Stage>('form');
  selectedDemo   = signal('');
  showPass       = false;

  // OTP state
  otpDigits      = signal<string[]>(['','','','','','']);
  otpError       = signal(false);
  otpAttempts    = signal(3);
  otpCountdown   = signal(0);
  generatedOtp   = signal('');
  private _countdownTimer: any;
  private _doneTimer: any;

  // Password strength
  pwStr_  = signal(0);

  loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    phone:     ['', [Validators.required, Validators.pattern(/^[0-9]{8,9}$/)]],
    password:  ['', [Validators.required, Validators.minLength(8)]],
    confirm:   ['', Validators.required],
  });

  readonly demos = [
    { short:'Dr. Khaddar', role:'Médecin',  email:'doctor@gmail.tn', password:'123456', av:'ZK', grad:'linear-gradient(135deg,#1d5fe0,#0d2a6e)' },
    { short:'Karim A.',    role:'Patient',  email:'karim@gmail.com', password:'123456', av:'KA', grad:'linear-gradient(135deg,#0891b2,#0e7490)' },
    { short:'Sana B.',     role:'Patiente', email:'sana@gmail.com',  password:'123456', av:'SB', grad:'linear-gradient(135deg,#7c3aed,#4f46e5)' },
  ];

  readonly features = [
    { text:'Gestion des rendez-vous', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`, bg:'rgba(96,165,250,.18)', color:'#93c5fd' },
    { text:'Ordonnances digitales',   icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>`,   bg:'rgba(52,211,153,.18)', color:'#6ee7b7' },
    { text:'Dossiers patients sécurisés', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, bg:'rgba(244,114,182,.18)', color:'#f9a8d4' },
  ];

  ngAfterViewInit() {}

  ngOnDestroy() {
    clearInterval(this._countdownTimer);
    clearTimeout(this._doneTimer);
  }

  setTab(t: Tab) {
    this.tab.set(t);
    this.loginError.set('');
    this.signupError.set('');
    this.signupStage.set('form');
    this.selectedDemo.set('');
  }
  toggleTab() { this.setTab(this.tab() === 'login' ? 'signup' : 'login'); }

  fillDemo(d: typeof this.demos[0]) {
    this.loginForm.patchValue({ email: d.email, password: d.password });
    this.loginError.set('');
    this.selectedDemo.set(d.email);
  }

  // ── Password strength ────────────────────────────────────────────────────
  updateStrength() {
    const pw = this.signupForm.get('password')?.value ?? '';
    let s = 0;
    if (pw.length >= 8)            s++;
    if (/[A-Z]/.test(pw))         s++;
    if (/[0-9]/.test(pw))         s++;
    if (/[^A-Za-z0-9]/.test(pw))  s++;
    this.pwStr_.set(s);
  }
  pwStr()  { return this.pwStr_(); }
  pwLabel(){ return ['','Faible','Moyen','Fort','Excellent'][this.pwStr_()]; }
  pwColor(i: number): string {
    if (this.pwStr_() < i) return '#e8edf5';
    return ['','#f0426a','#f0a020','#1d5fe0','#10b981'][this.pwStr_()];
  }

  // ── Login ────────────────────────────────────────────────────────────────
  submitLogin() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.loginError.set('');
    const { email, password } = this.loginForm.value;
    setTimeout(() => {
      const ok = this.auth.login(email!, password!);
      if (ok) {
        this.router.navigate([this.auth.getDashboardRoute()]);
      } else {
        this.loginError.set('Email ou mot de passe incorrect.');
        this.loading.set(false);
      }
    }, 800);
  }

  // ── Signup Step 1 (send OTP) ─────────────────────────────────────────────
  submitSignupStep1() {
    if (this.signupForm.invalid) { this.signupForm.markAllAsTouched(); return; }
    const v = this.signupForm.value;
    if (v.password !== v.confirm) { this.signupError.set('Les mots de passe ne correspondent pas.'); return; }
    if ((v.phone?.length ?? 0) < 8) { this.signupError.set('Numéro de téléphone invalide (8 chiffres minimum).'); return; }

    this.loading.set(true);
    this.signupError.set('');

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    this.generatedOtp.set(otp);

    setTimeout(() => {
      this.loading.set(false);
      this.signupStage.set('otp');
      this.otpDigits.set(['','','','','','']);
      this.otpError.set(false);
      this.otpAttempts.set(3);
      this.startCountdown();
      // Focus first box
      setTimeout(() => document.getElementById('otp-0')?.focus(), 100);
    }, 1200);
  }

  backToForm() {
    this.signupStage.set('form');
    clearInterval(this._countdownTimer);
  }

  // ── OTP Countdown ─────────────────────────────────────────────────────────
  startCountdown() {
    clearInterval(this._countdownTimer);
    this.otpCountdown.set(120);
    this._countdownTimer = setInterval(() => {
      const n = this.otpCountdown() - 1;
      this.otpCountdown.set(n);
      if (n <= 0) clearInterval(this._countdownTimer);
    }, 1000);
  }

  resendOtp() {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    this.generatedOtp.set(otp);
    this.otpDigits.set(['','','','','','']);
    this.otpError.set(false);
    this.otpAttempts.set(3);
    this.startCountdown();
    setTimeout(() => document.getElementById('otp-0')?.focus(), 50);
  }

  // ── OTP Input handling ─────────────────────────────────────────────────
  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val   = input.value.replace(/\D/g, '').slice(-1);
    const digits = [...this.otpDigits()];
    digits[index] = val;
    this.otpDigits.set(digits);
    this.otpError.set(false);
    if (val && index < 5) setTimeout(() => document.getElementById(`otp-${index + 1}`)?.focus(), 0);
    if (digits.join('').length === 6) setTimeout(() => this.verifyOtp(), 200);
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const digits = [...this.otpDigits()];
      if (!digits[index] && index > 0) {
        digits[index - 1] = '';
        this.otpDigits.set(digits);
        setTimeout(() => document.getElementById(`otp-${index - 1}`)?.focus(), 0);
      } else {
        digits[index] = '';
        this.otpDigits.set(digits);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = (event.clipboardData?.getData('text') ?? '').replace(/\D/g,'').slice(0,6);
    const digits = ['','','','','',''];
    text.split('').forEach((c, i) => { digits[i] = c; });
    this.otpDigits.set(digits);
    const nextEmpty = digits.findIndex(d => !d);
    const focusIdx  = nextEmpty === -1 ? 5 : nextEmpty;
    setTimeout(() => document.getElementById(`otp-${focusIdx}`)?.focus(), 0);
    if (text.length === 6) setTimeout(() => this.verifyOtp(), 300);
  }

  // ── Verify OTP ─────────────────────────────────────────────────────────
  verifyOtp() {
    const entered = this.otpDigits().join('');
    if (entered.length < 6) return;

    this.loading.set(true);
    setTimeout(() => {
      if (entered === this.generatedOtp()) {
        // ✅ Code correct → create account
        clearInterval(this._countdownTimer);
        this.loading.set(false);
        this.signupStage.set('done');
        this._doneTimer = setTimeout(() => {
          this.setTab('login');
          const v = this.signupForm.value;
          this.loginForm.patchValue({ email: v.email!, password: v.password! });
          this.signupForm.reset();
        }, 3000);
      } else {
        // ❌ Wrong code
        this.loading.set(false);
        this.otpError.set(true);
        this.otpAttempts.update(n => n - 1);
        this.otpDigits.set(['','','','','','']);
        if (this.otpAttempts() <= 0) {
          // Too many attempts → back to form
          setTimeout(() => { this.signupStage.set('form'); this.signupError.set('Trop de tentatives. Veuillez recommencer.'); }, 1200);
        } else {
          setTimeout(() => document.getElementById('otp-0')?.focus(), 100);
        }
      }
    }, 900);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  formatPhone(phone: string | null | undefined): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  linv(c: string) { const ctrl = this.loginForm.get(c);  return ctrl?.invalid && ctrl?.touched; }
  sinv(c: string) { const ctrl = this.signupForm.get(c); return ctrl?.invalid && ctrl?.touched; }
}