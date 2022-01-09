import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http'
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { GoogleMapsModule } from '@angular/google-maps'

import { ResultsComponent } from './results/results.component';
import { FormComponent } from './form/form.component';
import { KeywordValidatorDirective } from './keyword-validator.directive';
import { DistanceValidatorDirective } from './distance-validator.directive';
import { DetailsComponent } from './details/details.component';
import { FavoritesComponent } from './favorites/favorites.component';


@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    FormComponent,
    KeywordValidatorDirective,
    DistanceValidatorDirective,
    DetailsComponent,
    FavoritesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    RoundProgressModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
