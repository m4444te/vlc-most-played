import axios from 'axios';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

dotenv.config();

const vlcHost = 'localhost';
const vlcPort = 8080;
const vlcPassword = process.env.VLC_PASSWORD;
const checkInterval = process.env.CHECK_INTERVAL || 5000; // Default to 5 seconds if not set

let previousTitle = '';
let previousArtist = '';

async function initDatabase() {
  const db = await open({
    filename: './data/tunes.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS plays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      artist TEXT,
      played_at TEXT DEFAULT CURRENT_TIMESTAMP,
      play_count INTEGER DEFAULT 1
    )
  `);

  return db;
}

async function logPlay(db, title, artist) {
  const existingPlay = await db.get(`
    SELECT * FROM plays WHERE title = ? AND artist = ?
  `, [title, artist]);

  if (existingPlay) {
    await db.run(`
      UPDATE plays SET play_count = play_count + 1, played_at = CURRENT_TIMESTAMP WHERE id = ?
    `, [existingPlay.id]);
  } else {
    await db.run(`
      INSERT INTO plays (title, artist) VALUES (?, ?)
    `, [title, artist]);
  }
}
async function getCurrentSong() {
  try {
    const response = await axios.get(`http://${vlcHost}:${vlcPort}/requests/status.json`, {
      auth: {
        username: '',
        password: vlcPassword
      }
    });

    const info = response.data.information;
    const meta = info && info.category && info.category.meta;

    if (meta && meta.title && meta.artist && meta.description) {
      return { title: meta.title, artist: meta.artist, album: meta.album };
    } else {
      return { title: '', artist: ''};
    }
  } catch (error) {
    console.error('Error connecting to VLC:', error);
    return { title: '', artist: '', album : ''};
  }
}

async function monitorVLC() {
  const db = await initDatabase();

  setInterval(async () => {
    const currentSong = await getCurrentSong();

    if (currentSong.title !== previousTitle || currentSong.artist !== previousArtist) {
      if (currentSong.title && currentSong.artist) {
        const message = `${currentSong.title} by ${currentSong.artist} from ${currentSong.album}`;
        console.log(message)
        
        await logPlay(db, currentSong.title, currentSong.artist);
      } else {
        console.log('No song is currently playing or metadata is not available.');
      }
      previousTitle = currentSong.title;
      previousArtist = currentSong.artist;
    }
  }, checkInterval);
}

monitorVLC();
