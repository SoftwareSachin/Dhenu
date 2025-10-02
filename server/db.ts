import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';

// Use SQLite instead of PostgreSQL
const sqlite = new Database(path.join(process.cwd(), 'dhenu.db'));

export const db = drizzle(sqlite, { schema });
