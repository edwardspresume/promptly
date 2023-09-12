// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { Session, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '$databaseDir/database.types';
import type { AlertMessage } from '$globalTypes';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}

		interface PageData {
			session: Session | null;
			flashMessage?: AlertMessage;
		}

		// interface Error {}
		// interface Platform {}
	}
}
