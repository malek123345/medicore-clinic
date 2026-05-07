import { Component, OnInit, OnDestroy, signal,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="home">

  <!-- ══════════════ HERO ══════════════ -->
  <section class="hero">
    <!-- Sliding background images -->
    <div class="hero-slides">
      @for (s of heroSlides; track s.id; let i = $index) {
        <div class="hero-slide" [class.active]="slideIdx() === i" [style.background-image]="'url('+s.img+')'"></div>
      }
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-grid"></div>

    <!-- Floating RDV card (top right like original site) -->
    

    <div class="hero-content">
      
      <h1 class="hero-h1">
  <span class="fade-in delay-1">Cabinet Dentaire</span><br>
  <span class="hero-name fade-in delay-2">Dr. Zied KHADDAR</span>
</h1>

<p class="hero-spec fade-in delay-3">
  Parodontologie • Implantologie • Chirurgie Orale
</p>

<p class="hero-desc fade-in delay-4">
  Votre sourire est notre priorité. Des soins dentaires de qualité dans un environnement moderne et confortable.
</p>
      <div class="hero-btns">
        <a routerLink="/login" class="btn-rdv">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Prendre Rendez-vous
        </a>
        <a routerLink="/contact" class="btn-contact">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Nous Contacter
        </a>
      </div>
      <div class="hero-stats">
        @for (s of heroStats; track s.label) {
          <div class="hero-stat">
            <div class="hs-val">{{ s.val }}</div>
            <div class="hs-lbl">{{ s.label }}</div>
          </div>
        }
      </div>
    </div>

    <!-- Slide dots -->
    <div class="slide-dots">
      @for (s of heroSlides; track s.id; let i = $index) {
        <button class="slide-dot" [class.active]="slideIdx()===i" (click)="slideIdx.set(i)"></button>
      }
    </div>
  </section>

  <!-- ══════════════ SERVICES BAND ══════════════ -->
  <section class="svc-band">
    <div class="svc-grid">
      @for (svc of services; track svc.title; let i = $index) {
        <div class="svc-card" [style.animation-delay]="(i*0.1)+'s'">
          <div class="svc-icon" [innerHTML]="svc.icon"></div>
          <h3 class="svc-title">{{ svc.title }}</h3>
          <p class="svc-desc">{{ svc.desc }}</p>
          <ul class="svc-features">
            @for (f of svc.features; track f) {
              <li>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="#4ade80"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                {{ f }}
              </li>
            }
          </ul>
          <a routerLink="/apropos" class="svc-more">En savoir plus →</a>
        </div>
      }
    </div>
  </section>

  <!-- ══════════════ ABOUT (Dr. Photo + Text like screenshot) ══════════════ -->
  <section class="about-section">
    <div class="about-inner">
      <div class="about-photo-col">
        <div class="about-photo-wrap">
          <img
            src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=800:*"
            alt="Dr. Zied Khaddar"
            class="about-photo"
          />
          <div class="about-exp-badge">
            <div class="aeb-num">15+</div>
            <div class="aeb-lbl">Années d'expérience</div>
          </div>
          <div class="about-pat-badge">
            <div class="apb-num">5000+</div>
            <div class="apb-lbl">Patients satisfaits</div>
          </div>
        </div>
        <div class="about-bottom-bar">
          <em>Docteur Zied KHADDAR</em>
          <svg width="22" height="18" viewBox="0 0 24 20" fill="rgba(255,255,255,.5)"><path d="M0 0L8 0L4 8L8 8L4 16L0 16Z"/><path d="M12 0L20 0L16 8L20 8L16 16L12 16Z"/></svg>
        </div>
      </div>

      <div class="about-text-col">
        <div class="about-eyebrow">À propos</div>
        <h2 class="about-title">Dr. Zied KHADDAR</h2>
        <p class="about-subtitle">Spécialiste en Parodontologie & Implantologie Orale</p>
        <div class="about-divider"></div>

        <div class="about-quote">
          <div class="aq-icon">"</div>
          <p>Je vous souhaite la bienvenue sur le site web de mon cabinet situé à Tunis Belvédère. Les progrès importants que réalise notre profession me permettent de vous proposer des soins performants, suivant les données acquises de la science, en implantologie et en parodontologie, disciplines dans lesquelles je suis spécialisé.</p>
        </div>

        <p class="about-p">Pour assurer la pérennité des dents en bouche, il ne suffit pas de les préserver des caries, il faut également entretenir leur ancrage. C'est en cela que les soins de parodontie se révèlent indispensables.</p>

        <div class="about-highlight">
          <strong>Une gencive qui saigne est une gencive malade.</strong>
          <p>Le plus souvent, il s'agit d'une gingivite. Cette inflammation de la gencive est réversible grâce à un bon brossage et, éventuellement, une séance d'assainissement professionnel.</p>
        </div>

        <div class="about-stats">
          @for (s of aboutStats; track s.label) {
            <div class="as-item">
              <div class="as-val">{{ s.val }}</div>
              <div class="as-lbl">{{ s.label }}</div>
            </div>
          }
        </div>

        <a routerLink="/apropos" class="btn-about">En savoir plus →</a>
      </div>
    </div>
  </section>

  <!-- ══════════════ WHY CHOOSE US ══════════════ -->
  <section class="why-section">
    <div class="why-inner">
      <div class="section-hd">
        <h2 class="section-title">Pourquoi Nous Choisir ?</h2>
      </div>
      <div class="why-grid">
        @for (w of whyItems; track w.title; let i = $index) {
          <div class="why-card" [style.animation-delay]="(i*0.1)+'s'">

            <h3>{{ w.title }}</h3>
            <p>{{ w.desc }}</p>
          </div>
        }
      </div>
    </div>
  </section>



  <!-- ══════════════ RDV CTA ══════════════ -->
  <section class="cta-section">
    <div class="cta-overlay"></div>
    <div class="cta-inner">
      <h2 class="cta-title">Prêt à Retrouver Votre Sourire ?</h2>
      <p class="cta-sub">Prenez rendez-vous dès aujourd'hui et bénéficiez d'un bilan dentaire complet</p>
      <a routerLink="/login" class="cta-btn">
        Réserver un Rendez-vous
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <div class="cta-tel">ou appelez le <strong>+216 71 846 556</strong></div>
    </div>
  </section>
</div>
  `,
  styles: [`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Lato:wght@300;400;700&display=swap');

    :host {
      --P: #1b7fc4; --PD: #155f9a; --PL: #e3f2fd;
      --teal: #17a2b8; --dark: #1e3a5c; --text: #444; --tl: #777;
    }
    * { box-sizing: border-box; }

    /* ═══ HERO ═══ */
    .hero {
      position: relative; min-height: 100vh; display: flex; align-items: center;
      overflow: hidden; background: #0d2744;
    }
    .hero-slides { position: absolute; inset: 0; }
    .hero-slide {
      position: absolute; inset: 0; background-size: cover; background-position: center;
      transition: opacity 1s ease; opacity: 0;
    }
    .hero-slide.active { opacity: 1; }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to right, rgba(0,0,0,.75) 45%, rgba(0,0,0,.25));
    }
    .hero-grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
      background-size: 55px 55px; pointer-events: none;
    }
    .tw-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #fff;
  margin-left: 4px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
}

