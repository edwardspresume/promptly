// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { Session, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '$databaseDir/database.types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}

		interface PageData {
			session: Session | null;
			flash?: { type: 'success' | 'error'; message: string };
		}

		// interface Error {}
		// interface Platform {}
	}
}
