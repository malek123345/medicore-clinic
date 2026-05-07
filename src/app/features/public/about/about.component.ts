import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="ab-page">

  <!-- HERO -->
  <section class="ab-hero">
    <div class="ab-hero-bg">
      <div class="hero-orb ab-orb1"></div>
      <div class="hero-orb ab-orb2"></div>
      <div class="hero-grid-pat"></div>
      <div class="ecg-container">
        <svg class="ab-ecg" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <polyline class="ab-ecg-line" points="0,30 80,30 100,30 112,5 125,55 137,30 160,30 240,30 260,30 272,5 285,55 297,30 320,30 400,30 420,30 432,5 445,55 457,30 480,30 560,30 580,30 592,5 605,55 617,30 640,30 720,30 740,30 752,5 765,55 777,30 800,30 880,30 900,30 912,5 925,55 937,30 960,30 1040,30 1060,30 1072,5 1085,55 1097,30 1120,30 1200,30"/>
        </svg>
      </div>
    </div>
    <div class="ab-hero-inner">
      <div class="ab-eyebrow">
        <span class="eyebrow-dot"></span>
        Chirurgien Dentiste Spécialiste
      </div>
      <h1 class="ab-title">Dr. Zied <em>Khaddar</em></h1>
      <p class="ab-sub">Parodontologie &amp; Implantologie Orale · Tunis Belvédère</p>
      <div class="ab-hero-pills">
        @for (p of pills; track p) {
          <span class="ab-pill">{{ p }}</span>
        }
      </div>
    </div>
  </section>

  <!-- MAIN -->
  <section class="ab-main">
    <div class="ab-inner">
      <div class="ab-grid">

        <!-- LEFT COLUMN -->
        <div class="ab-left">
          <div class="ab-photo-wrap">
            <div class="ab-photo-frame">
              <img src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=800:*"
                alt="Dr. Zied Khaddar">
              <div class="ab-photo-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Certifié
              </div>
            </div>
          </div>

          <div class="ab-stats-grid">
            @for (s of stats; track s.val) {
              <div class="ab-stat">
                <span class="ab-stat-num">{{ s.val }}</span>
                <span class="ab-stat-lbl">{{ s.lbl }}</span>
              </div>
            }
          </div>

          <div class="ab-diplomes">
            <div class="ab-dip-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Diplômes &amp; Formation
            </div>
            @for (dip of diplomes; track dip) {
              <div class="ab-dip-item">
                <div class="ab-dip-dot"></div>
                <span>{{ dip }}</span>
              </div>
            }
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="ab-right">
          <div class="ab-quote-block">
            <div class="ab-quote-mark">"</div>
            <p>Je vous souhaite la bienvenue sur le site web de mon cabinet situé à Tunis Belvédère. Les progrès importants que réalise notre profession me permettent de vous proposer des soins performants, suivant les données acquises de la science, en implantologie et en parodontologie, disciplines dans lesquelles je suis spécialisé.</p>
            <div class="ab-quote-author">
              <div class="ab-author-av">ZK</div>
              <div>
                <div class="ab-author-name">Dr. Zied Khaddar</div>
                <div class="ab-author-title">Chirurgien Dentiste Spécialiste</div>
              </div>
            </div>
          </div>

          <p class="ab-p">Pour assurer la pérennité des dents en bouche, il ne suffit pas de les préserver des caries, il faut également entretenir leur ancrage. C'est en cela que les soins de parodontie se révèlent indispensables.</p>

          <div class="ab-highlight">
            <div class="ab-highlight-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <strong>Une gencive qui saigne est une gencive malade.</strong>
              <p>Le plus souvent, il s'agit d'une gingivite. Cette inflammation est réversible grâce à un bon brossage et, éventuellement, une séance d'assainissement professionnel.</p>
            </div>
          </div>

          <p class="ab-p">Parfois, la gingivite évolue vers la parodontite. L'ancrage de la dent (le parodonte) est alors affecté. La parodontite se caractérise, avec le temps, par un déchaussement des dents, l'apparition de trous noirs entre les dents, des mobilités dentaires, des déplacements des dents, une mauvaise haleine.</p>

          <div class="ab-warning">
            <div class="ab-warning-ico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p><strong>Attention !</strong> Chez le fumeur, les saignements gingivaux sont masqués. Gingivite et parodontites sont, dès lors, plus difficiles à détecter.</p>
          </div>

          <p class="ab-p-end"><em>Je vous souhaite une excellente visite.</em></p>

          <div class="ab-cta-row">
            <a routerLink="/contact" class="ab-btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Nous contacter
            </a>
            <a routerLink="/login" class="ab-btn-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Prendre RDV
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SPECIALITES -->
  <section class="ab-specs">
    <div class="ab-inner">
      <div class="ab-specs-hd">
        <span class="ab-specs-label">Expertise médicale</span>
        <h2 class="ab-specs-title">Mes Spécialités</h2>
        <p class="ab-specs-sub">Des soins de pointe adaptés à chaque patient</p>
      </div>
      <div class="ab-specs-grid">
        @for (spec of specialites; track spec.title; let i = $index) {
          <div class="ab-spec-card" [style.animation-delay]="(i*0.12)+'s'">
            <div class="ab-spec-ico-wrap">
              <div class="ab-spec-ico" [innerHTML]="spec.svgIcon"></div>
            </div>
            <h3 class="ab-spec-title">{{ spec.title }}</h3>
            <p class="ab-spec-desc">{{ spec.desc }}</p>
            <div class="ab-spec-tags">
              @for (tag of spec.tags; track tag) {
                <span class="ab-spec-tag">{{ tag }}</span>
              }
            </div>
          </div>
        }
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
    .ab-page { font-family: 'Inter', sans-serif; background: var(--bg); min-height: 100vh; }

    /* ── HERO ── */
    .ab-hero {
      position: relative;
      background: linear-gradient(135deg, var(--PD) 0%, var(--P) 60%, #2a9fd6 100%);
      padding: 80px 24px 70px;
      text-align: center;
      overflow: hidden;
    }
    .ab-hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .hero-orb { position: absolute; border-radius: 50%; filter: blur(60px); }
    .ab-orb1 { width: 500px; height: 500px; top: -150px; right: -80px; background: rgba(255,255,255,0.07); animation: orbF 20s ease-in-out infinite; }
    .ab-orb2 { width: 300px; height: 300px; bottom: -80px; left: -40px; background: rgba(42,159,214,0.15); animation: orbF 26s ease-in-out infinite reverse; }
    @keyframes orbF { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
    .hero-grid-pat { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 48px 48px; }
    .ecg-container { position: absolute; bottom: 0; left: 0; width: 100%; overflow: hidden; height: 60px; }
    .ab-ecg { width: 100%; height: 60px; opacity: .1; }
    .ab-ecg-line { fill: none; stroke: white; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: ecgA 6s ease-in-out infinite; }
    @keyframes ecgA { 0%{stroke-dashoffset:3000;opacity:0} 10%{opacity:1} 80%{stroke-dashoffset:0;opacity:.8} 100%{stroke-dashoffset:0;opacity:0} }

    .ab-hero-inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
    .ab-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 18px; background: rgba(255,255,255,0.12); padding: 6px 16px; border-radius: 99px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); }
    .eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #7ee8a2; animation: pdot 2s ease-in-out infinite; }
    @keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(126,232,162,.4)} 50%{box-shadow:0 0 0 6px rgba(126,232,162,0)} }
    .ab-title { font-family: 'Sora', sans-serif; font-size: 52px; font-weight: 800; color: white; margin-bottom: 12px; line-height: 1.1; letter-spacing: -1.5px; }
    .ab-title em { font-style: normal; color: rgba(255,255,255,0.7); }
    .ab-sub { font-size: 16px; color: rgba(255,255,255,0.72); margin-bottom: 28px; }
    .ab-hero-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
    .ab-pill { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); padding: 5px 14px; border-radius: 99px; backdrop-filter: blur(8px); }

    /* ── MAIN ── */
    .ab-main { padding: 60px 0 20px; }
    .ab-inner { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
    .ab-grid { display: grid; grid-template-columns: 340px 1fr; gap: 48px; align-items: start; }

    /* ── LEFT ── */
    .ab-photo-wrap { margin-bottom: 24px; }
    .ab-photo-frame {
      position: relative; border-radius: 20px; overflow: hidden;
      height: 300px;
      box-shadow: 0 16px 48px rgba(26,111,186,0.2);
      border: 3px solid white;
    }
    .ab-photo-frame img { width: 100%; height: 100%; object-fit: cover; }
    .ab-photo-badge {
      position: absolute; bottom: 14px; left: 14px;
      display: flex; align-items: center; gap: 7px;
      background: rgba(14,184,138,0.92); color: white;
      font-size: 12px; font-weight: 700;
      padding: 7px 14px; border-radius: 99px;
      backdrop-filter: blur(8px);
    }

    .ab-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .ab-stat {
      background: white; border-radius: 14px;
      padding: 16px; text-align: center;
      border: 1px solid var(--border);
      box-shadow: 0 2px 12px rgba(26,111,186,0.06);
      transition: all .25s;
    }
    .ab-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,111,186,0.12); }
    .ab-stat-num { display: block; font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: var(--P); letter-spacing: -1px; }
    .ab-stat-lbl { font-size: 11px; color: var(--tl); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .ab-diplomes { background: var(--dark); border-radius: 16px; padding: 20px 22px; }
    .ab-dip-header { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
    .ab-dip-header svg { stroke: rgba(255,255,255,0.4); }
    .ab-dip-item { display: flex; align-items: flex-start; gap: 10px; font-size: 12.5px; color: rgba(255,255,255,0.75); margin-bottom: 10px; line-height: 1.5; }
    .ab-dip-item:last-child { margin-bottom: 0; }
    .ab-dip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--P); flex-shrink: 0; margin-top: 5px; }

    /* ── RIGHT ── */
    .ab-quote-block {
      background: white; border-radius: 18px;
      padding: 28px 28px 24px;
      border: 1px solid var(--border);
      border-left: 4px solid var(--P);
      box-shadow: 0 4px 24px rgba(26,111,186,0.08);
      margin-bottom: 22px;
      position: relative;
      animation: fadeUp .6s ease both;
    }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
    .ab-quote-mark {
      font-family: Georgia, serif;
      font-size: 64px; color: var(--P); opacity: .2;
      position: absolute; top: 8px; left: 20px;
      line-height: 1;
    }
    .ab-quote-block p { font-size: 14.5px; color: var(--text); line-height: 1.8; margin: 12px 0 20px; font-style: italic; }
    .ab-quote-author { display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border); }
    .ab-author-av { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, var(--PD), var(--P)); color: white; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
    .ab-author-name { font-size: 14px; font-weight: 700; color: var(--dark); }
    .ab-author-title { font-size: 11.5px; color: var(--tl); margin-top: 1px; }

    .ab-p { font-size: 14px; color: var(--tl); line-height: 1.8; margin-bottom: 18px; }
    .ab-p-end { font-size: 14px; color: var(--text); line-height: 1.8; margin-bottom: 24px; }

    .ab-highlight {
      display: flex; gap: 16px; align-items: flex-start;
      background: var(--PL); border-radius: 14px;
      padding: 18px 20px; margin: 18px 0;
      border: 1px solid rgba(26,111,186,0.15);
    }
    .ab-highlight-ico { width: 40px; height: 40px; border-radius: 11px; background: var(--P); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ab-highlight strong { display: block; font-size: 14px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
    .ab-highlight p { font-size: 13.5px; color: var(--text); line-height: 1.7; margin: 0; }

    .ab-warning {
      display: flex; gap: 14px; align-items: flex-start;
      background: #fff7ed; border-radius: 14px;
      padding: 16px 20px; margin: 18px 0;
      border: 1px solid #fed7aa;
    }
    .ab-warning-ico { width: 36px; height: 36px; border-radius: 10px; background: #f97316; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ab-warning p { font-size: 13.5px; color: #7c2d12; line-height: 1.7; margin: 4px 0 0; }
    .ab-warning strong { color: #9a3412; }

    .ab-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .ab-btn-primary {
      display: inline-flex; align-items: center; gap: 9px;
      background: linear-gradient(135deg, var(--PD), var(--P));
      color: white; text-decoration: none;
      padding: 13px 26px; border-radius: 12px;
      font-size: 14px; font-weight: 700;
      box-shadow: 0 6px 24px rgba(26,111,186,0.35);
      transition: all .25s; font-family: 'Sora', sans-serif;
    }
    .ab-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(26,111,186,0.45); }
    .ab-btn-secondary {
      display: inline-flex; align-items: center; gap: 9px;
      background: white; color: var(--P);
      text-decoration: none; padding: 13px 26px;
      border-radius: 12px; font-size: 14px; font-weight: 700;
      border: 2px solid var(--border);
      transition: all .25s; font-family: 'Sora', sans-serif;
    }
    .ab-btn-secondary:hover { border-color: var(--P); background: var(--PL); transform: translateY(-2px); }

    /* ── SPECIALITES ── */
    .ab-specs { padding: 60px 0 80px; }
    .ab-specs-hd { text-align: center; margin-bottom: 40px; }
    .ab-specs-label { font-size: 11px; font-weight: 700; color: var(--P); text-transform: uppercase; letter-spacing: 2px; }
    .ab-specs-title { font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800; color: var(--dark); margin: 8px 0 10px; letter-spacing: -0.5px; }
    .ab-specs-sub { font-size: 15px; color: var(--tl); }
    .ab-specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

    .ab-spec-card {
      background: white; border-radius: 18px;
      padding: 28px 24px; text-align: center;
      border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(26,111,186,0.07);
      transition: all .3s cubic-bezier(.22,1,.36,1);
      animation: cardUp .6s ease both;
    }
    @keyframes cardUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
    .ab-spec-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 60px rgba(26,111,186,0.15);
      border-color: rgba(26,111,186,0.2);
    }
    .ab-spec-ico-wrap { display: flex; justify-content: center; margin-bottom: 18px; }
    .ab-spec-ico {
      width: 64px; height: 64px; border-radius: 18px;
      background: linear-gradient(135deg, var(--PD), var(--P));
      color: white;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(26,111,186,0.3);
    }
    .ab-spec-ico ::ng-deep svg { width: 28px; height: 28px; stroke: white; }
    .ab-spec-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 800; color: var(--dark); margin-bottom: 10px; }
    .ab-spec-desc { font-size: 13.5px; color: var(--tl); line-height: 1.7; margin-bottom: 16px; }
    .ab-spec-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
    .ab-spec-tag { font-size: 11px; font-weight: 600; color: var(--P); background: var(--PL); padding: 3px 10px; border-radius: 99px; border: 1px solid rgba(26,111,186,0.15); }

    @media (max-width: 900px) {
      .ab-grid { grid-template-columns: 1fr; }
      .ab-specs-grid { grid-template-columns: 1fr 1fr; }
      .ab-title { font-size: 36px; }
    }
    @media (max-width: 560px) {
      .ab-specs-grid { grid-template-columns: 1fr; }
      .ab-cta-row { flex-direction: column; }
      .ab-title { font-size: 28px; }
    }
  `]
})
export class AboutComponent {
  sanitizer = inject(DomSanitizer);
  readonly pills = ['Parodontologie', 'Implantologie', 'Chirurgie Orale', 'Esthétique Dentaire'];

  readonly stats = [
    { val: '15+', lbl: 'Années d\'expérience' },
    { val: '500+', lbl: 'Patients traités' },
    { val: '98%', lbl: 'Satisfaction' },
    { val: '100%', lbl: 'Dévouement' },
  ];

  readonly diplomes = [
    'Docteur en Chirurgie Dentaire — Faculté de Médecine Dentaire de Monastir',
    'Master en Parodontologie — Université de Tunis',
    'DU Implantologie Orale — Paris VII',
    'Membre de la Société Tunisienne de Parodontologie',
    'Formation continue internationale en implantologie',
  ];

  readonly specialites = [
    {
      title: 'Parodontologie',
      desc: 'Diagnostic et traitement des maladies des gencives et de l\'os de soutien dentaire. Techniques non-chirurgicales et chirurgicales de pointe.',
      svgIcon:this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M12 2C9 2 7 4 7 7c0 2 1 3.5 2 5l-1 3c-.5 1.5 0 3 1.5 4s3 .5 4 0 2.5-2.5 2-4l-1-3c1-1.5 2-3 2-5 0-3-2-5-4.5-5z"/></svg>`),
      tags: ['Gingivite', 'Parodontite', 'Surfaçage', 'Greffe gingivale'],
    },
    {
      title: 'Implantologie',
      desc: 'Pose d\'implants dentaires en titane pour remplacer les dents manquantes de façon permanente. Solutions All-on-4 disponibles.',
      svgIcon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M12 3v6M9 6h6M10 9l-2 8h8l-2-8"/><path d="M8 17c0 2 1.5 4 4 4s4-2 4-4"/></svg>`),
      tags: ['Implants', 'All-on-4', 'Greffe osseuse', 'Couronne'],
    },
    {
      title: 'Chirurgie Orale',
      desc: 'Interventions chirurgicales dans la cavité buccale : extractions, greffes, régénération osseuse guidée, élongation coronaire.',
      svgIcon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M4.5 12.5l3 3 9-9"/><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/></svg>`),
      tags: ['Extraction', 'Régénération', 'Gingivectomie', 'Esthétique'],
    },
  ];
}