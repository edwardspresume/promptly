import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { handleItemOperation } from '$dashboardUtils/itemDatabaseOperations.server';
import { PromptValidationSchema } from '$dashboardUtils/validation/promptValidationSchema';

export const load = (async (event) => {
    const promptForm = await superValidate(event, PromptValidationSchema);

    return { promptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createPrompt: async ({ request, locals: { getSession, supabase } }) => {
        const promptForm = await superValidate(request, PromptValidationSchema);

        if (!promptForm.valid) return message(promptForm, 'Invalid form');

        const session = await getSession();

        if (session) {
            await handleItemOperation(
                'prompts',
                'create',
                supabase,
                promptForm,
                null,
                session.user.id
            );
        }

        return message(promptForm, 'Prompt created!');
    },

    updatePrompt: async ({ request }) => {
        const form = await superValidate(request, PromptValidationSchema);

        return form.valid
            ? message(form, 'Prompt updated!')
            : message(form, 'Invalid form');
    },

    toggleFavorite: async ({ request }) => {
        console.log(await request.formData());

        return {
            message: 'Favorite toggled!',
        };
    },
};
