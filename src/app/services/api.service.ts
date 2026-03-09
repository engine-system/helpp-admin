import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:3000';

export interface SponsorPayload {
  companyName: string;
  cnpj: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  supportType: string;
  notes: string;
}

export interface Sponsor extends SponsorPayload {
  _id: string;
  active: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  async getSponsors(): Promise<Sponsor[]> {
    const res = await fetch(`${API_URL}/sponsors`);
    if (!res.ok) throw new Error('Erro ao buscar apoiadores.');
    return res.json();
  }

  async createSponsor(data: SponsorPayload): Promise<void> {
    const res = await fetch(`${API_URL}/sponsors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao cadastrar apoiador.');
    }
  }
}
