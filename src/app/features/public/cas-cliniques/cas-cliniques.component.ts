import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CasCliniquesService } from '../../../core/services/cas-cliniques.service';

@Component({
  selector: 'app-cas-cliniques',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="cc-page">
  <section class="cc-hero">
    <div class="cc-hero-inner">
      <div class="cc-eyebrow">Avant / Après traitement</div>
      <h1 class="cc-title">Cas Cliniques Récents</h1>
      <p class="cc-sub">Découvrez les résultats de nos traitements parodontaux et implantaires</p>
    </div>
  </section>

  <div class="cc-filters-bar">
    <div class="cc-filters-inner">
      @for (f of filters; track f.id) {
        <button class="cc-fbtn" [class.active]="activeFilter()===f.id" (click)="activeFilter.set(f.id)">
          {{ f.label }}
          <span class="cc-fcount">{{ countBy(f.id) }}</span>
        </button>
      }
    </div>
  </div>

  <section class="cc-body">
    <div class="cc-inner">
      <div class="cc-grid">
        @for (cas of filteredCases(); track cas.id; let i = $index) {
          <div class="cc-card" [style.animation-delay]="(i*0.1)+'s'">
            <div class="comparison-container" #container
              (mousedown)="startDrag($event, cas, container)"
              (touchstart)="startDrag($event, cas, container)">
              <div class="img-after"
                [style.background-image]="cas.afterImg.startsWith('assets') ? 'url('+cas.afterImg+')' : 'url('+cas.afterImg+')'"
                style="background-size:cover;background-position:center;">
              </div>
              <div class="img-before-overlay" [style.width]="cas.sliderPos+'%'">
                <div class="img-before"
                  [style.background-image]="'url('+cas.beforeImg+')'"
                  style="background-size:cover;background-position:center;width:100%;height:100%;">
                </div>
              </div>
              <div class="slider-handle" [style.left]="cas.sliderPos+'%'">
                <div class="slider-line"></div>
                <div class="slider-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b7fc4" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b7fc4" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
              <div class="img-labels">
                <span class="img-label img-label-avant">AVANT</span>
                <span class="img-label img-label-apres">APRÈS</span>
              </div>
            </div>
            <div class="cc-info">
              <span class="cc-cat" [style.color]="cas.catColor" [style.background]="cas.catColor+'15'">{{ cas.category }}</span>
              <h3 class="cc-case-title">{{ cas.titre }}</h3>
              <p class="cc-case-desc">{{ cas.description }}</p>
              <div class="cc-case-details">
                <div class="cc-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  {{ cas.traitement }}
                </div>
                <div class="cc-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ cas.duree }}
                </div>
              </div>
              <div class="cc-tags">
                @for (tag of cas.tags; track tag) {
                  <span class="cc-tag">{{ tag }}</span>
                }
              </div>
            </div>
          </div>
        }

        @if (filteredCases().length === 0) {
          <div class="cc-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>Aucun cas dans cette catégorie pour le moment.</p>
          </div>
        }
      </div>
    </div>
  </section>

  <section class="cc-cta">
    <div class="cc-cta-inner">
      <h2>Vous Souhaitez le Même Résultat ?</h2>
      <p>Prenez rendez-vous pour une consultation personnalisée</p>
      <a routerLink="/login" class="cc-cta-btn">
        Prendre Rendez-vous
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </section>
</div>
  `,
  styles: [`
    :host { --P:#1b7fc4; --PD:#155f9a; --dark:#1e3a5c; --text:#444; --tl:#777; --border:#dce8f5; }
    .cc-page { background:#f5f9ff; min-height:100vh; }
    .cc-hero { background:linear-gradient(135deg,var(--PD),var(--P)); padding:70px 24px 50px; text-align:center; }
    .cc-hero-inner { max-width:700px; margin:0 auto; }
    .cc-eyebrow { font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,.8);margin-bottom:10px; }
    .cc-title { font-size:42px;font-weight:900;color:white;margin-bottom:12px; }
    .cc-sub   { font-size:16px;color:rgba(255,255,255,.8); }
    .cc-filters-bar { background:white;border-bottom:1px solid var(--border);padding:16px 24px;position:sticky;top:68px;z-index:100;box-shadow:0 2px 10px rgba(0,0,0,.05); }
    .cc-filters-inner { max-width:1200px;margin:0 auto;display:flex;gap:10px;flex-wrap:wrap;justify-content:center; }
    .cc-fbtn { display:flex;align-items:center;gap:7px;padding:8px 20px;border-radius:99px;border:1.5px solid var(--border);background:white;font-size:13.5px;font-weight:600;color:var(--text);cursor:pointer;font-family:inherit;transition:all .18s; }
    .cc-fbtn:hover { border-color:var(--P);color:var(--P); }
    .cc-fbtn.active { background:var(--P);color:white;border-color:var(--P); }
    .cc-fcount { font-size:11px;background:rgba(0,0,0,.08);border-radius:99px;padding:1px 7px; }
    .cc-fbtn.active .cc-fcount { background:rgba(255,255,255,.25); }
    .cc-body { padding:48px 0 60px; }
    .cc-inner { max-width:1200px;margin:0 auto;padding:0 24px; }
    .cc-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:28px; }
    .cc-card { background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.07);transition:all .3s;animation:cardUp .6s ease both;cursor:default; }
    @keyframes cardUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
    .cc-card:hover { transform:translateY(-8px);box-shadow:0 16px 48px rgba(0,0,0,.12); }
    .comparison-container { position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;border-radius:10px 10px 0 0;background:#607cb6;cursor:ew-resize;user-select:none; }
    .img-after { position:absolute;inset:0; }
    .img-before-overlay { position:absolute;top:0;left:0;bottom:0;overflow:hidden; }
    .img-before { position:absolute;inset:0; }
    .slider-handle { position:absolute;top:0;bottom:0;width:4px;transform:translateX(-50%);z-index:5;pointer-events:none; }
    .slider-line { position:absolute;top:0;bottom:0;width:4px;background:white;box-shadow:0 0 10px rgba(0,0,0,.3); }
    .slider-btn { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;background:white;border-radius:50%;box-shadow:0 4px 16px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;gap:1px; }
    .img-labels { position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;pointer-events:none;z-index:6; }
    .img-label { background:rgba(0,0,0,.65);color:white;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:700;backdrop-filter:blur(8px); }
    .img-label-avant { color:#fca5a5; }
    .img-label-apres { color:#86efac; }
    .cc-info { padding:20px 22px 24px; }
    .cc-cat { display:inline-block;font-size:11px;font-weight:700;padding:3px 11px;border-radius:99px;margin-bottom:10px; }
    .cc-case-title { font-size:17px;font-weight:700;color:var(--dark);margin-bottom:8px; }
    .cc-case-desc  { font-size:13.5px;color:var(--tl);line-height:1.65;margin-bottom:14px; }
    .cc-case-details { display:flex;gap:18px;margin-bottom:12px; }
    .cc-detail { display:flex;align-items:center;gap:6px;font-size:13px;color:var(--tl); }
    .cc-tags { display:flex;flex-wrap:wrap;gap:7px; }
    .cc-tag { background:#e0eeff;color:var(--P);padding:4px 12px;border-radius:99px;font-size:12px;font-weight:600; }
    .cc-empty { grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:12px;padding:60px;text-align:center;color:#999; }
    .cc-cta { padding:60px 24px;background:linear-gradient(135deg,var(--PD),var(--P));text-align:center; }
    .cc-cta-inner { max-width:700px;margin:0 auto; }
    .cc-cta h2 { font-size:30px;font-weight:900;color:white;margin-bottom:10px; }
    .cc-cta p  { font-size:16px;color:rgba(255,255,255,.8);margin-bottom:24px; }
    .cc-cta-btn { display:inline-flex;align-items:center;gap:10px;background:#fbbf24;color:#1f2937;text-decoration:none;padding:14px 32px;border-radius:99px;font-size:16px;font-weight:800;box-shadow:0 6px 24px rgba(32,65,131,.45);transition:all .2s; }
    .cc-cta-btn:hover { background:#f59e0b;transform:translateY(-2px); }
    @media (max-width:700px) { .cc-grid { grid-template-columns:1fr; } .cc-title { font-size:28px; } }
  `]
})
export class CasCliniquesComponent {
  svc = inject(CasCliniquesService);
  activeFilter = signal('tous');

  readonly filters = [
    { id:'tous',           label:'Tous' },
    { id:'parodontologie', label:'Parodontologie' },
    { id:'implantologie',  label:'Implantologie' },
    { id:'chirurgie',      label:'Chirurgie Gingivale' },
  ];

  filteredCases() {
    const f = this.activeFilter();
    return f === 'tous' ? this.svc.cases() : this.svc.cases().filter(c => c.categorie === f);
  }

  countBy(f: string) {
    return f === 'tous' ? this.svc.cases().length : this.svc.cases().filter(c => c.categorie === f).length;
  }

  private isDragging = false;
  private currentCase: any = null;
  private currentContainer: HTMLElement | null = null;

  startDrag(event: MouseEvent | TouchEvent, cas: any, container: HTMLElement) {
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
    document.addEventListener('touchmove', move, { passive:false });
    document.addEventListener('touchend', end);
  }
}