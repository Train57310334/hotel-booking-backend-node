import { initDB, db } from '../src/storage/db.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

await initDB();

function now() { return new Date().toISOString(); }

// Admin user
const admin = {
  user_id: nanoid(),
  full_name: 'Admin User',
  email: 'admin@example.com',
  phone: null,
  password_hash: bcrypt.hashSync('admin123', 10),
  role: 'admin',
  created_at: now()
};

// Normal user
const user = {
  user_id: nanoid(),
  full_name: 'Demo User',
  email: 'user@example.com',
  phone: '0900000000',
  password_hash: bcrypt.hashSync('user1234', 10),
  role: 'user',
  created_at: now()
};

const hotel = {
  hotel_id: nanoid(),
  name: 'Sunrise Hotel',
  address: '123 Beach Road',
  city: 'Phuket',
  country: 'Thailand',
  phone: '076-123456',
  email: 'info@sunrise.example.com',
  created_at: now()
};

const room1 = {
  room_id: nanoid(),
  hotel_id: hotel.hotel_id,
  room_type: 'Deluxe',
  price_per_night: 1500,
  max_guests: 2,
  description: 'Sea view deluxe room',
  created_at: now()
};

const room2 = {
  room_id: nanoid(),
  hotel_id: hotel.hotel_id,
  room_type: 'Suite',
  price_per_night: 2800,
  max_guests: 3,
  description: 'Large suite with living area',
  created_at: now()
};

db.data.users = [admin, user];
db.data.hotels = [hotel];
db.data.rooms = [room1, room2];
db.data.room_availability = [
  { room_id: room1.room_id, date: '2025-10-01', is_available: true, price_override: 1600, created_at: now() },
  { room_id: room1.room_id, date: '2025-10-02', is_available: false, created_at: now() },
  { room_id: room2.room_id, date: '2025-10-01', is_available: true, created_at: now() },
  { room_id: room2.room_id, date: '2025-10-02', is_available: true, price_override: 2900, created_at: now() }
];
db.data.bookings = [];
db.data.payments = [];

await db.write();
console.log('Seeded. Admin: admin@example.com / admin123  |  User: user@example.com / user1234');
