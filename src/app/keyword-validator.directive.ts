import { Directive } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appKeywordValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: KeywordValidatorDirective,
    multi: true
  }]
})
export class KeywordValidatorDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value || (control.value && String(control.value).trim().length == 0)) {
      return { 'keywordInvalid': true };
    }
    return null;
  }
}
