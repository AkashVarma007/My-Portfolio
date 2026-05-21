import { Filter } from "bad-words";

const filter = new Filter();

export function containsProfanity(text: string): boolean {
  return filter.isProfane(text);
}

export function cleanText(text: string): string {
  if (!containsProfanity(text)) return text;
  return filter.clean(text);
}
