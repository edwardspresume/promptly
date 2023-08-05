<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Icon from '$globalComponents/Icon.svelte';

    export let iconSize: number;
    export let isFavorited: boolean | undefined;

    const dispatch = createEventDispatcher();

    function handleFavoriteToggleClick() {
        dispatch('favoriteToggled', { isFavorited: !isFavorited });
    }

    $: fill = isFavorited ? '#E2264D' : 'currentColor';
    $: buttonLabel = isFavorited ? 'Remove from Favorites' : 'Add to Favorites';
</script>

<button
    type="button"
    title={buttonLabel}
    aria-label={buttonLabel}
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
