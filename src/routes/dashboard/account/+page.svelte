<script lang="ts">
	import type { PageData } from './$types';

	import { userProfileStore } from '$dashboardStores/userProfileStore';
	import { userTagsStore } from '$dashboardStores/userTagsStore';
	import type { ConfirmationInfo } from '$dashboardTypes';
	import { exportUserData } from '$dashboardUtils/exportUserData';

	import PageSubHeader from '$dashboardComponents/account/PageSubHeader.svelte';
	import ConfirmationModal from '$dashboardComponents/modals/ConfirmationModal.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let data: PageData;

	const userData = {
		profile: $userProfileStore,
		prompts: data.userPrompts,
		tags: $userTagsStore
	};

	let confirmationModalRef: HTMLDialogElement;
	let accountDeleteConfirmationInfo: ConfirmationInfo;

	/**
	 * Deletes user account.
	 * @async
	 * @returns {ReturnType<ConfirmationInfo['callback']>} - The alert type and text of the delete operation.
	 */
	async function executeAccountDeletion(): ReturnType<ConfirmationInfo['callback']> {
		try {
			const response = await fetch(`?/deleteAccount`, {
				method: 'POST',
				body: JSON.stringify({ id: $userProfileStore?.id })
			});

			if (!response.ok) {
				throw new Error('Failed to delete account');
			}

			return {
				alertType: 'success',
				alertText: 'Account deleted successfully'
			};
		} catch (e) {
			console.error('Failed to delete account');

			return {
				alertType: 'error',
				alertText: 'Failed to delete account'
			};
		}
	}

	function handleDeleteAccount() {
		accountDeleteConfirmationInfo = {
			heading: `Delete Account`,
			subheading: `Are you sure you want to <span style="color: red;">permanently</span> your account? This action cannot be undone.`,
			callback: executeAccountDeletion
		};

		confirmationModalRef.showModal();
	}
</script>

<PageSubHeader heading="Main" subheading="Your account information" />

<section aria-label="Account Actions">
	<ul>
		<li>
			<h3>Email</h3>
			<p class="text-sm text-muted-foreground">{$userProfileStore?.email}</p>
		</li>

		<li>
			<h3>Subscription Status</h3>
			<p
				class="px-4 py-1 mt-1 text-sm font-semibold capitalize rounded-full bg-foreground text-background w-fit"
			>
				{$userProfileStore?.subscriptionStatus}
			</p>
		</li>
	</ul>

	<div class="flex flex-wrap gap-8 mt-8">
		<Button type="button" on:click={() => exportUserData(userData)} class="gap-2">
			<Icon name="download" />
			<span>Export Data</span>
		</Button>

		<Button type="button" variant="destructive" on:click={handleDeleteAccount} class="gap-2">
			<Icon name="delete" />
			<span>Delete Account</span>
		</Button>
	</div>
</section>

<ConfirmationModal bind:confirmationModalRef confirmationInfo={accountDeleteConfirmationInfo} />

<style lang="postcss">
	li {
		@apply pb-6 mb-8 border-b;

		h3 {
			@apply font-semibold;
		}
	}
</style>
