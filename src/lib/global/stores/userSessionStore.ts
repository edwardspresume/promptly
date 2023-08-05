import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export const userSessionStore = writable<null | User>(null);
