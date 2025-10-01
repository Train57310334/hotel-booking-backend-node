# Hotel Booking Backend (Node.js + Express + LowDB)

A minimal, clean, **API-first** backend template for a Hotel Booking System.
- **Express** (routing & middleware)
- **JWT Auth**
- **LowDB (JSON file)** for quick persistence (swap to MySQL/Postgres later)
- **Zod** input validation
- Feature modules: Auth, Hotels, Rooms, Room Availability, Bookings, Payments

## Quick Start

```bash
# 1) Unzip and cd
cd hotel-booking-backend

# 2) Install
npm install

# 3) Create .env
cp .env.example .env
# (edit JWT_SECRET if you like)

# 4) Seed sample data
npm run seed

# 5) Run
npm start
# Server: http://localhost:3000
```

## API Base
`/api`

### Auth
- `POST /api/auth/register` `{ full_name, email, phone?, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` (Bearer token)

### Hotels
- `GET /api/hotels`
- `GET /api/hotels/:id`
- `POST /api/hotels` *(auth required)*
- `PUT /api/hotels/:id` *(auth required)*
- `DELETE /api/hotels/:id` *(auth required)*

### Rooms
- `GET /api/rooms?hotel_id=<id>`
- `GET /api/rooms/:id`
- `POST /api/rooms` *(auth required)*
- `PUT /api/rooms/:id` *(auth required)*
- `DELETE /api/rooms/:id` *(auth required)*

### Availability
- `GET /api/rooms/:id/availability?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `POST /api/rooms/:id/availability` *(auth required)*
  ```json
  {
    "items": [
      {"date":"2025-10-01","is_available":true,"price_override":1200},
      {"date":"2025-10-02","is_available":false}
    ]
  }
  ```

### Bookings
- `GET /api/bookings` *(auth → only own bookings; admin → all)*
- `GET /api/bookings/:id` *(auth)*
- `POST /api/bookings` *(auth)*
  ```json
  { "room_id":"<id>","check_in_date":"2025-10-01","check_out_date":"2025-10-03" }
  ```
- `PUT /api/bookings/:id` *(auth/admin)* — update status `pending|confirmed|cancelled`

### Payments
- `POST /api/payments` *(auth)*
  ```json
  { "booking_id":"<id>","amount":200.50,"payment_method":"qr|credit_card|paypal|other","payment_status":"success|pending|failed","transaction_id":"..." }
  ```
- `GET /api/bookings/:id/payments` *(auth)*

## Notes
- This is a template for learning and starting fast. Replace LowDB with a real database and add role-based authorization for production.
- Booking service enforces simple **availability checks** and **date overlap prevention**.
- Error format is consistent: `{ status, message, result }`.
