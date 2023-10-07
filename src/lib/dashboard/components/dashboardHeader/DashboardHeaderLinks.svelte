<script lang="ts">
	import { page } from '$app/stores';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$globalUtils';

	import { dashboardLinks } from '$dashboardNavLinks';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLAttributes<HTMLUListElement>['class'] = undefined;
	export { className as class };
</script>

<ul class={cn('flex gap-2', className)}>
	{#each dashboardLinks.mainNav as { href, title } (title)}
		{@const isCurrentPage = $page.url.pathname === href ? 'page' : undefined}

		<li>
			<Button
				{href}
				variant="outline"
				aria-current={isCurrentPage}
				class="w-full sm:py-1 sm:px-2 sm:h-fit {isCurrentPage
					? 'text-primary  dark:text-primary dark:brightness-150'
					: ''}"
			>
				{title}
			</Button>
		</li>
	{/each}
</ul>
