import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { TagValidationSchema } from '$dashboardValidationSchemas/tagValidationSchema';
import { tagsTable } from '$databaseDir/schema';
import type { FormStatusMessage } from '$databaseDir/utils.server';

export const load = (async () => {
	const tagForm = await superValidate(TagValidationSchema);

	return { tagForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createTag: async ({ request, locals: { getSession } }) => {
		const tagForm = await superValidate<typeof TagValidationSchema, FormStatusMessage>(
			request,
			TagValidationSchema
		);

		if (!tagForm.valid)
			return message(tagForm, {
				statusType: 'error',
				text: 'The tag name you entered is invalid. Please enter a valid tag name.'
			});

		const session = await getSession();

		if (session) {
			const formData = {
				userId: session.user.id,
				name: tagForm.data.name
			};

			try {
				await drizzleClient.insert(tagsTable).values([formData]);
			} catch (error) {
				console.error(error);

				return message(tagForm, {
					statusType: 'error',
					text: 'Unexpected error during tag creation. Please retry.'
				});
			}
		}

		return message(tagForm, {
			statusType: 'success',
			text: 'Tag created successfully!'
		});
	}
};
