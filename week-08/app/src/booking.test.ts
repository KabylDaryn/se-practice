import { describe, it, expect } from "vitest";
// Assumes this file sits next to the module in src/. Adjust if canBook lives elsewhere.
import { canBook } from "./booking";

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
  return canBook({ start, end, ...makeDefaults(), ...overrides });
}

describe("canBook", () => {
  describe("AC1: 0 <= start < end <= 1440 and start > now", () => {
    it("T02: rejects start equal to now (540-570)", () => {
      expect(check(540, 570)).toBe(false);
    });

    it("N01: accepts start one minute after now (541-570)", () => {
      expect(check(541, 570)).toBe(true);
    });

    it("N02: rejects start before now (539-570)", () => {
      expect(check(539, 570)).toBe(false);
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

    // Derived from AC1 text, not in the reviewed table: needs approval.
    it("N03: accepts start = 0 when now is below it (now=-1, 0-30)", () => {
      expect(check(0, 30, { now: -1 })).toBe(true);
    });

    it("N04: rejects negative start even when start > now (now=-2, -1-30)", () => {
      expect(check(-1, 30, { now: -2 })).toBe(false);
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

    it("T10: rejects range enclosing the existing booking (570-690)", () => {
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

    it("N05: rejects a 1-minute overlap at the existing start (570-601)", () => {
      expect(check(570, 601)).toBe(false);
    });

    it("N06: rejects a 1-minute overlap at the existing end (659-720)", () => {
      expect(check(659, 720)).toBe(false);
    });

    it("X2: accepts a slot between two touching bookings (660-720)", () => {
      const bookings: Booking[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      expect(check(660, 720, { bookings })).toBe(true);
    });

    it("N07: rejects overlap with the second booking only (715-775)", () => {
      const bookings: Booking[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      expect(check(715, 775, { bookings })).toBe(false);
    });

    it("N08a: accepts a free slot when bookings are unsorted (660-720)", () => {
      const bookings: Booking[] = [
        { start: 720, end: 780 },
        { start: 600, end: 660 },
      ];
      expect(check(660, 720, { bookings })).toBe(true);
    });

    it("N08b: rejects an overlap when bookings are unsorted (630-690)", () => {
      const bookings: Booking[] = [
        { start: 720, end: 780 },
        { start: 600, end: 660 },
      ];
      expect(check(630, 690, { bookings })).toBe(false);
    });
  });

  describe("AC5: existing booking data is not changed", () => {
    // Two bookings in non-sorted order, so an in-place sort would change the data.
    function makeUnsorted(): Booking[] {
      return [
        { start: 720, end: 780 },
        { start: 600, end: 660 },
      ];
    }

    it("AC5: leaves bookings unchanged after an available request", () => {      
      const bookings = makeUnsorted();
      const before = structuredClone(bookings);
      const refs = [...bookings];

      const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });

      expect(result).toBe(true);
      expect(bookings).toStrictEqual(before);
      expect(bookings[0]).toBe(refs[0]);
      expect(bookings[1]).toBe(refs[1]);
    });

    it("leaves bookings unchanged after an unavailable request", () => {
      const bookings = makeUnsorted();
      const before = structuredClone(bookings);

      const result = canBook({ start: 630, end: 690, now: 540, blocked: false, bookings });

      expect(result).toBe(false);
      expect(bookings).toStrictEqual(before);
    });

    it("does not write to frozen bookings, and still returns the right decision", () => {
      const bookings = Object.freeze([
        Object.freeze({ start: 600, end: 660 }),
      ]) as unknown as Booking[];

      // ESM is strict mode, so any write to frozen data throws.
      const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });

      expect(result).toBe(true);
      expect(bookings).toStrictEqual([{ start: 600, end: 660 }]);
    });
  });
});