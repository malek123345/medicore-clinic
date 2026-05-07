// src/app/core/services/secretary.service.ts
import { Injectable, signal } from '@angular/core';

export interface Secretary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  permissions: {
    rdv: boolean;
    patients: boolean;
    ordonnances: boolean;
    paiements: boolean;
    parametres: boolean;
    urgences: boolean;
  };
  online: boolean;
  createdAt: string;
  doctorId: string;
}

@Injectable({ providedIn: 'root' })
export class SecretaryService {
  private secretaries = signal<Secretary[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('medspace_secretaries');
    if (stored) {
      this.secretaries.set(JSON.parse(stored));
    }
  }

  private saveToStorage() {
    localStorage.setItem('medspace_secretaries', JSON.stringify(this.secretaries()));
  }

  getAll() {
    return this.secretaries();
  }

  getByEmail(email: string): Secretary | undefined {
    return this.secretaries().find(s => s.email === email);
  }

  create(secretary: Omit<Secretary, 'id' | 'createdAt' | 'online'>): Secretary {
    const newSecretary: Secretary = {
      ...secretary,
      id: 'sec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      online: false
    };
    
    this.secretaries.update(list => [...list, newSecretary]);
    this.saveToStorage();
    return newSecretary;
  }

  update(id: string, updates: Partial<Secretary>) {
    this.secretaries.update(list => 
      list.map(s => s.id === id ? { ...s, ...updates } : s)
    );
    this.saveToStorage();
  }

  delete(id: string) {
    this.secretaries.update(list => list.filter(s => s.id !== id));
    this.saveToStorage();
  }

  setOnlineStatus(email: string, online: boolean) {
    this.secretaries.update(list =>
      list.map(s => s.email === email ? { ...s, online } : s)
    );
    this.saveToStorage();
  }
}