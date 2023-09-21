<script>
	import { page } from '$app/stores';

	import { marketingLinks } from '$marketingNavLinks';

	import ThemeToggleBtn from '$globalComponents/mainHeader/ThemeToggleBtn.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	$: isLoggedIn = $page.data.session?.user;
</script>

<ul class="flex items-center gap-3 sm:gap-2">
	{#each marketingLinks as { title, href } (title)}
		{#if !isLoggedIn || !href.includes('auth')}
			<li>
				<Button
					{href}
					variant={title === 'Dashboard' ? 'default' : 'ghost'}
					class="px-2 py-1 h-fit"
				>
					{title}
				</Button>
			</li>
		{/if}
	{/each}

	<li>
		<ThemeToggleBtn />
	</li>
</ul>
