import { Component, OnInit, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Sponsor } from '../services/api.service';

@Component({
  selector: 'app-sponsor-list',
  imports: [LowerCasePipe],
  templateUrl: './sponsor-list.html',
  styleUrl: './sponsor-list.css',
})
export class SponsorList implements OnInit {
  sponsors = signal<Sponsor[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(private api: ApiService, private router: Router) {}

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
}
