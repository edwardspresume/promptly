<script lang="ts">
	import { isNavigatingStore } from '$globalStores/isNavigatingStore';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

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
	<div class="grid h-full place-content-center" transition:fade>
		<Icon name="loading-spinner" size={90} class="-mt-40 animate-spin" />
	</div>
{:else}
	<slot />
{/if}
