import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Sponsor } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sponsor-list',
  imports: [],
  templateUrl: './sponsor-list.html',
  styleUrl: './sponsor-list.css',
})
export class SponsorList implements OnInit {
  sponsors = signal<Sponsor[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(private api: ApiService, private router: Router, private auth: AuthService) {}

  async ngOnInit() {
    try {
      const data = await this.api.getSponsors();
      this.sponsors.set(data);
    } catch {
      this.error.set('Não foi possível carregar os apoiadores.');
    } finally {
      this.loading.set(false);
    }
  }

  goToNew() {
    this.router.navigate(['/apoiadores/novo']);
  }

  goToDetail(id: string) {
    this.router.navigate(['/apoiadores', id]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
