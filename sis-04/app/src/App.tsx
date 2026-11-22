import { useState } from 'react';
import { ROOMS } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

const EQUIPMENT = ['Projector', 'Whiteboard', 'Computers', 'Microphone'];

export default function App() {
  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('a101');

  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);

  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const filteredRooms = filterRooms(ROOMS, { attendees, equipment });
  const selectedRoom = filteredRooms.find(r => r.id === roomId);
  const activeRoom = selectedRoom ?? filteredRooms[0];

  function resetResult() {
    setResult(null);
    setError('');
  }

  function toggleEquipment(item: string) {
    setEquipment(previous =>
      previous.includes(item)
        ? previous.filter(x => x !== item)
        : [...previous, item]
    );
    resetResult();
  }

  function check() {
    resetResult();

    if (!activeRoom) {
      setError('No rooms match your filters.');
      return;
    }

    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in all time fields.');
      return;
    }

    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);
    const n = toMinutes(now);

    if (s >= e) {
      setError('End time must be after start time.');
      return;
    }

    const available = checkRoom(ROOMS, activeRoom.id, {
      start: s,
      end: e,
      now: n,
    });

    setResult(available);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <h2>Find a room</h2>

      <div className="row">
        <label>
          Attendees
          <input
            type="number"
            min="1"
            value={attendees}
            onChange={e => {
              setAttendees(Number(e.target.value));
              resetResult();
            }}
          />
        </label>
      </div>

      <div className="row">
        {EQUIPMENT.map(item => (
          <label className="inline" key={item}>
            <input
              type="checkbox"
              checked={equipment.includes(item)}
              onChange={() => toggleEquipment(item)}
            />
            {item}
          </label>
        ))}
      </div>

      {filteredRooms.length === 0 ? (
        <p className="error">No rooms match your filters.</p>
      ) : (
        <>
          <div className="row">
            <label>
              Room
              <select
                value={activeRoom.id}
                onChange={e => {
                  setRoomId(e.target.value);
                  resetResult();
                }}
              >
                {filteredRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} (capacity: {room.capacity})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Current time
              <input
                type="time"
                value={now}
                onChange={e => {
                  setNow(e.target.value);
                  resetResult();
                }}
              />
            </label>

            <label>
              Start
              <input
                type="time"
                value={start}
                onChange={e => {
                  setStart(e.target.value);
                  resetResult();
                }}
              />
            </label>

            <label>
              End
              <input
                type="time"
                value={end}
                disabled={endOfDay}
                onChange={e => {
                  setEnd(e.target.value);
                  resetResult();
                }}
              />
            </label>

            <label className="inline">
              <input
                type="checkbox"
                checked={endOfDay}
                onChange={e => {
                  setEndOfDay(e.target.checked);
                  resetResult();
                }}
              />
              Ends at 24:00
            </label>
          </div>

          <button onClick={check}>Check availability</button>

          {error && <p className="error">{error}</p>}

          {result !== null && (
            <p className={`result ${result ? 'available' : 'unavailable'}`}>
              {result ? 'Available' : 'Unavailable'}
            </p>
          )}

          <h2>Existing bookings</h2>
          <ul>
            {activeRoom.bookings.length
              ? activeRoom.bookings.map((booking, index) => (
                  <li key={index}>
                    {fmt(booking.start)}–{fmt(booking.end)}
                  </li>
                ))
              : <li>none</li>}
          </ul>
        </>
      )}
    </main>
  );
}
