<script lang="ts">
	import SocialIcon from '../ui/SocialIcon.svelte';

	let {
		data,
	}: {
		data?: {
			linkedin_url?: string;
			github_url?: string;
			instagram_url?: string;
			twitter_url?: string;
		};
	} = $props();
</script>

<footer class="w-full mt-12 xs:mt-16 lg:mt-24 bg-white border-t border-zinc-200/20" role="contentinfo">
	<div class="flex flex-col md:flex-row justify-between items-center px-8 xs:px-12 py-10 xs:py-12 lg:py-16 max-w-7xl mx-auto gap-8">
		<div class="flex flex-col md:flex-row items-center gap-6 md:gap-12">
			<p class="font-space-grotesk text-xs uppercase tracking-widest text-zinc-500 opacity-70 hover:opacity-100 duration-500">
				© {new Date().getFullYear()} Dimas Febriyanto.
			</p>
			<nav aria-label="Footer navigation" class="flex gap-6 font-space-grotesk text-xs uppercase tracking-widest">
				<a href="/blog" class="text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500">
					Blog
				</a>
				<a href="/#projects" class="text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500">
					Projects
				</a>
				<a href="/#contact" class="text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500">
					Contact
				</a>
			</nav>
		</div>
		<nav aria-label="Social media links" class="flex gap-6 font-space-grotesk text-xs uppercase tracking-widest">
			{#if data?.github_url}
				<a
					class="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
					href={data.github_url}
					target="_blank"
					rel="noopener noreferrer me"
					aria-label="Dimas Febriyanto on GitHub"
				>
					<SocialIcon platform="github" className="w-3 h-3" />
					GitHub
				</a>
			{/if}
			{#if data?.linkedin_url}
				<a
					class="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
					href={data.linkedin_url}
					target="_blank"
					rel="noopener noreferrer me"
					aria-label="Dimas Febriyanto on LinkedIn"
				>
					<SocialIcon platform="linkedin" className="w-3 h-3" />
					LinkedIn
				</a>
			{/if}
			{#if data?.instagram_url}
				<a
					class="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
					href={data.instagram_url}
					target="_blank"
					rel="noopener noreferrer me"
					aria-label="Dimas Febriyanto on Instagram"
				>
					<SocialIcon platform="instagram" className="w-3 h-3" />
					Instagram
				</a>
			{/if}
			{#if data?.twitter_url}
				<a
					class="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-all opacity-70 hover:opacity-100 duration-500"
					href={data.twitter_url}
					target="_blank"
					rel="noopener noreferrer me"
					aria-label="Dimas Febriyanto on Twitter"
				>
					<SocialIcon platform="twitter" className="w-3 h-3" />
					Twitter
				</a>
			{/if}
		</nav>
	</div>
</footer>