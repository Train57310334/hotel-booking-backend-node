import { Router } from 'express';
import * as Auth from '../controllers/authController.js';
import * as Hotels from '../controllers/hotelController.js';
import * as Rooms from '../controllers/roomController.js';
import * as Bookings from '../controllers/bookingController.js';
import * as Payments from '../controllers/paymentController.js';
import { authRequired } from '../middlewares/auth.js';

const router = Router();

// Auth
router.post('/auth/register', Auth.register);
router.post('/auth/login', Auth.login);
router.get('/auth/me', authRequired, Auth.me);

// Hotels
router.get('/hotels', Hotels.index);
router.get('/hotels/:id', Hotels.show);
router.post('/hotels', authRequired, Hotels.store);
router.put('/hotels/:id', authRequired, Hotels.update);
router.delete('/hotels/:id', authRequired, Hotels.destroy);

// Rooms
router.get('/rooms', Rooms.index);
router.get('/rooms/:id', Rooms.show);
router.post('/rooms', authRequired, Rooms.store);
router.put('/rooms/:id', authRequired, Rooms.update);
router.delete('/rooms/:id', authRequired, Rooms.destroy);

// Availability
router.get('/rooms/:id/availability', Rooms.getAvailability);
router.post('/rooms/:id/availability', authRequired, Rooms.setAvailability);

// Bookings
router.get('/bookings', authRequired, Bookings.index);
router.get('/bookings/:id', authRequired, Bookings.show);
router.post('/bookings', authRequired, Bookings.store);
router.put('/bookings/:id', authRequired, Bookings.update);

// Payments
router.post('/payments', authRequired, Payments.create);
router.get('/bookings/:id/payments', authRequired, Payments.byBooking);

export default router;
