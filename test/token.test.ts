import { describe, it, expect } from "vitest";
import { generateInvitationToken, generateId } from "../worker/domain/token";

describe("Token Generator (Web Crypto)", () => {
  it("generates a token of default length 24", () => {
    const token = generateInvitationToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBe(24);
  });

  it("generates URL-safe base62 characters only", () => {
    const token = generateInvitationToken({ length: 32 });
    expect(token.length).toBe(32);
    expect(/^[0-9A-Za-z]+$/.test(token)).toBe(true);
  });

  it("throws when length is less than 16", () => {
    expect(() => generateInvitationToken({ length: 12 })).toThrow(/entropy/i);
  });

  it("generates distinct tokens in a sample of 1,000 values without collisions", () => {
    const sampleSize = 1000;
    const tokens = new Set<string>();

    for (let i = 0; i < sampleSize; i++) {
      const token = generateInvitationToken();
      expect(tokens.has(token)).toBe(false);
      tokens.add(token);
    }

    expect(tokens.size).toBe(sampleSize);
  });

  it("generates valid prefixed UUIDs", () => {
    const eventId = generateId("evt");
    expect(eventId.startsWith("evt_")).toBe(true);
    expect(eventId.length).toBeGreaterThan(20);
  });
});