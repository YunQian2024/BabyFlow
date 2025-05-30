import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

const expo = SQLite.openDatabaseSync('babyflow.db');
const db = drizzle(expo);

export function useDb() {
  return db;
}
