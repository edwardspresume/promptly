import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { handleItemOperation } from '$databaseDir/itemOperations.server';
import { promptsCrudSchema } from '$databaseDir/promptsCrudSchema';

export const load = (async (event) => {
    const promptForm = await superValidate(event, promptsCrudSchema);

    return { promptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createPrompt: async ({ request, locals: { getSession } }) => {
        const promptForm = await superValidate(request, promptsCrudSchema);

        if (!promptForm.valid) return message(promptForm, 'Invalid form');

        const session = await getSession();

        if (session) {
            const filteredData = Object.fromEntries(
                Object.entries(promptForm.data).filter(
                    ([, value]) => value !== undefined
                )
            );

            const promptData = { userId: session.user.id, ...filteredData };

            await handleItemOperation('prompts', 'create', promptData);
        }

        return message(promptForm, 'Prompt created!');
    },

    updatePrompt: async ({ request }) => {
        const form = await superValidate(request, promptsCrudSchema);

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
