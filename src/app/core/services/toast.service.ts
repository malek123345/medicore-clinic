import { Injectable, signal } from '@angular/core';
export interface Toast { id:string; type:'success'|'error'|'info'|'warning'; title:string; message:string; }
@Injectable({ providedIn:'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private add(type: Toast['type'], title: string, message: string) {
    const id = Math.random().toString(36).slice(2);
    this.toasts.update(t => [...t, { id, type, title, message }]);
    setTimeout(() => this.dismiss(id), 4500);
  }
  success(t:string,m=''){this.add('success',t,m);}
  error(t:string,m=''){this.add('error',t,m);}
  info(t:string,m=''){this.add('info',t,m);}
  warning(t:string,m=''){this.add('warning',t,m);}
  dismiss(id:string){this.toasts.update(t=>t.filter(x=>x.id!==id));}
}