<script>
	import { page } from '$app/stores';

	import { marketingLinks } from '$marketingNavLinks';

	import ThemeToggleBtn from '$globalComponents/mainHeader/ThemeToggleBtn.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	$: isLoggedIn = $page.data.session?.user;
</script>

<ul class="grid items-center gap-5 sm:gap-2 sm:flex">
	{#each marketingLinks as { title, href } (title)}
		{#if !isLoggedIn || !href.includes('auth')}
			<li>
				<Button
					{href}
					variant={title === 'Dashboard' ? 'default' : 'outline'}
					class="w-full sm:py-1 sm:px-2 sm:h-fit"
				>
					{title}
				</Button>
			</li>
		{/if}
	{/each}

	<li>
		<ThemeToggleBtn class="hidden sm:flex" />
	</li>
</ul>
