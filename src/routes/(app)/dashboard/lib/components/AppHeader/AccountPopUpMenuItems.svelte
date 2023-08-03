<script>
    import { isFeedbackModalOpen } from '$dashboardStores/feedbackModalStore';

    import Icon from '$globalComponents/Icon.svelte';
    import ExportDataBtn from './ExportDataBtn.svelte';
    import ThemeToggleBtn from './ThemeToggleBtn.svelte';
</script>

<li>
    <a href="#plans" title="Upgrade to Pro" aria-label="Upgrade to Pro">
        <Icon name="crown" />

        <span>
            Upgrade to <span
                class="py-1 text-white rounded-md pe-2 ps-2 bg-gradient-to-r from-sky-500 to-indigo-500"
            >
                Pro
            </span>
        </span>
    </a>
</li>

<li>
    <button
        title="Feedback"
        aria-label="Feedback"
        on:click={() => isFeedbackModalOpen.set(true)}
    >
        <Icon name="feedback" />
        <span>Feedback</span>
    </button>
</li>

<li>
    <ExportDataBtn />
</li>

<li>
    <ThemeToggleBtn />
</li>

<style lang="postcss">
    li {
        transition: background-color 0.2s ease-in-out;

        &:first-child {
            border-start-start-radius: 0.5rem;
            border-start-end-radius: 0.5rem;
        }

        &:last-child {
            border-end-end-radius: 0.5rem;
            border-end-start-radius: 0.5rem;
        }

        &:hover {
            background-color: hsl(214, 16%, 78%);
        }
    }

    :global(.dark) li:hover {
        background-color: hsl(214, 16%, 38%);
    }

    li a,
    li :global(button) {
        display: flex;
        padding: 0.8rem;
        inline-size: 100%;
        column-gap: 0.8rem;
        align-items: center;
        white-space: nowrap;
    }
</style>
