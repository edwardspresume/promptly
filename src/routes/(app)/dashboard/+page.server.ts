import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { PromptValidationSchema } from '$dashboardUtils/validation/promptValidationSchema';

export const load = (async (event) => {
    const promptForm = await superValidate(event, PromptValidationSchema);

    return { promptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createPrompt: async ({ request }) => {
        const form = await superValidate(request, PromptValidationSchema);

        return form.valid
            ? message(form, 'Prompt created!')
            : message(form, 'Invalid form');
    },

    updatePrompt: async ({ request }) => {
        const form = await superValidate(request, PromptValidationSchema);

        return form.valid
            ? message(form, 'Prompt updated!')
            : message(form, 'Invalid form');
    },
};
