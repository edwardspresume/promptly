<script lang="ts">
    import { SvelteToast } from '@zerodevx/svelte-toast';

    import type { LayoutData } from './$types';

    import '$globalStyles';

    import AppHeader from '$dashboardComponents/AppHeader/AppHeader.svelte';
    import FeedbackForm from '$dashboardComponents/Forms/FeedbackForm.svelte';

    export let data: LayoutData;
</script>

<div
    class="h-[100dvh] flex flex-col pb-6 bg-primary text-primary transition-colors duration-200"
>
    <AppHeader />

    <main
        class="relative grid w-full max-w-xl mx-auto mt-8 overflow-hidden pe-4 ps-4"
    >
        <slot />
    </main>
</div>

<SvelteToast options={{ intro: { y: -100 } }} />

<FeedbackForm feedbackFormData={data.feedbackForm} />
