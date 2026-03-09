import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Sponsor, Product } from '../services/api.service';

@Component({
  selector: 'app-sponsor-detail',
  imports: [FormsModule, DatePipe],
  templateUrl: './sponsor-detail.html',
  styleUrl: './sponsor-detail.css',
})
export class SponsorDetail implements OnInit {
  readonly types = ['Produto', 'Serviço'];

  sponsor = signal<Sponsor | null>(null);
  products = signal<Product[]>([]);
  requests = signal<any[]>([]);
  loading = signal(true);
  saving = signal(false);
  savingLogo = signal(false);
  error = signal('');
  showForm = signal(false);

  form = { name: '', description: '', type: '', image: '' };
  imagePreview = signal('');
  logoPreview = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      const [sponsor, products, requests] = await Promise.all([
        this.api.getSponsor(id),
        this.api.getProducts(id),
        this.api.getSponsorRequests(id),
      ]);
      this.sponsor.set(sponsor);
      this.products.set(products);
      this.requests.set(requests);
    } catch {
      this.error.set('Não foi possível carregar os dados.');
    } finally {
      this.loading.set(false);
    }
  }

  onLogoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const sponsor = this.sponsor();
    if (!sponsor) return;

    this.savingLogo.set(true);
    this.error.set('');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.logoPreview.set(base64);
      this.api.updateLogo(sponsor._id, base64)
        .then(() => this.sponsor.update(s => s ? { ...s, logo: base64 } : s))
        .catch((e: any) => this.error.set(e.message || 'Erro ao salvar logo.'))
        .finally(() => this.savingLogo.set(false));
    };
    reader.onerror = () => {
      this.error.set('Erro ao ler o arquivo.');
      this.savingLogo.set(false);
    };
    reader.readAsDataURL(file);
  }

  async removeLogo() {
    const sponsor = this.sponsor();
    if (!sponsor) return;
    this.savingLogo.set(true);
    try {
      await this.api.updateLogo(sponsor._id, null);
      this.sponsor.update(s => s ? { ...s, logo: undefined } : s);
      this.logoPreview.set('');
    } catch {
      this.error.set('Erro ao remover logo.');
    } finally {
      this.savingLogo.set(false);
    }
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.image = base64;
      this.imagePreview.set(base64);
    };
    reader.readAsDataURL(file);
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) this.resetForm();
  }

  resetForm() {
    this.form = { name: '', description: '', type: '', image: '' };
    this.imagePreview.set('');
  }

  async submit() {
    const sponsor = this.sponsor();
    if (!sponsor) return;
    this.error.set('');
    this.saving.set(true);
    try {
      const product = await this.api.createProduct({ ...this.form, sponsorId: sponsor._id });
      this.products.update(list => [product, ...list]);
      this.showForm.set(false);
      this.resetForm();
    } catch (e: any) {
      this.error.set(e.message || 'Erro ao salvar.');
    } finally {
      this.saving.set(false);
    }
  }

  async remove(id: string) {
    await this.api.deleteProduct(id);
    this.products.update(list => list.filter(p => p._id !== id));
  }

  async updateStatus(id: string, status: string) {
    await this.api.updateRequestStatus(id, status);
    this.requests.update(list =>
      list.map(r => r._id === id ? { ...r, status } : r)
    );
  }

  goBack() {
    this.router.navigate(['/apoiadores']);
  }
}
