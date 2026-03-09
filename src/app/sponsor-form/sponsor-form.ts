import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, SponsorPayload } from '../services/api.service';

@Component({
  selector: 'app-sponsor-form',
  imports: [FormsModule],
  templateUrl: './sponsor-form.html',
  styleUrl: './sponsor-form.css',
})
export class SponsorForm {
  form: SponsorPayload = {
    companyName: '',
    cnpj: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    notes: '',
  };

  loading = signal(false);
  error = signal('');

  constructor(private api: ApiService, private router: Router) {}

  goBack() {
    this.router.navigate(['/apoiadores']);
  }

  async submit() {
    this.error.set('');
    this.loading.set(true);
    try {
      await this.api.createSponsor(this.form);
      this.router.navigate(['/apoiadores']);
    } catch (e: any) {
      this.error.set(e.message || 'Erro inesperado.');
    } finally {
      this.loading.set(false);
    }
  }
}
