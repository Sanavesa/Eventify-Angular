import { Component, OnInit } from '@angular/core';
import { EventBrief } from '../interfaces/event-brief';
import { FavoritesService } from '../services/favorites.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  
  constructor(
    private favoriteService: FavoritesService,
    private helperService: HelperService) { }

  get favorites(): EventBrief[] {
    return this.favoriteService.favorites;
  }

  formatCategory(event: EventBrief): string {
    return this.helperService.formatCategory(event);
  }

  formatName(event: EventBrief): string {
    return this.helperService.formatName(event);
  }

  removeFavorite(event: EventBrief): void {
    this.favoriteService.remove(event);
  }
}