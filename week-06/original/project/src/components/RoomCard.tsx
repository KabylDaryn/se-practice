import { DoorClosed, DoorOpen, Lock, Users } from 'lucide-react';
import type { Room } from '@/types';

interface RoomCardProps {
  room: Room;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RoomCard({ room, selectedId, onSelect }: RoomCardProps) {
  const selected = room.id === selectedId;
  return (
    <button
      type="button"
      onClick={() => onSelect(room.id)}
      disabled={room.blocked}
      className={[
        'w-full text-left rounded-xl border p-3 transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
        room.blocked
          ? 'border-rose-200 bg-rose-50/60 cursor-not-allowed opacity-75'
          : selected
            ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-300'
            : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {room.blocked ? (
            <Lock className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <DoorOpen className="w-4 h-4 text-sky-600 shrink-0" />
          )}
          <span className="font-medium text-slate-800 truncate">{room.name}</span>
        </div>
        <DoorClosed className="w-4 h-4 text-slate-300 shrink-0" />
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
        <span>{room.building}</span>
        <span className="inline-flex items-center gap-1">
          <Users className="w-3 h-3" /> {room.capacity}
        </span>
        {room.blocked && <span className="text-rose-600 font-medium">Blocked</span>}
      </div>
    </button>
  );
}
