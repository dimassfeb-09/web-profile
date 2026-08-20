<script lang="ts">
	import Shimmer from './Shimmer.svelte';

	interface Props {
		variant?: 'skills' | 'experience' | 'projects' | 'education' | 'achievements' | 'certificates' | 'blog';
		header?: boolean;
	}

	let { variant = 'projects', header = true }: Props = $props();

	const isBig = $derived(variant === 'skills' || variant === 'education');
	const descWidth = $derived(
		variant === 'skills' ? 'w-2/3' : variant === 'education' ? 'w-3/4' : variant === 'blog' || variant === 'achievements' ? 'w-1/2' : 'w-full'
	);
	const descHeight = $derived(variant === 'skills' ? 'h-5 xs:h-6' : 'h-4');
</script>

<div class="w-full">
	{#if header}
		{#if variant === 'blog'}
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 xs:mb-16">
			<div class="flex-1">
				<Shimmer class="h-9 xs:h-11 lg:h-12 w-48 xs:w-56 mb-4 rounded-xl" />
				<Shimmer class="h-4 w-1/2 rounded-lg" />
			</div>
			<Shimmer class="hidden md:block h-11 w-36 xs:w-40 rounded-xl flex-shrink-0" />
		</div>
	{:else}
			<div class="mb-12 xs:mb-16">
				<Shimmer class="{isBig ? 'h-12 xs:h-14 w-48 xs:w-56 mb-6' : 'h-9 xs:h-11 lg:h-12 w-40 xs:w-44 mb-4'} rounded-xl" />
				<Shimmer class="{descHeight} w-full rounded-lg" />
				<Shimmer class="mt-2 {descHeight} {descWidth} rounded-lg" />
			</div>
		{/if}
	{/if}

	{#if variant === 'skills'}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xs:gap-8">
			{#each Array(3) as _}
				<div class="bg-white/60 border border-zinc-200/30 rounded-[2.5rem] p-8 flex flex-col gap-6">
					<div class="flex items-center gap-4">
						<Shimmer class="w-14 h-14 rounded-2xl flex-shrink-0" />
						<div class="flex-1 min-w-0">
							<Shimmer class="h-6 w-3/4 rounded-lg" />
							<Shimmer class="mt-3 h-1 w-8 rounded-full" />
						</div>
					</div>
					<div class="flex flex-wrap gap-2.5 mt-auto">
						{#each Array(4) as _}
							<Shimmer class="h-8 w-24 rounded-2xl" />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else if variant === 'experience'}
		<div class="flex flex-col gap-12">
			{#each Array(3) as _}
				<div class="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/10">
					<Shimmer class="h-9 w-48 xs:w-56 md:w-64 rounded-lg" />
					<Shimmer class="mt-3 h-1 w-12 rounded-full" />
					<div class="mt-10 space-y-12">
						{#each Array(2) as _}
							<div>
								<Shimmer class="h-7 w-40 xs:w-48 md:w-56 rounded-lg" />
								<Shimmer class="mt-3 h-4 w-40 rounded-lg" />
								<Shimmer class="mt-4 h-4 w-full rounded-lg" />
								<Shimmer class="mt-2 h-4 w-3/4 rounded-lg" />
								<div class="flex flex-wrap gap-2 mt-4">
									{#each Array(3) as _}
										<Shimmer class="h-5 w-16 rounded-md" />
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else if variant === 'projects'}
		<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-6 xs:gap-8">
			{#each Array(8) as _}
				<div class="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden flex flex-col">
					<Shimmer class="aspect-[1024/500] w-full rounded-none" />
					<div class="p-6 flex flex-col flex-grow">
						<div class="flex items-center gap-1.5 mb-4 min-h-[26px]">
							{#each Array(3) as _}
								<Shimmer class="h-5 w-14 rounded-md" />
							{/each}
						</div>
						<Shimmer class="h-7 w-3/4 rounded-lg" />
						<Shimmer class="mt-2 h-4 w-full rounded-lg" />
						<Shimmer class="mt-2 h-4 w-2/3 rounded-lg" />
						<div class="mt-5 mb-8 flex-grow space-y-3">
							{#each Array(2) as _}
								<div class="flex items-center gap-3">
									<Shimmer class="h-[18px] w-[18px] rounded-full flex-shrink-0" />
									<Shimmer class="h-4 w-3/4 rounded-lg" />
								</div>
							{/each}
						</div>
						<div class="flex justify-end">
							<Shimmer class="h-9 w-28 rounded-full" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else if variant === 'education'}
		<div class="relative border-l border-zinc-200 pl-8 ml-3 space-y-16 py-2">
			{#each Array(2) as _}
				<div class="relative">
					<Shimmer class="absolute -left-[37px] top-1 w-6 h-6 rounded-full" />
					<div class="flex items-center gap-4">
						<Shimmer class="w-12 h-12 rounded-xl flex-shrink-0" />
						<div>
							<Shimmer class="h-6 w-48 xs:w-56 md:w-64 rounded-lg" />
							<Shimmer class="mt-2 h-4 w-36 xs:w-44 rounded-lg" />
						</div>
					</div>
					<Shimmer class="mt-3 h-4 w-40 xs:w-48 md:w-56 rounded-lg" />
					<Shimmer class="mt-4 h-4 w-full max-w-3xl rounded-lg" />
					<Shimmer class="mt-2 h-4 w-4/5 max-w-2xl rounded-lg" />
					<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
						{#each Array(2) as _}
							<div class="space-y-3">
								<Shimmer class="h-4 w-32 rounded-lg" />
								<Shimmer class="h-4 w-full rounded-lg" />
								<Shimmer class="h-4 w-3/4 rounded-lg" />
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else if variant === 'achievements'}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each Array(2) as _}
				<div class="bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden">
					<Shimmer class="aspect-[1024/500] w-full rounded-none" />
					<div class="p-6">
						<div class="flex justify-between items-start gap-4 mb-2">
							<Shimmer class="h-6 w-40 rounded-lg" />
							<Shimmer class="h-6 w-24 rounded-full flex-shrink-0" />
						</div>
						<Shimmer class="mt-3 h-4 w-full rounded-lg" />
						<Shimmer class="mt-2 h-4 w-2/3 rounded-lg" />
						<Shimmer class="mt-5 h-4 w-24 rounded-lg" />
					</div>
				</div>
			{/each}
		</div>
	{:else if variant === 'certificates'}
		<div class="grid grid-cols-1 gap-4">
			{#each Array(6) as _}
				<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-container-low border border-outline-variant/10 rounded-2xl">
					<div class="flex items-center gap-5 min-w-0">
						<Shimmer class="w-12 h-12 rounded-full flex-shrink-0" />
						<div class="min-w-0">
							<Shimmer class="h-6 w-44 xs:w-56 rounded-lg" />
							<Shimmer class="mt-2 h-4 w-40 rounded-lg" />
						</div>
					</div>
					<div class="mt-4 sm:mt-0 flex items-center gap-3 sm:gap-6 flex-shrink-0">
						<Shimmer class="h-5 w-16 rounded-md" />
						<Shimmer class="h-5 w-16 rounded-md" />
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
			{#each Array(3) as _}
				<div class="flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8">
					<Shimmer class="h-4 w-28 rounded-md" />
					<Shimmer class="mt-4 h-7 w-full rounded-lg" />
					<Shimmer class="mt-2 h-7 w-3/4 rounded-lg" />
					<Shimmer class="mt-4 h-4 w-full rounded-lg" />
					<Shimmer class="mt-2 h-4 w-5/6 rounded-lg" />
					<Shimmer class="mt-8 h-4 w-28 rounded-md" />
				</div>
			{/each}
		</div>
	{/if}
</div>