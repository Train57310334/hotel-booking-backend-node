import { z } from 'zod';

export const RegisterSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6)
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const HotelSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional()
});

export const RoomSchema = z.object({
  hotel_id: z.string(),
  room_type: z.string(),
  price_per_night: z.number().nonnegative(),
  max_guests: z.number().int().positive(),
  description: z.string().optional()
});

export const AvailabilityItemSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  is_available: z.boolean().default(true),
  price_override: z.number().optional()
});

export const AvailabilitySchema = z.object({
  items: z.array(AvailabilityItemSchema)
});

export const BookingCreateSchema = z.object({
  room_id: z.string(),
  check_in_date: z.string(),
  check_out_date: z.string()
});

export const BookingUpdateSchema = z.object({
  status: z.enum(['pending','confirmed','cancelled'])
});

export const PaymentCreateSchema = z.object({
  booking_id: z.string(),
  amount: z.number().nonnegative(),
  payment_method: z.enum(['credit_card','paypal','qr','other']),
  payment_status: z.enum(['pending','success','failed']).default('pending'),
  transaction_id: z.string().optional()
});
