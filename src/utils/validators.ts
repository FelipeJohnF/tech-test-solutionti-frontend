import { stripMask } from "./masks";

/**
 * Validates Brazilian CPF format and check digits (Modulo 11).
 */
export const isValidCPF = (cpfValue?: string | null): boolean => {
  if (!cpfValue) return false;

  const clean = stripMask(cpfValue);

  // Must have exactly 11 digits
  if (clean.length !== 11) return false;

  // Reject known invalid combinations with repeating digits
  if (/^(\d)\1{10}$/.test(clean)) return false;

  // Validate 1st check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let firstCheck = 11 - (sum % 11);
  if (firstCheck >= 10) firstCheck = 0;
  if (firstCheck !== parseInt(clean.charAt(9), 10)) return false;

  // Validate 2nd check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  let secondCheck = 11 - (sum % 11);
  if (secondCheck >= 10) secondCheck = 0;
  if (secondCheck !== parseInt(clean.charAt(10), 10)) return false;

  return true;
};