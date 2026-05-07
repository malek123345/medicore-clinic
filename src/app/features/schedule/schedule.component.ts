import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="ph"><h1>Planning</h1><p>Dr. Marie Dupont · Cardiologie</p></div>

<div class="sgrid">
  <div class="card">
    <div class="ch">
      <button class="wb" (click)="changeWeek(-1)">← Précédent</button>
      <div class="wl">{{ weekLabel() }}</div>
      <button class="wb" (click)="changeWeek(1)">Suivant →</button>
    </div>
    <div class="cb">
      <div class="wcols">
        @for (d of weekDays; track d.name) {
          <div class="dcol">
            <div class="dh" [class.today]="d.isToday">
              <div class="dn">{{ d.name }}</div>
              <div class="dd" [class.today]="d.isToday">{{ d.num }}</div>
            </div>
            @for (e of d.events; track e.name) {
              <div class="sev" [class]="e.cls" (click)="toast.info(e.name, e.time)">
                <div class="en">{{ e.name }}</div>
                <div class="et">{{ e.time }}</div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  </div>

  <div>
    <div class="card smcard">
      <div class="ch"><div class="ct">Résumé du jour</div></div>
      <div class="cb">
        @for (r of summary; track r.label) {
          <div class="srow">
            <div class="sico">{{ r.icon }}</div>
            <div style="flex:1">
              <div class="sl">{{ r.label }}</div>
              <div class="sv" [style.color]="r.color">{{ r.value }}</div>
            </div>
          </div>
        }
      </div>
    </div>

    <div class="card smcard" style="margin-top:14px">
      <div class="ch"><div class="ct">Disponibilités</div></div>
      <div class="cb">
        @for (s of avail; track s.time) {
          <div class="arow" (click)="toast.info(s.time, s.free ? 'Disponible' : 'Occupé')">
            <div class="adot" [style.background]="s.free ? '#10b981' : '#f43f5e'"></div>
            <div class="at" style="flex:1">{{ s.time }}</div>
            <div class="as" [style.color]="s.free ? '#059669' : '#e11d48'">
              {{ s.free ? 'Libre' : 'Occupé' }}
            </div>
          </div>
        }
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    :host{display:block}
    .ph{margin-bottom:18px} h1{font-size:24px;font-weight:700;color:#0d1b2a} p{font-size:13px;color:#94a3b8;margin-top:3px}
    .sgrid{display:grid;grid-template-columns:1fr 290px;gap:16px}
    .card{background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 4px rgba(0,0,0,.05)}
    .ch{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(0,0,0,.04)}
    .ct{font-size:14px;font-weight:600;color:#0d1b2a}
    .cb{padding:14px 18px}
    .wl{font-size:14px;font-weight:600;color:#0d1b2a}
    .wb{background:#f0f4f8;border:1.5px solid rgba(0,0,0,.07);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;transition:border-color .15s}
    .wb:hover{border-color:#0ea5c9;color:#0ea5c9}
    .wcols{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
    .dcol{}
    .dh{text-align:center;padding:8px 4px;border-radius:10px;background:#f0f4f8;margin-bottom:7px;border:1.5px solid transparent}
    .dh.today{background:#e0f5fa;border-color:rgba(14,165,201,.3)}
    .dn{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:500}
    .dd{font-size:18px;font-weight:700;color:#0d1b2a;margin-top:2px} .dd.today{color:#0ea5c9}
    .sev{border-radius:8px;padding:6px 8px;margin-bottom:5px;font-size:11px;border-left:3px solid;cursor:pointer;transition:opacity .15s}
    .sev:hover{opacity:.75}
    .sev.t{border-color:#0ea5c9;background:#e0f5fa}
    .sev.i{border-color:#6366f1;background:#eef2ff}
    .sev.e{border-color:#10b981;background:#ecfdf5}
    .en{font-weight:600;color:#0d1b2a;margin-bottom:2px} .et{color:#94a3b8;font-size:10px}
    .srow{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.04)}
    .srow:last-child{border-bottom:none}
    .sico{font-size:18px;width:30px;text-align:center;flex-shrink:0}
    .sl{font-size:11px;color:#94a3b8} .sv{font-size:15px;font-weight:700;margin-top:1px}
    .arow{display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.04);cursor:pointer;border-radius:7px;transition:background .12s}
    .arow:last-child{border-bottom:none} .arow:hover{background:#f8fafc}
    .adot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .at{font-size:13px;font-weight:500;color:#0d1b2a} .as{font-size:11px;font-weight:600}
  `]
})
export class ScheduleComponent {
  toast = inject(ToastService);
  weekOffset = signal(0);

  weekLabel() {
    const s = 3 + this.weekOffset() * 7;
    return `${s}–${s + 6} mars 2026`;
  }
  changeWeek(d: number) { this.weekOffset.update(n => n + d); }

  weekDays = [
    { name:'Lun', num:3,  isToday:false, events:[{name:'S. Johnson',   time:'08:00', cls:'t'}, {name:'M. Bernard',  time:'09:30', cls:'i'}] },
    { name:'Mar', num:4,  isToday:false, events:[{name:'L. Khalil',    time:'09:30', cls:'e'}, {name:'P. Morel',    time:'11:00', cls:'t'}] },
    { name:'Mer', num:5,  isToday:false, events:[{name:'E. Lefevre',   time:'10:00', cls:'i'}] },
    { name:'Jeu', num:6,  isToday:false, events:[{name:'A. Benali',    time:'11:45', cls:'t'}, {name:'C. Rousseau', time:'14:00', cls:'e'}] },
    { name:'Ven', num:7,  isToday:false, events:[{name:'J. Wilson',    time:'14:45', cls:'i'}, {name:'S. Chen',     time:'15:30', cls:'e'}] },
    { name:'Sam', num:8,  isToday:true,  events:[] },
    { name:'Dim', num:9,  isToday:false, events:[{name:'M. Blanc',     time:'08:00', cls:'t'}] },
  ];

  summary = [
    { icon:'📅', label:'RDV total',  value:'12', color:'#0d1b2a' },
    { icon:'✅', label:'Terminés',   value:'7',  color:'#059669' },
    { icon:'⏳', label:'Restants',   value:'3',  color:'#d97706' },
    { icon:'❌', label:'Annulés',    value:'2',  color:'#e11d48' },
  ];

  avail = [
    { time:'08:00–09:00', free:false },
    { time:'09:00–10:00', free:false },
    { time:'10:00–11:00', free:true  },
    { time:'14:00–15:00', free:false },
    { time:'15:00–16:00', free:true  },
    { time:'16:00–17:00', free:true  },
  ];
}