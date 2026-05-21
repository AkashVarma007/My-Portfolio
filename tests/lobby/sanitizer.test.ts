import { describe, it, expect } from "vitest";
import { sanitizeUsername, isValidUsername, USERNAME_RULES } from "@/lib/lobby/sanitizer";

describe("isValidUsername", () => {
  it("accepts 3-16 char alphanumeric+underscore", () => {
    expect(isValidUsername("Akash")).toBe(true);
    expect(isValidUsername("a_b_c_d")).toBe(true);
    expect(isValidUsername("user123")).toBe(true);
  });

  it("rejects too short", () => {
    expect(isValidUsername("ab")).toBe(false);
    expect(isValidUsername("")).toBe(false);
  });

  it("rejects too long", () => {
    expect(isValidUsername("a".repeat(17))).toBe(false);
  });

  it("rejects special chars", () => {
    expect(isValidUsername("ak ash")).toBe(false);
    expect(isValidUsername("ak-ash")).toBe(false);
    expect(isValidUsername("ak.ash")).toBe(false);
    expect(isValidUsername("ak<script>")).toBe(false);
  });
});

describe("sanitizeUsername", () => {
  it("trims and lowers", () => {
    expect(sanitizeUsername("  Akash  ")).toBe("Akash");
  });

  it("strips disallowed chars", () => {
    expect(sanitizeUsername("Ak<>ash")).toBe("Akash");
  });

  it("enforces max length", () => {
    expect(sanitizeUsername("a".repeat(50)).length).toBe(USERNAME_RULES.maxLength);
  });
});
