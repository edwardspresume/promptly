<script lang="ts">
	import { page } from '$app/stores';

	import { RoutePaths } from '$globalTypes';

	import Button from '$globalComponents/ui/button/button.svelte';
</script>

<main class="grid h-[100dvh] gap-8 place-content-center">
	{#if $page.status === 404}
		<h1 class="text-4xl text-center">Page not found</h1>

		<div class="flex flex-wrap justify-center gap-3">
			<Button href={RoutePaths.MARKETING_LANDING}>Return to homepage</Button>

			<Button href={RoutePaths.DASHBOARD_PROMPTS}>Return to dashboard</Button>
		</div>
	{:else}
		<h1 class="text-2xl">Error</h1>

		<p>{$page.error?.message}</p>
	{/if}
</main>
