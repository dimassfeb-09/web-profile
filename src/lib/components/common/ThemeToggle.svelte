<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';
	import { theme } from '$lib/theme.svelte';

	let { className = '' }: { className?: string } = $props();
</script>

<button
	type="button"
	onclick={(e) => theme.toggle(e, e.currentTarget)}
	class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors focus:outline-none {className}"
	aria-label={theme.dark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={theme.dark ? 'Light mode' : 'Dark mode'}
>
	{#if theme.dark}
		<Sun class="w-5 h-5" />
	{:else}
		<Moon class="w-5 h-5" />
	{/if}
</button>
