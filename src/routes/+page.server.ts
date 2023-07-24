import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

import { PromptValidationSchema } from '$utils/validation/promptValidationSchema';

export const load = (async (event) => {
    const form = await superValidate(event, PromptValidationSchema);

    return { form };
}) satisfies PageServerLoad;

export const actions = {
    createPrompt: async ({ request }) => {
        const form = await superValidate(request, PromptValidationSchema);

        return form.valid
            ? message(form, 'Prompt created!')
            : fail(400, { form });
    },

    updatePrompt: async ({ request }) => {
        const form = await superValidate(request, PromptValidationSchema);

        return form.valid
            ? message(form, 'Prompt updated!')
            : fail(400, { form });
    },
};
