<script lang="ts">
	import Shimmer from './Shimmer.svelte';

	interface Props {
		variant?: 'blog' | 'achievement' | 'project';
	}

	let { variant = 'blog' }: Props = $props();
</script>

<div class="w-full">
	{#if variant === 'blog'}
		<div class="max-w-3xl mx-auto space-y-12">
			<div class="mb-4">
				<Shimmer class="h-9 w-24 rounded-full" />
			</div>

			<div class="flex items-center gap-2">
				<Shimmer class="h-3.5 w-14 rounded-md" />
				<Shimmer class="h-3 w-2 rounded-md" />
				<Shimmer class="h-3.5 w-10 rounded-md" />
				<Shimmer class="h-3 w-2 rounded-md" />
				<Shimmer class="h-3.5 w-28 rounded-md" />
			</div>

			<header class="space-y-6">
				<div class="flex flex-wrap items-center gap-6">
					<Shimmer class="h-4 w-32 rounded-lg" />
					<Shimmer class="h-4 w-28 rounded-lg" />
					<Shimmer class="h-4 w-20 rounded-lg" />
				</div>

				<Shimmer class="h-10 sm:h-14 w-full rounded-xl" />
				<Shimmer class="mt-2 h-10 sm:h-14 w-3/4 rounded-xl" />

				<div class="border-l-4 border-primary/20 pl-6 py-1 space-y-2">
					<Shimmer class="h-5 sm:h-6 w-full rounded-lg" />
					<Shimmer class="h-5 sm:h-6 w-2/3 rounded-lg" />
				</div>
			</header>

			<div class="space-y-6">
				<Shimmer class="h-9 sm:h-11 w-2/3 rounded-xl" />
				<Shimmer class="h-4 sm:h-5 w-full rounded-lg" />
				<Shimmer class="h-4 sm:h-5 w-full rounded-lg" />
				<Shimmer class="h-4 sm:h-5 w-3/4 rounded-lg" />
				<Shimmer class="h-8 sm:h-10 w-1/2 rounded-xl" />
				<Shimmer class="h-4 sm:h-5 w-full rounded-lg" />
				<Shimmer class="h-4 sm:h-5 w-full rounded-lg" />
				<Shimmer class="h-4 sm:h-5 w-5/6 rounded-lg" />
			</div>

			<div class="bg-surface-container-low rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-outline-variant/10">
				<Shimmer class="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex-shrink-0" />
				<div class="flex flex-col items-center sm:items-start w-full">
					<Shimmer class="h-6 w-48 rounded-lg" />
					<Shimmer class="mt-3 h-4 w-full rounded-lg" />
					<Shimmer class="mt-2 h-4 w-full rounded-lg" />
					<Shimmer class="mt-2 h-4 w-2/3 rounded-lg" />
					<Shimmer class="mt-4 h-4 w-32 rounded-lg" />
				</div>
			</div>

			<aside class="border-t border-outline-variant/10 pt-12 space-y-6">
				<Shimmer class="h-7 w-48 rounded-lg" />
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each Array(3) as _}
						<div class="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10">
							<Shimmer class="h-5 w-full rounded-lg" />
							<Shimmer class="mt-2 h-5 w-3/4 rounded-lg" />
							<Shimmer class="mt-3 h-3.5 w-full rounded-lg" />
							<Shimmer class="mt-2 h-3.5 w-2/3 rounded-lg" />
							<Shimmer class="mt-4 h-3 w-24 rounded-lg" />
						</div>
					{/each}
				</div>
			</aside>

			<div class="pt-12 border-t border-outline-variant/10">
				<div class="bg-surface-container-low rounded-[2rem] p-8 text-center space-y-4">
					<Shimmer class="h-7 w-56 mx-auto rounded-lg" />
					<Shimmer class="h-4 w-3/4 mx-auto rounded-lg" />
					<Shimmer class="mt-4 h-11 w-40 mx-auto rounded-xl" />
				</div>
			</div>
		</div>
	{:else if variant === 'achievement'}
		<div class="max-w-5xl mx-auto space-y-10">
			<div class="flex items-center gap-2">
				<Shimmer class="h-3.5 w-14 rounded-md" />
				<Shimmer class="h-3 w-2 rounded-md" />
				<Shimmer class="h-3.5 w-28 rounded-md" />
				<Shimmer class="h-3 w-2 rounded-md" />
				<Shimmer class="h-3.5 w-32 rounded-md" />
			</div>

			<Shimmer class="aspect-[16/7] w-full rounded-3xl" />

			<header class="space-y-4">
				<div class="flex flex-wrap gap-3">
					<Shimmer class="h-7 w-24 rounded-full" />
					<Shimmer class="h-7 w-28 rounded-full" />
				</div>
				<Shimmer class="h-9 md:h-12 w-full rounded-xl" />
				<Shimmer class="h-9 md:h-12 w-3/4 rounded-xl" />
				<Shimmer class="h-5 w-full rounded-lg" />
				<Shimmer class="h-5 w-2/3 rounded-lg" />
				<Shimmer class="h-4 w-64 rounded-lg" />
			</header>

			<div class="grid gap-6">
				<div class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
					<Shimmer class="h-6 w-48 rounded-lg mb-3" />
					<Shimmer class="h-4 w-full rounded-lg" />
					<Shimmer class="mt-2 h-4 w-full rounded-lg" />
					<Shimmer class="mt-2 h-4 w-2/3 rounded-lg" />
				</div>

				<div class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
					<Shimmer class="h-6 w-48 rounded-lg mb-3" />
					<Shimmer class="h-4 w-full rounded-lg" />
					<Shimmer class="mt-2 h-4 w-full rounded-lg" />
					<Shimmer class="mt-2 h-4 w-4/5 rounded-lg" />
				</div>

				<div class="grid md:grid-cols-2 gap-6">
					<div class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
						<Shimmer class="h-6 w-40 rounded-lg mb-4" />
						<div class="flex flex-wrap gap-2">
							{#each Array(4) as _}
								<Shimmer class="h-7 w-20 rounded-full" />
							{/each}
						</div>
					</div>

					<div class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
						<Shimmer class="h-6 w-44 rounded-lg mb-4" />
						<div class="space-y-3">
							{#each Array(3) as _}
								<div class="flex items-center gap-2">
									<Shimmer class="w-1.5 h-1.5 rounded-full flex-shrink-0" />
									<Shimmer class="h-4 w-2/3 rounded-lg" />
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="flex justify-center pt-2">
					<Shimmer class="h-14 w-64 rounded-2xl" />
				</div>
			</div>
		</div>
	{:else}
		<div class="max-w-5xl mx-auto space-y-10">
			<div class="flex items-center gap-2">
				<Shimmer class="h-3.5 w-14 rounded-md" />
				<Shimmer class="h-3 w-2 rounded-md" />
				<Shimmer class="h-3.5 w-24 rounded-md" />
				<Shimmer class="h-3 w-2 rounded-md" />
				<Shimmer class="h-3.5 w-36 rounded-md" />
			</div>

			<Shimmer class="aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl" />

			<header class="space-y-6">
				<div class="flex flex-wrap gap-3">
					<Shimmer class="h-7 w-24 rounded-full" />
					<Shimmer class="h-7 w-28 rounded-full" />
				</div>
				<Shimmer class="h-9 md:h-12 w-full rounded-xl" />
				<Shimmer class="h-9 md:h-12 w-3/4 rounded-xl" />
				<Shimmer class="h-5 md:h-6 w-full max-w-3xl rounded-lg" />
				<Shimmer class="h-5 md:h-6 w-full max-w-2xl rounded-lg" />
				<Shimmer class="h-5 md:h-6 w-2/3 max-w-xl rounded-lg" />
			</header>

			<div class="grid gap-8">
				<div class="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 border border-outline-variant/10 shadow-sm">
					<Shimmer class="h-8 w-40 rounded-xl mb-6" />
					<Shimmer class="h-4 w-full rounded-lg" />
					<Shimmer class="mt-3 h-4 w-full rounded-lg" />
					<Shimmer class="mt-3 h-4 w-full rounded-lg" />
					<Shimmer class="mt-3 h-4 w-3/4 rounded-lg" />
					<div class="flex flex-wrap gap-4 pt-6 border-t border-outline-variant/10">
						<Shimmer class="h-11 w-36 rounded-xl" />
						<Shimmer class="h-11 w-32 rounded-xl" />
					</div>
				</div>

				<div class="grid md:grid-cols-2 gap-8">
					<div class="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
						<Shimmer class="h-6 w-40 rounded-lg mb-6" />
						<div class="space-y-4">
							{#each Array(4) as _}
								<div class="flex items-start gap-3">
									<Shimmer class="w-5 h-5 rounded-full flex-shrink-0" />
									<Shimmer class="h-4 w-3/4 rounded-lg" />
								</div>
							{/each}
						</div>
					</div>

					<div class="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
						<Shimmer class="h-6 w-44 rounded-lg mb-6" />
						<div class="flex flex-wrap gap-2">
							{#each Array(6) as _}
								<Shimmer class="h-8 w-20 rounded-xl" />
							{/each}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{#each Array(4) as _}
						<Shimmer class="aspect-[4/3] w-full rounded-2xl" />
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>