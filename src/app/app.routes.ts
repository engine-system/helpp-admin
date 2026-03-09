import { Routes } from '@angular/router';
import { Login } from './login/login';
import { SponsorList } from './sponsor-list/sponsor-list';
import { SponsorForm } from './sponsor-form/sponsor-form';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'apoiadores', component: SponsorList, canActivate: [authGuard] },
  { path: 'apoiadores/novo', component: SponsorForm, canActivate: [authGuard] },
  { path: '', redirectTo: 'apoiadores', pathMatch: 'full' },
];
