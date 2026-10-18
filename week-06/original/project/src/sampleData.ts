import type { Booking, Room } from './types';

export const SAMPLE_ROOMS: Room[] = [
  { id: 'r1', name: 'Aurora Hall', building: 'North Wing', capacity: 40, blocked: false },
  { id: 'r2', name: 'Beacon Room', building: 'North Wing', capacity: 12, blocked: false },
  { id: 'r3', name: 'Cascade Lab', building: 'East Wing', capacity: 24, blocked: true },
  { id: 'r4', name: 'Dover Study', building: 'South Wing', capacity: 8, blocked: false },
  { id: 'r5', name: 'Elm Lecture', building: 'West Wing', capacity: 120, blocked: false },
];

// Bookings are expressed in minutes from 00:00. Touching endpoints are allowed.
export const SAMPLE_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, owner: 'Prof. Lindgren' }, // 09:00 - 10:00
  { id: 'b2', roomId: 'r1', start: 780, end: 840, owner: 'Dr. Okafor' }, // 13:00 - 14:00
  { id: 'b3', roomId: 'r2', start: 600, end: 660, owner: 'TA Morales' }, // 10:00 - 11:00
  { id: 'b4', roomId: 'r4', start: 480, end: 540, owner: 'Study Group A' }, // 08:00 - 09:00
  { id: 'b5', roomId: 'r5', start: 900, end: 960, owner: 'Dept. of Sciences' }, // 15:00 - 16:00
];