.tw-char {
  opacity: 0;
  animation: fadeChar 0.2s forwards;
  margin-right: 3px; /* <-- يبعد الحروف شوية */
}

@keyframes fadeChar {
  to { opacity: 1; }
}

    /* Floating RDV card */
    .rdv-float-card {
      position: absolute; top: 50%; right: 7%; transform: translateY(-50%);
      z-index: 10; text-decoration: none;
      background: rgba(43, 84, 112, 0.88); backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,.25); border-radius: 14px;
      padding: 26px 22px; display: flex; flex-direction: column; align-items: center;
      gap: 10px; min-width: 170px; text-align: center;
      animation: floatY 5s ease-in-out infinite;
      box-shadow: 0 12px 40px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.1);
      transition: background .2s;
    }
    .rdv-float-card:hover { background: rgba(163, 172, 179, 0.95); }
    @keyframes floatY { 0%,100%{transform:translateY(-50%) translateY(0)} 50%{transform:translateY(-50%) translateY(-10px)} }
    .rfc-icon { color: rgba(255,255,255,.9); }
    .rfc-top  { font-size: 13px; color: rgba(255,255,255,.8); font-weight: 500; }
    .rfc-main { font-size: 22px; font-weight: 900; color: white; line-height: 1.1; }
    .rfc-arrow { width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,.18); display: flex; align-items: center; justify-content: center; }

    .hero-content {
  position: relative;
  z-index: 2;
  padding: 140px 40px 60px 6%; /* <-- هذا المهم */
  max-width: 680px;
}
      .hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.25);
  color: rgba(255,255,255,.9);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 99px;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
}
      
    .hb-dot { width:7px;height:7px;border-radius:50%;background:#4ade80;animation:pulse 2s infinite;box-shadow:0 0 8px #4ade80; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .hero-h1 {  font-family: 'Cormorant Garamond', serif; margin: 0; letter-spacing: 0.5px; margin-top: 0;   /* <-- هذا المهم */
  margin-bottom: 10px; /* اختياري */  font-size: clamp(42px, 7vw, 78px); /* tkber chwaya - el font hiya sghira */  font-weight: 700;  font-style: italic;  color: white;  line-height: 1.02;  letter-spacing: 0px;  animation: fadeUp .8s ease both;}
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
    .hero-name {  color: #467fc0;  display: block;  font-style: italic;}
    .hero-spec {  font-family: 'Cormorant Garamond', serif;    margin-bottom: 10px;font-size: 22px;letter-spacing: 1px;  font-style: italic;  font-weight: 600;  color: rgba(255,255,255,.85);  letter-spacing: 1px;  animation: fadeUp .8s .1s ease both;}
    .hero-desc {  font-family: 'Nunito Sans', sans-serif;  font-weight: 300;  font-size: 15px;  line-height: 1.8;  color: rgba(255,255,255,.7); margin-bottom: 20px; animation: fadeUp .8s .2s ease both;}
    .hero-btns { display: flex;  margin-top: 10px;gap: 14px; flex-wrap: wrap; margin-bottom: 36px; animation: fadeUp .8s .3s ease both; }
    .btn-rdv {  display: flex; align-items: center; gap: 9px;  background: #676c78; color: #1f2937; text-decoration: none;  padding: 13px 26px; border-radius: 50px; font-size: 15px; font-weight: 800;  box-shadow: 0 6px 24px rgba(230, 231, 247, 0.45); transition: all .22s;  font-style: italic; /* <-- ZIDHA */}
    .btn-rdv:hover { background: rgb(61, 95, 146); transform: translateY(-2px); box-shadow: 0 10px 32px rgba(73, 110, 210, 0.55); }
    .btn-contact {  display: flex; align-items: center; gap: 9px;  border: 2px solid rgba(255,255,255,.55); color: white; text-decoration: none;  padding: 13px 26px; border-radius: 50px; font-size: 15px; font-weight: 600;  backdrop-filter: blur(8px); transition: all .22s;  font-style: italic; /* <-- ZIDHA */}
    .btn-contact:hover { background: rgba(255,255,255,.15); border-color: white; }
    .hero-stats { display: flex; gap: 32px; flex-wrap: wrap; animation: fadeUp .8s .4s ease both; }
    .hero-stat { border-left: 2px solid rgba(27,127,196,.6); padding-left: 14px; }
    .hs-val { font-size: 26px; font-weight: 900; color: white; line-height: 1; }
    .hs-lbl { font-size: 11px; color: rgba(255,255,255,.55); margin-top: 3px; letter-spacing: .6px; text-transform: uppercase; }
    .slide-dots { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; gap: 8px; }
    .slide-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid rgba(255,255,255,.5); background: transparent; cursor: pointer; transition: all .2s; }
    .slide-dot.active { background: white; border-color: white; transform: scale(1.25); }

    /* ═══ SERVICES BAND ═══ */
    .svc-band { background: var(--P); }
    .svc-grid { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); }
    .svc-card {
      padding: 48px 36px; border-right: 1px solid rgba(255,255,255,.15);
      transition: background .22s; cursor: default;
      animation: cardUp .6s ease both;
    }
    @keyframes cardUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
    .svc-card:last-child { border-right: none; }
    .svc-card:hover { background: var(--PD); }
    .svc-icon { margin-bottom: 20px; }
    .svc-icon ::ng-deep svg { width: 72px; height: 72px; color: rgba(255,255,255,.95); }
    .svc-title { font-size: 20px; font-weight: 800; color: white; margin-bottom: 10px; }
    .svc-desc  { font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.7; margin-bottom: 14px; }
    .svc-features { list-style: none; padding: 0; margin-bottom: 18px; }
    .svc-features li { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: rgba(255,255,255,.8); margin-bottom: 7px; }
    .svc-more { font-size: 13.5px; color: rgba(255,255,255,.85); font-weight: 600; text-decoration: none; }
    .svc-more:hover { color: white; text-decoration: underline; }

    /* ═══ ABOUT ═══ */
    .about-section { background: white; padding: 80px 0; }
    .about-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 440px 1fr; gap: 60px; align-items: start; }
    .about-photo-wrap { position: relative; }
    .about-photo { width: 100%; height: 460px; object-fit: cover; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,.15); display: block; }
    .about-exp-badge {
      position: absolute; bottom: 60px; left: -20px;
      background: var(--P); color: white; border-radius: 12px;
      padding: 14px 18px; box-shadow: 0 8px 28px rgba(27,127,196,.45);
      text-align: center;
    }
    .aeb-num { font-size: 26px; font-weight: 900; line-height: 1; }
    .aeb-lbl { font-size: 11px; opacity: .85; margin-top: 2px; }
    .about-pat-badge {
      position: absolute; top: 30px; right: -20px;
      background: var(--dark); color: white; border-radius: 12px;
      padding: 12px 16px; box-shadow: 0 8px 24px rgba(0,0,0,.3); text-align: center;
    }
    .apb-num { font-size: 22px; font-weight: 900; line-height: 1; }
    .apb-lbl { font-size: 10.5px; opacity: .75; margin-top: 2px; }
    .about-bottom-bar {
      background: var(--P); color: white; padding: 14px 22px;
      border-radius: 0 0 12px 12px; display: flex; align-items: center; justify-content: space-between;
      font-style: italic; font-size: 16px; font-weight: 600;
    }
    .about-eyebrow { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--P); margin-bottom: 8px; }
    .about-title    { font-size: 34px; font-weight: 900; color: var(--dark); margin-bottom: 4px; }
    .about-subtitle { font-size: 16px; font-weight: 600; color: var(--P); margin-bottom: 14px; }
    .about-divider  { width: 50px; height: 4px; background: var(--P); border-radius: 2px; margin-bottom: 22px; }
    .about-quote { background: #f0f7ff; border-left: 5px solid var(--P); border-radius: 0 10px 10px 0; padding: 20px 24px; margin-bottom: 18px; position: relative; }
    .aq-icon { position: absolute; top: -18px; left: 14px; font-size: 56px; color: var(--P); font-family: Georgia,serif; line-height: 1; opacity: .5; }
    .about-quote p { font-size: 14px; color: var(--text); line-height: 1.8; margin-top: 10px; }
    .about-p { font-size: 14px; color: var(--tl); line-height: 1.8; margin-bottom: 16px; }
    .about-highlight { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
    .about-highlight strong { color: var(--dark); }
    .about-highlight p { font-size: 13.5px; color: var(--text); line-height: 1.7; margin-top: 6px; }
    .about-stats { display: flex; gap: 28px; margin-bottom: 24px; }
    .as-item { text-align: center; }
    .as-val { font-size: 26px; font-weight: 900; color: var(--P); line-height: 1; }
    .as-lbl { font-size: 11px; color: var(--tl); margin-top: 3px; }
    .btn-about { display: inline-flex; background: var(--P); color: white; padding: 12px 26px; border-radius: 50px; text-decoration: none; font-size: 14.5px; font-weight: 700; transition: all .2s; box-shadow: 0 4px 16px rgba(27,127,196,.3); }
    .btn-about:hover { background: var(--PD); transform: translateY(-1px); }
     #line1, #line2 {
  display: block;
  margin-bottom: 10px;
}
#line1 {
  display: block;
  margin-bottom: 4px;
}

