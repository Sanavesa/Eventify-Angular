import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { fader, slider } from './route-animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slider,
    fader
  ]
})
export class AppComponent {

  resultsSelected: boolean = true;

  constructor(private router: Router) { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  get url() {
    return this.router.url;
  }

  isLinkActive(url: string): boolean {
    if (this.router.url.startsWith('/results')) {
      if (url == '/results') {
        this.resultsSelected = true;
        return true;
      }
      else
        return false;
    }
    else if (this.router.url.startsWith('/favorites')) {
      if (url == '/favorites') {
        this.resultsSelected = false;
        return true;
      }
      else
        return false;
    }
    else {
      if (url == '/results')
        return this.resultsSelected; 
      else
        return !this.resultsSelected; 
    }
  }
}