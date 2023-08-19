import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { handleItemOperation } from '$databaseDir/itemOperations.server';
import { tagsCrudSchema } from '$databaseDir/tagsCrudSchema';

export const load = (async (event) => {
    const tagForm = await superValidate(event, tagsCrudSchema);

    return { tagForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createTag: async ({ request, locals: { getSession } }) => {
        const tagForm = await superValidate(request, tagsCrudSchema);

        if (!tagForm.valid) return message(tagForm, 'Invalid form');

        const session = await getSession();

        if (session) {
            const formData = {
                userId: session.user.id,
                name: tagForm.data.name,
            };

            await handleItemOperation('tags', 'create', formData);
        }

        return message(tagForm, 'Tag created!');
    },

    updateTag: async ({ request, locals: { getSession } }) => {
        const tagForm = await superValidate(request, tagsCrudSchema);

        if (!tagForm.valid) return message(tagForm, 'Invalid form');

        const session = await getSession();

        if (session) {
            const formData = {
                name: tagForm.data.name,
            };

            await handleItemOperation(
                'tags',
                'update',
                formData,
                tagForm.data.id
            );
        }

        return message(tagForm, 'Tag updated!');
    },

    deleteTag: async ({ request, locals: { getSession } }) => {
        const formData = new URLSearchParams(await request.text());
        const tagId = formData.get('itemId');

        const session = await getSession();

        if (session) {
            await handleItemOperation('tags', 'delete', null, tagId);
        }

        return {
            status: 200,
            body: {
                message: 'Tag deleted successfully',
            },
        };
    },

    deleteAllTags: async ({ locals: { getSession } }) => {
        const session = await getSession();

        if (session) {
            await handleItemOperation(
                'tags',
                'deleteAll',
                null,
                null,
                session.user.id
            );
        }

        return {
            status: 200,
            body: {
                message: 'All tags deleted successfully',
            },
        };
    },
};
