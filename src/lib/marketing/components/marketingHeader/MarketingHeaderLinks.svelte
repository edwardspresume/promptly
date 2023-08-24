<script>
	import ThemeToggleBtn from '$globalComponents/mainHeader/ThemeToggleBtn.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	import { marketingNavLinks } from '$marketingNavLinks';
</script>

<ul class="flex items-center gap-3 sm:gap-2">
	{#each marketingNavLinks as { title, href, ariaLabel } (title)}
		<li>
			<Button
				{href}
				aria-label={ariaLabel}
				variant={title === 'Dashboard' ? 'default' : 'ghost'}
				class="px-2 py-1 h-fit"
			>
				{title}
			</Button>
		</li>
	{/each}

	<li class="flex -ml-2">
		<ThemeToggleBtn />
	</li>
</ul>
