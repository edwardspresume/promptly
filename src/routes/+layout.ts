import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL,
} from '$env/static/public';

import {
    supabaseStore,
    userSessionStore,
} from '$globalStores/userAndSupabaseStores';

import { allTagsStore } from '$dashboardStores/tagStore';
import { getTagsFromLocalStorage } from '$dashboardUtils/tagLocalStorageMethods';

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createSupabaseLoadClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
    });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        supabaseStore.set(supabase);
        userSessionStore.set(session?.user);

        const { data: tags, error } = await supabase
            .from('tags')
            .select('*')
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Failed to load tags from database:', error);
            return { supabase, session, error };
        }

        allTagsStore.set(tags);
    } else {
        allTagsStore.set(getTagsFromLocalStorage());
    }
    return { supabase, session };
};
