<script>
	import ThemeToggleBtn from '$globalComponents/MainHeader/ThemeToggleBtn.svelte';
	import DashboardLink from '$marketingComponents/DashboardLink.svelte';
</script>

<ul class="flex items-center gap-3 sm:gap-4">
	<li>
		<DashboardLink />
	</li>

	<li>
		<a href="/auth" aria-label="Sign up for a new account">Sign up</a>
	</li>

	<li class="flex -ml-2">
		<ThemeToggleBtn />
	</li>
</ul>
