import { message, superValidate } from 'sveltekit-superforms/server';

import type { Database } from '$dataBaseTypes';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { SuperValidated } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';

type TagOperation = 'create' | 'update' | 'delete' | 'deleteAll';

import { TagValidationSchema } from '$dashboardUtils/validation/tagValidationSchema';

/**
 * Function to build the appropriate Supabase query for the tag operation.
 * @param {TagOperation} operation The tag operation.
 * @param {SupabaseClient<Database>} supabase Initialized Supabase client.
 * @param {object} tagData The tag data.
 * @param {string | null | undefined} tagId Optional tag ID.
 */
function buildQuery(
    operation: TagOperation,
    supabase: SupabaseClient<Database>,
    tagData: object,
    tagId?: string | null,
    userId?: string
) {
    switch (operation) {
        case 'create':
            return supabase.from('tags').insert([tagData]);
        case 'update':
            return supabase.from('tags').update(tagData).eq('id', tagId);
        case 'delete':
            return supabase.from('tags').delete().eq('id', tagId);
        case 'deleteAll':
            return supabase.from('tags').delete().eq('user_id', userId);
    }
}

/**
 * Function to perform create, update, or delete operation on a tag.
 * @param {TagOperation} tagOperation Specifies the operation type.
 * @param {Session} session User session.
 * @param {SupabaseClient<Database>} supabase Initialized Supabase client.
 * @param {SuperValidated<typeof TagValidationSchema> | undefined} tagForm Form data validated against the TagValidationSchema.
 * @param {string | null | undefined} tagId Optional tag ID, required for update and delete operations.
 */
const handleTagOperation = async (
    tagOperation: TagOperation,
    session: Session,
    supabase: SupabaseClient<Database>,
    tagForm?: SuperValidated<typeof TagValidationSchema>,
    tagId?: string | null
) => {
    // Prepare tag data if it's not a delete or deleteAll operation
    const tagData =
        tagForm && tagOperation !== 'delete' && tagOperation !== 'deleteAll'
            ? { name: tagForm.data.name, user_id: session.user.id }
            : {};

    // Build the query based on the tag operation
    const query = buildQuery(
        tagOperation,
        supabase,
        tagData,
        tagId,
        session.user.id
    );

    const { error } = await query;

    if (error) {
        console.error(error);
        return message(tagForm, `Error ${tagOperation} tag`);
    }
};

export const load = (async (event) => {
    const tagForm = await superValidate(event, TagValidationSchema);

    return { tagForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createTag: async ({ request, locals: { getSession, supabase } }) => {
        const tagForm = await superValidate(request, TagValidationSchema);

        if (!tagForm.valid) return message(tagForm, 'Invalid form');

        const session = await getSession();

        if (session) {
            await handleTagOperation('create', session, supabase, tagForm);
        }

        return message(tagForm, 'Tag created!');
    },

    updateTag: async ({ request, locals: { getSession, supabase } }) => {
        const tagForm = await superValidate(request, TagValidationSchema);

        if (!tagForm.valid) return message(tagForm, 'Invalid form');

        const session = await getSession();

        if (session) {
            await handleTagOperation(
                'update',
                session,
                supabase,
                tagForm,
                tagForm.data.id
            );
        }

        return message(tagForm, 'Tag updated!');
    },

    deleteTag: async ({ request, locals: { getSession, supabase } }) => {
        const formData = new URLSearchParams(await request.text());
        const tagId = formData.get('tagId');

        const session = await getSession();

        if (session) {
            await handleTagOperation(
                'delete',
                session,
                supabase,
                undefined,
                tagId
            );
        }

        return {
            status: 200,
            body: {
                message: 'Tag deleted successfully',
            },
        };
    },

    deleteAllTags: async ({ locals: { getSession, supabase } }) => {
        const session = await getSession();

        if (session) {
            await handleTagOperation('deleteAll', session, supabase);
        }

        return {
            status: 200,
            body: {
                message: 'All tags deleted successfully',
            },
        };
    },
};
