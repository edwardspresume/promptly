<script lang="ts">
	import { page } from '$app/stores';
	import { RoutePaths } from '$globalTypes';

	export let indexPage: boolean = true;

	export let title: string = 'Promptly: Your Central Hub for AI Prompt Management';

	export let description: string =
		'Discover a seamless way to save, find, share, and manage your AI prompts with Promptly. Our powerful features help you optimize and organize prompts.';

	export let image = { src: '/icon.png', alt: 'promptly Icon' };

	const imageURL = $page.url.origin + image.src;

	const imageType = image.src.substring(image.src.lastIndexOf('.') + 1);

	const canonicalURL = $page.url.href;

	const webSiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Promptly',
		url: $page.url.origin,
		description: description,
		image: imageURL
	};

	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		url: canonicalURL,
		description: description,
		image: imageURL,
		publisher: {
			'@type': 'Organization',
			name: 'Promptly',
			logo: {
				'@type': 'ImageObject',
				url: imageURL,
				width: 1200,
				height: 600
			}
		}
	};
</script>

<svelte:head>
	<meta name="robots" content={indexPage ? 'index, follow' : 'noindex, nofollow'} />

	{#if indexPage}
		<link rel="canonical" href={canonicalURL} />
	{/if}

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="ai prompts, ai prompt, ai prompt generator, ai prompt library, ai prompt maker, ai prompt tool, ai prompter, ai prompts generator, ai prompts library, ai prompts maker, ai pro, ai writing prompts, writing prompts, save prompts, organize prompts, share prompts, prompt library, prompt manager"
	/>

	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<!-- Open Graph / Facebook -->
	<meta property="og:locale" content="en_IE" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Promptly" />
	<meta property="og:url" content={canonicalURL} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={title} />
	<meta property="og:image" content={imageURL} />
	<meta property="og:image:url" content={imageURL} />
	<meta property="og:image:secure_url" content={imageURL} />
	<meta property="og:image:type" content={`image/${imageType}`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="600" />
	<meta property="og:image:alt" content={image.alt} />

	<!-- Twitter -->
	<meta property="twitter:title" content={title} />
	<meta property="twitter:url" content={canonicalURL} />
	<meta property="twitter:creator" content="@edwardspresume" />
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={imageURL} />
	<meta name="twitter:image:alt" content={image.alt} />

	{#if $page.url.pathname === RoutePaths.MARKETING_LANDING}
		{@html `<script type="application/ld+json">${JSON.stringify(webSiteSchema)}</script>`}
	{/if}

	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
</svelte:head>