<script lang="ts">
    export let title: string = 'Submit';
    export let disabled: boolean = false;
</script>

<button
    {title}
    {disabled}
    type="submit"
    aria-label={title}
    aria-disabled={disabled}
    class="p-2 font-bold w-full text-white transition-colors duration-200 bg-indigo-500 rounded-md whitespace-nowrap hover:bg-indigo-700"
>
    {title}
</button>
