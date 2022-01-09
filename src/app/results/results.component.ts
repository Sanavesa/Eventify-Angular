import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBrief } from '../interfaces/event-brief';
import { FavoritesService } from '../services/favorites.service';
import { HelperService } from '../services/helper.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {
  
  displayedColumns: string[] = ['num', 'date', 'name', 'category', 'venue', 'favorite'];
  dataSource: EventBrief[] = [];
  progressBarValue: number = 0;
  isFetchingData: boolean = false;
  showTable: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private favoriteService: FavoritesService,
    private helperService: HelperService) { }
  
  ngOnInit(): void {
    this.subscriptions.push(this.searchService.onError.subscribe(_ => {
      console.log('error happened');
      this.progressBarValue = 0;
      const self = this;
      setTimeout(function () {
        self.isFetchingData = false;
        self.showTable = false;
      }, 1000);
    }));

    this.subscriptions.push(this.searchService.onRequest.subscribe(_ => {
      console.log('requesting...');
      this.progressBarValue = 0;
      this.isFetchingData = true;
      this.showTable = false;
    }));

    console.log('added new sub');
    this.subscriptions.push(this.searchService.onData.subscribe(data => {
      console.log('dahello from the other side', data);
      this.progressBarValue = 100;
      this.dataSource = data;
      this.showTable = !this.searchService.isReset;
      // this.showTable = true;
      const self = this;
      setTimeout(function () {
        self.isFetchingData = false;
      }, 500);
    }, error => {
      console.log('it errored out', error);
      this.progressBarValue = 0;
      this.showTable = false;
      const self = this;
      setTimeout(function () {
        self.isFetchingData = false;
      }, 1000);
    }));

    this.subscriptions.push(this.searchService.onReset.subscribe(_ => {
      console.log('data has been reset');
      this.progressBarValue = 0;
      this.dataSource = [];
      this.showTable = false;
    }));
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  formatCategory(event: EventBrief): string {
    return this.helperService.formatCategory(event);
  }

  formatName(event: EventBrief): string {
    return this.helperService.formatName(event);
  }

  toggleFavorite(event: EventBrief): void {
    this.favoriteService.toggle(event);
  }

  getFavoriteIcon(event: EventBrief): string {
    return this.helperService.getFavoriteIcon(event);
  }
}