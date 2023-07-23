<script lang="ts">
    import { handleKeyDown } from '$utils/functions';

    export let title: string;
    export let onItemClickOrKeyPress: () => void;
</script>

<li role="listitem">
    <button
        {title}
        type="button"
        aria-label={title}
        on:click={onItemClickOrKeyPress}
        on:keydown={(event) => handleKeyDown(event, onItemClickOrKeyPress)}
        class="w-full flex items-center justify-between gap-4 p-2 transition-colors duration-200 border rounded-md cursor-pointer hover:bg-white/40 border-white/10 dark:hover:bg-white/20 bg-white/20 dark:bg-white/5"
    >
        <slot />
    </button>
</li>
