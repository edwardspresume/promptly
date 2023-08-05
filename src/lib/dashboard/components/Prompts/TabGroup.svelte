<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Icon from '$globalComponents/Icon.svelte';

    const dispatch = createEventDispatcher();

    interface Tab {
        label: string;
        iconName: string;
    }

    let selectedTabIndex: number = 0;

    let tabs: Tab[] = [
        {
            label: 'All Prompts',
            iconName: 'lightbulb',
        },

        {
            label: 'Favorites',
            iconName: 'favorite',
        },
    ];

    /**
     * this function will set the active tab index and dispatch the custom event.
     * @param {number} index - The index of the tab
     */
    function handleTabSelection(index: number) {
        selectedTabIndex = index;

        dispatch('tabItemClicked', { selectedTabIndex });
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
<nav
    role="tablist"
    aria-label="Tab Group"
    class="flex justify-center border-b border-black/10 dark:border-white/10"
>
    {#each tabs as { label, iconName }, index}
        <button
            role="tab"
            type="button"
            on:click={() => handleTabSelection(index)}
            aria-controls={`tabpanel-${index}`}
            aria-selected={selectedTabIndex === index}
            tabindex={selectedTabIndex === index ? 0 : -1}
            class={`px-4 flex items-center text-lg gap-2 py-2 border-b-2 transition-colors duration-200 ease-in-out ${
                selectedTabIndex === index
                    ? 'border-black dark:border-white'
                    : 'border-transparent text-gray-500 dark:text-gray-500 hover:bg-white/60 dark:hover:bg-black/40'
            }`}
        >
            <Icon name={iconName} size={18} />
            {label}
        </button>
    {/each}
</nav>
