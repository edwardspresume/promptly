import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: 'src/lib/database/schema.ts',
	out: './drizzle',
	schemaFilter: ['public', 'stripe'],
	driver: 'pg',
	verbose: true,
	strict: true,
	dbCredentials: {
		connectionString: process.env.SECRET_DATABASE_URL || ''
	}
} satisfies Config;
