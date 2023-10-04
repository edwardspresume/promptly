<script lang="ts">
	import { enhance } from '$app/forms';

	import { userProfileStore } from '$dashboardStores/userProfileStore';
	import type { ProfileSchema } from '$databaseDir/schema';

	import PageSubHeader from '$dashboardComponents/account/PageSubHeader.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';

	type SubscriptionStatus = ProfileSchema['subscriptionStatus'];

	type SubscriptionStatusMessages = Partial<
		Record<SubscriptionStatus, { title: string; message: string; buttonText: string }>
	>;

	const subscriptionStatusMessages: SubscriptionStatusMessages = {
		trialing: {
			title: 'Enjoy Your Free Trial!',
			message: 'Explore all the premium features we have to offer.',
			buttonText: 'Subscribe to Our Pro Plan'
		},
		paused: {
			title: 'Your Free Trial Has Ended',
			message: 'Please upgrade to continue enjoying our services',
			buttonText: 'Reactivate Your Subscription'
		},
		canceled: {
			title: 'Subscription Canceled',
			message: 'Rejoin anytime you want.',
			buttonText: 'Reactivate Your Subscription'
		}
	};

	$: isLoading = false;

	const enhanceFunction = () => {
		isLoading = true;
		return async ({ update }: { update: Function }) => {
			await update();
			isLoading = false;
		};
	};
</script>

<PageSubHeader heading="Billing" subheading="Your billing information" />

{#if $userProfileStore?.subscriptionStatus !== 'active'}
	{@const currentStatus =
		subscriptionStatusMessages[$userProfileStore?.subscriptionStatus || 'trialing']}

	<section aria-label="Account Status" class="grid gap-4 p-4 rounded bg-accent">
		<h3>{currentStatus?.title}</h3>
		<p>{currentStatus?.message}</p>

		<form method="POST" aria-label="Subscribe to Pro Plan" use:enhance={enhanceFunction}>
			<SubmitButton class="px-4 w-fit" disabled={isLoading}>
				<Icon name="crown" />
				{currentStatus?.buttonText}
			</SubmitButton>
		</form>
	</section>
{:else}
	<form method="POST" aria-label="Manage Subscription" use:enhance={enhanceFunction}>
		<SubmitButton disabled={isLoading} class="w-fit">Manage subscription</SubmitButton>
	</form>
{/if}
