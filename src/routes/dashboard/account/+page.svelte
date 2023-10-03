<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	import { userProfileStore } from '$dashboardStores/userProfileStore';
	import { userTagsStore } from '$dashboardStores/userTagsStore';
	import { exportUserData } from '$dashboardUtils/exportUserData';

	import { page } from '$app/stores';
	import PageSubHeader from '$dashboardComponents/account/PageSubHeader.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let data: PageData;

	const userData = {
		profile: $userProfileStore,
		prompts: data.userPrompts,
		tags: $userTagsStore
	};

	const statusMessages: Record<string, { title: string; message: string; buttonText: string }> = {
		trialing: {
			title: 'Enjoy Your Free Trial!',
			message: 'Experience all the features we offer',
			buttonText: 'Upgrade Now'
		},
		paused: {
			title: 'Your Free Trial Has Ended',
			message: 'Please upgrade to continue enjoying our services',
			buttonText: 'Purchase Pro Plan'
		},
		canceled: {
			title: "We're sorry to see you go",
			message: 'You can rejoin anytime',
			buttonText: 'Reactivate Subscription'
		}
	};

	$: isLoading = false;
	$: isStripeCheckoutSuccess = $page.url.searchParams.has('success');
</script>

<PageSubHeader heading="Main" subheading="Your account information" />

{#if $userProfileStore?.subscriptionStatus !== 'active' || isStripeCheckoutSuccess}
	<section aria-label="Account Status" class="pb-8 mb-6 border-b">
		<article
			class="grid gap-4 p-4 rounded {isStripeCheckoutSuccess ? 'bg-green-600' : 'bg-accent'}"
		>
			{#if isStripeCheckoutSuccess}
				<h3>
					Your subscription has been activated! You can now enjoy all the features of the Pro plan!
				</h3>
			{:else if $userProfileStore?.subscriptionStatus !== 'active'}
				{@const currentStatus = statusMessages[$userProfileStore?.subscriptionStatus || 'trialing']}

				<h3>{currentStatus?.title}</h3>
				<p>{currentStatus?.message}</p>

				<form
					action="?/stripeCheckout"
					method="POST"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							await update();
							isLoading = false;
						};
					}}
				>
					<SubmitButton class="px-4 w-fit" disabled={isLoading}>
						<Icon name="crown" />
						{currentStatus?.buttonText}
					</SubmitButton>
				</form>
			{/if}
		</article>
	</section>
{/if}

<section aria-label="Account Actions">
	<div class="pb-6 mb-8 border-b">
		<h3 class="text-lg font-semibold">Email</h3>
		<p class="text-sm text-muted-foreground">{$userProfileStore?.email}</p>
	</div>

	<div class="flex flex-wrap gap-8 mt-8">
		<Button type="button" on:click={() => exportUserData(userData)} class="gap-2">
			<Icon name="download" />
			<span>Export Data</span>
		</Button>

		<Button formaction="?/deleteAccount" type="button" variant="destructive" class="gap-2">
			<Icon name="delete" />
			<span>Delete Account</span>
		</Button>
	</div>
</section>
