import { SECRET_DATABASE_URL } from '$env/static/private';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = SECRET_DATABASE_URL;

const client = postgres(connectionString);
export const drizzleClient: PostgresJsDatabase = drizzle(client);
