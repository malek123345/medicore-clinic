import { Injectable, signal, computed } from '@angular/core';

export interface CasClinique {
  id: number;
  categorie: 'parodontologie' | 'implantologie' | 'chirurgie';
  category: string;
  catColor: string;
  titre: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  traitement: string;
  duree: string;
  tags: string[];
  sliderPos: number;
  createdAt: string;
}

const STORAGE_KEY = 'medspace_cas_cliniques';

const DEFAULT_CASES: CasClinique[] = [
  {
    id: 1,
    categorie: 'parodontologie',
    category: 'Parodontologie',
    catColor: '#1b7fc4',
    titre: 'Correction du sourire gingival (Lip repositioning)',
    beforeImg: 'assets/images/cas/1.png',
    afterImg: 'assets/images/cas/2.png',
    description: 'Récession gingivale sévère avec perte osseuse, traitée par greffe gingivale et régénération osseuse guidée.',
    traitement: 'Greffe Gingivale + ROG',
    duree: '9 mois',
    tags: ['Greffe gingivale', 'Régénération osseuse', 'Parodontite'],
    sliderPos: 50,
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 2,
    categorie: 'implantologie',
    category: 'Implantologie',
    catColor: '#17a2b8',
    titre: "Pose d'Implant Dentaire",
    beforeImg: 'assets/images/cas/avant2.png',
    afterImg: 'assets/images/cas/apres2.png',
    description: "Remplacement d'une molaire manquante par implant avec greffe osseuse pré-implantaire.",
    traitement: 'Implant + Couronne',
    duree: '4 mois',
    tags: ['Implant', 'Greffe osseuse', 'Couronne'],
    sliderPos: 50,
    createdAt: '2024-02-10T10:00:00.000Z',
  },
  {
    id: 3,
    categorie: 'chirurgie',
    category: 'Chirurgie',
    catColor: '#155f9a',
    titre: 'Chirurgie Esthétique Gingivale',
    beforeImg: 'assets/images/cas/avant3.png',
    afterImg: 'assets/images/cas/apres3.png',
    description: 'Correction du sourire gingival par gingivectomie et élongation coronaire.',
    traitement: 'Gingivectomie',
    duree: '2 mois',
    tags: ['Esthétique', 'Gingivectomie'],
    sliderPos: 50,
    createdAt: '2024-03-05T10:00:00.000Z',
  },
  {
    id: 4,
    categorie: 'implantologie',
    category: 'Implantologie',
    catColor: '#17a2b8',
    titre: 'Réhabilitation Complète All-on-4',
    beforeImg: 'assets/images/cas/avant4.png',
    afterImg: 'assets/images/cas/apres4.png',
    description: 'Arcade complète sur 4 implants pour patient édenté.',
    traitement: 'All-on-4',
    duree: '8 mois',
    tags: ['All-on-4', 'Réhabilitation'],
    sliderPos: 50,
    createdAt: '2024-04-01T10:00:00.000Z',
  },
  {
    id: 5,
    categorie: 'parodontologie',
    category: 'Parodontologie',
    catColor: '#1b7fc4',
    titre: 'Traitement Parodontite Avancée',
    beforeImg: 'assets/images/cas/avant5.png',
    afterImg: 'assets/images/cas/apres5.png',
    description: 'Parodontite stade 3 avec mobilité dentaire, stabilisée par traitement parodontal non-chirurgical.',
    traitement: 'Surfaçage Radiculaire',
    duree: '3 mois',
    tags: ['Parodontite', 'Surfaçage'],
    sliderPos: 50,
    createdAt: '2024-05-12T10:00:00.000Z',
  },
  {
    id: 6,
    categorie: 'chirurgie',
    category: 'Chirurgie',
    catColor: '#155f9a',
    titre: 'Greffe Osseuse Pré-Implantaire',
    beforeImg: 'assets/images/cas/avant6.png',
    afterImg: 'assets/images/cas/apres6.png',
    description: "Augmentation osseuse horizontale avant pose d'implant.",
    traitement: 'Greffe Osseuse',
    duree: '5 mois',
    tags: ['Greffe osseuse', 'Augmentation'],
    sliderPos: 50,
    createdAt: '2024-06-20T10:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class CasCliniquesService {
  private _cases = signal<CasClinique[]>(this._load());
  cases = computed(() => this._cases());

  add(cas: Omit<CasClinique, 'id' | 'sliderPos' | 'createdAt'>): void {
    const newCase: CasClinique = {
      ...cas,
      id: Date.now(),
      sliderPos: 50,
      createdAt: new Date().toISOString(),
    };
    const updated = [...this._cases(), newCase];
    this._cases.set(updated);
    this._save(updated);
  }

  remove(id: number): void {
    const updated = this._cases().filter(c => c.id !== id);
    this._cases.set(updated);
    this._save(updated);
  }

  update(id: number, data: Partial<CasClinique>): void {
    const updated = this._cases().map(c =>
      c.id === id ? { ...c, ...data } : c
    );
    this._cases.set(updated);
    this._save(updated);
  }

  updateSlider(id: number, pos: number): void {
    this._cases.update(list =>
      list.map(c => c.id === id ? { ...c, sliderPos: pos } : c)
    );
  }

  private _load(): CasClinique[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CasClinique[];
    } catch { /* ignore */ }
    return DEFAULT_CASES;
  }

  private _save(list: CasClinique[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch { /* quota exceeded */ }
  }
}