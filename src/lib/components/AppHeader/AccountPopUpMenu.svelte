<script lang="ts">
    import { fly } from 'svelte/transition';

    import { listenForOutsideClick } from '$utils/functions';

    import AccountPopUpMenuItems from './AccountPopUpMenuItems.svelte';

    // State variable to track if the menu is open or not
    let isAccountPopUpMenuVisible = false;

    // Dynamic variable to set the title of the account menu button
    $: accountPopUpMenuButtonTitle = isAccountPopUpMenuVisible
        ? 'Close account pop-up menu'
        : 'Open account pop-up menu';
</script>

<div class="relative grid">
    <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isAccountPopUpMenuVisible}
        aria-controls="account-pop-up-menu"
        aria-label={accountPopUpMenuButtonTitle}
        title={accountPopUpMenuButtonTitle}
        class="w-12 h-12 border rounded-full bg-gradient-to-b from-blue-500 to-purple-500 dark:border-blue-500 border-violet-500"
        on:click|stopPropagation={() =>
            (isAccountPopUpMenuVisible = !isAccountPopUpMenuVisible)}
    />

    {#if isAccountPopUpMenuVisible}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <menu
            id="account-pop-up-menu"
            on:click|stopPropagation
            on:keydown|stopPropagation
            transition:fly={{ y: 20 }}
            use:listenForOutsideClick={() =>
                (isAccountPopUpMenuVisible = false)}
            class="absolute mt-3 bg-white rounded-md shadow-xl dark:bg-black/60 backdrop-blur-md top-full"
        >
            <AccountPopUpMenuItems />
        </menu>
    {/if}
</div>

<style lang="postcss">
    button {
        -webkit-tap-highlight-color: transparent;
    }

    @media (width < 1182px) {
        menu {
            inset-inline-end: 0%;
        }
    }

    @media (width > 1182px) {
        menu {
            inset-inline-start: 50%;
            transform: translateX(-50%);
        }
    }
</style>
