<script lang="ts">
	import { page } from '$app/stores';

	import { dashboardLinks } from '$dashboardNavLinks';

	import Button from '$globalComponents/ui/button/button.svelte';
</script>

<ul class="flex">
	{#each dashboardLinks.mainNav as { href, title, ariaLabel } (title)}
		{@const isCurrentPage = $page.url.pathname === href ? 'page' : undefined}

		<li>
			<Button
				{href}
				variant="ghost"
				aria-label={ariaLabel}
				aria-current={isCurrentPage}
				class="px-2 py-1 h-fit {isCurrentPage ? 'text-primary' : ''}"
			>
				{title}
			</Button>
		</li>
	{/each}
</ul>
