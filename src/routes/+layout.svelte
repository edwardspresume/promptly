<script>
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';

    import { SvelteToast } from '@zerodevx/svelte-toast';

    import '../styles/app.postcss';

    import AppHeader from '$components/AppHeader.svelte';

    inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="h-[100dvh] flex flex-col pb-6">
    <AppHeader />

    <main>
        <slot />
    </main>
</div>

<SvelteToast options={{ intro: { y: -100 } }} />
