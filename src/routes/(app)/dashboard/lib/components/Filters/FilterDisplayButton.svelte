<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
</script>

<button
    type="button"
    title="Show Filters"
    class="theme"
    aria-label="Show Filters"
    on:click={() => dispatch('showFilters')}
>
    Filters
</button>
