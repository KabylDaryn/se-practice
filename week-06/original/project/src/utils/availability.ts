import {
  MAX_BOOKING_LENGTH,
  MINUTES_PER_DAY,
  type Booking,
  type CheckResult,
  type Interval,
  type Room,
} from '@/types';

// AC4: overlap when start < otherEnd AND end > otherStart. Touching endpoints allowed.
function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && a.end > b.start;
}

export interface CheckInput {
  room: Room | undefined;
  interval: Interval;
  nowMinutes: number; // current time in minutes from 00:00
  bookings: Booking[];
}

export function checkAvailability(input: CheckInput): CheckResult {
  const { room, interval, nowMinutes, bookings } = input;
  const reasons: string[] = [];

  if (!room) {
    return { decision: 'unavailable', reasons: ['Select a room first.'] };
  }

  // AC1: 0 <= start < end <= 1440 and start after current time.
  if (!Number.isFinite(interval.start) || !Number.isFinite(interval.end)) {
    reasons.push('Enter both a start and end time.');
  } else {
    if (interval.start < 0 || interval.start >= MINUTES_PER_DAY) {
      reasons.push('Start time must be between 00:00 and 23:59.');
    }
    if (interval.end < 0 || interval.end > MINUTES_PER_DAY) {
      reasons.push('End time must be between 00:00 and 24:00.');
    }
    if (
      interval.start >= 0 &&
      interval.start <= MINUTES_PER_DAY &&
      interval.end >= 0 &&
      interval.end <= MINUTES_PER_DAY &&
      interval.start >= interval.end
    ) {
      reasons.push('Start time must be earlier than end time.');
    }
    if (interval.start < nowMinutes) {
      reasons.push('Start time must be after the current time.');
    }
  }

  // AC2: booking longer than 120 minutes.
  if (
    Number.isFinite(interval.start) &&
    Number.isFinite(interval.end) &&
    interval.end > interval.start &&
    interval.end - interval.start > MAX_BOOKING_LENGTH
  ) {
    reasons.push('Bookings cannot be longer than 120 minutes.');
  }

  // AC3: blocked room.
  if (room.blocked) {
    reasons.push(`${room.name} is currently blocked and cannot be booked.`);
  }

  // AC4: overlap with existing bookings for this room.
  const roomBookings = bookings.filter((b) => b.roomId === room.id);
  const collisions = roomBookings.filter((b) => overlaps(interval, b));
  if (collisions.length > 0) {
    const first = collisions[0];
    reasons.push(
      `Overlaps an existing booking (${fmt(first.start)}–${fmt(first.end)}, ${first.owner}).`,
    );
  }

  return { decision: reasons.length === 0 ? 'available' : 'unavailable', reasons };
}

export function fmt(minutes: number): string {
  const m = Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(minutes)));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function timeToMinutes(value: string): number {
  if (!value) return NaN;
  const [h, m] = value.split(':').map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
  return h * 60 + m;
}
