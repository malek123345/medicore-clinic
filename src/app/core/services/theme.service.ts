import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark = signal<boolean>(false);
  readonly isDark = this._dark.asReadonly();

  constructor() {
    // Persist theme
    const saved = localStorage.getItem('khaddar_theme');
    if (saved === 'dark') this._dark.set(true);
    effect(() => {
      const d = this._dark();
      document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
      localStorage.setItem('khaddar_theme', d ? 'dark' : 'light');
    });
  }

  toggle() { this._dark.update(d => !d); }
}