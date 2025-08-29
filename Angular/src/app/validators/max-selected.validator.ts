import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// custom validator for maximum selected options
export function maxSelectedValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && Array.isArray(control.value) && control.value.length > max) {
      return { maxSelected: true };
    }
    return null;
  };
}
