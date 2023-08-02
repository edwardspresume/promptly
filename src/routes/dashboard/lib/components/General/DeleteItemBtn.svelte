<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Icon from './Icon.svelte';

    export let iconSize: number = 22;
    export let buttonTitle: string = '';

    const dispatch = createEventDispatcher();
</script>

<button
    type="button"
    title={buttonTitle}
    aria-label={buttonTitle}
    on:click|stopPropagation={() => dispatch('click')}
    class="transition-colors duration-200 text-slate-800 hover:text-red-500 dark:hover:text-red-500 dark:text-slate-300"
>
    <Icon name="delete" size={iconSize} />
</button>
