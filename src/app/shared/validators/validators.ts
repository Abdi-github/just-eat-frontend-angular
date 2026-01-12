import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(control.value) ? null : { invalidEmail: true };
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const errors: ValidationErrors = {};
  if (value.length < 8) errors['passwordMin'] = true;
  if (!/[A-Z]/.test(value)) errors['passwordUppercase'] = true;
  if (!/[a-z]/.test(value)) errors['passwordLowercase'] = true;
  if (!/[0-9]/.test(value)) errors['passwordDigit'] = true;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) errors['passwordSpecial'] = true;

  return Object.keys(errors).length ? errors : null;
}

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  // Swiss phone number: +41 followed by 9 digits
  const phoneRegex = /^\+41\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
  return phoneRegex.test(control.value) ? null : { invalidPhone: true };
}

export function postalCodeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  // Swiss postal code: exactly 4 digits
  const postalRegex = /^\d{4}$/;
  return postalRegex.test(control.value) ? null : { invalidPostalCode: true };
}

export function matchFieldValidator(matchTo: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;
    const matchControl = parent.get(matchTo);
    if (!matchControl) return null;
    return control.value === matchControl.value ? null : { passwordsMismatch: true };
  };
}
