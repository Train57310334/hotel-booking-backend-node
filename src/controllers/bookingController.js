import { db } from '../storage/db.js';
import { ok, fail } from '../utils/response.js';
import { BookingCreateSchema, BookingUpdateSchema } from '../validation/schemas.js';
import { createBooking } from '../services/bookingService.js';

export async function index(req, res) {
  const isAdmin = req.user?.role === 'admin';
  const list = isAdmin ? db.data.bookings : db.data.bookings.filter(b => b.user_id === req.user.user_id);
  return ok(res, 'OK', list);
}

export async function show(req, res) {
  const b = db.data.bookings.find(x => x.booking_id === req.params.id);
  if (!b) return fail(res, 'Booking not found', 404);
  if (req.user.role !== 'admin' && b.user_id !== req.user.user_id) return fail(res, 'Forbidden', 403);
  return ok(res, 'OK', b);
}

export async function store(req, res) {
  try {
    const body = BookingCreateSchema.parse(req.body);
    const room = db.data.rooms.find(r => r.room_id === body.room_id);
    if (!room) return fail(res, 'Room not found', 404);

    const booking = createBooking({ user_id: req.user.user_id, ...body });
    await db.write();
    return ok(res, 'Booking created', booking);
  } catch (e) {
    return fail(res, e.status ? e.message : (e.errors?.[0]?.message || e.message), e.status || 400);
  }
}

export async function update(req, res) {
  try {
    const body = BookingUpdateSchema.parse(req.body);
    const b = db.data.bookings.find(x => x.booking_id === req.params.id);
    if (!b) return fail(res, 'Booking not found', 404);
    if (req.user.role !== 'admin' && b.user_id !== req.user.user_id) return fail(res, 'Forbidden', 403);
    b.status = body.status;
    await db.write();
    return ok(res, 'Updated', b);
  } catch (e) {
    return fail(res, e.errors?.[0]?.message || e.message, 400);
  }
}
