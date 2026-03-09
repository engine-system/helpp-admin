import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:3000';

export interface SponsorPayload {
  companyName: string;
  cnpj: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
}

export interface Sponsor extends SponsorPayload {
  _id: string;
  active: boolean;
  createdAt: string;
  logo?: string;
}

export interface ProductPayload {
  sponsorId: string;
  name: string;
  description: string;
  type: string;
  image: string;
}

export interface Product extends ProductPayload {
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

  async getSponsor(id: string): Promise<Sponsor> {
    const res = await fetch(`${API_URL}/sponsors/${id}`);
    if (!res.ok) throw new Error('Apoiador não encontrado.');
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

  async getProducts(sponsorId: string): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products?sponsorId=${sponsorId}`);
    if (!res.ok) throw new Error('Erro ao buscar produtos.');
    return res.json();
  }

  async createProduct(data: ProductPayload): Promise<Product> {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao cadastrar produto.');
    }
    return res.json();
  }

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  }

  async getSponsorRequests(sponsorId: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/sponsor-requests?sponsorId=${sponsorId}`);
    if (!res.ok) throw new Error('Erro ao buscar requisições.');
    return res.json();
  }

  async updateRequestStatus(id: string, status: string): Promise<any> {
    const res = await fetch(`${API_URL}/sponsor-requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar status.');
    return res.json();
  }

  async updateLogo(sponsorId: string, logo: string | null): Promise<void> {
    const res = await fetch(`${API_URL}/sponsors/${sponsorId}/logo`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logo }),
    });
    if (!res.ok) throw new Error('Erro ao salvar logo.');
  }
}
