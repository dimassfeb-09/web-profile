<script lang="ts">
	import { ExternalLink, Mail } from 'lucide-svelte';
	import SocialIcon from '../ui/SocialIcon.svelte';

	interface ContactData {
		headline: string;
		description: string;
		email: string;
		linkedin_url: string;
		github_url?: string;
		instagram_url?: string;
		twitter_url?: string;
	}

	let { data }: { data: ContactData } = $props();
</script>

<section class="pt-8 xs:pt-12 lg:pt-16 pb-12 text-center relative overflow-hidden">
	<div class="max-w-3xl mx-auto px-6">
		<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6">
			{data.headline}
		</h2>
		<p class="font-body text-base xs:text-lg md:text-xl text-on-surface-variant mb-12 leading-relaxed font-light">
			{data.description}
		</p>
		<div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
			<a
				class="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-label font-medium tracking-wide transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,62,199,0.25)] hover:-translate-y-1 active:translate-y-0"
				href={`mailto:${data.email}`}
			>
				Send an Email
			</a>
			<a
				class="w-full sm:w-auto px-8 py-4 rounded-full bg-surface-container-highest text-on-surface font-label font-medium tracking-wide transition-all duration-300 hover:bg-surface-variant flex items-center justify-center gap-2"
				href={data.linkedin_url}
				rel="noopener noreferrer me"
				target="_blank"
				aria-label="Dimas Febriyanto on LinkedIn"
			>
				LinkedIn Profile
				<ExternalLink class="w-3.5 h-3.5" />
			</a>
		</div>
		<div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-low border border-outline-variant/20 mb-12">
			<Mail class="w-4 h-4 text-on-surface-variant" />
			<span class="text-on-surface-variant font-label text-sm tracking-wide">
				{data.email}
			</span>
		</div>

		<!-- Social Links Row -->
		<div class="flex items-center justify-center gap-6">
			{#if data.linkedin_url}
				<a
					href={data.linkedin_url}
					target="_blank"
					rel="noopener noreferrer me"
					class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all hover:-translate-y-1"
					title="LinkedIn"
					aria-label="Dimas Febriyanto on LinkedIn"
				>
					<SocialIcon platform="linkedin" className="w-6 h-6" />
				</a>
			{/if}
			{#if data.github_url}
				<a
					href={data.github_url}
					target="_blank"
					rel="noopener noreferrer me"
					class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all hover:-translate-y-1"
					title="GitHub"
					aria-label="Dimas Febriyanto on GitHub"
				>
					<SocialIcon platform="github" className="w-6 h-6" />
				</a>
			{/if}
			{#if data.instagram_url}
				<a
					href={data.instagram_url}
					target="_blank"
					rel="noopener noreferrer me"
					class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all hover:-translate-y-1"
					title="Instagram"
					aria-label="Dimas Febriyanto on Instagram"
				>
					<SocialIcon platform="instagram" className="w-6 h-6" />
				</a>
			{/if}
			{#if data.twitter_url}
				<a
					href={data.twitter_url}
					target="_blank"
					rel="noopener noreferrer me"
					class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all hover:-translate-y-1"
					title="Twitter / X"
					aria-label="Dimas Febriyanto on Twitter"
				>
					<SocialIcon platform="twitter" className="w-6 h-6" />
				</a>
			{/if}
		</div>
	</div>
</section>