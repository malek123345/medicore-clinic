import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="ct-page">

  <!-- HERO -->
  <section class="ct-hero">
    <div class="ct-hero-bg">
      <div class="hero-orb h-orb1"></div>
      <div class="hero-orb h-orb2"></div>
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

      <!-- 3 INFO CARDS -->
      <div class="ct-cards-top">

        <div class="ct-info-card">
          <div class="ct-ic-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="ct-ic-label">Adresse</div>
          <div class="ct-ic-val">Tunis Belvédère<br>Tunisie</div>
          <div class="ct-ic-note">À proximité du centre-ville de Tunis</div>
        </div>

        <div class="ct-info-card">
          <div class="ct-ic-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.3 19.79 19.79 0 0 1 1.61 2.68 2 2 0 0 1 3.58.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.05a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 15.5l.42 1.42z"/>
            </svg>
          </div>
          <div class="ct-ic-label">Téléphone</div>
          <div class="ct-ic-val">
            <a href="tel:+21671846556">+216 71 846 556</a><br>
            <a href="tel:+21620551124">+216 20 551 124</a>
          </div>
          <div class="ct-ic-note">Disponible Lun – Sam · 08h – 16h45</div>
        </div>

        <div class="ct-info-card">
          <div class="ct-ic-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div class="ct-ic-label">Email</div>
          <div class="ct-ic-val">
            <a href="mailto:zied.khaddar&#64;gmail.com">zied.khaddar&#64;gmail.com</a>
          </div>
          <div class="ct-ic-note">Réponse sous 24h ouvrables</div>
        </div>

      </div>

      <!-- GOOGLE MAP -->
      <div class="ct-map-card">
        <iframe
          class="ct-map-frame"
          [src]="mapUrl"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Cabinet Dr. Khaddar — Tunis Belvédère">
        </iframe>
        <div class="ct-map-foot">
          <div>
            <div class="ct-map-foot-txt">Tunis Belvédère, Tunisie</div>
            <div class="ct-map-foot-sub">Cabinet de Parodontologie &amp; Implantologie — Dr. Khaddar</div>
          </div>
          <a href="https://maps.google.com/?q=Tunis+Belvedere,+Tunis,+Tunisie"
             target="_blank"
             class="ct-map-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>

    </div>
  </section>

</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

    :host {
      --P: #1a6fba;
      --PD: #0d2137;
      --PL: #eef4fb;
      --border: rgba(13,33,55,.06);
    }

    * { box-sizing: border-box; }
    .ct-page { font-family: 'DM Sans', sans-serif; background: var(--PL); min-height: 100vh; color: var(--PD); }

    /* ── HERO ── */
    .ct-hero {
      background: linear-gradient(135deg, #0d2137 0%, #1a4a7a 60%, #1a6fba 100%);
      padding: 72px 48px 80px;
      position: relative; overflow: hidden; text-align: center;
    }
    .ct-hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .hero-orb { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,.05); }
    .h-orb1 { width: 420px; height: 420px; top: -140px; right: -100px; }
    .h-orb2 { width: 280px; height: 280px; bottom: -100px; left: -80px; border-color: rgba(26,111,186,.15); }

    .ct-hero-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
    .ct-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
      border-radius: 99px; padding: 6px 18px;
      font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      color: rgba(255,255,255,.7); margin-bottom: 24px;
    }
    .eyebrow-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #7ee8a2;
      animation: pdot 2s ease-in-out infinite;
    }
    @keyframes pdot {
      0%,100% { box-shadow: 0 0 0 0 rgba(126,232,162,.4); }
      50%      { box-shadow: 0 0 0 6px rgba(126,232,162,0); }
    }
    .ct-title {
      font-family: 'Playfair Display', serif;
      font-size: 48px; font-weight: 700; color: #fff;
      line-height: 1.08; letter-spacing: -1.5px; margin-bottom: 16px;
    }
    .ct-title em { font-style: italic; color: rgba(255,255,255,.45); }
    .ct-sub { font-size: 15px; font-weight: 300; color: rgba(255,255,255,.6); line-height: 1.7; }

    /* ── MAIN ── */
    .ct-main { padding: 64px 0 80px; }
    .ct-inner { max-width: 1100px; margin: 0 auto; padding: 0 48px; }

    /* ── 3 CARDS ── */
    .ct-cards-top {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 20px; margin-bottom: 32px;
    }
    .ct-info-card {
      background: white; border-radius: 20px; padding: 32px 28px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 24px rgba(13,33,55,.06);
      transition: all .25s; position: relative; overflow: hidden;
    }
    .ct-info-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #0d2137, #1a6fba);
    }
    .ct-info-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,111,186,.14); }

    .ct-ic-ico {
      width: 48px; height: 48px; border-radius: 14px;
      background: linear-gradient(135deg, #0d2137, #1a6fba);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px; box-shadow: 0 4px 16px rgba(26,111,186,.3);
    }
    .ct-ic-ico svg { width: 20px; height: 20px; }
    .ct-ic-label {
      font-size: 10px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: var(--P); margin-bottom: 8px;
    }
    .ct-ic-val { font-size: 15px; font-weight: 500; color: var(--PD); line-height: 1.7; }
    .ct-ic-val a { color: var(--P); text-decoration: none; transition: color .2s; }
    .ct-ic-val a:hover { color: #0f4f87; text-decoration: underline; }
    .ct-ic-note { font-size: 12px; font-weight: 300; color: #8aaccc; margin-top: 6px; line-height: 1.5; }

    /* ── MAP ── */
    .ct-map-card {
      background: white; border-radius: 20px; overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: 0 4px 24px rgba(13,33,55,.06);
    }
    .ct-map-frame { width: 100%; height: 420px; display: block; border: none; }
    .ct-map-foot {
      padding: 20px 28px; border-top: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
    }
    .ct-map-foot-txt { font-size: 14px; font-weight: 500; color: var(--PD); }
    .ct-map-foot-sub { font-size: 12px; font-weight: 300; color: #8aaccc; margin-top: 3px; }
    .ct-map-btn {
      display: inline-flex; align-items: center; gap: 7px;
      background: var(--P); color: #fff;
      font-size: 12px; font-weight: 500; padding: 10px 20px;
      border-radius: 99px; text-decoration: none;
      transition: all .2s; white-space: nowrap; flex-shrink: 0;
    }
    .ct-map-btn:hover { background: #0f4f87; transform: translateY(-1px); }
    .ct-map-btn svg { width: 13px; height: 13px; }

    @media (max-width: 900px) {
      .ct-cards-top { grid-template-columns: 1fr; }
      .ct-inner { padding: 0 24px; }
      .ct-title { font-size: 34px; }
      .ct-hero { padding: 48px 24px 56px; }
      .ct-map-frame { height: 280px; }
      .ct-map-foot { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class ContactComponent {
  private sanitizer = inject(DomSanitizer);

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.8!2d10.1780094!3d36.818218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd348764e3d7cd%3A0x1a71afc5cc2c8961!2sDr%20Zied%20Khaddar!5e4!3m2!1sfr!2stn!4v1700000000000'
);
}