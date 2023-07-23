<script lang="ts">
    import { onDestroy } from 'svelte';

    import type { ItemType } from '$types';

    import Icon from '$components/General/Icon.svelte';

    export let itemType: ItemType;
    export let listRef: HTMLUListElement;

    const title = `Return to top of ${itemType}'s list`;

    let isVisible = false;

    function scrollToTop() {
        listRef && listRef.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const updateVisibility = () => {
        isVisible = listRef.scrollTop > 200;
    };

    $: {
        if (listRef) {
            updateVisibility();
            listRef.addEventListener('scroll', updateVisibility);
        }
    }

    onDestroy(() => {
        if (listRef) {
            listRef.removeEventListener('scroll', updateVisibility);
        }
    });
</script>

<!-- Render the button only if listRef exists and it has scrolled more than 200px -->
{#if listRef && isVisible}
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
