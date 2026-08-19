<script lang="ts">
	interface Role {
		role: string;
		start_date: string | Date;
		end_date: string | Date | null;
		description: string[];
		tags?: string[];
	}

	let { company, roles }: { company: string; roles: Role[] } = $props();

	let expandedRoles = $state<Record<number, boolean>>({});

	function toggleExpand(idx: number) {
		expandedRoles = { ...expandedRoles, [idx]: !expandedRoles[idx] };
	}

	function formatDate(dateValue: string | Date | null) {
		if (!dateValue) return 'Present';
		const date = new Date(dateValue);
		return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
	}
</script>

<div class="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/10 hover:border-primary/20 transition-colors duration-300 relative group">
	<div class="mb-10">
		<h3 class="font-headline text-3xl font-bold text-on-surface mb-2">
			{company}
		</h3>
		<div class="h-1 w-12 bg-primary rounded-full"></div>
	</div>

	<div class="relative space-y-12">
		{#if roles.length > 1}
			<div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant/30 hidden sm:block"></div>
		{/if}

		{#each roles as item, idx}
			{@const bullets = item.description.slice(1)}
			{@const isExpanded = !!expandedRoles[idx]}
			{@const visibleCount = 3}
			{@const hasMoreBullets = bullets.length > visibleCount}
			{@const renderedBullets = hasMoreBullets && !isExpanded ? bullets.slice(0, visibleCount) : bullets}
			<div class="relative sm:pl-10">
				{#if roles.length > 1}
					<div class="absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-surface-container-lowest bg-primary hidden sm:block z-10"></div>
				{/if}

				<div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
					<div>
						<h4 class="font-headline text-xl font-bold text-on-surface">
							{item.role}
						</h4>
						<div class="mt-1 text-on-surface-variant font-label text-sm">
							{formatDate(item.start_date)} — {formatDate(item.end_date)}
						</div>
					</div>
				</div>

				<div class="space-y-4 mb-6">
					{#if item.description.length > 0}
						<p class="text-on-surface-variant font-body leading-relaxed">
							{item.description[0]}
						</p>
					{/if}

					{#if item.description.length > 1}
						<ul class="list-disc list-outside ml-5 text-on-surface-variant font-body space-y-3">
							{#each renderedBullets as point}
								<li class="pl-2">{point}</li>
							{/each}
						</ul>

						{#if hasMoreBullets}
							<button
								onclick={() => toggleExpand(idx)}
								class="mt-3 flex items-center gap-1.5 text-xs xs:text-sm font-semibold text-primary hover:opacity-80 active:scale-95 transition-all focus:outline-none"
							>
								{#if isExpanded}
									Show Less
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
									</svg>
								{:else}
									Show All ({bullets.length})
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
									</svg>
								{/if}
							</button>
						{/if}
					{/if}
				</div>

				{#if item.tags && item.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each item.tags as tag}
							<span class="px-2 py-0.5 text-[10px] font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant/10 rounded-md">
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>