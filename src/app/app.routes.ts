import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { ItemHistoryPageComponent } from './pages/item-history-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'history/:id', component: ItemHistoryPageComponent },
  { path: '**', redirectTo: '' },
];
