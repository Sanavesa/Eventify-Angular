import { Injectable } from '@angular/core';
import { EventBrief } from '../interfaces/event-brief';
import { EventFull } from '../interfaces/event-full';
import { FavoritesService } from './favorites.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private favoriteService: FavoritesService) { }

  formatCategory(event: EventBrief): string {
    let set: Set<string> = new Set();

    if (event.category.genre != 'N/A')
      set.add(event.category.genre);

    if (event.category.subGenre != 'N/A')
      set.add(event.category.subGenre);

    if (event.category.segment != 'N/A')
      set.add(event.category.segment);

    if (event.category.type != 'N/A')
      set.add(event.category.type);

    if (event.category.subType != 'N/A')
      set.add(event.category.subType);

    return Array.from(set).join(' | ');
  }

  formatArtists(event: EventFull): string {
    let set: Set<string> = new Set();

    for (let artist of event.artists) {
      set.add(artist.name);
    }

    return Array.from(set).join(' | ');
  }

  formatCategoryFull(event: EventFull): string {
    let set: Set<string> = new Set();

    if (event.info.category.genre != 'N/A')
      set.add(event.info.category.genre);

    if (event.info.category.subGenre != 'N/A')
      set.add(event.info.category.subGenre);

    if (event.info.category.segment != 'N/A')
      set.add(event.info.category.segment);

    if (event.info.category.type != 'N/A')
      set.add(event.info.category.type);

    if (event.info.category.subType != 'N/A')
      set.add(event.info.category.subType);

    return Array.from(set).join(' | ');
  }

  formatName(event: EventBrief): string {
    const name: string = event.name;
    let formattedName = name;
    if (formattedName.length > 35) {
      const cutPosition: string = formattedName.charAt(35);
      formattedName = formattedName.substring(0, 35);
      if (cutPosition != ' ') {
        const whitespaceIndex: number = formattedName.lastIndexOf(' ');
        if (whitespaceIndex > -1) {
          formattedName = formattedName.substring(0, whitespaceIndex);
        }
      }

      formattedName += '...';
    }

    return formattedName;
  }

  formatPriceRange(event: EventFull): string {
    const min: number = event.info.priceRange.min;
    const max: number = event.info.priceRange.max;
    const currency: string = event.info.priceRange.currency;
    if (min == 0 && max == 0)
      return 'N/A';
    else if (min == 0)
      return String(max) + ' ' + currency;
    else if (max == 0)
      return String(min) + ' ' + currency;
    else
      return String(min) + ' - ' + String(max) + ' ' + currency;
  }

  formatCity(event: EventFull): string {
    const city = event.venue.city;
    const state = event.venue.state;
    if (city == 'N/A' && state == 'N/A')
      return 'N/A';
    else if (city == 'N/A')
      return state;
    else if (state == 'N/A')
      return city;
    else
      return city + ', ' + state;
  }

  getFavoriteIcon(event: EventBrief): string {
    if (this.favoriteService.has(event))
      return 'star_rate';
    else
      return 'star_border';
  }
}
