<script lang="ts">
	import type { PageProps } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import AboutSection from '$lib/components/sections/AboutSection.svelte';
	import SkillsSection from '$lib/components/sections/SkillsSection.svelte';
	import ExperienceSection from '$lib/components/sections/ExperienceSection.svelte';
	import ProjectsSection from '$lib/components/sections/ProjectsSection.svelte';
	import EducationSection from '$lib/components/sections/EducationSection.svelte';
	import AchievementSection from '$lib/components/sections/AchievementSection.svelte';
	import CertificatesSection from '$lib/components/sections/CertificatesSection.svelte';
	import BlogSection from '$lib/components/sections/BlogSection.svelte';
	import ContactSection from '$lib/components/sections/ContactSection.svelte';
	import SectionLoader from '$lib/components/common/SectionLoader.svelte';
	import SectionSkeleton from '$lib/components/ui/skeletons/SectionSkeleton.svelte';

	let { data }: PageProps = $props();

	// below-the-fold sections: fetch only when scrolled near
	const lazySections = new Set(['projects', 'education', 'achievements', 'certificates', 'blog']);
</script>

<main class="pt-20 xs:pt-24 lg:pt-32 px-6 xs:px-8 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto flex flex-col gap-12 xs:gap-20 lg:gap-24 xl:gap-32 pb-20 xs:pb-32">
	<HeroSection data={data.homeData} />

	{#each data.visibleSections as section}
		{@const key = section.section_key}
		<div id={key}>
			{#if key === 'about'}
				{#if data.aboutData}
					<AboutSection data={data.aboutData} />
				{/if}
			{:else if key === 'contact'}
				{#if data.contactData}
					<ContactSection data={data.contactData} />
				{/if}
			{:else}
				<SectionLoader
					endpoint={`/api/section/${key}`}
					lazy={lazySections.has(key)}
				>
					{#snippet skeleton()}
						<SectionSkeleton cards={4} cols={key === 'skills' || key === 'certificates' ? 3 : 1} />
					{/snippet}
					{#snippet error(retry)}
						<div class="flex flex-col items-center justify-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 px-6 py-12 text-center">
							<p class="text-neutral-400">Gagal memuat bagian ini. Coba lagi.</p>
							<button
								onclick={retry}
								class="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
							>
								Coba lagi
							</button>
						</div>
					{/snippet}
					{#snippet children(d)}
						{#if key === 'skills'}
							<SkillsSection categories={d as any} />
						{:else if key === 'experience'}
							<ExperienceSection experiences={d as any} />
						{:else if key === 'projects'}
							<ProjectsSection initialProjects={d as any} />
						{:else if key === 'education'}
							<EducationSection educations={d as any} />
						{:else if key === 'achievements'}
							<AchievementSection achievements={d as any} />
						{:else if key === 'certificates'}
							<CertificatesSection certificates={d as any} />
						{:else if key === 'blog'}
							<BlogSection blogs={d as any} />
						{/if}
					{/snippet}
				</SectionLoader>
			{/if}
		</div>
	{/each}
</main>