import type { Provider } from '@supabase/supabase-js';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import {
    handleEmailSignIn,
    handleOauthSignIn,
} from '$marketingUtils/authHelpers.server';
import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

export const load = (async (event) => {
    const emailAuthForm = await superValidate(event, EmailAuthSchema);

    return { emailAuthForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    signUp: async ({ request, url, locals: { supabase } }) => {
        const form = await superValidate(request, EmailAuthSchema);

        const oathProvider = url.searchParams.get('provider') as Provider;

        if (oathProvider) {
            return await handleOauthSignIn(form, oathProvider, url, supabase);
        }

        return await handleEmailSignIn(form, url, supabase, true);
    },
};
