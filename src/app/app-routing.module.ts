import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: 'results', component: ResultsComponent, data: { animation: 'none' }},
  { path: 'favorites', component: FavoritesComponent, data: { animation: 'none' } },
  { path: 'details/:id', component: DetailsComponent, data: {animation: 'isRight'} },
  { path: '', redirectTo: 'results', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }