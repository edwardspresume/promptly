import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL,
} from '$env/static/public';

import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

// This SvelteKit server hook initializes a Supabase client and provides session data
// for authenticated requests.

// The handle function runs for before every request
export const handle: Handle = async ({ event, resolve }) => {
    // Create a new Supabase client using the provided Supabase URL and anonymous key,
    // then store this client in the event.locals object. This makes the Supabase
    // client available to endpoints and hooks that run later.
    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event,
    });

    // This function retrieves the current user session from Supabase auth and makes
    // it available on the event.locals object.
    event.locals.getSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    // Call the resolve function to continue handling the request, and specify that only
    // the 'content-range' header should be serialized in the response. This is necessary
    // because Supabase requires this header for certain operations.
    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        },
    });
};
