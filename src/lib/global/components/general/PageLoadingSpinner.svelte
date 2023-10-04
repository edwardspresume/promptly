<script lang="ts">
	import { isNavigatingStore } from '$globalStores/isNavigatingStore';
	import { onDestroy } from 'svelte';

	import Icon from '$globalComponents/Icon.svelte';

	let showSpinner = false;
	let timeoutId: number | NodeJS.Timeout;

	const unsubscribe = isNavigatingStore.subscribe((isNavigating) => {
		clearTimeout(timeoutId);
		if (isNavigating) {
			timeoutId = setTimeout(() => (showSpinner = true), 300);
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
	<div class="grid h-full gap-4 justify-items-center -mt-36 place-content-center">
		<Icon name="loading-spinner" size={50} class="animate-spin" />
		<p class="text-xl animate-pulse">Loading</p>
	</div>
{:else}
	<slot />
{/if}
