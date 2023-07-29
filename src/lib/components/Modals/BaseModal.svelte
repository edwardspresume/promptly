<script lang="ts">
    import { SvelteToast } from '@zerodevx/svelte-toast';

    import { createEventDispatcher } from 'svelte';

    import { closeDialogOnOutsideClick } from '$utils/functions';

    import CloseModalBtn from './CloseModalBtn.svelte';

    export let dialogElement: HTMLDialogElement;
    export let modalTitle: string;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    on:close={() => dispatch('close')}
    on:click={(event) => closeDialogOnOutsideClick(event, dialogElement)}
    bind:this={dialogElement}
    class="border rounded-lg border-black/30 dark:border-white/30 bg-white dark:bg-white/5 backdrop:backdrop-blur-md backdrop:bg-black/70 max-w-md max-h-[100dvh] overflow-y-auto"
>
    <header
        class="flex justify-between items-center mb-12 gap-7 text-[#b7b7b7]"
    >
        <h3 class="text-xl font-bold">{modalTitle}</h3>

        <CloseModalBtn {dialogElement} />
    </header>

    <slot />

    <SvelteToast target="baseModal" options={{ intro: { y: -100 } }} />
</dialog>
