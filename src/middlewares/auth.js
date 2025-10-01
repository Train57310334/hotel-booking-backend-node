import jwt from 'jsonwebtoken';
import { fail } from '../utils/response.js';
import { db } from '../storage/db.js';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return fail(res, 'Unauthorized', 401);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = payload;
    next();
  } catch (e) {
    return fail(res, 'Invalid token', 401);
  }
}

export function currentUser(req) {
  if (!req?.user) return null;
  return db.data.users.find(u => u.user_id === req.user.user_id) || null;
}

export function isAdmin(req) {
  const u = currentUser(req);
  return u?.role === 'admin';
}
