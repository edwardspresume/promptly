import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { SupabaseClient } from '@supabase/supabase-js';

import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL,
} from '$env/static/public';

import {
    supabaseStore,
    userSessionStore,
} from '$globalStores/userAndSupabaseStores';

import { allPromptsStore } from '$dashboardStores/promptsStore';
import { allTagsStore } from '$dashboardStores/tagStore';

import {
    promptLocalStorageManager,
    tagLocalStorageManager,
} from '$dashboardUtils/localStorageManager';

async function getDataFromSupabase(
    supabase: SupabaseClient,
    tableName: string,
    userId: string
) {
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error(`Failed to load ${tableName} from database:`, error);
        throw error;
    }

    return data;
}

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
        const userId = session.user.id;

        supabaseStore.set(supabase);
        userSessionStore.set(session?.user);

        try {
            const prompts = await getDataFromSupabase(
                supabase,
                'prompts',
                userId
            );

            const tags = await getDataFromSupabase(supabase, 'tags', userId);

            allPromptsStore.set(prompts);
            allTagsStore.set(tags);
        } catch (error) {
            return { supabase, session, error };
        }
    } else {
        allTagsStore.set(tagLocalStorageManager.getItems());
        allPromptsStore.set(promptLocalStorageManager.getItems());
    }
    return { supabase, session };
};
