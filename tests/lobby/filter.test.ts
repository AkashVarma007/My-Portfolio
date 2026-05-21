import { describe, it, expect } from "vitest";
import { containsProfanity, cleanText } from "@/lib/lobby/filter";

describe("containsProfanity", () => {
  it("returns false for clean text", () => {
    expect(containsProfanity("hello world")).toBe(false);
    expect(containsProfanity("welcome to the lobby")).toBe(false);
  });

  it("returns true for known profanity", () => {
    expect(containsProfanity("damn this")).toBe(true);
  });
});

describe("cleanText", () => {
  it("passes clean text through", () => {
    expect(cleanText("hello world")).toBe("hello world");
  });

  it("masks profanity with asterisks", () => {
    const result = cleanText("damn this");
    expect(result).not.toContain("damn");
    expect(result).toContain("*");
  });
});
