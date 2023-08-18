import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
    schema: './drizzle/schema.ts',
    out: './drizzle',
    driver: 'pg',
    verbose: true,
    strict: true,
    dbCredentials: {
        connectionString: process.env.DATABASE_URL || '',
    },
} satisfies Config;
