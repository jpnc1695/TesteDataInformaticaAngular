import { FormControl } from '@angular/forms';
import { cpfValidator } from './cpf.validator';

describe('cpfValidator', () => {
  const v = cpfValidator();
  it('aceita CPF válido', () => {
    expect(v(new FormControl('529.982.247-25'))).toBeNull();
  });
  it('rejeita CPF inválido', () => {
    expect(v(new FormControl('11111111111'))).toEqual({ cpf: true });
  });
  it('aceita vazio (deixa required cuidar)', () => {
    expect(v(new FormControl(''))).toBeNull();
  });
});