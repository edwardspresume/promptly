<script lang="ts">
    import type { EnterKeyHint } from '$dashboardTypes/dashboardTypes';

    export let value: string = '';
    export let name: string = '';
    export let label: string = '';
    export let placeholder: string = '';
    export let errorMessage: object | undefined;
    export let enterkeyhint: EnterKeyHint = 'enter';
</script>

<label class="flex-grow">
    <span class="sr-only">{label}</span>

    <textarea
        {name}
        rows="6"
        bind:value
        {placeholder}
        {enterkeyhint}
        aria-label={label}
    />

    <small class="text-red-500">{errorMessage}</small>
</label>
