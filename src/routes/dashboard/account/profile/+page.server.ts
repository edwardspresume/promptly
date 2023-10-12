import type { Actions, PageServerLoad } from './$types';

import { message, setError, superValidate } from 'sveltekit-superforms/server';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { profilesTable } from '$databaseDir/schema';
import { and, eq, ne } from 'drizzle-orm';

import type { AlertMessage } from '$globalTypes';

import { ProfileValidationSchema } from '$dashboardValidationSchemas/profileValidationSchema';
import { getUserProfile, sanitizeFormData } from '$databaseDir/databaseUtils.server';
import { logError } from '$globalUtils';

export const load = (async ({ locals: { getSession } }) => {
	const session = await getSession();

	const userProfile = await getUserProfile(session?.user.id);

	const profileForm = await superValidate(
		{
			...userProfile,
			username: userProfile?.username ?? '',
			fullName: userProfile?.fullName ?? ''
		},
		ProfileValidationSchema
	);

	return { profileForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const profileForm = await superValidate<typeof ProfileValidationSchema, AlertMessage>(
			request,
			ProfileValidationSchema
		);

		if (!profileForm.valid) {
			return message(profileForm, {
				alertType: 'error',
				alertText: 'Invalid profile data'
			});
		}

		const profileId = profileForm.data.id;
		const sanitizedData = sanitizeFormData(profileForm.data);

		try {
			delete sanitizedData.id;
			delete sanitizedData.avatarUrl;
			delete sanitizedData.isActive;

			if (profileId) {
				const isUsernameTaken = await drizzleClient.query.profilesTable.findFirst({
					where: and(
						ne(profilesTable.id, profileId),
						eq(profilesTable.username, sanitizedData.username)
					),

					columns: {
						username: true
					}
				});

				if (isUsernameTaken) {
					return setError(profileForm, 'username', 'Username already taken');
				}

				await drizzleClient
					.update(profilesTable)
					.set(sanitizedData)
					.where(eq(profilesTable.id, profileId));
			}
		} catch (error) {
			logError(error, `Error when updating profile`, {
				sanitizedData
			});

			return message(
				profileForm,
				{
					alertType: 'error',
					alertText: 'Unexpected error during profile update. Please try again later.'
				},
				{ status: 500 }
			);
		}

		return message(profileForm, {
			alertType: 'success',
			alertText: 'Profile updated successfully!'
		});
	}
};
