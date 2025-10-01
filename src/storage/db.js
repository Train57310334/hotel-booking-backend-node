import { JSONFilePreset } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../data/db.json');

export let db = null;

export async function initDB() {
  db = await JSONFilePreset(dbPath, {
    users: [],
    hotels: [],
    rooms: [],
    room_availability: [],
    bookings: [],
    payments: []
  });
  await db.write();
}
