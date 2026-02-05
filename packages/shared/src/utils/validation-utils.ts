/**
 * Validation Utility Functions
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

export const isValidTIN = (tin: string): boolean => {
  const cleaned = tin.replace(/\D/g, '');
  return cleaned.length === 9;
};

export const isValidZipCode = (zip: string): boolean => {
  const cleaned = zip.replace(/\D/g, '');
  return cleaned.length === 5 || cleaned.length === 9;
};

export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

export const isWithinRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const isRequiredFieldFilled = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return true;
};
