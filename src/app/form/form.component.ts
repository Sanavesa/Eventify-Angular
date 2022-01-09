import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { SuggestionService } from '../services/suggestion.service';
import { SearchService } from '../services/search.service';
import { KeywordSuggestion } from '../interfaces/keyword-suggestion';
import { LocationService } from '../services/location.service';
import { Router } from '@angular/router';
import { GeoCoord } from '../interfaces/geo-coord';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  myForm!: FormGroup;
  keywordSuggestions: KeywordSuggestion[] = [];
  filteredKeywordSuggestions!: Observable<KeywordSuggestion[]>;
  geoCoord!: GeoCoord;
  private subscriptions: Subscription[] = [];
  private clickedSearch: boolean = false;

  constructor(private suggestionService: SuggestionService,
    private locationService: LocationService,
    private searchService: SearchService,
    private router: Router) { }

  ngOnInit() {
    this.myForm = new FormGroup({
      keyword: new FormControl('', {updateOn: 'change', validators: [Validators.required, this.keywordValidator()]}),
      distance: new FormControl('', { updateOn: 'blur', validators: [this.distanceValidator()] }),
      locationOther: new FormControl({ value: '', disabled: true }, { updateOn: 'blur', validators: [Validators.required, this.keywordValidator()] }),
      location: new FormControl('location-current', { updateOn: 'blur' })
    },
      { updateOn: 'submit' });

    this.filteredKeywordSuggestions = this.keyword.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '')
        })
    );

    this.subscriptions.push(this.locationService.onData.subscribe(data => {
      this.geoCoord = data;
      if (this.clickedSearch) {
        this.clickedSearch = false;
        this.search(data.latitude, data.longitude);
      }
    }));

    this.subscriptions.push(this.searchService.onData.subscribe(data => {
      this.router.navigateByUrl('/results');
    }));

    this.locationService.updateFromCurrent();
  }

  ngOnDestroy(): void {
    console.log('Destroy form', this.subscriptions.length);
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  displayFn(keywordSuggestion: KeywordSuggestion): string {
    return keywordSuggestion && keywordSuggestion.suggestion ? keywordSuggestion.suggestion : '';
  }

  onLocationChanged(e: any): void {
    const value = e.target.value;
    if (value == 'location-other') {
      this.locationOther.enable();
    } else {
      this.locationOther.disable();
    }
  }
  
  onSubmit(): void {
    if (this.myForm.invalid) {
      this.validateFields(this.myForm);
      return;
    }

    this.clickedSearch = true;

    const isOtherLocationChecked: boolean = (<HTMLInputElement>document.getElementById("location-other")).checked;
    if (isOtherLocationChecked) {
      const otherLocation: string= (<HTMLInputElement>document.getElementById("location-other-text")).value;
      this.locationService.updateFromOther(otherLocation);
    } else {
      this.locationService.updateFromCurrent();
    }
  }

  onReset(): void {
    this.keyword.setValue('');
    (<HTMLInputElement>document.getElementById("category")).value = 'category-all';
    this.distance.setValue('');
    (<HTMLInputElement>document.getElementById("units")).value = 'units-miles';
    (<HTMLInputElement>document.getElementById("location-current")).checked = true;
    (<HTMLInputElement>document.getElementById("location-other")).checked = false;
    this.locationOther.setValue('');
    this.locationOther.disable();
    this.validateFields(this.myForm);

    console.log('navgiating to results');
    this.router.navigateByUrl('/results');
    console.log('resetting');
    this.searchService.reset();
  }

  private keywordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const invalid = (!control.value || (control.value && String(control.value).trim().length == 0));
      return invalid ? {keywordInvalid: {value: control.value}} : null;
    };
  }

  private distanceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }
      if (String(control.value).length > 0) {
        const isNumeric = /^\+?\d+$/.test(String(control.value));
        if (isNumeric) {
          return null;
        } else {
          return {distanceInvalid: {value: control.value}}
        }
      } else {
        return null;
      }
    };
  }

  private filter(val: string): Observable<any[]> {
    this.suggestionService.update(val);
    return this.suggestionService.currentData
      .pipe(
        map(response => response.filter((keywordSuggestion: { suggestion: string; }) => {
          return true;
        }))
      );
  }

  private validateFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateFields(control);
      }
    });
  }

  private search(latitude: string, longitude: string): void {
    const keyword: string = (<HTMLInputElement>document.getElementById("keyword")).value;
    const category: string = (<HTMLInputElement>document.getElementById("category")).value;
    let distance: string = (<HTMLInputElement>document.getElementById("distance")).value;
    if (distance.length == 0)
      distance = '10';
    const units: string = (<HTMLInputElement>document.getElementById("units")).value == 'units-miles' ? 'miles' : 'km';
    this.searchService.update(keyword, category, distance, units, latitude, longitude);
  }

  get keyword() {
    return this.myForm.controls['keyword'];
  }

  get distance() {
    return this.myForm.controls['distance'];
  }

  get locationOther() {
    return this.myForm.controls['locationOther'];
  }

  get location() {
    return this.myForm.controls['location'];
  }
}