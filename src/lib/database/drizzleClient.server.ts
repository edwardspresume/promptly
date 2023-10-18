import { SECRET_DB_CONNECTION_STRING } from '$env/static/private';

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const connectionString = SECRET_DB_CONNECTION_STRING;

const client = postgres(connectionString);
export const drizzleClient: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });
