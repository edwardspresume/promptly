<script lang="ts">
	import { isNavigatingStore } from '$globalStores/isNavigatingStore';
	import { onDestroy } from 'svelte';

	import Icon from '$globalComponents/Icon.svelte';

	let showSpinner = false;
	let timeoutId: number | NodeJS.Timeout;

	const unsubscribe = isNavigatingStore.subscribe((isNavigating) => {
		clearTimeout(timeoutId);

		if (isNavigating) {
			timeoutId = setTimeout(() => (showSpinner = true), 100);
		} else {
			showSpinner = false;
		}
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
		unsubscribe();
	});
</script>

{#if showSpinner}
	<div class="grid h-full place-content-center">
		<Icon name="loading-spinner" size={60} class="animate-spin" />
	</div>
{:else}
	<slot />
{/if}
