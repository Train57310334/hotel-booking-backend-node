import { db } from '../storage/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ok, fail } from '../utils/response.js';
import { nanoid } from 'nanoid';
import { RegisterSchema, LoginSchema } from '../validation/schemas.js';

export async function register(req, res) {
  try {
    const body = RegisterSchema.parse(req.body);
    const exists = db.data.users.find(u => u.email === body.email);
    if (exists) return fail(res, 'Email already registered', 409);

    const hash = bcrypt.hashSync(body.password, 10);
    const user = {
      user_id: nanoid(),
      full_name: body.full_name,
      email: body.email,
      phone: body.phone || null,
      password_hash: hash,
      role: 'user',
      created_at: new Date().toISOString()
    };
    db.data.users.push(user);
    await db.write();

    return ok(res, 'Registered', { user_id: user.user_id, email: user.email });
  } catch (e) {
    return fail(res, e.errors?.[0]?.message || e.message, 400);
  }
}

export async function login(req, res) {
  try {
    const body = LoginSchema.parse(req.body);
    const user = db.data.users.find(u => u.email === body.email);
    if (!user) return fail(res, 'Invalid email or password', 401);
    const valid = bcrypt.compareSync(body.password, user.password_hash);
    if (!valid) return fail(res, 'Invalid email or password', 401);

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return ok(res, 'Logged in', { token });
  } catch (e) {
    return fail(res, e.errors?.[0]?.message || e.message, 400);
  }
}

export async function me(req, res) {
  const user = db.data.users.find(u => u.user_id === req.user.user_id);
  if (!user) return fail(res, 'User not found', 404);
  const { password_hash, ...safe } = user;
  return ok(res, 'OK', safe);
}
