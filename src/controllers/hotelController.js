import { db } from '../storage/db.js';
import { ok, fail } from '../utils/response.js';
import { HotelSchema } from '../validation/schemas.js';
import { nanoid } from 'nanoid';

export async function index(req, res) {
  return ok(res, 'OK', db.data.hotels);
}

export async function show(req, res) {
  const h = db.data.hotels.find(x => x.hotel_id === req.params.id);
  if (!h) return fail(res, 'Hotel not found', 404);
  return ok(res, 'OK', h);
}

export async function store(req, res) {
  try {
    const payload = HotelSchema.parse(req.body);
    const h = { hotel_id: nanoid(), created_at: new Date().toISOString(), ...payload };
    db.data.hotels.push(h);
    await db.write();
    return ok(res, 'Created', h);
  } catch (e) {
    return fail(res, e.errors?.[0]?.message || e.message, 400);
  }
}

export async function update(req, res) {
  const h = db.data.hotels.find(x => x.hotel_id === req.params.id);
  if (!h) return fail(res, 'Hotel not found', 404);
  Object.assign(h, req.body);
  await db.write();
  return ok(res, 'Updated', h);
}

export async function destroy(req, res) {
  const i = db.data.hotels.findIndex(x => x.hotel_id === req.params.id);
  if (i === -1) return fail(res, 'Hotel not found', 404);
  db.data.hotels.splice(i, 1);
  await db.write();
  return ok(res, 'Deleted');
}
