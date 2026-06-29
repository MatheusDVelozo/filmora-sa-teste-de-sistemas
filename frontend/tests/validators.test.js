import { isPuppy, formatCurrency, validateForm } from '../src/utils/validators.js';

describe('validators (frontend)', () => {
  it('isPuppy: retorna true para idade <= 1 (comportamento atual)', () => {
    expect(isPuppy(0)).toBe(true);
    expect(isPuppy(1)).toBe(true);
    expect(isPuppy(2)).toBe(false);
  });

  it('formatCurrency: formata números e produz "$NaN" para undefined', () => {
    expect(formatCurrency(12)).toBe('$12.00');
    expect(formatCurrency(null)).toBe('$0.00');
    expect(formatCurrency(undefined)).toBe('$NaN');
  });

  it('validateForm: valida apenas comprimento das strings (comportamento atual)', () => {
    expect(validateForm('Dog', 'Poodle')).toBe(true);
    expect(validateForm('', '')).toBe(false);
    // comportamento atual aceita strings com espaços
    expect(validateForm(' ', ' ')).toBe(true);
  });
});
