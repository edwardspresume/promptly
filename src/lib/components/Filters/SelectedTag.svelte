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
    on:click|stopPropagation={() => dispatch('removeTag')}
    class="flex gap-2 px-1 text-xs text-white rounded-md select-none dark:text-black bg-black/80 dark:bg-white"
>
    <span>{tag.name}</span>
    <span>&#x2715;</span>
</button>
