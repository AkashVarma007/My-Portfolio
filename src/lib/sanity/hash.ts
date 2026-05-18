// src/lib/sanity/hash.ts
/**
 * Deterministic 8-char hex hash for vanity log HASH field.
 * Uses a small FNV-1a 32-bit; runs in edge runtime (no node crypto).
 */
export function vanityHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  hash = (hash ^ (hash >>> 16)) >>> 0;
  const a = hash.toString(16).padStart(8, "0");
  let h2 = hash ^ 0xdeadbeef;
  for (let i = 0; i < input.length; i++) {
    h2 ^= input.charCodeAt((input.length - 1 - i + input.length) % input.length);
    h2 = Math.imul(h2 >>> 0, 0x01000193);
  }
  const b = (h2 >>> 0).toString(16).padStart(8, "0");
  return (a.slice(0, 4) + b.slice(0, 4)).toLowerCase();
}
