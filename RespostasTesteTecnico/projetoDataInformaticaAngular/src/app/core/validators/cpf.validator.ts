import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = String(control.value ?? '').replace(/\D/g, '');
    if (!cpf) return null;
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return { cpf: true };

    const calcDigit = (slice: string) => {
      const sum = slice
        .split('')
        .reduce((acc, d, i) => acc + Number(d) * (slice.length + 1 - i), 0);
      const rest = (sum * 10) % 11;
      return rest === 10 ? 0 : rest;
    };

    if (calcDigit(cpf.slice(0, 9)) !== Number(cpf[9])) return { cpf: true };
    if (calcDigit(cpf.slice(0, 10)) !== Number(cpf[10])) return { cpf: true };
    return null;
  };
}