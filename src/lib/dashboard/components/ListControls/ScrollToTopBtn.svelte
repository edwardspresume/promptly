<script lang="ts">
    import { onDestroy } from 'svelte';

    import type { ItemType } from '$dashboardTypes/dashboardTypes';

    import Icon from '$globalComponents/Icon.svelte';

    export let itemType: ItemType;
    export let itemContainerRef: HTMLElement;

    const title = `Return to top of ${itemType}'s list`;

    let isVisible = false;

    function scrollToTop() {
        itemContainerRef &&
            itemContainerRef.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const updateVisibility = () => {
        isVisible = itemContainerRef.scrollTop > 200;
    };

    $: {
        if (itemContainerRef) {
            updateVisibility();
            itemContainerRef.addEventListener('scroll', updateVisibility);
        }
    }

    onDestroy(() => {
        if (itemContainerRef) {
            itemContainerRef.removeEventListener('scroll', updateVisibility);
        }
    });
</script>

<!-- Render the button only if itemContainerRef exists and it has scrolled more than 200px -->
{#if itemContainerRef && isVisible}
    <button
        {title}
        type="button"
        aria-live="polite"
        aria-label={title}
        on:click={scrollToTop}
        class="p-2 font-bold duration-500 ease-in-out rounded-full bg-gradient-to-r from-indigo-500 to-indigo-500 hover:scale-105"
    >
        <Icon name="arrow-upward" size={26} />
    </button>
{/if}
