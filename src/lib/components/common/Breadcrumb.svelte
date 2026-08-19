<script lang="ts">
	import JsonLd from './JsonLd.svelte';

	interface BreadcrumbItem {
		label: string;
		href: string;
	}

	let { items, baseUrl = 'https://www.dimassfeb.com' }: {
		items: BreadcrumbItem[];
		baseUrl?: string;
	} = $props();

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			item: `${baseUrl}${item.href}`,
		})),
	});
</script>

<JsonLd schema={schema} />
<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-on-surface-variant font-body mb-6">
	{#each items as item, index}
		<span class="flex items-center gap-2">
			{#if index > 0}
				<span class="text-on-surface-variant/40" aria-hidden="true">/</span>
			{/if}
			{#if index < items.length - 1}
				<a href={item.href} class="hover:text-primary transition-colors hover:underline">{item.label}</a>
			{:else}
				<span class="text-on-surface font-medium truncate max-w-[200px]" aria-current="page">{item.label}</span>
			{/if}
		</span>
	{/each}
</nav>