// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// src/app.d.ts

import { Session, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '$dashboardTypes/database.types';

declare global {
    namespace App {
        interface Locals {
            supabase: SupabaseClient<Database>;
            getSession(): Promise<Session | null>;
        }
        interface PageData {
            session: Session | null;
        }
        // interface Error {}
        // interface Platform {}
    }
}
