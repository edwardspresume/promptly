<script lang="ts">
    import { darkModePreferenceStore } from '$dashboardStores/darkModePreferenceStore';

    import Icon from '$globalComponents/Icon.svelte';

    const currentDarkModePreference =
        darkModePreferenceStore?.currentPreference;

    $: isDarkMode = $currentDarkModePreference;

    $: if (typeof window !== 'undefined') {
        // Invert the theme preference.
        document.documentElement.classList.toggle('dark', isDarkMode ?? false);
    }

    $: buttonTitle = isDarkMode
        ? 'Switch to light mode'
        : 'Switch to dark mode';
</script>

<button
    role="switch"
    type="button"
    aria-live="polite"
    title={buttonTitle}
    aria-label={buttonTitle}
    aria-checked={isDarkMode}
    on:click={() => darkModePreferenceStore?.toggleDarkMode()}
>
    {#if isDarkMode}
        <Icon name="sun" />
        <span>Switch to Light Mode</span>
    {:else}
        <Icon name="moon" />
        <span>Switch to Dark Mode</span>
    {/if}
</button>
