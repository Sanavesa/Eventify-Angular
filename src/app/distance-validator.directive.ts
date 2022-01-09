import { Directive } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appDistanceValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DistanceValidatorDirective,
    multi: true
  }]
})
export class DistanceValidatorDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value == null) {
      return null;
    }
    if (String(control.value).length > 0) {
      const isNumeric = /^\+?\d+$/.test(String(control.value));
      if (isNumeric) {
        return null;
      } else {
        return { 'distanceInvalid': true };
      }
    } else {
      return null;
    }
  }
}