#line2 {
  display: block;
}
#line3 {
  margin-top: 10px;
  margin-bottom: 12px;
}

#line4 {
  margin-top: 8px;
}
    /* ═══ WHY ═══ */
    .why-section { background: linear-gradient(135deg, var(--PD) 0%, var(--P) 100%); padding: 70px 0; }
    .why-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section-hd { text-align: center; margin-bottom: 42px; }
    .section-eyebrow { display: inline-block; background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); font-size: 11.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 14px; border-radius: 99px; margin-bottom: 10px; }
    .section-title { font-size: 30px; font-weight: 900; color: white; margin-bottom: 8px; }
    .section-sub { font-size: 15px; color: rgba(255,255,255,.75); }
    .why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
    .why-card {
      text-align: center; padding: 28px 20px; background: rgba(255,255,255,.1);
      border-radius: 16px; backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.15); transition: all .25s;
      animation: cardUp .6s ease both;
    }
    .why-card:hover { background: rgba(255,255,255,.18); transform: translateY(-5px); }
    .why-ico { width: 70px; height: 70px; margin: 0 auto 18px; background: rgba(255,255,255,.18); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .why-ico ::ng-deep svg { width: 36px; height: 36px; color: white; }
    .why-card h3 { font-size: 16px; font-weight: 700; color: white; margin-bottom: 10px; }
    .why-card p  { font-size: 13.5px; color: rgba(255,255,255,.8); line-height: 1.6; }

    /* ═══ CAS PREVIEW ═══ */
    .cas-preview { background: #f5f9ff; padding: 80px 0; }
    .cas-preview-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .cas-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    .cas-card {
      background: white; border-radius: 14px; overflow: hidden;
      border: 1px solid #dce8f5; box-shadow: 0 3px 16px rgba(0,0,0,.06);
      transition: all .25s; animation: cardUp .6s ease both;
    }
    .cas-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(27,127,196,.14); border-color: var(--P); }
    .cas-images { display: flex; align-items: center; padding: 20px; gap: 10px; background: #f8fbff; border-bottom: 1px solid #eef4fc; }
    .cas-col { flex: 1; }
    .cas-lbl { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-align: center; margin-bottom: 7px; }
    .cas-lbl-avant { color: #c0392b; }
    .cas-lbl-apres { color: #27ae60; }
    .cas-img { height: 100px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
    .cas-arrow { font-size: 22px; color: var(--P); font-weight: 700; flex-shrink: 0; }
    .cas-info { padding: 18px 20px 22px; }
    .cas-title { font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
    .cas-desc  { font-size: 13.5px; color: var(--tl); line-height: 1.6; }
    .btn-cas { display: inline-flex; background: var(--P); color: white; padding: 13px 32px; border-radius: 50px; text-decoration: none; font-size: 15px; font-weight: 700; transition: all .2s; box-shadow: 0 4px 16px rgba(27,127,196,.3); }
    .btn-cas:hover { background: var(--PD); transform: translateY(-2px); }
    .hero-stat {
  opacity: 0;
  transform: translateY(10px);
  animation: statIn 0.6s forwards;
}
.fade-in {
  opacity: 0;
  transform: translateY(12px);
  animation: fadeIn 0.8s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* delays */
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }
.delay-4 { animation-delay: 0.8s; }
.hero-stat:nth-child(1) { animation-delay: 0.2s; }
.hero-stat:nth-child(2) { animation-delay: 0.35s; }
.hero-stat:nth-child(3) { animation-delay: 0.5s; }
.hero-stat:nth-child(4) { animation-delay: 0.65s; }

@keyframes statIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
    /* ═══ CTA ═══ */
    .cta-section { position: relative; padding: 80px 24px; text-align: center; overflow: hidden; }
    .cta-section::before { content:''; position:absolute; inset:0; background-image:url('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&h=600&fit=crop'); background-size:cover; background-position:center; }
    .cta-overlay { position: absolute; inset: 0; background: rgba(20,40,70,.88); }
    .cta-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
    .cta-title { font-size: 34px; font-weight: 900; color: white; margin-bottom: 12px; }
    .cta-sub   { font-size: 16px; color: rgba(255,255,255,.8); margin-bottom: 28px; }
    .cta-btn {
      display: inline-flex; align-items: center; gap: 10px;
      background: #a2adc7; color: #1f2937; text-decoration: none;
      padding: 15px 34px; border-radius: 50px; font-size: 16px; font-weight: 800;
      box-shadow: 0 6px 28px rgba(67, 77, 224, 0.45); transition: all .22s;
    }
    .cta-btn:hover { background: #3278c3; transform: translateY(-2px); }
    .cta-tel { margin-top: 18px; font-size: 14px; color: rgba(255,255,255,.7); }
    .cta-tel strong { color: white; font-size: 18px; }

    @media (max-width: 1000px) { .about-inner { grid-template-columns: 1fr; } .about-exp-badge,.about-pat-badge { position: static; margin-top: 8px; } }
    @media (max-width: 900px)  { .svc-grid { grid-template-columns: 1fr; } .svc-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,.12); } .why-grid { grid-template-columns: 1fr 1fr; } .cas-grid { grid-template-columns: 1fr; } .rdv-float-card { display: none; } }
    @media (max-width: 600px)  { .hero-stats { gap: 16px; } .why-grid { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
   

  slideIdx = signal(0);
  private timer: any;
  sanitizer = inject(DomSanitizer);


  readonly heroSlides = [
    { id:1, img:'https://i.pinimg.com/1200x/a1/cf/67/a1cf6767574a5799e52fb7fa99658857.jpg' },
    { id:2, img:'https://i.pinimg.com/1200x/f1/2c/b5/f12cb59511c42c8e548d8e867156164a.jpg' },

  ];






  readonly heroStats = [
    { val:'15+',   label:'Années exp.' },
    { val:'5000+', label:'Patients' },
    { val:'98%',   label:'Satisfaction' },
    { val:'1200+', label:'Implants' },
  ];

  readonly aboutStats = [
    { val:'5000+', label:'Patients satisfaits' },
    { val:'1200+', label:'Implants posés' },
    { val:'98%',   label:'Taux de réussite' },
  ];

  readonly services = [
    {
      title: 'Parodontologie',
      desc: 'Traitement des maladies des gencives et de l\'os qui entoure et soutient les dents.',
      features: ['Détartrage et surfaçage radiculaire', 'Greffe gingivale', 'Régénération osseuse'],
      icon: this.sanitizer.bypassSecurityTrustHtml( `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 22c-8 2-14 10-12 20s10 18 18 16" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M48 22c8 2 14 10 12 20s-10 18-18 16" stroke="white" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="40" cy="25" rx="10" ry="12" stroke="white" stroke-width="2.5" fill="rgba(255,255,255,.15)"/><path d="M30 42 C28 52 32 62 40 64 C48 62 52 52 50 42" stroke="white" stroke-width="2" fill="rgba(255,255,255,.08)"/><ellipse cx="40" cy="66" rx="12" ry="5" stroke="white" stroke-width="1.5" fill="rgba(255,255,255,.08)"/></svg>`),
    },
    {
      title: 'Implantologie',
      desc: 'Remplacement de dents manquantes avec des implants en titane pour une solution permanente.',
      features: ['Implants dentaires', 'All-on-4', 'Greffe osseuse'],
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="33" y="10" width="14" height="28" rx="7" stroke="white" stroke-width="2.5" fill="rgba(255,255,255,.15)"/><line x1="40" y1="38" x2="40" y2="58" stroke="white" stroke-width="3.5" stroke-linecap="round"/><line x1="32" y1="44" x2="48" y2="44" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="50" x2="50" y2="50" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="56" x2="52" y2="56" stroke="white" stroke-width="2" stroke-linecap="round"/><ellipse cx="40" cy="63" rx="16" ry="6" stroke="white" stroke-width="2" fill="rgba(255,255,255,.1)"/></svg>`),
    },
    {
      title: 'Chirurgie Orale',
      desc: 'Interventions chirurgicales pour extractions, kystes et pathologies buccales.',
      features: ['Extraction dents sagesse', 'Chirurgie pré-implantaire', 'Traitement des kystes'],
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="36" r="20" stroke="white" stroke-width="2.5" fill="rgba(255,255,255,.1)"/><path d="M30 28 C28 22 34 16 40 16 C46 16 52 22 50 28" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M30 44 C30 50 34 58 40 60 C46 58 50 50 50 44" stroke="white" stroke-width="2" stroke-linecap="round" fill="rgba(255,255,255,.08)"/><line x1="55" y1="22" x2="65" y2="14" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="62" y1="12" x2="68" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="40" cy="36" r="5" fill="rgba(255,255,255,.3)" stroke="white" stroke-width="1.5"/></svg>`),
    },
  ];

  readonly whyItems = [
    { title:'Expertise Reconnue',      desc:'Plus de 15 ans d\'expérience en parodontologie et implantologie.'  },
    { title:'Équipement Moderne',      desc:'Technologies de pointe pour des soins précis et confortables.' },
    { title:'Hygiène Stricte',         desc:'Protocoles de stérilisation aux normes internationales.'},
    { title:'Prise en Charge Complète',desc:'Suivi personnalisé et accompagnement tout au long du traitement.' },
  ];

  readonly casPrev = [
    { id:1, title:'Traitement parodontal', desc:'Traitement de la parodontite sévère avec récupération osseuse complète.',   colorBefore:'#c0392b', colorAfter:'#1b7fc4' },
    { id:2, title:'Pose d\'implant',        desc:'Remplacement d\'une dent manquante par un implant ostéointégré en titane.', colorBefore:'#8e5c5c', colorAfter:'#17a2b8' },
    { id:3, title:'Chirurgie gingivale',   desc:'Correction d\'un sourire gingival par gingivectomie laser.',               colorBefore:'#a05050', colorAfter:'#155f9a' },
  ];

 ngOnInit() {
  this.timer = setInterval(() => {
    this.slideIdx.update(i => (i + 1) % this.heroSlides.length);
  }, 5000);
}
  ngOnDestroy() { clearInterval(this.timer); }
 
}