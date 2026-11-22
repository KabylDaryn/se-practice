
import type { Room } from './rooms';

export type RoomFilters = {
  attendees: number;
  equipment: string[];
};

export function filterRooms(
  rooms: Room[],
  filters: RoomFilters
): Room[] {
  return rooms.filter(room =>
    room.capacity >= filters.attendees &&
    filters.equipment.every(item =>
      room.equipment.includes(item)
    )
  );
}
