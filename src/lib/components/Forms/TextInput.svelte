<script lang="ts">
    import type { EnterKeyHint } from '$types';

    export let value: string = '';
    export let name: string = '';
    export let label: string = '';
    export let placeholder: string = '';
    export let errorMessage: object | undefined;
    export let enterkeyhint: EnterKeyHint = 'enter';
</script>

<label class="flex-grow">
    <span class="sr-only">{label}</span>

    <input
        {name}
        bind:value
        type="text"
        {placeholder}
        {enterkeyhint}
        spellcheck="true"
        autocomplete="on"
        aria-label={label}
    />

    <small class="text-red-500">{errorMessage}</small>
</label>
