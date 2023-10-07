<script>
	import { marketingLinks } from '$marketingNavLinks';

	import { page } from '$app/stores';
	import ThemeToggleBtn from '$globalComponents/mainHeader/ThemeToggleBtn.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
</script>

<ul class="grid items-center gap-5 sm:gap-2 sm:flex">
	{#each marketingLinks as { title, href } (title)}
		{@const isCurrentPage = $page.url.pathname === href ? 'page' : undefined}

		<li>
			<Button
				{href}
				aria-current={isCurrentPage}
				variant={title === 'Dashboard' ? 'default' : 'outline'}
				class="w-full sm:py-1 sm:px-2 sm:h-fit {isCurrentPage
					? 'text-primary  dark:text-primary dark:brightness-150'
					: ''}"
			>
				{title}
			</Button>
		</li>
	{/each}

	<li>
		<ThemeToggleBtn class="hidden sm:flex" />
	</li>
</ul>
