import { superValidate } from 'sveltekit-superforms/server';

import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

export const load = (async (event) => {
    const emailAuthForm = await superValidate(event, EmailAuthSchema);

    return { emailAuthForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    signUp: async ({ fetch, session, body }) => {
        return {
            status: 200,
            body: {
                message: 'success',
            },
        };
    },
};
