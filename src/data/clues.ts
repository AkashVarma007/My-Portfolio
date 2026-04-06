export interface Clue {
  id: number;
  tier: 1 | 2 | 3 | 4;
  title: string;
  hint: string;
  location: string;
  prerequisite: number | null;
}

export const CLUES: Clue[] = [
  { id: 1, tier: 1, title: "Enter the Arcade", hint: "The portfolio ends — but something begins. Find the arcade.", location: "arcade", prerequisite: null },
  { id: 2, tier: 1, title: "The Void Entry", hint: "You already found the void. Look closer.", location: "void", prerequisite: 1 },
  { id: 3, tier: 1, title: "The Flicker", hint: "Something in the darkness blinks differently.", location: "void", prerequisite: 2 },
  { id: 4, tier: 1, title: "The Constellation", hint: "The orbiting icons hold a secret order.", location: "hero", prerequisite: 3 },
  { id: 5, tier: 1, title: "The Hidden Field", hint: "The terminal knows more than it shows.", location: "about", prerequisite: 4 },
  { id: 6, tier: 2, title: "The Bright Letters", hint: "Some letters in the stream shine brighter.", location: "marquee", prerequisite: 5 },
  { id: 7, tier: 2, title: "The Answer", hint: "In Snake, the answer to everything is 42.", location: "arcade-snake", prerequisite: 6 },
  { id: 8, tier: 2, title: "The Lost Sequence", hint: "The years are out of order. Start at the present, then loop back to the beginning, and return to the middle.", location: "journey", prerequisite: 7 },
  { id: 9, tier: 2, title: "The Numbers Station", hint: "Skill levels aren't just percentages.", location: "skills", prerequisite: 8 },
  { id: 10, tier: 3, title: "The Color Code", hint: "The final wall tells a colorful story.", location: "arcade-breakout", prerequisite: 9 },
  { id: 11, tier: 3, title: "The Wrong Coordinates", hint: "The map isn't pointing where you think.", location: "contact", prerequisite: 10 },
  { id: 12, tier: 3, title: "The Particle Message", hint: "Particles aren't always random.", location: "particles", prerequisite: 11 },
  { id: 13, tier: 3, title: "The Invasion Pattern", hint: "Wave 10 invaders march to a beat.", location: "arcade-invaders", prerequisite: 12 },
  { id: 14, tier: 4, title: "The Console", hint: "↑↑↓↓←→←→BA", location: "terminal", prerequisite: 13 },
  { id: 15, tier: 4, title: "The Passphrase", hint: "The itch that opens every door.", location: "terminal", prerequisite: 14 },
  { id: 16, tier: 4, title: "The End", hint: "Enter the passphrase. Find the door.", location: "secret", prerequisite: 15 },
];

export const TIER_NAMES: Record<number, string> = {
  1: "Curiosity",
  2: "Pattern",
  3: "Cryptography",
  4: "The Gauntlet",
};

export const TOTAL_CLUES = CLUES.length;
