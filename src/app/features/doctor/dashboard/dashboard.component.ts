import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RdvService } from '../../../core/services/rdv.service';
import { DossierService } from '../../../core/services/dossier.service';
import { ThemeService } from '../../../core/services/theme.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CasCliniquesService } from '../../../core/services/cas-cliniques.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
<div class="dash" [class.dark]="theme.isDark()">

  <!-- ══ AMBIENT BACKGROUND ══ -->
  <div class="ambient-bg">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="grid-overlay"></div>
  </div>

  <!-- ══ PAGE HEADER ══ -->
  <div class="page-hd">
    <div class="page-hd-left">
      <div class="page-eyebrow">
        <div class="pulse-ring"><span class="live-pulse"></span></div>
        <span>{{ today }}</span>
        <span class="sep">·</span>
        <span class="role-chip">{{ isSecretary() ? 'Espace Secrétaire' : 'Dashboard Médical' }}</span>
      </div>
      <h1 class="page-title">
        Bonjour, <span class="accent-text">{{ firstName() }}</span>
        <span class="wave-emoji">👋</span>
      </h1>
    </div>
    <div class="hd-actions">
      <a routerLink="/doctor/rdv" class="btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Planning
      </a>
      <a routerLink="/doctor/rdv" class="btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouveau RDV
      </a>
    </div>
  </div>

  <!-- ══ STAT CARDS ══ -->
  <div class="stats-grid" [class.stats-grid-2]="isSecretary()">
    @for (s of visibleStatCards(); track s.label; let i = $index) {
      <div class="stat-card" [style.--c]="s.color" [style.--cb]="s.bg" [style.animation-delay]="(i*0.12)+'s'">
        <div class="stat-card-glow"></div>
        <div class="stat-card-inner">
          <div class="stat-top">
            <div class="stat-ico-wrap">
              <div class="stat-ico" [innerHTML]="sanitize(s.icon)"></div>
              <div class="stat-ico-ring"></div>
            </div>
            <div class="stat-trend" [class.up]="s.up" [class.dn]="!s.up">
              <span class="trend-arrow">{{ s.up ? '↗' : '↘' }}</span>
              <span>{{ s.trend }}%</span>
            </div>
          </div>
          <div class="stat-val-wrap">
            <div class="stat-val">{{ s.val }}</div>
            <div class="stat-lbl">{{ s.label }}</div>
          </div>
          <div class="stat-progress">
            <div class="stat-progress-track">
              <div class="stat-progress-fill" [style.width]="s.pct+'%'">
                <div class="fill-shimmer"></div>
              </div>
            </div>
            <div class="stat-progress-meta">
              <span>Objectif mensuel</span>
              <span class="stat-pct">{{ s.pct }}%</span>
            </div>
          </div>
        </div>
        <div class="stat-card-border"></div>
      </div>
    }
  </div>

  <!-- ══ 3-COLUMN GRID ══ -->
  <div class="tri-grid" [class.tri-grid-secretary]="isSecretary()">

    <!-- ══ LEFT COL ══ -->
    <div class="col-left">

      <!-- TODAY RDV -->
      <div class="glass-card">
        <div class="card-hd">
          <div class="card-hd-left">
            <div class="card-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div class="card-eye">Planning du jour</div>
              <div class="card-title">Rendez-vous d'aujourd'hui</div>
            </div>
          </div>
          <a routerLink="/doctor/rdv" class="pill-link">
            Tout voir
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>
        <div class="rdv-list">
          @for (rdv of todayRdvs(); track rdv.id; let i = $index; let isLast = $last) {
            <div class="rdv-item" [style.animation-delay]="(0.1 + i*0.08)+'s'">
              <div class="rdv-time-col">
                <div class="rdv-time">{{ rdv.time }}</div>
                <div class="rdv-ampm">{{ rdv.time < '12:00' ? 'AM' : 'PM' }}</div>
              </div>
              <div class="rdv-timeline">
                <div class="rdv-dot-wrap">
                  <div class="rdv-dot"
                    [class.dot-confirmed]="rdv.status==='confirmed'"
                    [class.dot-done]="rdv.status==='done'"
                    [class.dot-pending]="rdv.status==='pending'"
                    [class.dot-cancelled]="rdv.status==='cancelled'">
                    <span class="dot-pulse"></span>
                  </div>
                </div>
                @if (!isLast) { <div class="rdv-vline"></div> }
              </div>
              <div class="rdv-av" [style.background]="rdv.grad">
                {{ rdv.patientName[0] }}{{ rdv.patientName.split(' ')[1]?.[0] ?? '' }}
              </div>
              <div class="rdv-body">
                <div class="rdv-name">{{ rdv.patientName }}</div>
                <div class="rdv-meta">
                  <span class="rdv-tag">{{ rdv.type }}</span>
                  @if (rdv.patientPhone) {
                    <span class="rdv-ph">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {{ rdv.patientPhone }}
                    </span>
                  }
                </div>
              </div>
              <span class="badge" [class]="badgeClass(rdv.status)">{{ statusLabel(rdv.status) }}</span>
            </div>
          }
          @if (todayRdvs().length === 0) {
            <div class="empty-st">
              <div class="empty-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p class="empty-title">Aucun rendez-vous aujourd'hui</p>
              <p class="empty-sub">Profitez de cette pause bien méritée</p>
            </div>
          }
        </div>
      </div>

      <!-- WEEK CHART — DOCTOR ONLY -->
      @if (isDoctor()) {
        <div class="glass-card chart-card">
          <div class="card-hd">
            <div class="card-hd-left">
              <div class="card-icon chart-ico">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </div>
              <div>
                <div class="card-eye">Cette semaine</div>
                <div class="card-title">Activité des patients</div>
              </div>
            </div>
            <div class="chart-summary">
              <div class="chart-total">{{ weekTotal() }}</div>
              <div class="chart-total-lbl">RDV cette semaine</div>
            </div>
          </div>
          <div class="activity-mini-stats">
            @for (ms of miniStats; track ms.label) {
              <div class="ms-item">
                <div class="ms-dot" [style.background]="ms.color"></div>
                <div class="ms-content">
                  <div class="ms-val">{{ ms.val }}</div>
                  <div class="ms-lbl">{{ ms.label }}</div>
                </div>
                <button class="ms-btn" [style.--btn-c]="ms.color">{{ ms.action }}</button>
              </div>
            }
          </div>
          <div class="week-chart">
            @for (d of weekData; track d.day; let i = $index) {
              <div class="wday-col">
                <div class="wbar-area">
                  <div class="wbar-tooltip">{{ d.count }} consultations</div>
                  <div class="wbar"
                    [class.today]="d.today"
                    [style.height.%]="d.count / maxWeek() * 88"
                    [style.animation-delay]="(0.2 + i * 0.08)+'s'">
                    <div class="wbar-shine"></div>
                  </div>
                </div>
                <div class="wday-lbl" [class.today]="d.today">{{ d.day }}</div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ALL RDV TABLE -->
      <div class="glass-card table-card">
        <div class="card-hd">
          <div class="card-hd-left">
            <div class="card-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <div class="card-eye">Historique complet</div>
              <div class="card-title">Tous les rendez-vous</div>
            </div>
          </div>
          <div class="tbl-filters">
            <button class="filter-btn active">Tous</button>
            <button class="filter-btn">Confirmés</button>
            <button class="filter-btn">En attente</button>
          </div>
        </div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Genre</th>
                <th>Poids</th>
                <th>Spécialité</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (rdv of allRdvs(); track rdv.id; let i = $index) {
                <tr [style.animation-delay]="(i*0.04)+'s'">
                  <td>
                    <div class="tbl-patient">
                      <div class="tbl-av" [style.background]="rdv.grad">
                        {{ rdv.patientName[0] }}{{ rdv.patientName.split(' ')[1]?.[0] ?? '' }}
                      </div>
                      <span class="tbl-name">{{ rdv.patientName }}</span>
                    </div>
                  </td>
                  <td class="muted">{{ rdv.gender ?? 'N/A' }}</td>
                  <td class="muted">{{ rdv.weight ?? '—' }}</td>
                  <td class="muted">{{ rdv.type }}</td>
                  <td class="muted">{{ formatDate(rdv.date) }}</td>
                  <td><span class="badge" [class]="badgeClass(rdv.status)">{{ statusLabel(rdv.status) }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ══ MIDDLE COL ══ -->
    <div class="col-mid">

      <!-- CALENDAR -->
      <div class="glass-card cal-card">
        <div class="card-hd">
          <div class="card-hd-left">
            <div class="card-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div class="card-eye">Agenda mensuel</div>
              <div class="card-title">{{ monthName }} {{ calYear }}</div>
            </div>
          </div>
          <div class="cal-nav">
            <button class="cal-btn" (click)="prevMonth()">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button class="cal-btn cal-today-btn" (click)="goToday()">Aujourd'hui</button>
            <button class="cal-btn" (click)="nextMonth()">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="cal-body">
          <div class="cal-wdays">
            @for (d of dayNames; track d) { <div class="cal-wday">{{ d }}</div> }
          </div>
          <div class="cal-grid">
            @for (cell of calendarCells(); track $index) {
              <div class="cal-cell"
                [class.other]="!cell.currentMonth"
                [class.is-today]="cell.isToday"
                [class.selected]="cell.date === selectedDate()"
                [class.has-rdv]="cell.rdvCount > 0 && cell.currentMonth"
                (click)="selectDate(cell)">
                <div class="cal-num">{{ cell.day }}</div>
                @if (cell.rdvCount > 0 && cell.currentMonth) {
                  <div class="cal-dots">
                    @for (rdv of cell.rdvs.slice(0,3); track rdv.id) {
                      <span class="cal-dot" [style.background]="dotColor(rdv.status)"></span>
                    }
                  </div>
                  @if (cell.rdvCount > 1) {
                    <div class="cal-count">{{ cell.rdvCount }}</div>
                  }
                }
              </div>
            }
          </div>
        </div>
        @if (selectedDayRdvs().length > 0) {
          <div class="cal-detail">
            <div class="cal-det-hd">
              <span class="cal-det-title">{{ formatSelectedDate() }}</span>
              <span class="det-chip">{{ selectedDayRdvs().length }} patient(s)</span>
            </div>
            @for (rdv of selectedDayRdvs(); track rdv.id) {
              <div class="cal-det-row">
                <span class="cal-det-time">{{ rdv.time }}</span>
                <div class="cal-det-av" [style.background]="rdv.grad">
                  {{ rdv.patientName[0] }}{{ rdv.patientName.split(' ')[1]?.[0] ?? '' }}
                </div>
                <div class="cal-det-info">
                  <div class="cal-det-name">{{ rdv.patientName }}</div>
                  <div class="cal-det-type">{{ rdv.type }}</div>
                </div>
                <span class="badge" [class]="badgeClass(rdv.status)">{{ statusLabel(rdv.status) }}</span>
              </div>
            }
          </div>
        } @else if (selectedDate()) {
          <div class="cal-empty">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Aucun rendez-vous ce jour
          </div>
        }
      </div>

      <!-- ORDONNANCES — DOCTOR ONLY -->
      @if (isDoctor()) {
        <div class="glass-card">
          <div class="card-hd">
            <div class="card-hd-left">
              <div class="card-icon presc-ico">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
                </svg>
              </div>
              <div>
                <div class="card-eye">Récentes</div>
                <div class="card-title">Ordonnances</div>
              </div>
            </div>
            <a routerLink="/doctor/ordonnances" class="pill-link">
              Voir tout
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>
          <div class="ord-list">
            @for (ord of recentOrds(); track ord.id) {
              <div class="ord-row">
                <div class="ord-ico">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
                  </svg>
                </div>
                <div class="ord-body">
                  <div class="ord-name">{{ ord.patientName }}</div>
                  <div class="ord-meta">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ ord.date }} · {{ ord.medications.length }} médicament(s)
                  </div>
                </div>
                <span class="badge badge-confirmed">Active</span>
              </div>
            }
            @if (recentOrds().length === 0) {
              <div class="empty-st" style="padding:24px">
                <div class="empty-ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
                  </svg>
                </div>
                <p class="empty-title">Aucune ordonnance récente</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- CHECK-IN CARD — SECRETARY ONLY -->
      @if (isSecretary()) {
        <div class="glass-card">
          <div class="card-hd">
            <div class="card-hd-left">
              <div class="card-icon" style="background:rgba(16,185,129,0.15);color:#10b981">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <polyline points="16 11 18 13 22 9"/>
                </svg>
              </div>
              <div>
                <div class="card-eye">Arrivées du jour</div>
                <div class="card-title">Check-in patients</div>
              </div>
            </div>
            <span class="det-chip">{{ todayRdvs().length }} attendu(s)</span>
          </div>
          <div class="rdv-list">
            @for (rdv of todayRdvs(); track rdv.id; let i = $index) {
              <div class="rdv-item" [style.animation-delay]="(i*0.08)+'s'">
                <div class="rdv-av" [style.background]="rdv.grad">
                  {{ rdv.patientName[0] }}{{ rdv.patientName.split(' ')[1]?.[0] ?? '' }}
                </div>
                <div class="rdv-body">
                  <div class="rdv-name">{{ rdv.patientName }}</div>
                  <div class="rdv-meta">
                    <span class="rdv-tag">{{ rdv.time }}</span>
                    <span class="rdv-tag">{{ rdv.type }}</span>
                  </div>
                </div>
                <button class="checkin-btn" [class.checked]="rdv.status === 'confirmed'">
                  {{ rdv.status === 'confirmed' ? '✓ Arrivé' : 'Check-in' }}
                </button>
              </div>
            }
            @if (todayRdvs().length === 0) {
              <div class="empty-st" style="padding:24px">
                <p class="empty-title">Aucun patient attendu</p>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- ══ RIGHT COL — DOCTOR ONLY ══ -->
    @if (isDoctor()) {
      <div class="col-right">
        <!-- DOCTOR PROFILE CARD -->
        <div class="glass-card doctor-card">
          <div class="doc-banner">
            <div class="doc-banner-mesh"></div>
            <div class="doc-ecg-line">
              <svg viewBox="0 0 300 60" preserveAspectRatio="none" width="100%" height="100%">
                <polyline class="ecg-path" points="0,40 30,40 45,40 50,10 55,55 60,40 90,40 120,40 135,40 140,10 145,55 150,40 180,40 210,40 225,40 230,10 235,55 240,40 270,40 300,40" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
              </svg>
            </div>
          </div>
          <div class="doc-profile">
            <div class="doc-avatar-wrap">
              <div class="doc-avatar"><span>{{ getInitials() }}</span></div>
              <div class="doc-av-badge">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div class="doc-name">{{ auth.user()?.name ?? 'Dr. Khaddar' }}</div>
            <div class="doc-spec">{{ auth.user()?.specialty ?? 'Médecin généraliste' }}</div>
          </div>
          <div class="doc-stats">
            @for (ds of docStats; track ds.label) {
              <div class="doc-stat">
                <div class="doc-stat-val">{{ ds.val }}</div>
                <div class="doc-stat-lbl">{{ ds.label }}</div>
              </div>
            }
          </div>
          <div class="doc-limit">
            <div class="doc-limit-hd">
              <span class="doc-limit-lbl">Limite de patients</span>
              <span class="doc-limit-val">{{ appointmentsLimit }}</span>
            </div>
            <div class="doc-limit-track">
              <div class="doc-limit-fill" [style.width]="limitPct+'%'">
                <div class="fill-shimmer"></div>
              </div>
            </div>
            <div class="doc-limit-meta">
              <span>{{ limitUsed }} / {{ appointmentsLimit }}</span>
              <span class="doc-limit-pct">{{ limitPct }}%</span>
            </div>
          </div>
          <div class="doc-extra-stats">
            @for (es of extraStats; track es.label) {
              <div class="doc-extra-item" [style.--ec]="es.color">
                <div class="doc-extra-ico-wrap">
                  <span class="doc-extra-sign">{{ es.sign }}</span>
                </div>
                <div>
                  <div class="doc-extra-val">{{ es.val }}</div>
                  <div class="doc-extra-lbl">{{ es.label }}</div>
                </div>
              </div>
            }
          </div>
          <div class="doc-donut-wrap">
            <div class="doc-donut">
              <svg viewBox="0 0 120 120" width="110" height="110">
                <defs>
                  <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:var(--P);stop-opacity:1"/>
                    <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1"/>
                  </linearGradient>
                  <linearGradient id="dg2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:1"/>
                    <stop offset="100%" style="stop-color:#059669;stop-opacity:1"/>
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" stroke-width="10"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="url(#dg1)" stroke-width="10"
                  stroke-dasharray="301.6" stroke-dashoffset="75.4" stroke-linecap="round"
                  transform="rotate(-90 60 60)" class="donut-arc"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="url(#dg2)" stroke-width="10"
                  stroke-dasharray="301.6" stroke-dashoffset="226.2" stroke-linecap="round"
                  transform="rotate(-90 60 60)" class="donut-arc" style="animation-delay:0.3s"/>
              </svg>
              <div class="doc-donut-inner">
                <div class="doc-donut-val">{{ totalPatients.toLocaleString('fr-FR') }}</div>
                <div class="doc-donut-lbl">Patients</div>
              </div>
            </div>
            <div class="doc-donut-legend">
              <div class="legend-item">
                <div class="legend-dot" style="background:var(--P)"></div>
                <div>
                  <div class="legend-lbl">Nouveaux</div>
                  <div class="legend-val">{{ newPatientsCount }}</div>
                </div>
              </div>
              <div class="legend-item">
                <div class="legend-dot" style="background:#10b981"></div>
                <div>
                  <div class="legend-lbl">Récurrents</div>
                  <div class="legend-val">{{ returnPatients }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QUICK ACTIONS -->
        <div class="glass-card">
          <div class="card-hd">
            <div class="card-hd-left">
              <div class="card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <div class="card-eye">Actions rapides</div>
                <div class="card-title">Raccourcis</div>
              </div>
            </div>
          </div>
          <div class="quick-actions">
            @for (qa of quickActions; track qa.label; let i = $index) {
              <a [routerLink]="qa.path" class="qa-item"
                [style.--qc]="qa.color" [style.--qcb]="qa.bg"
                [style.animation-delay]="(i*0.06)+'s'">
                <div class="qa-ico-wrap">
                  <div class="qa-ico" [innerHTML]="sanitize(qa.icon)"></div>
                </div>
                <div class="qa-content">
                  <div class="qa-label">{{ qa.label }}</div>
                  <div class="qa-sub">{{ qa.sub }}</div>
                </div>
                <div class="qa-arrow">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }
          </div>
        </div>
      </div>
    }

    <!-- ══ RIGHT COL — SECRETARY ONLY ══ -->
    @if (isSecretary()) {
      <div class="col-right">

        <!-- SECRETARY PROFILE CARD -->
        <div class="glass-card doctor-card">
          <div class="doc-banner">
            <div class="doc-banner-mesh" style="background-image: radial-gradient(circle at 20% 50%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.2) 0%, transparent 40%);"></div>
            <div class="doc-ecg-line">
              <svg viewBox="0 0 300 60" preserveAspectRatio="none" width="100%" height="100%">
                <polyline class="ecg-path" points="0,40 30,40 45,40 50,10 55,55 60,40 90,40 120,40 135,40 140,10 145,55 150,40 180,40 210,40 225,40 230,10 235,55 240,40 270,40 300,40" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
              </svg>
            </div>
          </div>
          <div class="doc-profile">
            <div class="doc-avatar-wrap">
              <div class="doc-avatar" style="background:linear-gradient(135deg,#8b5cf6,#6366f1)">
                <span>{{ getInitials() }}</span>
              </div>
              <div class="doc-av-badge">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div class="doc-name">{{ auth.user()?.name ?? 'Secrétaire' }}</div>
            <div class="doc-spec">Secrétaire médicale</div>
          </div>
          <div class="doc-stats">
            <div class="doc-stat">
              <div class="doc-stat-val">{{ todayRdvs().length }}</div>
              <div class="doc-stat-lbl">RDV aujourd'hui</div>
            </div>
            <div class="doc-stat">
              <div class="doc-stat-val">{{ casCases().length }}</div>
              <div class="doc-stat-lbl">Cas cliniques</div>
            </div>
          </div>
        </div>

        <!-- QUICK ACTIONS — SECRETARY -->
        <div class="glass-card">
          <div class="card-hd">
            <div class="card-hd-left">
              <div class="card-icon" style="background:rgba(16,185,129,0.15);color:#10b981">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <div class="card-eye">Actions rapides</div>
                <div class="card-title">Raccourcis</div>
              </div>
            </div>
          </div>
          <div class="quick-actions">
            @for (qa of secretaryActions; track qa.label; let i = $index) {
              <a [routerLink]="qa.path" class="qa-item"
                [style.--qc]="qa.color" [style.--qcb]="qa.bg"
                [style.animation-delay]="(i*0.06)+'s'">
                <div class="qa-ico-wrap">
                  <div class="qa-ico" [innerHTML]="sanitize(qa.icon)"></div>
                </div>
                <div class="qa-content">
                  <div class="qa-label">{{ qa.label }}</div>
                  <div class="qa-sub">{{ qa.sub }}</div>
                </div>
                <div class="qa-arrow">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </a>
            }
          </div>
        </div>

        <!-- ══ CAS CLINIQUES CARD — NOUVELLE VERSION AVEC MODALS ══ -->
        <div class="glass-card cas-card">
          <!-- Card Header -->
          <div class="card-hd">
            <div class="card-hd-left">
              <div class="card-icon cas-ico">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div>
                <div class="card-eye">Galerie médicale</div>
                <div class="card-title">Cas Cliniques</div>
              </div>
            </div>
            <a routerLink="/doctor/cas-cliniques" class="pill-link">
              Voir page
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>

          <!-- Stats mini -->
          <div class="cas-stats-row">
            <div class="cas-stat-item">
              <div class="cas-stat-num">{{ casCases().length }}</div>
              <div class="cas-stat-lbl">Total</div>
            </div>
            <div class="cas-stat-divider"></div>
            <div class="cas-stat-item">
              <div class="cas-stat-num cas-paro">{{ countCat('parodontologie') }}</div>
              <div class="cas-stat-lbl">Parodon.</div>
            </div>
            <div class="cas-stat-divider"></div>
            <div class="cas-stat-item">
              <div class="cas-stat-num cas-impl">{{ countCat('implantologie') }}</div>
              <div class="cas-stat-lbl">Implant.</div>
            </div>
            <div class="cas-stat-divider"></div>
            <div class="cas-stat-item">
              <div class="cas-stat-num cas-chir">{{ countCat('chirurgie') }}</div>
              <div class="cas-stat-lbl">Chirurgie</div>
            </div>
          </div>

          <!-- 2 Action Buttons → déclenchent les MODALS -->
          <div class="cas-actions">
            <button class="cas-btn-add" (click)="openAddForm()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Ajouter un cas
            </button>
            <button class="cas-btn-voir" (click)="openCasListModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Voir détails
              <span class="cas-voir-count">{{ casCases().length }}</span>
            </button>
          </div>

          <!-- Preview tiles (3 derniers cas) -->
          @if (casCases().length > 0) {
            <div class="cas-preview-grid">
              @for (c of casCases().slice(0, 3); track c.id) {
                <div class="cas-preview-tile" (click)="openCasListModal()">
                  @if (c.afterImg || c.beforeImg) {
                    <img [src]="c.afterImg || c.beforeImg" class="cas-preview-img" alt="">
                  } @else {
                    <div class="cas-preview-placeholder">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  }
                  <div class="cas-preview-info">
                    <span class="cas-preview-cat" [style.color]="getCatColor(c.categorie)">{{ c.categorie }}</span>
                    <span class="cas-preview-title">{{ c.titre | slice:0:22 }}{{ c.titre.length > 22 ? '…' : '' }}</span>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="cas-empty-tile">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Aucun cas clinique</p>
              <span>Commencez par en ajouter un</span>
            </div>
          }
        </div>
        <!-- ══ END CAS CLINIQUES CARD ══ -->

      </div>
    }

  </div>

  <!-- ══════════════════════════════════════════════════════════════
       MODAL — AJOUTER / MODIFIER CAS CLINIQUE
  ══════════════════════════════════════════════════════════════ -->
  @if (showCasForm()) {
    <div class="modal-overlay" (click)="closeForm()">
      <div class="modal-box" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="modal-hd">
          <div class="modal-hd-left">
            <div class="modal-hd-ico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                @if (selectedCas()) {
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                } @else {
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                }
              </svg>
            </div>
            <div>
              <div class="modal-eyebrow">Galerie médicale</div>
              <div class="modal-title">{{ selectedCas() ? 'Modifier le cas clinique' : 'Nouveau cas clinique' }}</div>
            </div>
          </div>
          <button class="modal-close" (click)="closeForm()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="modal-form-grid">

            <!-- Titre -->
            <div class="mf-field mf-full">
              <label class="mf-label">Titre du cas <span class="mf-req">*</span></label>
              <input class="mf-input" placeholder="Ex : Implant unitaire maxillaire…" [(ngModel)]="form.titre">
            </div>

            <!-- Description -->
            <div class="mf-field mf-full">
              <label class="mf-label">Description clinique <span class="mf-req">*</span></label>
              <textarea class="mf-textarea" rows="3" placeholder="Observations, diagnostic, historique…" [(ngModel)]="form.description"></textarea>
            </div>

            <!-- Catégorie -->
            <div class="mf-field mf-full">
              <label class="mf-label">Catégorie</label>
              <div class="mf-cat-row">
                @for (cat of categories; track cat.value) {
                  <button class="mf-cat-btn"
                    [class.active]="form.categorie === cat.value"
                    [style.--cc]="cat.color"
                    (click)="form.categorie = cat.value">
                    <span class="mf-cat-dot" [style.background]="cat.color"></span>
                    {{ cat.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Traitement + Durée -->
            <div class="mf-field">
              <label class="mf-label">Traitement</label>
              <input class="mf-input" placeholder="Ex : Implant Nobel Biocare…" [(ngModel)]="form.traitement">
            </div>
            <div class="mf-field">
              <label class="mf-label">Durée</label>
              <input class="mf-input" placeholder="Ex : 6 mois" [(ngModel)]="form.duree">
            </div>

            <!-- Images avant / après -->
            <div class="mf-field mf-full">
              <label class="mf-label">Photos avant / après</label>
              <div class="mf-img-row">
                <div class="mf-img-col">
                  <div class="mf-img-badge before">Avant</div>
                  <label class="mf-img-upload" [class.has-img]="form.beforeImg">
                    @if (form.beforeImg) {
                      <img [src]="form.beforeImg" class="mf-img-preview" alt="Avant">
                      <div class="mf-img-overlay">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Changer
                      </div>
                    } @else {
                      <div class="mf-img-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Ajouter photo</span>
                      </div>
                    }
                    <input type="file" accept="image/*" style="display:none" (change)="onBeforeImage($event)">
                  </label>
                </div>
                <div class="mf-img-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div class="mf-img-col">
                  <div class="mf-img-badge after">Après</div>
                  <label class="mf-img-upload" [class.has-img]="form.afterImg">
                    @if (form.afterImg) {
                      <img [src]="form.afterImg" class="mf-img-preview" alt="Après">
                      <div class="mf-img-overlay">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Changer
                      </div>
                    } @else {
                      <div class="mf-img-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Ajouter photo</span>
                      </div>
                    }
                    <input type="file" accept="image/*" style="display:none" (change)="onAfterImage($event)">
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="modal-ft">
          <button class="mf-btn-cancel" (click)="closeForm()">Annuler</button>
          <button class="mf-btn-save" (click)="saveCas()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ selectedCas() ? 'Enregistrer les modifications' : 'Ajouter le cas' }}
          </button>
        </div>

      </div>
    </div>
  }

  <!-- ══════════════════════════════════════════════════════════════
       MODAL — LISTE CAS CLINIQUES
  ══════════════════════════════════════════════════════════════ -->
  @if (showCasList()) {
    <div class="modal-overlay" (click)="closeCasListModal()">
      <div class="modal-box modal-box-wide" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="modal-hd">
          <div class="modal-hd-left">
            <div class="modal-hd-ico" style="background:rgba(16,185,129,0.15);color:#10b981">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <div class="modal-eyebrow">Galerie médicale</div>
              <div class="modal-title">
                Cas cliniques
                <span class="modal-count">{{ casCases().length }}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:10px;align-items:center">
            <button class="cas-btn-add" style="padding:9px 16px;font-size:12px" (click)="openAddFormFromList()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nouveau
            </button>
            <button class="modal-close" (click)="closeCasListModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          @if (casCases().length === 0) {
            <div class="ml-empty">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Aucun cas clinique enregistré</p>
              <span>Cliquez sur "Nouveau" pour commencer</span>
            </div>
          }

          <div class="ml-grid">
            @for (c of casCases(); track c.id; let i = $index) {
              <div class="ml-card" [style.animation-delay]="(i*0.07)+'s'">

                <!-- Images strip -->
                <div class="ml-card-imgs">
                  <div class="ml-img-wrap">
                    @if (c.beforeImg) {
                      <img [src]="c.beforeImg" class="ml-img" alt="Avant">
                    } @else {
                      <div class="ml-img-ph">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    }
                    <span class="ml-img-lbl">Avant</span>
                  </div>
                  <div class="ml-img-sep">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                  <div class="ml-img-wrap">
                    @if (c.afterImg) {
                      <img [src]="c.afterImg" class="ml-img" alt="Après">
                    } @else {
                      <div class="ml-img-ph">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    }
                    <span class="ml-img-lbl">Après</span>
                  </div>
                </div>

                <!-- Content -->
                <div class="ml-card-body">
                  <div class="ml-card-top">
                    <span class="ml-cat-badge"
                      [style.background]="getCatColor(c.categorie)+'18'"
                      [style.color]="getCatColor(c.categorie)"
                      [style.border-color]="getCatColor(c.categorie)+'40'">
                      <span class="ml-cat-dot" [style.background]="getCatColor(c.categorie)"></span>
                      {{ c.categorie }}
                    </span>
                    @if (c.duree) {
                      <span class="ml-dur">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {{ c.duree }}
                      </span>
                    }
                  </div>
                  <div class="ml-card-title">{{ c.titre }}</div>
                  @if (c.description) {
                    <div class="ml-card-desc">{{ c.description | slice:0:100 }}{{ c.description.length > 100 ? '…' : '' }}</div>
                  }
                  @if (c.traitement) {
                    <div class="ml-card-treat">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
                      </svg>
                      {{ c.traitement }}
                    </div>
                  }
                </div>

                <!-- Actions -->
                <div class="ml-card-actions">
                  <button class="ml-btn-edit" (click)="openEditFromList(c)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                  <button class="ml-btn-del" (click)="deleteCas(c.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  }

</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

    .dash {
      --P:       #1d6ae5; --P2: #1558c9; --P3: #4d8ef0;
      --Pl:      rgba(29,106,229,0.07); --Pl2: rgba(29,106,229,0.13);
      --bg:      #f0f4fc; --bg2: #e6ecf8; --bg3: #ffffff;
      --border:  rgba(29,106,229,0.1); --border2: rgba(29,106,229,0.18);
      --txt:     #0c1b3d; --txt2: #2d3f6b; --txt3: #5a6f9a; --txt4: #8d9fbb;
      --glass-bg: rgba(255,255,255,0.65);
      --glass-border: rgba(255,255,255,0.9);
      --card-shadow: 0 2px 12px rgba(29,106,229,0.08), 0 20px 40px rgba(29,106,229,0.06);
      font-family: 'Outfit', system-ui, sans-serif;
      display: flex; flex-direction: column; gap: 26px;
      min-height: calc(100vh - 48px);
      position: relative;
      animation: dashIn .7s cubic-bezier(0.16,1,0.3,1) both;
    }
    .dash.dark {
      --P: #4d8ef0; --P2: #3374d9; --P3: #6fa3f5;
      --Pl: rgba(77,142,240,0.1); --Pl2: rgba(77,142,240,0.18);
      --bg: #080e1e; --bg2: #0d1628; --bg3: #111f35;
      --border: rgba(77,142,240,0.1); --border2: rgba(77,142,240,0.2);
      --txt: #e8f0ff; --txt2: #b0c4e8; --txt3: #607898; --txt4: #3d5070;
      --glass-bg: rgba(17,31,53,0.75);
      --glass-border: rgba(77,142,240,0.15);
      --card-shadow: 0 4px 24px rgba(0,0,0,0.35);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes dashIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }

    /* AMBIENT */
    .ambient-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
    .orb { position:absolute; border-radius:100%; filter:blur(80px); opacity:0.45; }
    .dash.dark .orb { opacity:0.2; }
    .orb-1 { width:500px; height:500px; top:-100px; left:-80px; background:radial-gradient(circle,#c7d9fc,#93b4f8); animation:orbFloat1 18s ease-in-out infinite; }
    .dash.dark .orb-1 { background:radial-gradient(circle,#1a3a6e,#0d2147); }
    .orb-2 { width:400px; height:400px; bottom:10%; right:-60px; background:radial-gradient(circle,#d4ebff,#a8d4f8); animation:orbFloat2 22s ease-in-out infinite; }
    .dash.dark .orb-2 { background:radial-gradient(circle,#0e2d52,#061826); }
    .orb-3 { width:300px; height:300px; top:45%; left:35%; background:radial-gradient(circle,#e8d5ff,#c4a9f9); animation:orbFloat3 16s ease-in-out infinite; }
    .dash.dark .orb-3 { background:radial-gradient(circle,#1e1045,#110929); }
    @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.95)} }
    @keyframes orbFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,40px)} }
    @keyframes orbFloat3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.08)} }
    .grid-overlay { position:absolute; inset:0; background-image: linear-gradient(rgba(29,106,229,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(29,106,229,0.04) 1px,transparent 1px); background-size:48px 48px; }
    .dash.dark .grid-overlay { background-image: linear-gradient(rgba(77,142,240,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(77,142,240,0.05) 1px,transparent 1px); }

    /* PAGE HEADER */
    .page-hd { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap; position:relative; z-index:1; }
    .page-eyebrow { display:flex; align-items:center; gap:10px; font-size:11px; font-weight:700; color:var(--txt4); text-transform:uppercase; letter-spacing:.09em; margin-bottom:10px; }
    .pulse-ring { position:relative; width:10px; height:10px; }
    .live-pulse { position:absolute; inset:0; border-radius:50%; background:#22c55e; animation:livePulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
    .live-pulse::before { content:''; position:absolute; inset:-5px; border-radius:50%; background:rgba(34,197,94,0.3); animation:livePulse2 2s cubic-bezier(0.4,0,0.6,1) infinite; }
    @keyframes livePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
    @keyframes livePulse2 { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.6);opacity:0} }
    .sep { color:var(--border2); }
    .role-chip { background:var(--Pl2); color:var(--P); padding:2px 10px; border-radius:99px; border:1px solid var(--border2); font-size:10px; }
    .page-title { font-size:34px; font-weight:900; color:var(--txt); letter-spacing:-1.5px; line-height:1.1; margin-bottom:8px; }
    .accent-text { background:linear-gradient(135deg,var(--P) 0%,#6366f1 50%,#8b5cf6 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .wave-emoji { display:inline-block; animation:wave 2.5s ease-in-out infinite; transform-origin:70% 70%; }
    @keyframes wave { 0%,100%{transform:rotate(0)} 15%{transform:rotate(14deg)} 30%{transform:rotate(-8deg)} 45%{transform:rotate(0)} }
    .hd-actions { display:flex; gap:12px; align-items:center; }
    .btn-primary { display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:14px; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif; background:linear-gradient(135deg,var(--P) 0%,#6366f1 100%); color:#fff; text-decoration:none; border:none; cursor:pointer; box-shadow:0 4px 16px rgba(29,106,229,.35); transition:all .3s cubic-bezier(0.34,1.56,0.64,1); }
    .btn-primary:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 24px rgba(29,106,229,.45); }
    .btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:14px; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif; background:var(--glass-bg); color:var(--txt2); text-decoration:none; border:1.5px solid var(--glass-border); backdrop-filter:blur(12px); transition:all .3s cubic-bezier(0.34,1.56,0.64,1); }
    .btn-ghost:hover { color:var(--P); border-color:var(--P); transform:translateY(-2px); }

    /* STAT CARDS */
    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; position:relative; z-index:1; }
    .stats-grid.stats-grid-2 { grid-template-columns:repeat(2,1fr); max-width:620px; }
    .stat-card { position:relative; border-radius:20px; overflow:hidden; animation:statIn .8s cubic-bezier(0.34,1.56,0.64,1) both; transition:transform .4s cubic-bezier(0.34,1.56,0.64,1),box-shadow .4s; cursor:default; }
    @keyframes statIn { from{opacity:0;transform:translateY(28px) scale(0.94)} to{opacity:1;transform:none} }
    .stat-card:hover { transform:translateY(-6px) scale(1.02); }
    .stat-card-glow { position:absolute; inset:-1px; background:linear-gradient(135deg,var(--glass-border),rgba(255,255,255,0.3) 30%,transparent 70%); border-radius:21px; z-index:0; }
    .stat-card-inner { position:relative; z-index:1; background:var(--glass-bg); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1.5px solid var(--glass-border); border-top:3px solid var(--c); border-radius:19px; padding:20px; box-shadow:var(--card-shadow); }
    .stat-card-border { position:absolute; inset:0; border-radius:20px; pointer-events:none; background:linear-gradient(135deg,var(--c) 0%,transparent 40%); opacity:0.06; }
    .stat-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:18px; }
    .stat-ico-wrap { position:relative; width:50px; height:50px; border-radius:14px; background:var(--cb); display:flex; align-items:center; justify-content:center; }
    .stat-ico { color:var(--c); display:flex; }
    .stat-ico ::ng-deep svg { width:22px; height:22px; }
    .stat-ico-ring { position:absolute; inset:-4px; border-radius:18px; border:1.5px solid var(--c); opacity:0.2; animation:icoRing 3s ease-in-out infinite; }
    @keyframes icoRing { 0%,100%{transform:scale(1);opacity:0.2} 50%{transform:scale(1.08);opacity:0} }
    .stat-trend { font-size:11px; font-weight:700; padding:5px 11px; border-radius:99px; display:flex; align-items:center; gap:4px; }
    .stat-trend.up { background:rgba(16,185,129,.12); color:#059669; }
    .stat-trend.dn { background:rgba(239,68,68,.1); color:#dc2626; }
    .trend-arrow { font-size:14px; }
    .stat-val-wrap { margin-bottom:16px; }
    .stat-val { font-size:40px; font-weight:900; color:var(--c); letter-spacing:-2px; line-height:1; margin-bottom:4px; }
    .stat-lbl { font-size:11px; color:var(--txt4); font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
    .stat-progress-track { height:6px; background:var(--border); border-radius:99px; overflow:hidden; margin-bottom:6px; }
    .stat-progress-fill { height:100%; background:linear-gradient(90deg,var(--c) 0%,color-mix(in srgb,var(--c) 60%,white) 100%); border-radius:99px; position:relative; overflow:hidden; }
    .fill-shimmer { position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent); animation:shimmer 2.5s ease-in-out infinite; }
    @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
    .stat-progress-meta { display:flex; justify-content:space-between; font-size:10px; color:var(--txt4); font-weight:600; }
    .stat-pct { color:var(--c); font-weight:800; }

    /* GRID */
    .tri-grid { display:grid; grid-template-columns:1fr 340px 300px; gap:20px; align-items:start; position:relative; z-index:1; }
    .tri-grid.tri-grid-secretary { grid-template-columns:1fr 340px 280px; }
    .col-left, .col-mid, .col-right { display:flex; flex-direction:column; gap:20px; }

    /* GLASS CARD */
    .glass-card { background:var(--glass-bg); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1.5px solid var(--glass-border); border-radius:20px; overflow:hidden; box-shadow:var(--card-shadow); transition:transform .35s cubic-bezier(0.34,1.56,0.64,1),box-shadow .35s; }
    .glass-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(29,106,229,0.14),0 1px 1px rgba(255,255,255,0.8); }
    .dash.dark .glass-card:hover { box-shadow:0 12px 40px rgba(0,0,0,0.45); }

    /* CARD HEADER */
    .card-hd { display:flex; align-items:center; justify-content:space-between; padding:18px 20px 14px; border-bottom:1px solid var(--border); }
    .card-hd-left { display:flex; align-items:center; gap:12px; }
    .card-icon { width:36px; height:36px; border-radius:10px; background:var(--Pl2); color:var(--P); display:flex; align-items:center; justify-content:center; }
    .chart-ico { background:rgba(245,158,11,0.14); color:#f59e0b; }
    .presc-ico { background:rgba(139,92,246,0.14); color:#8b5cf6; }
    .cas-ico { background:rgba(139,92,246,0.14); color:#8b5cf6; }
    .card-eye { font-size:9.5px; color:var(--txt4); font-weight:700; text-transform:uppercase; letter-spacing:.1em; margin-bottom:2px; }
    .card-title { font-size:14.5px; font-weight:800; color:var(--txt); letter-spacing:-.3px; }
    .pill-link { display:flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700; color:var(--P); text-decoration:none; padding:5px 13px; border-radius:99px; background:var(--Pl); border:1px solid var(--border2); transition:all .25s; white-space:nowrap; }
    .pill-link:hover { background:var(--Pl2); transform:translateX(2px); }

    /* RDV LIST */
    .rdv-list { padding:8px 14px 14px; display:flex; flex-direction:column; gap:4px; }
    .rdv-item { display:flex; align-items:center; gap:11px; padding:11px 12px; border-radius:14px; transition:all .25s cubic-bezier(0.34,1.56,0.64,1); animation:rdvIn .5s cubic-bezier(0.34,1.56,0.64,1) both; border:1px solid transparent; cursor:pointer; }
    @keyframes rdvIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
    .rdv-item:hover { background:var(--Pl); border-color:var(--border2); transform:translateX(5px); }
    .rdv-time-col { min-width:44px; text-align:center; flex-shrink:0; }
    .rdv-time { font-size:13px; font-weight:800; color:var(--P); letter-spacing:-.3px; }
    .rdv-ampm { font-size:9px; color:var(--txt4); font-weight:700; text-transform:uppercase; }
    .rdv-timeline { display:flex; flex-direction:column; align-items:center; height:100%; min-height:44px; flex-shrink:0; }
    .rdv-dot-wrap { position:relative; }
    .rdv-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; margin-bottom:4px; position:relative; z-index:1; }
    .dot-pulse { position:absolute; inset:-5px; border-radius:50%; animation:dotP 2.2s cubic-bezier(0.4,0,0.6,1) infinite; }
    @keyframes dotP { 0%,100%{box-shadow:0 0 0 0 currentColor;opacity:.8} 50%{box-shadow:0 0 0 7px currentColor;opacity:0} }
    .dot-confirmed { background:#22c55e; color:rgba(34,197,94,0.25); }
    .dot-done { background:#6366f1; color:rgba(99,102,241,0.25); }
    .dot-pending { background:#f59e0b; color:rgba(245,158,11,0.25); }
    .dot-cancelled { background:#ef4444; color:rgba(239,68,68,0.25); }
    .rdv-vline { flex:1; width:1.5px; background:linear-gradient(180deg,var(--border2),transparent); }
    .rdv-av { width:38px; height:38px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:white; box-shadow:0 3px 10px rgba(0,0,0,0.15); }
    .rdv-body { flex:1; min-width:0; }
    .rdv-name { font-size:13px; font-weight:700; color:var(--txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:3px; }
    .rdv-meta { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
    .rdv-tag { font-size:10px; color:var(--P); background:var(--Pl); padding:2px 8px; border-radius:6px; font-weight:600; }
    .rdv-ph { font-size:10px; color:var(--txt4); display:flex; align-items:center; gap:3px; }

    /* EMPTY */
    .empty-st { display:flex; flex-direction:column; align-items:center; gap:12px; padding:40px 20px; text-align:center; }
    .empty-ico { width:52px; height:52px; border-radius:15px; background:var(--Pl); display:flex; align-items:center; justify-content:center; color:var(--P); }
    .empty-title { font-size:13.5px; font-weight:700; color:var(--txt2); }
    .empty-sub { font-size:12px; color:var(--txt4); }

    /* BADGES */
    .badge { display:inline-block; font-size:10px; font-weight:700; padding:3px 10px; border-radius:99px; white-space:nowrap; border:1px solid; letter-spacing:.02em; }
    .badge-confirmed { background:rgba(16,185,129,.1); color:#059669; border-color:rgba(16,185,129,.25); }
    .badge-pending { background:rgba(245,158,11,.1); color:#d97706; border-color:rgba(245,158,11,.25); }
    .badge-done { background:rgba(99,102,241,.1); color:#6366f1; border-color:rgba(99,102,241,.25); }
    .badge-cancelled { background:rgba(239,68,68,.08); color:#dc2626; border-color:rgba(239,68,68,.2); }

    /* CHART */
    .chart-summary { text-align:right; }
    .chart-total { font-size:26px; font-weight:900; color:var(--P); letter-spacing:-1px; }
    .chart-total-lbl { font-size:10px; color:var(--txt4); font-weight:600; margin-top:2px; }
    .activity-mini-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; padding:14px 18px; border-bottom:1px solid var(--border); }
    .ms-item { display:flex; flex-direction:column; gap:8px; padding:12px; border-radius:12px; background:rgba(29,106,229,0.04); border:1px solid var(--border); transition:all .2s; }
    .ms-item:hover { background:var(--Pl); transform:translateY(-2px); }
    .ms-dot { width:8px; height:8px; border-radius:50%; }
    .ms-content { flex:1; }
    .ms-val { font-size:22px; font-weight:900; color:var(--txt); letter-spacing:-.5px; margin-bottom:1px; }
    .ms-lbl { font-size:9.5px; color:var(--txt4); font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
    .ms-btn { font-size:10px; font-weight:700; padding:5px 10px; border-radius:99px; border:none; cursor:pointer; background:var(--btn-c); color:white; transition:all .2s; }
    .ms-btn:hover { filter:brightness(1.1); transform:translateY(-1px); }
    .week-chart { display:flex; gap:8px; align-items:flex-end; height:130px; padding:10px 18px 18px; }
    .wday-col { flex:1; display:flex; flex-direction:column; align-items:center; height:100%; }
    .wbar-area { flex:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; position:relative; }
    .wbar-tooltip { position:absolute; top:-34px; left:50%; transform:translateX(-50%) scale(0.8); background:var(--txt); color:var(--bg3); padding:4px 9px; border-radius:8px; font-size:9.5px; font-weight:700; white-space:nowrap; opacity:0; pointer-events:none; transition:all .2s cubic-bezier(0.34,1.56,0.64,1); }
    .wday-col:hover .wbar-tooltip { opacity:1; transform:translateX(-50%) scale(1); }
    .wbar { width:82%; border-radius:8px 8px 3px 3px; min-height:6px; background:linear-gradient(180deg,var(--P3),var(--P)); animation:barGrow 1.2s cubic-bezier(0.34,1.56,0.64,1) both; transition:all .3s; position:relative; overflow:hidden; }
    @keyframes barGrow { from{height:0!important;transform-origin:bottom} }
    .wbar-shine { position:absolute; inset:0; background:linear-gradient(180deg,rgba(255,255,255,0.35),transparent); }
    .wbar.today { background:linear-gradient(180deg,#fbbf24,#f59e0b)!important; }
    .wday-lbl { font-size:9.5px; color:var(--txt4); margin-top:7px; font-weight:700; }
    .wday-lbl.today { color:var(--P); font-weight:900; }

    /* TABLE */
    .tbl-filters { display:flex; gap:6px; }
    .filter-btn { font-size:11px; font-weight:700; padding:6px 13px; border-radius:8px; background:var(--Pl); border:1px solid var(--border); color:var(--txt3); cursor:pointer; transition:all .2s; font-family:'Outfit',sans-serif; }
    .filter-btn.active { background:var(--P); color:white; border-color:var(--P); }
    .tbl-wrap { overflow-x:auto; }
    .tbl { width:100%; border-collapse:collapse; font-size:13px; font-family:'Outfit',sans-serif; }
    .tbl thead th { padding:11px 16px; text-align:left; font-size:10px; font-weight:700; color:var(--txt4); text-transform:uppercase; letter-spacing:.08em; background:rgba(29,106,229,0.04); border-bottom:1px solid var(--border); }
    .tbl tbody tr { border-bottom:1px solid var(--border); transition:all .25s; animation:rowIn .4s cubic-bezier(0.34,1.56,0.64,1) both; }
    @keyframes rowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
    .tbl tbody tr:hover { background:var(--Pl); }
    .tbl td { padding:13px 16px; color:var(--txt2); }
    .tbl-patient { display:flex; align-items:center; gap:9px; }
    .tbl-av { width:30px; height:30px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; color:white; flex-shrink:0; }
    .tbl-name { font-weight:700; color:var(--txt); }
    .muted { color:var(--txt4); font-size:12.5px; }

    /* CALENDAR */
    .cal-body { padding:0 14px 14px; }
    .cal-nav { display:flex; align-items:center; gap:6px; }
    .cal-btn { height:30px; padding:0 10px; border-radius:9px; border:1px solid var(--border); background:var(--glass-bg); backdrop-filter:blur(8px); color:var(--txt3); cursor:pointer; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:4px; transition:all .2s; font-family:'Outfit',sans-serif; }
    .cal-btn:hover { background:var(--Pl2); color:var(--P); border-color:var(--P); }
    .cal-today-btn { padding:0 12px; }
    .cal-wdays { display:grid; grid-template-columns:repeat(7,1fr); margin-bottom:4px; padding-top:10px; }
    .cal-wday { text-align:center; font-size:9px; font-weight:800; color:var(--txt4); text-transform:uppercase; letter-spacing:.07em; padding:5px 0; }
    .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
    .cal-cell { position:relative; border-radius:10px; padding:7px 4px 6px; min-height:46px; cursor:pointer; transition:all .2s cubic-bezier(0.34,1.56,0.64,1); display:flex; flex-direction:column; align-items:center; border:1.5px solid transparent; }
    .cal-cell:hover { background:var(--Pl2); border-color:var(--border2); transform:scale(1.06); }
    .cal-cell.other { opacity:.25; pointer-events:none; }
    .cal-num { font-size:11.5px; font-weight:600; color:var(--txt2); line-height:1; margin-bottom:4px; }
    .cal-cell.is-today .cal-num { background:linear-gradient(135deg,var(--P),#6366f1); color:white; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:10.5px; }
    .cal-cell.selected { background:var(--Pl2); border-color:var(--P); }
    .cal-dots { display:flex; gap:2px; flex-wrap:wrap; justify-content:center; }
    .cal-dot { width:5px; height:5px; border-radius:50%; }
    .cal-count { position:absolute; top:3px; right:3px; font-size:8px; font-weight:800; color:white; background:var(--P); border-radius:99px; padding:1px 4px; }
    .cal-detail { border-top:1px solid var(--border); padding:14px 16px; display:flex; flex-direction:column; gap:8px; animation:detailIn .3s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes detailIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
    .cal-det-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
    .cal-det-title { font-size:12.5px; font-weight:800; color:var(--txt); }
    .det-chip { font-size:10px; font-weight:700; color:var(--P); background:var(--Pl); padding:3px 9px; border-radius:99px; border:1px solid var(--border2); }
    .cal-det-row { display:flex; align-items:center; gap:9px; padding:9px 11px; border-radius:11px; background:var(--Pl); border:1px solid var(--border); transition:all .2s; }
    .cal-det-row:hover { background:var(--Pl2); transform:translateX(4px); }
    .cal-det-time { font-size:11px; font-weight:800; color:var(--P); min-width:38px; }
    .cal-det-av { width:26px; height:26px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:800; color:white; flex-shrink:0; }
    .cal-det-info { flex:1; }
    .cal-det-name { font-size:11.5px; font-weight:700; color:var(--txt); }
    .cal-det-type { font-size:10px; color:var(--txt4); margin-top:1px; }
    .cal-empty { padding:14px 16px; display:flex; align-items:center; gap:7px; color:var(--txt4); font-size:12px; border-top:1px solid var(--border); }

    /* ORDONNANCES */
    .ord-list { padding-bottom:4px; }
    .ord-row { display:flex; align-items:center; gap:11px; padding:12px 18px; border-bottom:1px solid var(--border); cursor:pointer; transition:all .25s; }
    .ord-row:hover { background:var(--Pl); transform:translateX(5px); }
    .ord-ico { width:34px; height:34px; border-radius:10px; background:rgba(139,92,246,0.1); display:flex; align-items:center; justify-content:center; color:#8b5cf6; flex-shrink:0; }
    .ord-name { font-size:13px; font-weight:700; color:var(--txt); }
    .ord-meta { font-size:10.5px; color:var(--txt4); margin-top:2px; display:flex; align-items:center; gap:5px; }
    .ord-body { flex:1; }

    /* DOCTOR CARD */
    .doctor-card { overflow:hidden; }
    .doc-banner { height:110px; position:relative; overflow:hidden; background:linear-gradient(135deg,var(--P) 0%,#2f6ec6 60%,#6366f1 100%); }
    .doc-banner-mesh { position:absolute; inset:0; background-image: radial-gradient(circle at 20% 50%,rgba(255,255,255,0.15) 0%,transparent 50%), radial-gradient(circle at 80% 20%,rgba(255,255,255,0.1) 0%,transparent 40%); }
    .doc-ecg-line { position:absolute; bottom:0; left:0; right:0; height:50px; opacity:0.6; }
    .ecg-path { stroke-dasharray:1000; stroke-dashoffset:1000; animation:ecgDraw 3s ease forwards; }
    @keyframes ecgDraw { to{stroke-dashoffset:0} }
    .doc-profile { display:flex; flex-direction:column; align-items:center; padding:0 18px 18px; margin-top:-34px; text-align:center; }
    .doc-avatar-wrap { position:relative; margin-bottom:10px; }
    .doc-avatar { width:68px; height:68px; border-radius:18px; background:linear-gradient(135deg,var(--P),#6366f1); border:3px solid var(--bg3); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; color:white; box-shadow:0 8px 24px rgba(29,106,229,0.35); position:relative; z-index:1; }
    .doc-av-badge { position:absolute; bottom:-3px; right:-3px; width:20px; height:20px; border-radius:50%; background:#10b981; border:2.5px solid var(--bg3); display:flex; align-items:center; justify-content:center; color:white; }
    .doc-name { font-size:15px; font-weight:900; color:var(--txt); letter-spacing:-.4px; margin-bottom:2px; }
    .doc-spec { font-size:11px; color:var(--txt4); font-weight:500; }
    .doc-stats { display:grid; grid-template-columns:1fr 1fr; gap:0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); margin:0 18px 18px; }
    .doc-stat { padding:13px 8px; text-align:center; border-right:1px solid var(--border); }
    .doc-stat:nth-child(even) { border-right:none; }
    .doc-stat-val { font-size:20px; font-weight:900; color:var(--P); letter-spacing:-.8px; }
    .doc-stat-lbl { font-size:9.5px; color:var(--txt4); font-weight:700; margin-top:2px; text-transform:uppercase; letter-spacing:.04em; }
    .doc-limit { padding:0 18px 16px; }
    .doc-limit-hd { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .doc-limit-lbl { font-size:11px; font-weight:700; color:var(--txt2); }
    .doc-limit-val { font-size:11px; font-weight:800; color:var(--P); }
    .doc-limit-track { height:7px; background:var(--border); border-radius:99px; overflow:hidden; margin-bottom:5px; }
    .doc-limit-fill { height:100%; background:linear-gradient(90deg,var(--P),#6366f1); border-radius:99px; position:relative; overflow:hidden; }
    .doc-limit-meta { display:flex; justify-content:space-between; font-size:10px; color:var(--txt4); font-weight:600; }
    .doc-limit-pct { color:var(--P); font-weight:800; }
    .doc-extra-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:0 18px 16px; border-bottom:1px solid var(--border); }
    .doc-extra-item { display:flex; align-items:center; gap:9px; }
    .doc-extra-ico-wrap { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:color-mix(in srgb,var(--ec) 12%,transparent); }
    .doc-extra-sign { font-size:18px; font-weight:900; color:var(--ec); }
    .doc-extra-val { font-size:14px; font-weight:900; color:var(--txt); letter-spacing:-.5px; }
    .doc-extra-lbl { font-size:10px; color:var(--txt4); font-weight:500; }
    .doc-donut-wrap { padding:18px; display:flex; align-items:center; gap:18px; }
    .doc-donut { position:relative; flex-shrink:0; }
    .donut-arc { animation:donutDraw 1.8s cubic-bezier(0.34,1.56,0.64,1) both; }
    @keyframes donutDraw { from{stroke-dashoffset:301.6} }
    .doc-donut-inner { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
    .doc-donut-val { font-size:17px; font-weight:900; color:var(--txt); letter-spacing:-1px; }
    .doc-donut-lbl { font-size:9px; color:var(--txt4); font-weight:700; text-transform:uppercase; }
    .doc-donut-legend { display:flex; flex-direction:column; gap:12px; }
    .legend-item { display:flex; align-items:center; gap:10px; }
    .legend-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
    .legend-lbl { font-size:10.5px; color:var(--txt4); }
    .legend-val { font-size:14px; font-weight:800; color:var(--txt); }

    /* QUICK ACTIONS */
    .quick-actions { padding:8px 14px 14px; display:flex; flex-direction:column; gap:5px; }
    .qa-item { display:flex; align-items:center; gap:11px; padding:11px 12px; border-radius:13px; text-decoration:none; cursor:pointer; transition:all .25s cubic-bezier(0.34,1.56,0.64,1); border:1px solid transparent; animation:qaIn .5s cubic-bezier(0.34,1.56,0.64,1) both; }
    @keyframes qaIn { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:none} }
    .qa-item:hover { background:var(--qcb); border-color:color-mix(in srgb,var(--qc) 25%,transparent); transform:translateX(6px); }
    .qa-ico-wrap { width:38px; height:38px; border-radius:11px; flex-shrink:0; background:var(--qcb); display:flex; align-items:center; justify-content:center; }
    .qa-ico { color:var(--qc); display:flex; }
    .qa-ico ::ng-deep svg { width:15px; height:15px; }
    .qa-content { flex:1; }
    .qa-label { font-size:13px; font-weight:700; color:var(--txt); margin-bottom:1px; }
    .qa-sub { font-size:10.5px; color:var(--txt4); }
    .qa-arrow { color:var(--txt4); flex-shrink:0; transition:all .25s; }
    .qa-item:hover .qa-arrow { transform:translateX(4px); color:var(--qc); }

    /* CHECK-IN */
    .checkin-btn { font-size:11px; font-weight:700; padding:6px 13px; border-radius:99px; border:1.5px solid var(--border); background:var(--glass-bg); color:var(--txt3); cursor:pointer; transition:all .2s; white-space:nowrap; font-family:'Outfit',sans-serif; }
    .checkin-btn:hover { background:rgba(16,185,129,0.1); border-color:#10b981; color:#059669; }
    .checkin-btn.checked { background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.3); color:#059669; }

    /* ══════════════════════════════════════════════════
       CAS CLINIQUES — Tile dans la carte dashboard
    ══════════════════════════════════════════════════ */
    .cas-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:0; border-bottom:1px solid var(--border); }
    .cas-stat-item { padding:12px 8px; text-align:center; }
    .cas-stat-divider { width:1px; background:var(--border); margin:10px 0; }
    .cas-stat-num { font-size:22px; font-weight:900; color:var(--txt); letter-spacing:-1px; line-height:1; margin-bottom:3px; }
    .cas-stat-lbl { font-size:9px; color:var(--txt4); font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
    .cas-paro { color:#1b7fc4; }
    .cas-impl { color:#17a2b8; }
    .cas-chir { color:#155f9a; }

    .cas-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:14px 16px; border-bottom:1px solid var(--border); }
    .cas-btn-add { display:flex; align-items:center; justify-content:center; gap:7px; padding:11px 14px; border-radius:13px; font-size:12.5px; font-weight:700; font-family:'Outfit',sans-serif; background:linear-gradient(135deg,#8b5cf6,#6366f1); color:white; border:none; cursor:pointer; box-shadow:0 4px 14px rgba(139,92,246,0.35); transition:all .3s cubic-bezier(0.34,1.56,0.64,1); }
    .cas-btn-add:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(139,92,246,0.45); }
    .cas-btn-voir { display:flex; align-items:center; justify-content:center; gap:7px; padding:11px 14px; border-radius:13px; font-size:12.5px; font-weight:700; font-family:'Outfit',sans-serif; background:var(--Pl); color:var(--P); border:1.5px solid var(--border2); cursor:pointer; transition:all .3s cubic-bezier(0.34,1.56,0.64,1); }
    .cas-btn-voir:hover { background:var(--Pl2); transform:translateY(-2px); }
    .cas-voir-count { background:var(--P); color:white; font-size:10px; font-weight:800; padding:1px 7px; border-radius:99px; min-width:20px; text-align:center; }

    .cas-preview-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding:12px 14px 14px; }
    .cas-preview-tile { border-radius:12px; overflow:hidden; border:1.5px solid var(--border); cursor:pointer; transition:all .25s cubic-bezier(0.34,1.56,0.64,1); background:var(--bg2); }
    .cas-preview-tile:hover { transform:translateY(-3px) scale(1.03); border-color:var(--border2); box-shadow:0 8px 20px rgba(29,106,229,0.1); }
    .cas-preview-img { width:100%; aspect-ratio:4/3; object-fit:cover; display:block; }
    .cas-preview-placeholder { aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; color:var(--txt4); background:var(--Pl); }
    .cas-preview-info { padding:7px 8px; }
    .cas-preview-cat { display:block; font-size:8.5px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin-bottom:2px; }
    .cas-preview-title { display:block; font-size:10.5px; font-weight:700; color:var(--txt); line-height:1.3; }

    .cas-empty-tile { padding:28px 16px; display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center; color:var(--txt4); }
    .cas-empty-tile p { font-size:13px; font-weight:700; color:var(--txt3); }
    .cas-empty-tile span { font-size:11px; }

    /* ══════════════════════════════════════════════════
       MODAL OVERLAY — Base
    ══════════════════════════════════════════════════ */
    .modal-overlay {
      position:fixed; inset:0; z-index:9999;
      background:rgba(8,14,30,0.7);
      backdrop-filter:blur(10px) saturate(140%);
      -webkit-backdrop-filter:blur(10px) saturate(140%);
      display:flex; align-items:center; justify-content:center;
      padding:20px;
      animation:overlayIn .25s ease both;
    }
    @keyframes overlayIn { from{opacity:0} to{opacity:1} }

    .modal-box {
      background:var(--bg3);
      border:1.5px solid var(--glass-border);
      border-radius:24px;
      width:100%; max-width:580px;
      max-height:90vh;
      display:flex; flex-direction:column;
      box-shadow:0 40px 100px rgba(0,0,0,0.28), 0 8px 24px rgba(29,106,229,0.1);
      animation:modalIn .38s cubic-bezier(0.34,1.56,0.64,1) both;
      overflow:hidden;
    }
    .modal-box-wide { max-width:860px; }
    @keyframes modalIn { from{opacity:0;transform:scale(0.86) translateY(28px)} to{opacity:1;transform:none} }

    /* Modal header */
    .modal-hd {
      display:flex; align-items:center; justify-content:space-between;
      padding:20px 24px 18px;
      border-bottom:1px solid var(--border);
      background:linear-gradient(135deg,rgba(139,92,246,0.06),rgba(29,106,229,0.04));
      flex-shrink:0;
    }
    .modal-hd-left { display:flex; align-items:center; gap:14px; }
    .modal-hd-ico {
      width:44px; height:44px; border-radius:14px;
      background:rgba(139,92,246,0.14); color:#8b5cf6;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
      box-shadow:0 4px 16px rgba(139,92,246,0.2);
    }
    .modal-eyebrow { font-size:10px; font-weight:700; color:var(--txt4); text-transform:uppercase; letter-spacing:.09em; margin-bottom:3px; }
    .modal-title { font-size:17px; font-weight:900; color:var(--txt); letter-spacing:-.5px; display:flex; align-items:center; gap:10px; }
    .modal-count { font-size:12px; font-weight:800; padding:2px 10px; border-radius:99px; background:var(--Pl2); color:var(--P); border:1px solid var(--border2); }
    .modal-close {
      width:36px; height:36px; border-radius:11px;
      background:var(--Pl); border:1.5px solid var(--border);
      color:var(--txt4); cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:all .25s; flex-shrink:0;
    }
    .modal-close:hover { background:rgba(239,68,68,0.1); color:#ef4444; border-color:rgba(239,68,68,0.3); transform:rotate(90deg) scale(1.05); }

    /* Modal body */
    .modal-body { flex:1; overflow-y:auto; padding:22px 24px; }
    .modal-body::-webkit-scrollbar { width:5px; }
    .modal-body::-webkit-scrollbar-track { background:transparent; }
    .modal-body::-webkit-scrollbar-thumb { background:var(--border2); border-radius:99px; }

    /* Modal footer */
    .modal-ft {
      display:flex; gap:10px; padding:16px 24px;
      border-top:1px solid var(--border);
      background:rgba(29,106,229,0.025);
      flex-shrink:0;
    }

    /* ══════════════════════════════════════════════════
       FORM FIELDS (inside modal)
    ══════════════════════════════════════════════════ */
    .modal-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .mf-full { grid-column:1 / -1; }
    .mf-field { display:flex; flex-direction:column; gap:6px; }
    .mf-label { font-size:11px; font-weight:700; color:var(--txt3); text-transform:uppercase; letter-spacing:.07em; }
    .mf-req { color:#ef4444; }
    .mf-input {
      padding:11px 14px; border-radius:12px;
      background:var(--glass-bg); border:1.5px solid var(--border);
      color:var(--txt); font-size:13.5px; font-family:'Outfit',sans-serif;
      outline:none; transition:all .2s;
    }
    .mf-input:focus { border-color:#8b5cf6; box-shadow:0 0 0 3px rgba(139,92,246,0.13); }
    .mf-textarea {
      padding:11px 14px; border-radius:12px;
      background:var(--glass-bg); border:1.5px solid var(--border);
      color:var(--txt); font-size:13.5px; font-family:'Outfit',sans-serif;
      resize:vertical; min-height:85px; outline:none; transition:all .2s;
    }
    .mf-textarea:focus { border-color:#8b5cf6; box-shadow:0 0 0 3px rgba(139,92,246,0.13); }

    /* Category buttons */
    .mf-cat-row { display:flex; gap:8px; flex-wrap:wrap; }
    .mf-cat-btn {
      display:flex; align-items:center; gap:6px;
      padding:8px 16px; border-radius:99px; font-size:12px; font-weight:700;
      font-family:'Outfit',sans-serif; cursor:pointer;
      border:1.5px solid var(--border); background:var(--Pl); color:var(--txt3);
      transition:all .25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .mf-cat-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
    .mf-cat-btn.active {
      background:color-mix(in srgb,var(--cc) 14%,transparent);
      color:var(--cc); border-color:color-mix(in srgb,var(--cc) 50%,transparent);
      box-shadow:0 0 0 3px color-mix(in srgb,var(--cc) 10%,transparent);
      transform:scale(1.04);
    }

    /* Image upload */
    .mf-img-row { display:flex; align-items:center; gap:14px; }
    .mf-img-col { flex:1; display:flex; flex-direction:column; gap:7px; }
    .mf-img-badge {
      display:inline-block; font-size:9.5px; font-weight:800; text-transform:uppercase; letter-spacing:.07em;
      padding:3px 10px; border-radius:99px; width:fit-content;
    }
    .mf-img-badge.before { background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.25); }
    .mf-img-badge.after  { background:rgba(16,185,129,0.1); color:#10b981; border:1px solid rgba(16,185,129,0.25); }
    .mf-img-arrow { color:var(--txt4); flex-shrink:0; }
    .mf-img-upload {
      display:block; border-radius:14px; border:2px dashed var(--border2);
      cursor:pointer; overflow:hidden; position:relative;
      aspect-ratio:4/3; transition:all .3s cubic-bezier(0.34,1.56,0.64,1);
      background:var(--Pl);
    }
    .mf-img-upload:hover { border-color:#8b5cf6; transform:scale(1.02); }
    .mf-img-upload.has-img { border-style:solid; border-color:var(--border); }
    .mf-img-placeholder {
      position:absolute; inset:0;
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
      color:var(--txt4); font-size:11px; font-weight:600;
    }
    .mf-img-preview { width:100%; height:100%; object-fit:cover; display:block; }
    .mf-img-overlay {
      position:absolute; inset:0; background:rgba(0,0,0,0.5);
      display:flex; align-items:center; justify-content:center; gap:6px;
      color:white; font-size:12px; font-weight:700; opacity:0; transition:opacity .2s;
    }
    .mf-img-upload:hover .mf-img-overlay { opacity:1; }

    /* Footer buttons */
    .mf-btn-cancel {
      flex:1; padding:12px; border-radius:13px; font-size:13px; font-weight:700;
      font-family:'Outfit',sans-serif; background:var(--Pl); color:var(--txt3);
      border:1.5px solid var(--border); cursor:pointer; transition:all .2s;
    }
    .mf-btn-cancel:hover { border-color:var(--border2); color:var(--txt); }
    .mf-btn-save {
      flex:2; display:flex; align-items:center; justify-content:center; gap:8px;
      padding:12px; border-radius:13px; font-size:13px; font-weight:800;
      font-family:'Outfit',sans-serif;
      background:linear-gradient(135deg,#8b5cf6,#6366f1);
      color:white; border:none; cursor:pointer;
      box-shadow:0 6px 20px rgba(139,92,246,0.35);
      transition:all .3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .mf-btn-save:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(139,92,246,0.45); }

    /* ══════════════════════════════════════════════════
       MODAL LIST — Cards grid
    ══════════════════════════════════════════════════ */
    .ml-empty {
      display:flex; flex-direction:column; align-items:center; gap:12px;
      padding:56px 20px; text-align:center; color:var(--txt4);
    }
    .ml-empty p { font-size:14.5px; font-weight:700; color:var(--txt2); }
    .ml-empty span { font-size:12px; }

    .ml-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:16px; }

    .ml-card {
      background:var(--glass-bg);
      border:1.5px solid var(--glass-border);
      border-radius:18px; overflow:hidden;
      animation:mlCardIn .45s cubic-bezier(0.34,1.56,0.64,1) both;
      transition:transform .3s cubic-bezier(0.34,1.56,0.64,1),box-shadow .3s;
      display:flex; flex-direction:column;
    }
    .ml-card:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(29,106,229,0.13); }
    @keyframes mlCardIn { from{opacity:0;transform:translateY(22px) scale(0.94)} to{opacity:1;transform:none} }

    .ml-card-imgs {
      display:flex; align-items:center;
      background:var(--bg2); padding:10px 10px 8px; gap:6px;
    }
    .ml-img-wrap {
      flex:1; position:relative; border-radius:10px; overflow:hidden;
      aspect-ratio:4/3; border:1px solid var(--border);
    }
    .ml-img { width:100%; height:100%; object-fit:cover; display:block; }
    .ml-img-ph {
      width:100%; height:100%; background:var(--Pl);
      display:flex; align-items:center; justify-content:center; color:var(--txt4);
    }
    .ml-img-lbl {
      position:absolute; bottom:3px; left:50%; transform:translateX(-50%);
      font-size:7px; font-weight:800; color:white; text-transform:uppercase; letter-spacing:.05em;
      background:rgba(0,0,0,0.5); padding:1px 5px; border-radius:4px; white-space:nowrap;
    }
    .ml-img-sep { color:var(--txt4); flex-shrink:0; }

    .ml-card-body { padding:13px 14px; flex:1; }
    .ml-card-top { display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:8px; }
    .ml-cat-badge {
      display:flex; align-items:center; gap:5px;
      font-size:10px; font-weight:700; padding:3px 9px; border-radius:99px;
      border:1px solid; text-transform:capitalize;
    }
    .ml-cat-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
    .ml-dur { display:flex; align-items:center; gap:4px; font-size:10px; color:var(--txt4); font-weight:600; }
    .ml-card-title { font-size:13.5px; font-weight:800; color:var(--txt); margin-bottom:6px; line-height:1.3; }
    .ml-card-desc { font-size:11.5px; color:var(--txt3); line-height:1.5; margin-bottom:8px; }
    .ml-card-treat { display:flex; align-items:center; gap:5px; font-size:10.5px; color:var(--txt4); font-style:italic; }

    .ml-card-actions { display:flex; border-top:1px solid var(--border); }
    .ml-btn-edit, .ml-btn-del {
      flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
      padding:11px 8px; font-size:12px; font-weight:700;
      font-family:'Outfit',sans-serif; border:none; cursor:pointer;
      transition:all .2s; background:transparent;
    }
    .ml-btn-edit { color:#3b82f6; border-right:1px solid var(--border); }
    .ml-btn-edit:hover { background:rgba(59,130,246,0.08); }
    .ml-btn-del { color:#ef4444; }
    .ml-btn-del:hover { background:rgba(239,68,68,0.08); }

    /* RESPONSIVE */
    @media (max-width:1400px) { .tri-grid { grid-template-columns:1fr 330px; } .col-right { display:none; } }
    @media (max-width:1100px) { .tri-grid { grid-template-columns:1fr; } .col-mid { display:none; } }
    @media (max-width:768px) {
      .stats-grid { grid-template-columns:1fr 1fr; }
      .stats-grid.stats-grid-2 { grid-template-columns:1fr 1fr; }
      .page-title { font-size:26px; }
      .hd-actions { width:100%; }
      .btn-primary, .btn-ghost { flex:1; justify-content:center; }
      .modal-box { border-radius:18px; }
      .modal-form-grid { grid-template-columns:1fr; }
      .mf-full { grid-column:1; }
      .ml-grid { grid-template-columns:1fr 1fr; }
    }
    @media (max-width:500px) {
      .stats-grid { grid-template-columns:1fr; }
      .hd-actions { flex-direction:column; }
      .ml-grid { grid-template-columns:1fr; }
      .modal-overlay { padding:10px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  rdvSvc = inject(RdvService);
  dossier = inject(DossierService);
  theme = inject(ThemeService);
  casSvc = inject(CasCliniquesService);

  constructor(private sanitizer: DomSanitizer) {}

  // ══ CAS CLINIQUES STATE ══
  showCasForm = signal(false);
  showCasList = signal(false);
  selectedCas = signal<any>(null);

  readonly categories = [
    { value: 'parodontologie', label: 'Parodontologie', color: '#1b7fc4' },
    { value: 'implantologie', label: 'Implantologie', color: '#17a2b8' },
    { value: 'chirurgie', label: 'Chirurgie', color: '#155f9a' },
  ] as const;

  form = {
    titre: '',
    description: '',
    categorie: 'parodontologie' as 'parodontologie' | 'implantologie' | 'chirurgie',
    traitement: '',
    duree: '',
    beforeImg: '',
    afterImg: '',
    tags: [] as string[]
  };

  readonly casCases = computed(() => this.casSvc.cases());

  // ── Ouvrir modal Ajouter ──
  openAddForm() {
    this.resetForm();
    this.showCasList.set(false);
    this.showCasForm.set(true);
  }

  // ── Ouvrir modal Ajouter depuis la liste ──
  openAddFormFromList() {
    this.showCasList.set(false);
    this.resetForm();
    this.showCasForm.set(true);
  }

  // ── Fermer modal formulaire ──
  closeForm() {
    this.showCasForm.set(false);
    this.resetForm();
  }

  // ── Ouvrir modal liste ──
  openCasListModal() {
    this.showCasForm.set(false);
    this.showCasList.set(true);
  }

  // ── Fermer modal liste ──
  closeCasListModal() {
    this.showCasList.set(false);
  }

  // ── Ouvrir edit depuis la liste ──
  openEditFromList(cas: any) {
    this.showCasList.set(false);
    this.openEdit(cas);
  }

  openEdit(cas: any) {
    this.selectedCas.set(cas);
    this.form = {
      titre: cas.titre,
      description: cas.description,
      categorie: cas.categorie,
      traitement: cas.traitement ?? '',
      duree: cas.duree ?? '',
      beforeImg: cas.beforeImg ?? '',
      afterImg: cas.afterImg ?? '',
      tags: cas.tags ?? []
    };
    this.showCasList.set(false);
    this.showCasForm.set(true);
  }

  deleteCas(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer ce cas clinique ?')) return;
    this.casSvc.remove(id);
  }

  onBeforeImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.form.beforeImg = reader.result as string; };
    reader.readAsDataURL(file);
  }

  onAfterImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.form.afterImg = reader.result as string; };
    reader.readAsDataURL(file);
  }

  saveCas() {
    if (!this.form.titre.trim() || !this.form.description.trim()) {
      alert('Veuillez remplir le titre et la description');
      return;
    }
    const catMap: Record<string, string> = {
      parodontologie: 'Parodontologie',
      implantologie: 'Implantologie',
      chirurgie: 'Chirurgie'
    };
    const colorMap: Record<string, string> = {
      parodontologie: '#1b7fc4',
      implantologie: '#17a2b8',
      chirurgie: '#155f9a'
    };
    const payload = {
      titre: this.form.titre,
      description: this.form.description,
      categorie: this.form.categorie,
      category: catMap[this.form.categorie],
      catColor: colorMap[this.form.categorie],
      traitement: this.form.traitement,
      duree: this.form.duree,
      beforeImg: this.form.beforeImg,
      afterImg: this.form.afterImg,
      tags: this.form.tags
    };
    const current = this.selectedCas();
    if (current) {
      this.casSvc.update(current.id, payload);
    } else {
      this.casSvc.add(payload);
    }
    this.closeForm();
    this.showCasList.set(true);
  }

  resetForm() {
    this.selectedCas.set(null);
    this.form = {
      titre: '', description: '', categorie: 'parodontologie',
      traitement: '', duree: '', beforeImg: '', afterImg: '', tags: []
    };
  }

  countCat(cat: string): number {
    return this.casSvc.cases().filter(c => c.categorie === cat).length;
  }

  getCatColor(categorie: string): string {
    const map: Record<string, string> = {
      parodontologie: '#1b7fc4',
      implantologie: '#17a2b8',
      chirurgie: '#155f9a'
    };
    return map[categorie] ?? '#6366f1';
  }

  // ══ DASHBOARD DATA ══
  today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  firstName = () => this.auth.user()?.name?.replace('Dr. ', '').split(' ')[0] ?? 'Docteur';
  getInitials = () => (this.auth.user()?.name ?? 'DK').replace('Dr. ', '').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  isDoctor = () => this.auth.user()?.role === 'Doctor';
  isSecretary = () => this.auth.user()?.role === 'Secretary';

  todayRdvs = signal<any[]>([]);
  allRdvs = signal<any[]>([]);
  recentOrds = signal<any[]>([]);

  calMonth = signal(new Date().getMonth());
  calYear = new Date().getFullYear();
  selectedDate = signal<string | null>(null);

  readonly dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  readonly monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  get monthName() { return this.monthNames[this.calMonth()]; }

  readonly appointmentsLimit = 136;
  readonly limitUsed = 92;
  readonly limitPct = Math.round((this.limitUsed / this.appointmentsLimit) * 100);
  readonly totalPatients = 15814;
  readonly newPatientsCount = 2543;
  readonly returnPatients = 2736;

  readonly docStats = [
    { val: '2.543', label: 'Consultations' },
    { val: '3.567', label: 'Total patients' },
  ];

  readonly extraStats = [
    { val: '13.078', label: 'Consultations', sign: '+', color: '#10b981' },
    { val: '2.736', label: 'Retour patients', sign: '+', color: '#1d6ae5' },
  ];

  readonly quickActions = [
    { label: 'Nouveau RDV', sub: 'Planifier un rendez-vous', path: '/doctor/rdv', color: '#1d6ae5', bg: 'rgba(29,106,229,0.1)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>` },
    { label: 'Ordonnance', sub: 'Créer une ordonnance', path: '/doctor/ordonnances', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>` },
    { label: 'Nouveau patient', sub: 'Ajouter un dossier', path: '/doctor/patients', color: '#0891b2', bg: 'rgba(8,145,178,0.1)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>` },
    { label: 'Urgences', sub: 'Gérer les urgences', path: '/doctor/urgences', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
  ];

  readonly secretaryActions = [
    { label: 'Nouveau RDV', sub: 'Planifier un rendez-vous', path: '/doctor/rdv', color: '#1d6ae5', bg: 'rgba(29,106,229,0.1)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>` },
    { label: 'Patients', sub: 'Gérer les dossiers', path: '/doctor/patients', color: '#0891b2', bg: 'rgba(8,145,178,0.1)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>` },
    { label: 'Planning', sub: 'Voir le calendrier complet', path: '/doctor/rdv', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  ];

  ngOnInit() {
    const todayDate = new Date().toISOString().slice(0, 10);
    const today = this.rdvSvc.getForDate(todayDate);
    this.todayRdvs.set((today.length > 0 ? today : this.rdvSvc.getAll().slice(0, 4)).map((r: any) => ({ ...r, grad: this.grad(r.patientName) })));
    this.allRdvs.set(this.rdvSvc.getAll().map((r: any) => ({ ...r, grad: this.grad(r.patientName) })).sort((a: any, b: any) => b.createdAt?.localeCompare(a.createdAt ?? '') ?? 0));
    this.recentOrds.set(this.dossier.ordonnances().slice(0, 3));
    this.selectedDate.set(todayDate);
  }

  visibleStatCards = computed(() => {
    const user = this.auth.user();
    if (user?.role === 'Secretary') return this.statCards.filter(s => s.label === 'RDV ce mois' || s.label === 'Patients actifs');
    return this.statCards;
  });

  confirmedToday = computed(() => this.todayRdvs().filter(r => r.status === 'confirmed').length);
  pendingToday = computed(() => this.todayRdvs().filter(r => r.status === 'pending').length);

  calendarCells = computed(() => {
    const month = this.calMonth();
    const year = this.calYear;
    const todayStr = new Date().toISOString().slice(0, 10);
    const firstDay = new Date(year, month, 1);
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const allRdvs = this.allRdvs();
    const cells: any[] = [];
    for (let i = startDow - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day).toISOString().slice(0, 10);
      cells.push({ day, date, currentMonth: false, isToday: false, rdvCount: 0, rdvs: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d).toISOString().slice(0, 10);
      const rdvs = allRdvs.filter((r: any) => r.date === date).map((r: any) => ({ ...r, grad: this.grad(r.patientName) }));
      cells.push({ day: d, date, currentMonth: true, isToday: date === todayStr, rdvCount: rdvs.length, rdvs });
    }
    let next = 1;
    while (cells.length < 42) {
      const date = new Date(year, month + 1, next).toISOString().slice(0, 10);
      cells.push({ day: next++, date, currentMonth: false, isToday: false, rdvCount: 0, rdvs: [] });
    }
    return cells;
  });

  selectedDayRdvs = computed(() => {
    const sel = this.selectedDate();
    if (!sel) return [];
    return this.allRdvs().filter((r: any) => r.date === sel).map((r: any) => ({ ...r, grad: this.grad(r.patientName) }));
  });

  selectDate(cell: any) { this.selectedDate.set(cell.date); }
  prevMonth() { const m = this.calMonth(); if (m === 0) { this.calMonth.set(11); (this as any).calYear--; } else { this.calMonth.set(m - 1); } }
  nextMonth() { const m = this.calMonth(); if (m === 11) { this.calMonth.set(0); (this as any).calYear++; } else { this.calMonth.set(m + 1); } }
  goToday() { const now = new Date(); this.calMonth.set(now.getMonth()); (this as any).calYear = now.getFullYear(); this.selectedDate.set(now.toISOString().slice(0, 10)); }

  formatSelectedDate(): string {
    const sel = this.selectedDate();
    if (!sel) return '';
    return new Date(sel).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  formatDate(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  dotColor(status: string): string {
    return ({ confirmed: '#22c55e', pending: '#f59e0b', done: '#6366f1', cancelled: '#ef4444' } as any)[status] ?? '#6366f1';
  }

  grad(name: string): string {
    const g = [
      'linear-gradient(135deg,#1d6ae5,#1558c9)', 'linear-gradient(135deg,#0891b2,#0e7490)',
      'linear-gradient(135deg,#6366f1,#4f46e5)', 'linear-gradient(135deg,#059669,#047857)',
      'linear-gradient(135deg,#d97706,#b45309)', 'linear-gradient(135deg,#db2777,#be185d)'
    ];
    return g[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % g.length];
  }

  badgeClass(s: string): string {
    return ({ confirmed: 'badge-confirmed', pending: 'badge-pending', done: 'badge-done', cancelled: 'badge-cancelled' } as any)[s] ?? 'badge-done';
  }

  statusLabel(s: string): string {
    return ({ confirmed: 'Confirmé', pending: 'En attente', done: 'Terminé', cancelled: 'Annulé' } as any)[s] ?? s;
  }

  sanitize(svg: string) { return this.sanitizer.bypassSecurityTrustHtml(svg); }

  readonly miniStats = [
    { val: 12, label: 'Nv. Patients', color: '#1d6ae5', action: 'Ajouter' },
    { val: 9, label: 'Tâches imp.', color: '#f59e0b', action: 'Voir' },
    { val: 4, label: 'Alertes', color: '#ef4444', action: 'Gérer' },
  ];

  readonly weekData = [
    { day: 'L', count: 6, today: false }, { day: 'M', count: 9, today: false },
    { day: 'M', count: 5, today: false }, { day: 'J', count: 14, today: true },
    { day: 'V', count: 11, today: false }, { day: 'S', count: 8, today: false },
  ];

  maxWeek = () => Math.max(...this.weekData.map(d => d.count));
  weekTotal = () => this.weekData.reduce((s, d) => s + d.count, 0);

  readonly statCards = [
    { val: '5', label: 'RDV ce mois', color: '#1d6ae5', bg: 'rgba(29,106,229,0.12)', pct: 70, up: true, trend: 12, icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
    { val: '2', label: 'Patients actifs', color: '#0891b2', bg: 'rgba(8,145,178,0.12)', pct: 50, up: true, trend: 8, icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>` },
    { val: '3', label: 'Ordonnances', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', pct: 65, up: true, trend: 5, icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>` },
    { val: '4', label: 'RDV confirmés', color: '#10b981', bg: 'rgba(16,185,129,0.12)', pct: 80, up: true, trend: 3, icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
  ];
}