import { db } from '../storage/db.js';
import { nanoid } from 'nanoid';

// Helpers
function parseDate(s) { return new Date(s + 'T00:00:00Z'); }
function dateRange(start, end) {
  const s = parseDate(start), e = parseDate(end);
  const days = [];
  for (let d = new Date(s); d < e; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(new Date(d).toISOString().slice(0,10));
  }
  return days;
}

function hasOverlap(aStart, aEnd, bStart, bEnd) {
  // [start, end) overlap check
  return (aStart < bEnd) && (bStart < aEnd);
}

export function isRoomAvailable(room_id, check_in_date, check_out_date) {
  // check bookings overlap
  const aStart = parseDate(check_in_date);
  const aEnd = parseDate(check_out_date);

  const conflict = db.data.bookings.find(b =>
    b.room_id === room_id &&
    b.status !== 'cancelled' &&
    hasOverlap(aStart, aEnd, parseDate(b.check_in_date), parseDate(b.check_out_date))
  );
  if (conflict) return false;

  // check room_availability blocks (explicitly unavailable)
  const days = dateRange(check_in_date, check_out_date);
  for (const d of days) {
    const rec = db.data.room_availability.find(x => x.room_id === room_id && x.date === d);
    if (rec && rec.is_available === false) return false;
  }

  return true;
}

export function computeTotalPrice(room_id, check_in_date, check_out_date) {
  const room = db.data.rooms.find(r => r.room_id === room_id);
  if (!room) return 0;
  const days = dateRange(check_in_date, check_out_date);
  let total = 0;
  for (const d of days) {
    const rec = db.data.room_availability.find(x => x.room_id === room_id && x.date === d);
    total += (rec?.price_override ?? room.price_per_night);
  }
  return Number(total.toFixed(2));
}

export function createBooking({ user_id, room_id, check_in_date, check_out_date }) {
  if (!isRoomAvailable(room_id, check_in_date, check_out_date)) {
    const err = new Error('Room is not available for the selected dates');
    err.status = 409;
    throw err;
  }
  const total_price = computeTotalPrice(room_id, check_in_date, check_out_date);
  const booking = {
    booking_id: nanoid(),
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    total_price,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  db.data.bookings.push(booking);
  return booking;
}
