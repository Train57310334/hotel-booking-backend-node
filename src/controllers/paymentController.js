import { db } from '../storage/db.js';
import { ok, fail } from '../utils/response.js';
import { PaymentCreateSchema } from '../validation/schemas.js';
import { nanoid } from 'nanoid';

export async function create(req, res) {
  try {
    const body = PaymentCreateSchema.parse({
      ...req.body,
      amount: Number(req.body.amount)
    });

    const booking = db.data.bookings.find(b => b.booking_id === body.booking_id);
    if (!booking) return fail(res, 'Booking not found', 404);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.user_id) return fail(res, 'Forbidden', 403);

    const payment = {
      payment_id: nanoid(),
      booking_id: body.booking_id,
      amount: body.amount,
      payment_method: body.payment_method,
      payment_status: body.payment_status,
      transaction_id: body.transaction_id || null,
      created_at: new Date().toISOString()
    };
    db.data.payments.push(payment);

    if (body.payment_status === 'success') {
      booking.status = 'confirmed';
    }
    await db.write();
    return ok(res, 'Payment recorded', payment);
  } catch (e) {
    return fail(res, e.errors?.[0]?.message || e.message, 400);
  }
}

export async function byBooking(req, res) {
  const booking = db.data.bookings.find(b => b.booking_id === req.params.id);
  if (!booking) return fail(res, 'Booking not found', 404);
  if (req.user.role !== 'admin' && booking.user_id !== req.user.user_id) return fail(res, 'Forbidden', 403);
  const list = db.data.payments.filter(p => p.booking_id === booking.booking_id);
  return ok(res, 'OK', list);
}
