<script lang="ts">
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';

    import type { LayoutData } from './$types';

    export let data: LayoutData;

    inject({ mode: dev ? 'development' : 'production' });
</script>

<div
    class="h-[100dvh] flex flex-col pb-6 bg-primary text-primary transition-colors duration-200"
>
    <main
        class="relative grid w-full max-w-xl mx-auto mt-8 overflow-hidden pe-4 ps-4"
    >
        <slot />
    </main>
</div>
