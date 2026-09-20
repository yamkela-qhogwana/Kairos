import { isValidPhoneNumber } from 'libphonenumber-js';

export function isValidPhoneForCountry(nationalNumber: string, countryCode: string): boolean {
  try {
    return isValidPhoneNumber(nationalNumber, countryCode as never);
  } catch {
    return false;
  }
}
