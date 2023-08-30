<script lang="ts">
	import { onDestroy } from 'svelte';

	import type { ItemType } from '$dashboardTypes';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let itemType: ItemType;
	export let itemsListRef: HTMLElement;

	const title = `Return to top of ${itemType}'s list`;

	let isVisible = false;

	function scrollToTop() {
		itemsListRef && itemsListRef.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const updateVisibility = () => {
		isVisible = itemsListRef.scrollTop > 200;
	};

	$: {
		if (itemsListRef) {
			updateVisibility();

			itemsListRef.addEventListener('scroll', updateVisibility);
		}
	}

	onDestroy(() => {
		if (itemsListRef) {
			itemsListRef.removeEventListener('scroll', updateVisibility);
		}
	});
</script>

<!-- Render the button only if itemsListRef exists and it has scrolled more than 200px -->
{#if itemsListRef && isVisible}
	<Button
		{title}
		size="icon"
		type="button"
		aria-live="polite"
		aria-label={title}
		on:click={scrollToTop}
		class="transition-all duration-500 ease-in-out rounded-full bg-gradient-to-r from-indigo-500 to-indigo-500 hover:scale-105"
	>
		<Icon name="arrow-upward" size={26} />
	</Button>
{/if}
