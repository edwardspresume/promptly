import { DATABASE_URL } from '$env/static/private';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = DATABASE_URL;

const client = postgres(connectionString);
export const supabaseDB: PostgresJsDatabase = drizzle(client);
