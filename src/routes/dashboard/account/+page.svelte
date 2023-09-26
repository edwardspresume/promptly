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

<section>
	<div>
		<h3>Email</h3>
		<p class="text-muted-foreground">{$userProfileStore?.email}</p>
	</div>

	<div class="flex gap-8 mt-8">
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
