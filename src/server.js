import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3000;

async function initDatabase() {
  const db = await open({
    filename: './data/tunes.db',
    driver: sqlite3.Database
  });

  return db;
}

app.use(express.static('public'));

app.get('/songs', async (req, res) => {
  const db = await initDatabase();
  const songs = await db.all('SELECT * FROM plays ORDER BY played_at DESC');
  res.json(songs);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
