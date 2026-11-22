
export type Interval = {
  start: number;
  end: number;
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b204',
    name: 'Room B-204',
    capacity: 40,
    equipment: ['Projector', 'Computers', 'Whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'c305',
    name: 'Room C-305',
    capacity: 15,
    equipment: ['Whiteboard'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'd410',
    name: 'Room D-410',
    capacity: 60,
    equipment: ['Projector', 'Microphone'],
    blocked: false,
    bookings: [{ start: 780, end: 840 }],
  },
];
