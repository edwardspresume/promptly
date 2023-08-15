<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import { userSessionStore } from '$globalStores/userAndSupabaseStores';

    import { notifyError } from '$dashboardUtils/toast';
    import Icon from '$globalComponents/Icon.svelte';

    export let iconSize: number;
    export let isFavorited: boolean = false;
    export let context: 'PromptCreationForm' | 'PromptEditForm' | 'PromptItem';

    const dispatch = createEventDispatcher();

    /**
     * Handles the click event to toggle the favorite state.
     * If the context is 'PromptItem' and there a user session, it sends a request to the server.
     * Otherwise, it just dispatches an event.
     */
    async function handleFavoriteToggleClick() {
        if (context === 'PromptItem' && $userSessionStore) {
            try {
                // Prepare form data
                const formData = new FormData();
                formData.append('isFavorited', String(!isFavorited));

                // Send an asynchronous request to the server
                const response = await fetch('?/toggleFavorite', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) isFavorited = !isFavorited;
            } catch (error) {
                console.error(error);
                notifyError('Failed to toggle favorite');
            }
        } else {
            dispatch('favoriteToggled', { isFavorited: !isFavorited });
        }
    }

    $: fill = isFavorited ? '#E2264D' : 'currentColor';
    $: buttonLabel = isFavorited ? 'Remove from Favorites' : 'Add to Favorites';
</script>

<button
    role="switch"
    type="button"
    title={buttonLabel}
    aria-label={buttonLabel}
    aria-checked={isFavorited}
    class="text-gray-600 dark:text-slate-500"
    on:click|preventDefault|stopPropagation={handleFavoriteToggleClick}
>
    <label>
        <span class="sr-only">{buttonLabel}</span>
        <input
            type="checkbox"
            checked={isFavorited}
            name="isFavorited"
            class="hidden"
        />
    </label>
    <Icon size={iconSize} {fill} name="favorite" />
</button>
