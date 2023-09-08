import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { eq } from 'drizzle-orm';

import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { TagValidationSchema } from '$dashboardValidationSchemas/tagValidationSchema';
import { tagsTable } from '$databaseDir/schema';
import { sanitizeContent } from '$databaseDir/utils.server';
import type { AlertMessage } from '$globalTypes';

export const load = (async () => {
	const tagForm = await superValidate(TagValidationSchema);

	return { tagForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { getSession } }) => {
		const tagForm = await superValidate<typeof TagValidationSchema, AlertMessage>(
			request,
			TagValidationSchema
		);

		if (!tagForm.valid) {
			return message(tagForm, {
				alertType: 'error',
				alertText: 'The tag name you entered is invalid. Please enter a valid tag name.'
			});
		}

		const tagId = tagForm.data.id;

		const session = await getSession();

		if (session) {
			const sanitizedTagName = sanitizeContent(tagForm.data.name);

			try {
				if (tagId) {
					await drizzleClient
						.update(tagsTable)
						.set({ name: sanitizedTagName })
						.where(eq(tagsTable.id, tagId));
				} else {
					await drizzleClient.insert(tagsTable).values({
						profileId: session.user.id,
						name: sanitizedTagName
					});
				}
			} catch (error) {
				console.error(error);

				return message(tagForm, {
					alertType: 'error',
					alertText: `Unexpected error during tag ${tagId ? 'update' : 'creation'}. Please retry.`
				});
			}
		}

		return message(tagForm, {
			alertType: 'success',
			alertText: `Tag ${tagId ? 'updated' : 'created'} successfully!`
		});
	}
};
