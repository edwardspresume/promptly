<script>
    import '../styles/app.postcss';

    import AppHeader from '$components/AppHeader.svelte';
</script>

<div>
    <AppHeader />
    <main>
        <slot />
    </main>
</div>
