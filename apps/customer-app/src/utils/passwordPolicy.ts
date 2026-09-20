// Matches Instagram's actual rule: 6+ characters, no forced uppercase/
// number/symbol — just long enough, and not a well-known weak password.
export const MIN_PASSWORD_LENGTH = 6;

const COMMON_WEAK_PASSWORDS = new Set([
  'password', 'password1', 'password12', 'password123',
  '123456', '1234567', '12345678', '123456789', '1234567890',
  'qwerty', 'qwerty123', 'qwerty12345',
  '111111', '000000', '123123',
  'abc123', 'letmein', 'welcome', 'monkey', 'dragon',
  'iloveyou', 'admin', 'football', 'baseball',
]);

export function isWeakPassword(
  password: string,
  email: string,
  firstName: string = '',
  lastName: string = '',
): boolean {
  const lower = password.toLowerCase();
  if (COMMON_WEAK_PASSWORDS.has(lower)) return true;
  if (/^\d+$/.test(password)) return true; // fully numeric
  if (/^[a-zA-Z]+$/.test(password) && new Set(lower).size <= 2) return true; // e.g. "aaaaaa"
  const emailLocalPart = email.split('@')[0]?.toLowerCase();
  if (emailLocalPart && emailLocalPart.length >= 4 && lower === emailLocalPart) return true;
  if (firstName && lower === firstName.toLowerCase()) return true;
  if (lastName && lower === lastName.toLowerCase()) return true;
  return false;
}
