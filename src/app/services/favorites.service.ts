import { Injectable } from '@angular/core';
import { EventBrief } from '../interfaces/event-brief';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  favorites: EventBrief[] = [];

  constructor() {
    this.load();
  }

  has(event: EventBrief): boolean {
    return this.getIndex(event) > -1;
  }

  add(event: EventBrief): void {
    const index = this.getIndex(event);
    if (index == -1) {
      this.favorites.push(event);
      this.save();
    }
  }

  remove(event: EventBrief): void {
    const index = this.getIndex(event);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.save();
    }
  }

  toggle(event: EventBrief): void {
    if (this.has(event))
      this.remove(event);
    else
      this.add(event);
  }

  load(): void {
    const retrieved = localStorage.getItem('favorites');
    if (retrieved == null)
      return;
    this.favorites = JSON.parse(retrieved);
  }

  save(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  private getIndex(event: EventBrief): number {
    for (let i = 0; i < this.favorites.length; i++) {
      if (this.favorites[i].id == event.id) {
        return i;
      }
    }
    return -1;
  }
}