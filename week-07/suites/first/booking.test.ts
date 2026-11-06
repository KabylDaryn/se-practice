import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// TODO: point this at the module the page actually imports canBook from.
import { canBook } from "../src/booking";

type Booking = { start: number; end: number };

// Fresh fixture on every call: no shared mutable state between tests.
function makeDefaults() {
  return {
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }] as Booking[],
  };
}

function check(
  start: number,
  end: number,
  overrides: Partial<ReturnType<typeof makeDefaults>> = {}
) {
  const fixture = { ...makeDefaults(), ...overrides };
  return canBook({ start, end, ...fixture });
}

describe("canBook", () => {
  beforeEach(() => {
    // Fixed wall-clock time in case the function or its dependencies read Date.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T09:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("AC1: 0 <= start < end <= 1440 and start > now", () => {
    it("T02: rejects start equal to now (540-570)", () => {
      expect(check(540, 570)).toBe(false);
    });

    it("T03: rejects zero-length range (720-720)", () => {
      expect(check(720, 720)).toBe(false);
    });

    it("T04: rejects start after end (750-720)", () => {
      expect(check(750, 720)).toBe(false);
    });

    it("T05: rejects end beyond 1440 (1380-1441)", () => {
      expect(check(1380, 1441)).toBe(false);
    });

    it("X1: accepts end exactly at 1440 (1439-1440)", () => {
      expect(check(1439, 1440)).toBe(true);
    });
  });

  describe("AC2: maximum duration is 120 minutes", () => {
    it("T06: accepts exactly 120 minutes (720-840)", () => {
      expect(check(720, 840)).toBe(true);
    });

    it("T07: rejects 121 minutes (720-841)", () => {
      expect(check(720, 841)).toBe(false);
    });
  });

  describe("AC3: blocked rooms are unavailable", () => {
    it("T13: rejects an otherwise valid request when blocked (660-720)", () => {
      expect(check(660, 720, { blocked: true })).toBe(false);
    });
  });

  describe("AC4: overlaps rejected, touching endpoints allowed", () => {
    it("T01: accepts range starting at existing end (660-720)", () => {
      expect(check(660, 720)).toBe(true);
    });

    it("T08: accepts range ending at existing start (570-600)", () => {
      expect(check(570, 600)).toBe(true);
    });

    it("T09: rejects overlap at the tail (630-690)", () => {
      expect(check(630, 690)).toBe(false);
    });

    it("T10: rejects overlap at the head (570-690)", () => {
      expect(check(570, 690)).toBe(false);
    });

    it("T11: rejects range fully inside existing booking (615-645)", () => {
      expect(check(615, 645)).toBe(false);
    });

    it("T12: rejects identical range (600-660)", () => {
      expect(check(600, 660)).toBe(false);
    });

    it("T14: accepts the same range when there are no bookings (630-690)", () => {
      expect(check(630, 690, { bookings: [] })).toBe(true);
    });

    it("X2: accepts a slot between two touching bookings (660-720)", () => {
      const bookings: Booking[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      expect(check(660, 720, { bookings })).toBe(true);
    });
  });

  describe("AC5: existing booking data is not changed", () => {
    it("leaves bookings unchanged after an available request", () => {
      const defaults = makeDefaults();
      const before = structuredClone(defaults.bookings);
      const firstBooking = defaults.bookings[0];

      const result = canBook({ start: 660, end: 720, ...defaults });

      expect(result).toBe(true);
      expect(defaults.bookings).toEqual(before);
      expect(defaults.bookings).toHaveLength(1);
      expect(defaults.bookings[0]).toBe(firstBooking); // same object, not replaced
    });

    it("leaves bookings unchanged after an unavailable request", () => {
      const defaults = makeDefaults();
      const before = structuredClone(defaults.bookings);

      const result = canBook({ start: 630, end: 690, ...defaults });

      expect(result).toBe(false);
      expect(defaults.bookings).toEqual(before);
    });

    it("does not mutate a frozen bookings array or its entries", () => {
      const bookings = Object.freeze([
        Object.freeze({ start: 600, end: 660 }),
      ]) as unknown as Booking[];

      // Under strict-mode ESM, any write to frozen data would throw here.
      expect(() =>
        canBook({ start: 660, end: 720, now: 540, blocked: false, bookings })
      ).not.toThrow();
      expect(bookings).toEqual([{ start: 600, end: 660 }]);
    });
  });
});