import { useMemo, useState } from "react";
import {
  Clock,
  DoorOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CalendarX2,
  CalendarRange,
  Ban,
} from "lucide-react";

const ROOM_NAME = "Room A-101";

const CURRENT_MINUTE = 540; // 09:00
const BOOKINGS: { start: number; end: number; label: string }[] = [
  { start: 600, end: 660, label: "10:00 – 11:00" },
];

const MAX_DURATION = 120;
const MIN_MINUTE = 0;
const MAX_MINUTE = 1440;

type CheckOutcome =
  | { kind: "available"; reason: string }
  | { kind: "unavailable"; reason: string }
  | { kind: "validation"; reason: string };

function toMinute(time: string): number | null {
  // Expects "HH:MM"
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  return h * 60 + min;
}

function toTime(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  // Touching at an endpoint is NOT overlap.
  return aStart < bEnd && bStart < aEnd;
}

function App() {
  const [startInput, setStartInput] = useState("09:30");
  const [endInput, setEndInput] = useState("10:30");
  const [blocked, setBlocked] = useState(false);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);

  const currentTimeLabel = toTime(CURRENT_MINUTE);

  const requestedStart = useMemo(() => toMinute(startInput), [startInput]);
  const requestedEnd = useMemo(() => toMinute(endInput), [endInput]);

  function handleCheck() {
    const start = requestedStart;
    const end = requestedEnd;

    // Basic parsing / structural validation first.
    if (start === null || end === null) {
      setOutcome({ kind: "validation", reason: "Please enter valid times for both start and end." });
      return;
    }
    if (start < MIN_MINUTE || end > MAX_MINUTE) {
      setOutcome({
        kind: "validation",
        reason: "Times must stay within the day (00:00 to 24:00).",
      });
      return;
    }
    if (start >= end) {
      setOutcome({
        kind: "validation",
        reason: "The end time must be later than the start time.",
      });
      return;
    }
    if (start <= CURRENT_MINUTE) {
      setOutcome({
        kind: "validation",
        reason:
          "Choose a start time later than the current time (" +
          currentTimeLabel +
          "). Starting exactly at the current time is not allowed.",
      });
      return;
    }
    const duration = end - start;
    if (duration > MAX_DURATION) {
      setOutcome({
        kind: "validation",
        reason:
          "The booking duration must be at most " +
          MAX_DURATION +
          " minutes. Your request is " +
          duration +
          " minutes.",
      });
      return;
    }

    // AC3: blocked room.
    if (blocked) {
      setOutcome({
        kind: "unavailable",
        reason: "This room is currently blocked and cannot be booked.",
      });
      return;
    }

    // AC4: overlap with existing bookings (endpoint touching is fine).
    const clash = BOOKINGS.find((b) => overlaps(start, end, b.start, b.end));
    if (clash) {
      setOutcome({
        kind: "unavailable",
        reason:
          "Your requested time overlaps with an existing booking (" +
          clash.label +
          "). Times that only touch at an endpoint are fine — try starting at " +
          toTime(clash.end) +
          " or later.",
      });
      return;
    }

    // AC5: available — no booking is created.
    setOutcome({
      kind: "available",
      reason:
        "This time is free. No booking has been made — this is a check only.",
    });
  }

  const resultStyles =
    outcome?.kind === "available"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : outcome?.kind === "unavailable"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : outcome?.kind === "validation"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-slate-50 px-3 py-1 text-xs font-medium tracking-wide uppercase">
            <CalendarRange className="h-3.5 w-3.5" />
            Smart Campus
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Room Availability Checker
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Check whether a time slot is free before you book. This tool never
            creates or confirms a booking — it only checks availability.
          </p>
        </header>

        {/* Room card */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <DoorOpen className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Selected room
                </p>
                <p className="truncate text-lg font-semibold text-slate-900">
                  {ROOM_NAME}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
              <Clock className="h-4 w-4" />
              <div className="text-right leading-tight">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  Current time
                </p>
                <p className="text-sm font-semibold tabular-nums">
                  {currentTimeLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-5">
            <DayTimeline
              current={CURRENT_MINUTE}
              bookings={BOOKINGS}
              requested={
                requestedStart !== null && requestedEnd !== null && outcome
                  ? { start: requestedStart, end: requestedEnd }
                  : null
              }
              outcomeKind={outcome?.kind ?? null}
            />

            {/* Existing bookings list */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">
                Existing bookings
              </p>
              <ul className="space-y-1.5">
                {BOOKINGS.map((b) => (
                  <li
                    key={b.label}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <CalendarX2 className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="tabular-nums">{b.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1.5">
                Start time
              </span>
              <input
                type="time"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 tabular-nums focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1.5">
                End time
              </span>
              <input
                type="time"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 tabular-nums focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </div>

          {/* Blocked toggle */}
          <label className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer select-none">
            <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
              <Ban className="h-4 w-4 text-slate-500" />
              Room is blocked
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={blocked}
              onClick={() => setBlocked((v) => !v)}
              className={
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " +
                (blocked ? "bg-rose-500" : "bg-slate-300")
              }
            >
              <span
                className={
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform " +
                  (blocked ? "translate-x-5" : "translate-x-0.5")
                }
              />
            </button>
          </label>

          <button
            type="button"
            onClick={handleCheck}
            className="mt-5 w-full rounded-lg bg-sky-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 active:bg-sky-800"
          >
            Check availability
          </button>
        </section>

        {/* Result */}
        {outcome && (
          <section
            className={
              "mt-5 rounded-2xl border p-5 " + resultStyles
            }
          >
            <div className="flex items-start gap-3">
              {outcome.kind === "available" && (
                <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5" />
              )}
              {outcome.kind === "unavailable" && (
                <XCircle className="h-6 w-6 shrink-0 mt-0.5" />
              )}
              {outcome.kind === "validation" && (
                <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="text-lg font-semibold">
                  {outcome.kind === "available"
                    ? "Available"
                    : outcome.kind === "unavailable"
                    ? "Unavailable"
                    : "Please check your times"}
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {outcome.reason}
                </p>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-6 text-center text-xs text-slate-400">
          Checking never changes or deletes existing bookings.
        </footer>
      </div>
    </div>
  );
}

function DayTimeline({
  current,
  bookings,
  requested,
  outcomeKind,
}: {
  current: number;
  bookings: { start: number; end: number }[];
  requested: { start: number; end: number } | null;
  outcomeKind: "available" | "unavailable" | "validation" | null;
}) {
  const DAY = 1440;
  const pct = (m: number) => `${(m / DAY) * 100}%`;

  const requestedColor =
    outcomeKind === "available"
      ? "bg-emerald-400"
      : outcomeKind === "unavailable"
      ? "bg-rose-400"
      : outcomeKind === "validation"
      ? "bg-amber-400"
      : "bg-sky-300";

  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-400 mb-1.5">
        <span>00:00</span>
        <span>Day timeline</span>
        <span>24:00</span>
      </div>
      <div className="relative h-7 w-full rounded-md bg-slate-100 overflow-hidden">
        {/* Existing bookings */}
        {bookings.map((b) => (
          <div
            key={b.start}
            className="absolute top-0 bottom-0 bg-slate-300"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title="Existing booking"
          />
        ))}

        {/* Requested range */}
        {requested && (
          <div
            className={"absolute top-0 bottom-0 " + requestedColor}
            style={{
              left: pct(requested.start),
              width: pct(Math.max(0, requested.end - requested.start)),
            }}
            title="Your requested time"
          />
        )}

        {/* Current time marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
          style={{ left: pct(current) }}
          title="Current time"
        />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-300" />
          Existing booking
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-900" />
          Current time
        </span>
        {requested && (
          <span className="inline-flex items-center gap-1.5">
            <span className={"inline-block h-2.5 w-2.5 rounded-sm " + requestedColor} />
            Your request
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
