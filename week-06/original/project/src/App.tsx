import { useMemo, useState } from 'react';
import { Building2, Clock, DoorOpen, Sparkles } from 'lucide-react';
import type { Booking, CheckResult, Interval, Room } from '@/types';
import { SAMPLE_BOOKINGS, SAMPLE_ROOMS } from '@/sampleData';
import { checkAvailability, fmt, timeToMinutes } from '@/utils/availability';
import { RoomCard } from '@/components/RoomCard';
import { DecisionBanner } from '@/components/DecisionBanner';
import { Timeline } from '@/components/Timeline';

function nowMinutesToday(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function minutesToInput(min: number): string {
  const m = Math.max(0, Math.min(1440, Math.round(min)));
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

export default function App() {
  const [bookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [nowMinutes] = useState<number>(nowMinutesToday());

  const room: Room | undefined = useMemo(
    () => SAMPLE_ROOMS.find((r) => r.id === selectedRoomId),
    [selectedRoomId],
  );

  const interval: Interval = useMemo(
    () => ({ start: timeToMinutes(startTime), end: timeToMinutes(endTime) }),
    [startTime, endTime],
  );

  const result: CheckResult | null = useMemo(() => {
    if (!selectedRoomId) return null;
    return checkAvailability({ room, interval, nowMinutes, bookings });
  }, [selectedRoomId, room, interval, nowMinutes, bookings]);

  const lengthMin =
    Number.isFinite(interval.start) && Number.isFinite(interval.end) && interval.end > interval.start
      ? interval.end - interval.start
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 text-sky-700 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            Campus Spaces
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Smart Campus Room Availability
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Check whether a campus room is free for your proposed time slot. This is a
            read-only checker — existing bookings are never modified.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <Clock className="w-3.5 h-3.5" />
            Current time: <span className="font-semibold text-slate-700">{fmt(nowMinutes)}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Room selection */}
          <section className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <DoorOpen className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-700">Select a room</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_ROOMS.map((r) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  selectedId={selectedRoomId}
                  onSelect={setSelectedRoomId}
                />
              ))}
            </div>
          </section>

          {/* Time + decision */}
          <section className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-700">Propose an interval</h2>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">Start</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">End</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </label>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div>
                  Duration:{' '}
                  <span className="font-medium text-slate-700">
                    {lengthMin !== null ? `${lengthMin} min` : '—'}
                  </span>
                  {lengthMin !== null && lengthMin > 120 && (
                    <span className="text-rose-600"> (exceeds 120 min limit)</span>
                  )}
                </div>
                <div>
                  Window must be 00:00–24:00, start after {fmt(nowMinutes)}, and ≤ 120 min.
                </div>
              </div>

              <DecisionBanner result={result} roomName={room?.name} />
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-100/70 rounded-lg p-3">
              <Building2 className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
              <span>
                Touching endpoints are allowed (e.g. an interval ending at 10:00 may follow one
                starting at 10:00). Blocked rooms are always rejected.
              </span>
            </div>
          </section>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <Timeline
            room={room}
            bookings={bookings}
            pendingStart={Number.isFinite(interval.start) ? interval.start : null}
            pendingEnd={Number.isFinite(interval.end) ? interval.end : null}
          />
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Fictional sample data · Read-only availability checker
        </footer>
      </div>
    </div>
  );
}
