<script>
    import AccountPopUpMenu from './AccountPopUpMenu.svelte';
    import Logo from '$globalComponents/Logo.svelte';
    import PageLinks from './PageLinks.svelte';
</script>

<header class="z-50 py-1 border-b border-black/10 dark:border-white/10">
    <div class="flex items-center justify-between max-w-5xl mx-auto ps-2 pe-2">
        <Logo href='/dashboard' title='Go to prompts' />

        <nav class="flex items-center gap-4">
            <PageLinks />

            <AccountPopUpMenu />
        </nav>
    </div>
</header>
