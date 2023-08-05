<script lang="ts">
    import { fly } from 'svelte/transition';

    import { onOutsideClick } from '$dashboardUtils/functions';
    import { userSessionStore } from '$globalStores/userSessionStore';

    import AccountPopUpMenuItems from './AccountPopUpMenuItems.svelte';

    // State variable to track if the menu is open or not
    let isAccountPopUpMenuVisible = false;

    // Dynamic variable to set the title of the account menu button
    $: accountPopUpMenuButtonTitle = isAccountPopUpMenuVisible
        ? 'Close account pop-up menu'
        : 'Open account pop-up menu';

    let userAvatarUrl = $userSessionStore?.user_metadata?.avatar_url;
    let userEmail = $userSessionStore?.email?.charAt(0).toUpperCase();
    let userFirstName =
        $userSessionStore?.user_metadata?.full_name?.split(' ')[0][0];
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
    >
        {#if userAvatarUrl}
            <img src={userAvatarUrl} alt="User's avatar" class="rounded-full" />
        {:else if userFirstName}
            <span class="text-2xl">{userFirstName}</span>
        {:else if userEmail}
            <span class="text-2xl">{userEmail}</span>
        {/if}
    </button>

    {#if isAccountPopUpMenuVisible}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <menu
            id="account-pop-up-menu"
            on:click|stopPropagation
            on:keydown|stopPropagation
            transition:fly={{ y: 20 }}
            use:onOutsideClick={() => (isAccountPopUpMenuVisible = false)}
            class="absolute mt-3 rounded-md shadow-xl bg-secondary top-full backdrop-blur-md"
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
