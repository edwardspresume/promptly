<script>
	import { isNavigatingStore } from '$globalStores/isNavigatingStore';

	import Icon from '$globalComponents/Icon.svelte';
</script>

{#if $isNavigatingStore}
	<div class="grid w-full h-full place-content-center">
		<Icon name="loading-spinner" size={60} class="animate-spin" />
	</div>
{:else}
	<slot />
{/if}
