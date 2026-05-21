export const USERNAME_RULES = {
  minLength: 3,
  maxLength: 16,
  pattern: /^[A-Za-z0-9_]+$/,
} as const;

export function isValidUsername(value: string): boolean {
  if (value.length < USERNAME_RULES.minLength) return false;
  if (value.length > USERNAME_RULES.maxLength) return false;
  return USERNAME_RULES.pattern.test(value);
}

export function sanitizeUsername(value: string): string {
  return value
    .trim()
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, USERNAME_RULES.maxLength);
}
