import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';
import { DetailsService } from '../services/details.service';
import { Artist, EventFull } from '../interfaces/event-full';
import { HelperService } from '../services/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventBrief } from '../interfaces/event-brief';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  tabIndex: number = 1;
  event!: EventFull;
  progressColor: string = '#7ac001';
  markers: any[] = [];
  center: any = { lat: 0, lng: 0 };

  private subscriptions: Subscription[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private detailsService: DetailsService,
    private favoriteService: FavoritesService,
    private helperService: HelperService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.subscriptions.push(this.detailsService.onData.subscribe((data: EventFull) => {
      this.event = data;
      const latitude = parseFloat(data.venue.location.latitude);
      const longitude = parseFloat(data.venue.location.longitude);

      this.center.lat = latitude;
      this.center.lng = longitude;

      this.markers.push({
        position: {
          lat: latitude,
          lng: longitude
        },
        label: {
          color: 'red',
          text: data.venue.name
        },
        title: data.venue.name,
      });
    }));

    this.subscriptions.push(this.route.paramMap.subscribe((params: ParamMap) => {
      const id: string = params.get('id')!;
      this.detailsService.update(id);
    }));
  }

  ngOnDestroy(): void {
    console.log('Destroy details', this.subscriptions.length);
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  back(): void {
    this.location.back();
  }

  formatArtists(event: EventFull): string {
    return this.helperService.formatArtists(event);
  }

  formatCategory(event: EventFull): string {
    return this.helperService.formatCategoryFull(event);
  }

  formatPriceRange(event: EventFull): string {
    return this.helperService.formatPriceRange(event);
  }

  formatCity(event: EventFull): string {
    return this.helperService.formatCity(event);
  }

  openSeatmap(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  getTwitterLink(event: EventFull): string {
    const text = 'Check out ' + event.name + ' located at ' + event.venue.name + '. #CSCI571EventSearch';
    const url = new URL('https://twitter.com/intent/tweet');
    url.searchParams.append('text', text);
    return url.href;
  }

  toggleFavorite(event: EventFull): void {
    this.favoriteService.toggle(this.toBrief(event));
  }

  getFavoriteIcon(event: EventFull): string {
    return this.helperService.getFavoriteIcon(this.toBrief(event));
  }

  getMusicalArtists(event: EventFull): Artist[] {
    let artists: Artist[] = [];
    for (let artist of event.artists) {
      if (artist.musicRelated)
        artists.push(artist);
    }
    return artists;
  }

  hasMusicData(artist: Artist): boolean {
    if (artist.followers > 0)
      return true;
    if (artist.popularity > 0)
      return true;
    if (artist.spotifyURL != 'N/A')
      return true;
    return false;
  }

  private toBrief(event: EventFull): EventBrief {
    let eventBrief: EventBrief = {
      date: event.info.date,
      name: event.name,
      category: event.info.category,
      venue: event.venue.name,
      id: event.id
    }
    return eventBrief;
  }
}