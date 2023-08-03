<script lang="ts">
    export let title: string = 'Submit';
    export let disabled: boolean = false;
    export let extraStyles: string = '';
</script>

<button
    {title}
    {disabled}
    type="submit"
    aria-label={title}
    aria-disabled={disabled}
    class="w-full p-3 font-bold text-white transition-colors duration-200 rounded-md bg-violet-600 whitespace-nowrap hover:bg-violet-700 {extraStyles}"
>
    {title}
</button>
