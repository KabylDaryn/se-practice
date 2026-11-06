
type Booking = {
  start: number;
  end: number;
};

type BookingInput = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
};

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: BookingInput): boolean {
  if (!(0 <= start && start < end && end <= 1440)) {
    return false;
  }

  if (start <= now) return false;

  if (end - start > 120) return false;

  if (blocked) return false;

  for (const booking of bookings) {
    if (start < booking.end && end > booking.start) {
      return false;
    }
  }

  return true;
}
