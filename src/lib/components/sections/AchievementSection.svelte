<script lang="ts">
	import AchievementCard from '../ui/AchievementCard.svelte';

	interface Achievement {
		id: string;
		slug: string;
		title: string;
		description: string;
		image_url: string | null;
		image_hash?: string | null;
		date: string | Date | null;
	}

	let { achievements }: { achievements: Achievement[] } = $props();
</script>

{#if achievements.length > 0}
	<section class="pt-8 xs:pt-12 lg:pt-16 min-h-[400px]">
		<div class="mb-12 xs:mb-16">
			<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-pretty max-w-3xl">
				Achievements
			</h2>
			<p class="font-body text-zinc-500 text-base xs:text-lg leading-relaxed font-light mt-4 max-w-2xl">
				Recognition and milestones attained throughout my journey.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each achievements as achievement}
				<AchievementCard
					slug={achievement.slug}
					title={achievement.title}
					description={achievement.description}
					imageUrl={achievement.image_url}
					imageHash={achievement.image_hash}
					date={achievement.date || ''}
				/>
			{/each}
		</div>
	</section>
{/if}