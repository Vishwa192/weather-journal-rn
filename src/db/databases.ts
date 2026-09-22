import * as SQLite from 'expo-sqlite'

export interface Entry{
    id: number;
    note: string;
    photoUri: string | null;
    latitude: number;
    longitude: number;
    temperature: number;
    weatherCode: number;
    createdAt: string;
}

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
    db = await SQLite.openDatabaseAsync('weatherJournal.db');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS entries(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note TEXT NOT NULL,
            photoUri TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            temperature REAL NOT NULL,
            weatherCode INTEGER NOT NULL,
            createdAt TEXT NOT NULL
        )    
    `)
}

export async function insertEntry(entry: Omit<Entry, 'id'>): Promise<void>{
    await db.runAsync(
        `INSERT INTO entries(note, photoUri,latitude,longitude,temperature,weatherCode,createdAt)
         VALUES (?,?,?,?,?,?,?);`,
         [entry.note, entry.photoUri, entry.latitude, entry.longitude, entry.temperature, entry.weatherCode, entry.createdAt]
    )
}

export async function getAllEntries(): Promise<Entry[]> {
    return await db.getAllAsync<Entry>('Select * FROM entries ORDER BY createdAt DESC;')
}

export async function deleteEntry(id: number): Promise<void>{
    await db.runAsync('DELETE FROM entries WHERE id = ?;', [id]);
}