<script lang="ts">
    import { SvelteToast } from '@zerodevx/svelte-toast';

    import { closeDialogOnOutsideClick } from '$utils/functions';

    import CloseModalBtn from './CloseModalBtn.svelte';

    export let dialogElement: HTMLDialogElement;
    export let modalTitle: string;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    on:click={(event) => closeDialogOnOutsideClick(event, dialogElement)}
    bind:this={dialogElement}
    class="border rounded-lg border-white/30 bg-white/5 backdrop:backdrop-blur-md backdrop:bg-black/70 overflow-visible max-w-md"
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
