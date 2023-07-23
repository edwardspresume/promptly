<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { TagSchema } from '$types';

    export let tag: TagSchema;

    const dispatch = createEventDispatcher();
</script>

<button
    type="button"
    title="Remove tag"
    aria-label={`Remove ${tag.name} tag`}
    on:click|stopPropagation={() => dispatch('remove', tag)}
    class="flex text-xs gap-2 px-1 text-white rounded-md dark:text-black bg-black/70 dark:bg-white select-none"
>
    <span>{tag.name}</span>
    <span>&#x2715;</span>
</button>
