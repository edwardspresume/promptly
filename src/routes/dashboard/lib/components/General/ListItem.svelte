<script lang="ts">
    import { handleKeyDown } from '$dashboardUtils/functions';

    export let title: string;
    export let onItemClickOrKeyPress: () => void;
</script>

<div
    {title}
    tabindex="0"
    role="button"
    aria-label={title}
    on:click={onItemClickOrKeyPress}
    on:keydown={(event) => handleKeyDown(event, onItemClickOrKeyPress)}
    class="flex items-center justify-between gap-4 p-2 transition-colors duration-200 border rounded-md cursor-pointer hover:bg-black/10 border-black/10 dark:border-white/10 bg-secondary dark:hover:bg-white/20 dark:bg-white/5"
>
    <slot />
</div>
