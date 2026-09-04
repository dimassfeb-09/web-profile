<script lang="ts">
	import type { PageProps } from './$types';
	import { Calendar, Clock, ArrowLeft } from 'lucide-svelte';
	import TiptapHTML from '$lib/components/shared/TiptapHTML.svelte';
	import JsonLd from '$lib/components/common/JsonLd.svelte';
	import RelatedPosts from '$lib/components/blog/RelatedPosts.svelte';
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import BackButton from '$lib/components/common/BackButton.svelte';
	import QuoteShare from '$lib/components/blog/QuoteShare.svelte';
	import BlogTracker from '$lib/components/blog/BlogTracker.svelte';

	let { data }: PageProps = $props();
	const blog = $derived(data.blog);

	const canonicalUrl = $derived(`https://www.dimassfeb.com/blog/${blog.slug}`);
	const publishedTime = $derived(blog.published_at ? new Date(blog.published_at).toISOString() : undefined);
	const ogImage = $derived(data.ogImage ?? 'https://www.dimassfeb.com/og-image.png');

	const blogPostingSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${canonicalUrl}#article`,
		headline: blog.title,
		description: blog.excerpt ?? '',
		url: canonicalUrl,
		datePublished: publishedTime,
		dateModified: blog.updated_at
			? new Date(blog.updated_at).toISOString()
			: blog.published_at
				? new Date(blog.published_at).toISOString()
				: undefined,
		author: { '@type': 'Person', '@id': 'https://www.dimassfeb.com/#person', name: 'Dimas Febriyanto', url: 'https://www.dimassfeb.com' },
		publisher: { '@type': 'Person', '@id': 'https://www.dimassfeb.com/#person', name: 'Dimas Febriyanto', url: 'https://www.dimassfeb.com' },
		image: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
		mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
		isPartOf: { '@type': 'Blog', '@id': 'https://www.dimassfeb.com/blog#blog' },
		inLanguage: 'id-ID',
	});

	const breadcrumbSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dimassfeb.com' },
			{ '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.dimassfeb.com/blog' },
			{ '@type': 'ListItem', position: 3, name: blog.title, item: canonicalUrl },
		],
	});
</script>

<svelte:head>
	<title>{blog.title} | Dimas Febriyanto</title>
	<meta name="description" content={blog.excerpt ?? `Read "${blog.title}" by Dimas Febriyanto — Fullstack & Mobile Developer specializing in Golang and Flutter.`} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content="{blog.title} | Dimas Febriyanto" />
	<meta property="og:description" content={blog.excerpt ?? `Read "${blog.title}" by Dimas Febriyanto — Fullstack & Mobile Developer specializing in Golang and Flutter.`} />
	<meta property="og:site_name" content="Dimas Febriyanto" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{blog.title} — Article by Dimas Febriyanto" />
	{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{blog.title} | Dimas Febriyanto" />
	<meta name="twitter:description" content={blog.excerpt ?? `Read "${blog.title}" by Dimas Febriyanto — Fullstack & Mobile Developer specializing in Golang and Flutter.`} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<JsonLd schema={[blogPostingSchema, breadcrumbSchema]} />
<BlogTracker title={blog.title} slug={blog.slug} />
<QuoteShare authorName="Dimas Febriyanto" />

<article class="min-h-screen pt-32 pb-20 px-6 sm:px-10 bg-surface relative">
	<div class="max-w-3xl mx-auto space-y-12">
		<div class="mb-4">
			<BackButton href="/blog" label="Back to Blog" />
		</div>
		<Breadcrumb
			items={[
				{ label: 'Home', href: '/' },
				{ label: 'Blog', href: '/blog' },
				{ label: blog.title, href: `/blog/${blog.slug}` },
			]}
		/>

		<header class="space-y-6">
			<div class="flex flex-wrap items-center gap-6 text-sm font-bold text-on-surface-variant">
				<a href="/" rel="author" class="text-primary hover:text-primary/80 transition-colors">
					By Dimas Febriyanto
				</a>
				<div class="flex items-center gap-2">
					<Calendar class="w-4 h-4 text-primary" />
					{blog.published_at
						? new Date(blog.published_at).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})
						: ''}
				</div>
				{#if blog.updated_at && blog.updated_at !== blog.published_at}
					<div class="flex items-center gap-2 text-xs text-on-surface-variant/60">
						<span>Updated:</span>
						<time datetime={new Date(blog.updated_at).toISOString()}>
							{new Date(blog.updated_at).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
							})}
						</time>
					</div>
				{/if}
				<div class="flex items-center gap-2">
					<Clock class="w-4 h-4 text-primary" />
					{data.readTime} min read
				</div>
			</div>

			<h1 class="font-headline text-4xl sm:text-6xl font-bold text-on-surface leading-tight">
				{blog.title}
			</h1>

			{#if blog.excerpt}
				<p class="font-body text-xl text-on-surface-variant italic border-l-4 border-primary/20 pl-6 py-2">
					{blog.excerpt}
				</p>
			{/if}
		</header>

		<TiptapHTML html={data.contentHtml} className="tiptap-content w-full max-w-none focus:outline-none" />

		<div
			class="bg-surface-container-low rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-outline-variant/10 mt-12"
		>
			<div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-surface shadow-lg bg-surface-container-high relative">
				<img src="/profile-photo.jpg" alt="Dimas Febriyanto - Fullstack Developer" class="w-full h-full object-cover" />
			</div>
			<div class="flex flex-col text-center sm:text-left">
				<h3 class="font-headline text-xl font-bold text-on-surface mb-2">Dimas Febriyanto</h3>
				<p class="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4">
					Fullstack & Mobile Developer specializing in Golang & Flutter. Aktif sebagai Junior Mobile Developer di Sagara Technology & asisten lab di Universitas Gunadarma. Passionate about building scalable algorithms & high-impact applications.
				</p>
				<a
					href="/"
					class="text-sm font-label font-bold text-primary hover:text-primary/80 transition-colors inline-flex items-center justify-center sm:justify-start gap-1.5 group"
				>
					Lihat Portofolio
					<ArrowLeft class="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>

		<RelatedPosts related={data.related} />

		<footer class="pt-12 border-t border-outline-variant/10">
			<div class="bg-surface-container-low rounded-[2rem] p-8 text-center space-y-4">
				<h3 class="font-headline text-xl font-bold text-on-surface">Liked this article?</h3>
				<p class="font-body text-on-surface-variant text-sm">
					Feel free to share it with your network or reach out if you have any questions!
				</p>
				<div class="flex justify-center gap-4 pt-4">
					<a
						href="/#contact"
						class="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all"
					>
						Get in Touch
					</a>
				</div>
			</div>
		</footer>
	</div>
</article>