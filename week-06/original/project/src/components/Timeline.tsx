import { fmt } from '@/utils/availability';
import type { Booking, Room } from '@/types';

interface TimelineProps {
  room: Room | undefined;
  bookings: Booking[];
  pendingStart: number | null;
  pendingEnd: number | null;
}

// A simple 06:00 - 22:00 visual timeline.
const DAY_START = 6 * 60;
const DAY_END = 22 * 60;
const SPAN = DAY_END - DAY_START;

function pos(min: number): number {
  const clamped = Math.max(DAY_START, Math.min(DAY_END, min));
  return ((clamped - DAY_START) / SPAN) * 100;
}

export function Timeline({ room, bookings, pendingStart, pendingEnd }: TimelineProps) {
  const roomBookings = bookings.filter((b) => room && b.roomId === room.id);

  const ticks = [6, 9, 12, 15, 18, 21].map((h) => h * 60);

  const hasPending =
    pendingStart !== null &&
    pendingEnd !== null &&
    Number.isFinite(pendingStart) &&
    Number.isFinite(pendingEnd) &&
    pendingEnd > pendingStart;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-700">
          Today's schedule {room ? `· ${room.name}` : ''}
        </h3>
        <span className="text-xs text-slate-400">06:00 – 22:00</span>
      </div>

      <div className="relative h-12 rounded-md bg-slate-100 overflow-hidden">
        {roomBookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-1 bottom-1 rounded bg-slate-400/80 text-[10px] text-white px-1 flex items-center overflow-hidden"
            style={{ left: `${pos(b.start)}%`, width: `${Math.max(0.5, pos(b.end) - pos(b.start))}%` }}
            title={`${fmt(b.start)}–${fmt(b.end)} · ${b.owner}`}
          >
            <span className="truncate">{fmt(b.start)}–{fmt(b.end)}</span>
          </div>
        ))}

        {hasPending && (
          <div
            className="absolute top-0 bottom-0 border-2 border-dashed border-sky-500 bg-sky-200/40"
            style={{
              left: `${pos(pendingStart!)}%`,
              width: `${Math.max(0.5, pos(pendingEnd!) - pos(pendingStart!))}%`,
            }}
            title="Proposed interval"
          />
        )}
      </div>

      <div className="relative h-4 mt-1 text-[10px] text-slate-400">
        {ticks.map((t) => (
          <span key={t} className="absolute -translate-x-1/2" style={{ left: `${pos(t)}%` }}>
            {fmt(t)}
          </span>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-400 inline-block" /> Existing booking
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-dashed border-sky-500 bg-sky-200/40 inline-block" />
          Proposed interval
        </span>
      </div>
    </div>
  );
}
