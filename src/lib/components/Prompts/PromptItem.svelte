<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { PromptSchema } from '$types';

    import promptsStore from '$stores/promptsStore';

    import Icon from '$components/General/Icon.svelte';
    import ListItem from '$components/General/ListItem.svelte';
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
        promptsStore.toggleFavorite(id);
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
            iconSize={20}
            {isFavorited}
            on:favoriteToggled={(event) => handleFavoriteStatusToggle(event)}
        />

        <CopyPromptTextBtn promptText={text} />
    </div>
</ListItem>
