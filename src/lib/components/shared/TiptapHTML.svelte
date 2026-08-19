<script lang="ts">
	// HTML di-render server-side di load (+page.server.ts) via renderBlogContent.
	let { html, className = '' }: { html: string; className?: string } = $props();
</script>

{#if html}
	<div class={className}>{@html html}</div>
{/if}