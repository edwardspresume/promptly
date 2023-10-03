<script lang="ts">
	import { page } from '$app/stores';

	import { RoutePaths } from '$globalTypes';

	import Button from '$globalComponents/ui/button/button.svelte';
</script>

<main class="grid h-full gap-3 text-center justify-items-center place-content-center">
	{#if $page.status === 401}
		<h1 class="text-2xl">Authentication required</h1>

		<p>{$page.error?.message}</p>

		<div class="flex gap-2">
			<Button href={RoutePaths.SIGNIN}>Log in</Button>

			<Button href={RoutePaths.SIGNUP}>Sign up</Button>
		</div>
	{:else}
		<h1 class="text-2xl">Error</h1>

		<p>{$page.error?.message}</p>
	{/if}
</main>
