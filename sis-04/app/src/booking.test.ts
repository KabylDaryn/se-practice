import { describe, it, expect } from 'vitest';
import { canBook, checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const rooms: Room[] = [
  {
    id: 'a',
    name: 'Room A',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b',
    name: 'Room B',
    capacity: 40,
    equipment: ['Projector', 'Computers', 'Whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'c',
    name: 'Room C',
    capacity: 15,
    equipment: ['Whiteboard'],
    blocked: true,
    bookings: [],
  },
];

const request = {
  start: 660,
  end: 720,
  now: 540,
  blocked: false,
  bookings: [{ start: 600, end: 660 }],
};

describe('Original acceptance criteria', () => {
  it('AC1 rejects invalid time boundaries', () => {
    expect(canBook({ ...request, start: -1 })).toBe(false);
    expect(canBook({ ...request, end: 1500 })).toBe(false);
    expect(canBook({ ...request, start: 500 })).toBe(false);
  });

  it('AC2 rejects bookings longer than 120 minutes', () => {
    expect(canBook({ ...request, end: 781 })).toBe(false);
  });

  it('AC3 rejects blocked rooms', () => {
    expect(canBook({ ...request, blocked: true })).toBe(false);
  });

  it('AC4 rejects overlapping bookings', () => {
    expect(canBook({ ...request, start: 650 })).toBe(false);
  });

  it('AC5 does not mutate existing bookings', () => {
    const bookings = [{ start: 600, end: 660 }];
    const before = JSON.stringify(bookings);

    canBook({ ...request, bookings });

    expect(JSON.stringify(bookings)).toBe(before);
  });
});

describe('Feature requirements', () => {
  it('F1 filters by room capacity', () => {
    const result = filterRooms(rooms, {
      attendees: 30,
      equipment: [],
    });

    expect(result.map(r => r.id)).toEqual(['b']);
  });

  it('F2 requires ALL selected equipment', () => {
    const result = filterRooms(rooms, {
      attendees: 1,
      equipment: ['Projector', 'Computers'],
    });

    expect(result.map(r => r.id)).toEqual(['b']);
  });

  it('F3 rejects a blocked room', () => {
    expect(checkRoom(rooms, 'c', {
      start: 660,
      end: 720,
      now: 540,
    })).toBe(false);
  });

  it('F4 returns an empty list when no rooms match', () => {
    expect(filterRooms(rooms, {
      attendees: 100,
      equipment: [],
    })).toEqual([]);
  });

  it('F5 uses the selected rooms own bookings', () => {
    const times = { start: 600, end: 660, now: 540 };

    expect(checkRoom(rooms, 'a', times)).toBe(false);
    expect(checkRoom(rooms, 'b', times)).toBe(true);
  });
});

describe('Boundary tests', () => {
  it('B1 accepts exactly 120 minutes', () => {
    expect(canBook({
      ...request,
      start: 660,
      end: 780,
    })).toBe(true);
  });

  it('B2 rejects 121 minutes', () => {
    expect(canBook({
      ...request,
      start: 660,
      end: 781,
    })).toBe(false);
  });

  it('B3 accepts touching bookings', () => {
    expect(canBook(request)).toBe(true);
  });

  it('B4 rejects overlapping bookings', () => {
    expect(canBook({
      ...request,
      start: 659,
    })).toBe(false);
  });

  it('B5 includes room when capacity equals attendees', () => {
    expect(filterRooms(rooms, {
      attendees: 20,
      equipment: [],
    }).map(r => r.id)).toContain('a');
  });

  it('B6 excludes room when capacity is one below attendees', () => {
    expect(filterRooms(rooms, {
      attendees: 21,
      equipment: [],
    }).map(r => r.id)).not.toContain('a');
  });
});

describe('Integration', () => {
  it('INT filters rooms and checks the returned room', () => {
    const filtered = filterRooms(rooms, {
      attendees: 30,
      equipment: ['Computers'],
    });

    expect(filtered.map(r => r.id)).toEqual(['b']);

    expect(checkRoom(filtered, filtered[0].id, {
      start: 600,
      end: 660,
      now: 540,
    })).toBe(true);
  });
});
