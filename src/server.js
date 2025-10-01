import app from './app.js';
import { initDB } from './storage/db.js';

const PORT = process.env.PORT || 3000;

await initDB();

app.listen(PORT, () => {
  console.log(`➜ Server running on http://localhost:${PORT}`);
});
