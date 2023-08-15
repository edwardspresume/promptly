<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { PromptSchema } from '$dashboardTypes';

    import ListItem from '$dashboardComponents/General/ListItem.svelte';
    import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
    import Icon from '$globalComponents/Icon.svelte';
    import CopyPromptTextBtn from './CopyPromptTextBtn.svelte';
    import FavoriteToggleBtn from './FavoriteToggleBtn.svelte';

    export let prompt: PromptSchema;

    let { id, title, text, isFavorited } = prompt;

    $: {
        ({ id, title, text, isFavorited } = prompt);
    }

    const dispatch = createEventDispatcher();

    /**
     *  Toggles the favorite status of the prompt
     * @param {CustomEvent} event - Event object that has isFavorited value
     */
    function handleFavoriteStatusToggle(event: CustomEvent) {
        isFavorited = event.detail.isFavorited;

        promptLocalStorageManager.updateItem(id!, { isFavorited });
    }
</script>

<ListItem
    title={`Edit prompt: ${title}`}
    onItemClickOrKeyPress={() => dispatch('editPrompt', prompt)}
>
    <h3 class="flex items-center gap-2 select-none">
        <Icon name="lightbulb" size={15} />

        <span>
            {title}
        </span>
    </h3>

    <div class="flex items-center gap-x-4">
        <FavoriteToggleBtn
            context="PromptItem"
            {isFavorited}
            iconSize={20}
            on:favoriteToggled={(event) => handleFavoriteStatusToggle(event)}
        />

        <CopyPromptTextBtn promptText={text} />
    </div>
</ListItem>
