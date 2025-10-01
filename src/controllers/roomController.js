import { db } from '../storage/db.js';
import { ok, fail } from '../utils/response.js';
import { RoomSchema, AvailabilitySchema } from '../validation/schemas.js';
import { nanoid } from 'nanoid';

export async function index(req, res) {
  const { hotel_id } = req.query;
  let rooms = db.data.rooms;
  if (hotel_id) rooms = rooms.filter(r => r.hotel_id === hotel_id);
  return ok(res, 'OK', rooms);
}

export async function show(req, res) {
  const r = db.data.rooms.find(x => x.room_id === req.params.id);
  if (!r) return fail(res, 'Room not found', 404);
  return ok(res, 'OK', r);
}

export async function store(req, res) {
  try {
    const payload = RoomSchema.parse({
      ...req.body,
      price_per_night: Number(req.body.price_per_night),
      max_guests: Number(req.body.max_guests)
    });
    const hotel = db.data.hotels.find(h => h.hotel_id === payload.hotel_id);
    if (!hotel) return fail(res, 'Hotel not found', 404);

    const r = { room_id: nanoid(), created_at: new Date().toISOString(), ...payload };
    db.data.rooms.push(r);
    await db.write();
    return ok(res, 'Created', r);
  } catch (e) {
    return fail(res, e.errors?.[0]?.message || e.message, 400);
  }
}

export async function update(req, res) {
  const r = db.data.rooms.find(x => x.room_id === req.params.id);
  if (!r) return fail(res, 'Room not found', 404);
  Object.assign(r, req.body);
  await db.write();
  return ok(res, 'Updated', r);
}

export async function destroy(req, res) {
  const i = db.data.rooms.findIndex(x => x.room_id === req.params.id);
  if (i === -1) return fail(res, 'Room not found', 404);
  db.data.rooms.splice(i, 1);
  await db.write();
  return ok(res, 'Deleted');
}

export async function getAvailability(req, res) {
  const { start, end } = req.query;
  const room_id = req.params.id;
  const exists = db.data.rooms.find(x => x.room_id === room_id);
  if (!exists) return fail(res, 'Room not found', 404);
  const items = db.data.room_availability.filter(a => a.room_id === room_id && (!start || a.date >= start) && (!end || a.date <= end));
  return ok(res, 'OK', items);
}

export async function setAvailability(req, res) {
  try {
    const room_id = req.params.id;
    const exists = db.data.rooms.find(x => x.room_id === room_id);
    if (!exists) return fail(res, 'Room not found', 404);

    const payload = AvailabilitySchema.parse({
      items: (req.body.items || []).map(i => ({ ...i, price_override: i.price_override != null ? Number(i.price_override) : undefined }))
    });

    for (const item of payload.items) {
      const idx = db.data.room_availability.findIndex(x => x.room_id === room_id && x.date === item.date);
      const rec = { room_id, ...item, created_at: new Date().toISOString() };
      if (idx >= 0) db.data.room_availability[idx] = { ...db.data.room_availability[idx], ...rec };
      else db.data.room_availability.push(rec);
    }
    await db.write();
    return ok(res, 'Upserted', payload.items);
  } catch (e) {
    return fail(res, e.errors?.[0]?.message || e.message, 400);
  }
}
