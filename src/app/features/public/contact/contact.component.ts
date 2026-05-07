import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="ct-page">

  <!-- HERO -->
  <section class="ct-hero">
    <div class="ct-hero-bg">
      <div class="hero-orb h-orb1"></div>
      <div class="hero-orb h-orb2"></div>
      <div class="hero-grid-pat"></div>
      <div class="hero-cross hc1">✚</div>
      <div class="hero-cross hc2">✚</div>
    </div>
    <div class="ct-hero-inner">
      <div class="ct-eyebrow">
        <span class="eyebrow-dot"></span>
        Contactez-nous
      </div>
      <h1 class="ct-title">Nous sommes <em>à votre écoute</em></h1>
      <p class="ct-sub">Notre équipe répond à vos questions du lundi au samedi</p>
    </div>
  </section>

  <!-- MAIN -->
  <section class="ct-main">
    <div class="ct-inner">
      <div class="ct-grid">

        <!-- LEFT: Info -->
        <div class="ct-infos">
          <div class="ct-section-label">Informations du cabinet</div>
          <h2 class="ct-infos-title">Cabinet Dr. Khaddar</h2>
          <p class="ct-infos-sub">Spécialiste en parodontologie et implantologie à Tunis Belvédère</p>

          @for (info of contactInfos; track info.label) {
            <div class="ct-info-card">
              <div class="ct-info-ico" [innerHTML]="info.icon"></div>
              <div class="ct-info-text">
                <div class="ct-info-label">{{ info.label }}</div>
                <div class="ct-info-val" [innerHTML]="info.value"></div>
              </div>
            </div>
          }

          <div class="ct-horaires">
            <div class="ct-h-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Horaires d'ouverture
            </div>
            @for (h of horaires; track h.day) {
              <div class="ct-h-row" [class.ct-h-closed]="h.closed" [class.ct-h-today]="isToday(h.day)">
                <span class="ct-h-day">
                  {{ h.day }}
                  @if (isToday(h.day)) { <span class="today-badge">Aujourd'hui</span> }
                </span>
                <span class="ct-h-hours">{{ h.closed ? 'Fermé' : h.hours }}</span>
              </div>
            }
          </div>

          <!-- Map placeholder -->
          <div class="ct-map">
            <div class="map-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--P)" stroke-width="1.5" opacity=".5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Tunis Belvédère, Tunisie</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: Form -->
        <div class="ct-form-card">
          <div class="ct-form-stripe"></div>
          <div class="ct-form-hd">
            <div class="ct-form-hd-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h2 class="ct-form-title">Envoyer un message</h2>
              <p class="ct-form-sub">Réponse garantie sous 24h</p>
            </div>
          </div>

          <form class="ct-form" (ngSubmit)="submit()">
            <div class="ct-form-row">
              <div class="ct-fg">
                <label class="ct-fl">Prénom <span class="req">*</span></label>
                <div class="ct-fi-wrap" [class.focused]="focus['firstName']">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input class="ct-fi" type="text" [(ngModel)]="form.firstName" name="firstName"
                    placeholder="Votre prénom" required
                    (focus)="focus['firstName']=true" (blur)="focus['firstName']=false">
                </div>
              </div>
              <div class="ct-fg">
                <label class="ct-fl">Nom <span class="req">*</span></label>
                <div class="ct-fi-wrap" [class.focused]="focus['lastName']">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input class="ct-fi" type="text" [(ngModel)]="form.lastName" name="lastName"
                    placeholder="Votre nom" required
                    (focus)="focus['lastName']=true" (blur)="focus['lastName']=false">
                </div>
              </div>
            </div>

            <div class="ct-fg">
              <label class="ct-fl">Email <span class="req">*</span></label>
              <div class="ct-fi-wrap" [class.focused]="focus['email']">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input class="ct-fi" type="email" [(ngModel)]="form.email" name="email"
                  placeholder="votre@email.com" required
                  (focus)="focus['email']=true" (blur)="focus['email']=false">
              </div>
            </div>

            <div class="ct-fg">
              <label class="ct-fl">Téléphone</label>
              <div class="ct-fi-wrap" [class.focused]="focus['phone']">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.3 19.79 19.79 0 0 1 1.61 2.68 2 2 0 0 1 3.58.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.05a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 15.5l.42 1.42z"/></svg>
                <input class="ct-fi" type="tel" [(ngModel)]="form.phone" name="phone"
                  placeholder="+216 XX XXX XXX"
                  (focus)="focus['phone']=true" (blur)="focus['phone']=false">
              </div>
            </div>

            <div class="ct-fg">
              <label class="ct-fl">Sujet</label>
              <div class="ct-fi-wrap" [class.focused]="focus['subject']">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <select class="ct-fi" [(ngModel)]="form.subject" name="subject"
                  (focus)="focus['subject']=true" (blur)="focus['subject']=false">
                  <option value="">-- Choisir un sujet --</option>
                  <option>Demande de rendez-vous</option>
                  <option>Renseignements sur les soins</option>
                  <option>Urgence dentaire</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>

            <div class="ct-fg">
              <label class="ct-fl">Message <span class="req">*</span></label>
              <div class="ct-fi-wrap ct-ta-wrap" [class.focused]="focus['message']">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="align-self:flex-start;margin-top:2px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <textarea class="ct-fi ct-ta" [(ngModel)]="form.message" name="message"
                  rows="5" placeholder="Décrivez votre situation ou posez vos questions…" required
                  (focus)="focus['message']=true" (blur)="focus['message']=false"></textarea>
              </div>
            </div>

            <button class="ct-submit-btn" type="submit" [disabled]="sending()">
              @if (sending()) {
                <span class="ct-spin"></span>
                Envoi en cours…
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Envoyer le message
              }
              <div class="submit-shine"></div>
            </button>

            <p class="ct-privacy">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Vos données sont confidentielles et ne seront jamais partagées.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

    :host {
      --P: #1a6fba;
      --PD: #0f4f87;
      --PL: #e8f3fc;
      --PL2: rgba(26,111,186,0.1);
      --dark: #0d2137;
      --text: #334155;
      --tl: #64748b;
      --border: #dbeafe;
      --bg: #f0f7ff;
    }

    * { box-sizing: border-box; }
    .ct-page { font-family: 'Inter', sans-serif; background: var(--bg); min-height: 100vh; }

    /* ── HERO ── */
    .ct-hero {
      position: relative;
      background: linear-gradient(135deg, var(--PD) 0%, var(--P) 60%, #2a9fd6 100%);
      padding: 80px 24px 60px;
      text-align: center;
      overflow: hidden;
    }
    .ct-hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .hero-orb { position: absolute; border-radius: 50%; filter: blur(60px); }
    .h-orb1 { width: 400px; height: 400px; top: -120px; right: -60px; background: rgba(255,255,255,0.07); animation: orbF 18s ease-in-out infinite; }
    .h-orb2 { width: 280px; height: 280px; bottom: -80px; left: -40px; background: rgba(42,159,214,0.15); animation: orbF 24s ease-in-out infinite reverse; }
    @keyframes orbF { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
    .hero-grid-pat { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 48px 48px; }
    .hero-cross { position: absolute; color: white; opacity: .06; font-size: 24px; animation: crossF 16s ease-in-out infinite; user-select: none; }
    .hc1 { top: 20%; right: 12%; animation-duration: 18s; }
    .hc2 { bottom: 30%; left: 8%; font-size: 16px; animation-duration: 13s; animation-delay: -6s; }
    @keyframes crossF { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-12px) rotate(15deg)} }

    .ct-hero-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
    .ct-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 18px; background: rgba(255,255,255,0.12); padding: 6px 16px; border-radius: 99px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); }
    .eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #7ee8a2; box-shadow: 0 0 0 0 rgba(126,232,162,.4); animation: pdot 2s ease-in-out infinite; }
    @keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(126,232,162,.4)} 50%{box-shadow:0 0 0 6px rgba(126,232,162,0)} }
    .ct-title { font-family: 'Sora', sans-serif; font-size: 44px; font-weight: 800; color: white; margin-bottom: 14px; line-height: 1.1; letter-spacing: -1px; }
    .ct-title em { font-style: normal; color: rgba(255,255,255,0.72); }
    .ct-sub { font-size: 16px; color: rgba(255,255,255,0.72); line-height: 1.7; }

    /* ── MAIN ── */
    .ct-main { padding: 60px 0 80px; }
    .ct-inner { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
    .ct-grid { display: grid; grid-template-columns: 400px 1fr; gap: 40px; align-items: start; }

    /* ── INFO ── */
    .ct-section-label { font-size: 11px; font-weight: 700; color: var(--P); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .ct-infos-title { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 800; color: var(--dark); margin-bottom: 6px; }
    .ct-infos-sub { font-size: 13.5px; color: var(--tl); line-height: 1.6; margin-bottom: 28px; }

    .ct-info-card {
      display: flex; align-items: flex-start; gap: 14px;
      background: white; border-radius: 14px;
      padding: 16px 18px; margin-bottom: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 12px rgba(26,111,186,0.06);
      transition: all .25s ease;
    }
    .ct-info-card:hover { transform: translateX(4px); border-color: rgba(26,111,186,0.25); box-shadow: 0 4px 20px rgba(26,111,186,0.1); }
    .ct-info-ico {
      width: 42px; height: 42px; border-radius: 12px;
      background: linear-gradient(135deg, var(--PD), var(--P));
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(26,111,186,0.25);
    }
    .ct-info-ico ::ng-deep svg { width: 17px; height: 17px; stroke: white; }
    .ct-info-text { flex: 1; }
    .ct-info-label { font-size: 10px; font-weight: 700; color: var(--P); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .ct-info-val { font-size: 14px; color: var(--dark); line-height: 1.6; font-weight: 500; }

    .ct-horaires {
      background: var(--dark); border-radius: 16px;
      padding: 20px 22px; margin-top: 16px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .ct-h-header { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
    .ct-h-header svg { stroke: rgba(255,255,255,0.4); }
    .ct-h-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 13px; transition: all .15s;
    }
    .ct-h-row:last-child { border-bottom: none; padding-bottom: 0; }
    .ct-h-day { color: rgba(255,255,255,0.85); font-weight: 500; display: flex; align-items: center; gap: 8px; }
    .ct-h-hours { color: rgba(255,255,255,0.55); font-size: 12.5px; }
    .ct-h-closed .ct-h-hours { color: #f87171; }
    .ct-h-today { background: rgba(26,111,186,0.15); margin: 0 -22px; padding: 8px 22px !important; }
    .ct-h-today .ct-h-hours { color: #7ee8a2; }
    .today-badge { font-size: 9px; font-weight: 700; background: var(--P); color: white; padding: 2px 7px; border-radius: 99px; }

    .ct-map {
      margin-top: 14px; border-radius: 14px;
      background: var(--PL); border: 1px solid var(--border);
      padding: 20px; text-align: center;
      display: flex; align-items: center; justify-content: center;
    }
    .map-inner { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--tl); }

    /* ── FORM ── */
    .ct-form-card {
      background: white; border-radius: 20px;
      box-shadow: 0 8px 40px rgba(26,111,186,0.12);
      border: 1px solid var(--border);
      overflow: hidden;
    }
    .ct-form-stripe { height: 4px; background: linear-gradient(90deg, var(--PD), var(--P), #2a9fd6); }
    .ct-form-hd {
      display: flex; align-items: center; gap: 14px;
      padding: 24px 28px 20px;
      border-bottom: 1px solid var(--border);
    }
    .ct-form-hd-ico {
      width: 46px; height: 46px; border-radius: 13px;
      background: var(--PL2); color: var(--P);
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(26,111,186,0.15);
      flex-shrink: 0;
    }
    .ct-form-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: var(--dark); margin-bottom: 2px; }
    .ct-form-sub { font-size: 12px; color: var(--tl); }

    .ct-form { display: flex; flex-direction: column; gap: 16px; padding: 24px 28px 28px; }
    .ct-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .ct-fg { display: flex; flex-direction: column; gap: 6px; }
    .ct-fl { font-size: 12px; font-weight: 700; color: var(--dark); letter-spacing: 0.3px; }
    .req { color: #f0426a; }

    .ct-fi-wrap {
      display: flex; align-items: center; gap: 10px;
      padding: 11px 15px;
      border-radius: 12px; background: var(--bg);
      border: 1.5px solid var(--border);
      color: var(--tl); transition: all .2s ease;
    }
    .ct-fi-wrap.focused { border-color: var(--P); background: white; box-shadow: 0 0 0 4px rgba(26,111,186,0.1); color: var(--P); }
    .ct-ta-wrap { align-items: flex-start; }
    .ct-fi {
      border: none; background: transparent; outline: none;
      font-size: 13.5px; color: var(--dark); width: 100%;
      font-family: 'Inter', sans-serif;
    }
    .ct-fi::placeholder { color: #94a3b8; }
    .ct-fi option { background: white; }
    .ct-ta { resize: vertical; min-height: 120px; line-height: 1.6; }

    .ct-submit-btn {
      position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      background: linear-gradient(135deg, var(--PD), var(--P));
      color: white; border: none;
      border-radius: 13px; padding: 15px;
      font-size: 15px; font-weight: 700;
      cursor: pointer; font-family: 'Sora', sans-serif;
      box-shadow: 0 6px 24px rgba(26,111,186,0.35);
      transition: all .25s ease; margin-top: 4px;
    }
    .ct-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(26,111,186,0.45); }
    .ct-submit-btn:disabled { opacity: .55; cursor: not-allowed; }
    .submit-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: left .5s; }
    .ct-submit-btn:hover .submit-shine { left: 100%; }

    .ct-spin { width: 16px; height: 16px; border-radius: 50%; border: 2.5px solid rgba(255,255,255,.3); border-top-color: white; animation: spin .6s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }

    .ct-privacy { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--tl); text-align: center; justify-content: center; }
    .ct-privacy svg { stroke: var(--tl); flex-shrink: 0; }

    @media (max-width: 900px) {
      .ct-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .ct-form-row { grid-template-columns: 1fr; }
      .ct-title { font-size: 30px; }
      .ct-form { padding: 20px; }
    }
  `]
})
export class ContactComponent {
  private sanitizer = inject(DomSanitizer);
  private toast = inject(ToastService);
  sending = signal(false);
  form = { firstName:'', lastName:'', email:'', phone:'', subject:'', message:'' };
  focus: Record<string, boolean> = {};

  readonly contactInfos = [
    {
      label: 'Adresse',
      value: 'Tunis Belvédère, Tunisie',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`)
    },
    {
      label: 'Téléphone',
      value: '+216 71 846 556<br>+216 20 551 124',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.3 19.79 19.79 0 0 1 1.61 2.68 2 2 0 0 1 3.58.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.05a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 15.5l.42 1.42z"/></svg>`)
    },
    {
      label: 'Email',
      value: 'zied.khaddar@gmail.com',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`)
    },
  ];

  readonly horaires = [
    { day:'Lundi',    hours:'09:00 – 19:00', closed:false },
    { day:'Mardi',    hours:'09:00 – 19:00', closed:false },
    { day:'Mercredi', hours:'09:00 – 19:00', closed:false },
    { day:'Jeudi',    hours:'09:00 – 19:00', closed:false },
    { day:'Vendredi', hours:'09:00 – 19:00', closed:false },
    { day:'Samedi',   hours:'08:00 – 14:00', closed:false },
    { day:'Dimanche', hours:'Fermé',         closed:true  },
  ];

  isToday(day: string): boolean {
    const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    return days[new Date().getDay()] === day;
  }

  submit() {
    if (!this.form.firstName || !this.form.email || !this.form.message) {
      this.toast.error('Champs manquants', 'Remplissez les champs obligatoires.');
      return;
    }
    this.sending.set(true);
    setTimeout(() => {
      this.sending.set(false);
      this.toast.success('Message envoyé !', 'Nous vous répondrons bientôt.');
      this.form = { firstName:'', lastName:'', email:'', phone:'', subject:'', message:'' };
    }, 1200);
  }
}