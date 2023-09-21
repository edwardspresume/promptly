<script lang="ts">
	import type { PageData } from './$types';

	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import PageSubHeader from '$dashboardComponents/account/PageSubHeader.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let data: PageData;
</script>

<PageSubHeader heading="Main" subheading="Your account information" />

<section>
	<div>
		<h3>Email</h3>
		<p class="text-muted-foreground">{$userProfileStore?.email}</p>
	</div>

	<form class="flex gap-8 mt-8">
		<Button formaction="?/exportData" type="button" class="gap-2">
			<Icon name="download" />
			<span>Export Data</span>
		</Button>

		<Button formaction="?/deleteAccount" type="button" variant="destructive" class="gap-2">
			<Icon name="delete" />
			<span>Delete Account</span>
		</Button>
	</form>
</section>
