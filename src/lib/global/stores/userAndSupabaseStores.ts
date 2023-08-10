import type { SupabaseClient, User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export const userSessionStore = writable<null | User>(null);
export const supabaseStore = writable<SupabaseClient | null>(null);
