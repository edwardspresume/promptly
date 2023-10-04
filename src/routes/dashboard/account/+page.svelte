<script lang="ts">
	import type { PageData } from './$types';

	import { userProfileStore } from '$dashboardStores/userProfileStore';
	import { userTagsStore } from '$dashboardStores/userTagsStore';
	import { exportUserData } from '$dashboardUtils/exportUserData';

	import PageSubHeader from '$dashboardComponents/account/PageSubHeader.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let data: PageData;

	const userData = {
		profile: $userProfileStore,
		prompts: data.userPrompts,
		tags: $userTagsStore
	};
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

		<Button formaction="?/deleteAccount" type="button" variant="destructive" class="gap-2">
			<Icon name="delete" />
			<span>Delete Account</span>
		</Button>
	</div>
</section>

<style lang="postcss">
	li {
		@apply pb-6 mb-8 border-b;

		h3 {
			@apply font-semibold;
		}
	}
</style>
