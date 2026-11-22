
import type { Interval, Room } from './rooms';

export type BookingRequest = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
};

export function canBook(request: BookingRequest): boolean {
  const { start, end, now, blocked, bookings } = request;

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    !Number.isInteger(now)
  ) return false;

  if (start < 0 || end > 1440 || now < 0 || now > 1440) {
    return false;
  }

  if (start >= end || start <= now) return false;
  if (end - start > 120) return false;
  if (blocked) return false;

  for (const booking of bookings) {
    if (start < booking.end && end > booking.start) {
      return false;
    }
  }

  return true;
}

export function checkRoom(
  rooms: Room[],
  roomId: string,
  request: Pick<BookingRequest, 'start' | 'end' | 'now'>
): boolean {
  const room = rooms.find(r => r.id === roomId);

  if (!room) return false;

  return canBook({
    ...request,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}
