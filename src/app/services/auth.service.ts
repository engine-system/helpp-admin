import { Injectable, signal } from '@angular/core';

const API_URL = 'http://localhost:3000';
const TOKEN_KEY = '@helpp_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = signal(!!localStorage.getItem(TOKEN_KEY));

  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao fazer login.');
    }
    const { token } = await res.json();
    localStorage.setItem(TOKEN_KEY, token);
    this.isLoggedIn.set(true);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
