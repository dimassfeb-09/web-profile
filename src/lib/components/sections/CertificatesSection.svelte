<script lang="ts">
	interface Certificate {
		id?: string;
		title: string;
		issuer: string;
		issue_date: string | Date | null;
		credential_url: string | null;
		image_url: string | null;
	}

	let { certificates }: { certificates: Certificate[] } = $props();

	let selectedImage = $state<string | null>(null);

	function formatDate(dateValue: string | Date | null) {
		if (!dateValue) return '';
		const date = new Date(dateValue);
		return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
	}
</script>

{#if certificates.length > 0}
	<section class="pt-12 xs:pt-16 lg:pt-24 pb-20">
		<div class="mb-12 xs:mb-16">
			<h2 class="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
				Certificates.
			</h2>
			<p class="text-zinc-500 font-body text-sm xs:text-base lg:text-lg mb-4 drop-shadow-sm">
				A showcase of my professional certifications and achievements, highlighting my commitment to continuous learning and excellence in technology.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4">
			{#each certificates as cert}
			<div
				class="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-container-low border border-outline-variant/10 rounded-2xl transition-all duration-300 hover:bg-surface-container-high {cert.image_url ? 'hover:border-primary/30' : ''}"
			>
					<div class="flex items-center gap-5">
						<div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
								<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
							</svg>
						</div>
						<div>
							<h3 class="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
								{cert.title}
							</h3>
							<p class="font-body text-sm text-on-surface-variant">
								{cert.issuer} • <span class="opacity-80">{formatDate(cert.issue_date)}</span>
							</p>
						</div>
					</div>

					<div class="mt-4 sm:mt-0 flex items-center gap-3 sm:gap-6">
						{#if cert.image_url}
							<button
								onclick={(e) => {
									e.stopPropagation();
									selectedImage = cert.image_url;
								}}
								class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
								Preview
							</button>
						{/if}

						{#if cert.image_url && cert.credential_url}
							<div class="w-px h-4 bg-outline-variant/30 hidden sm:block"></div>
						{/if}

						{#if cert.credential_url}
							<a
								href={cert.credential_url}
								target="_blank"
								rel="noopener noreferrer"
								onclick={(e) => e.stopPropagation()}
								class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M15 3h6v6" />
									<path d="M10 14 21 3" />
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
								</svg>
								Verify
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if selectedImage}
			<div
				class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm"
				role="button"
				tabindex="0"
				onclick={(e) => {
					if (e.target === e.currentTarget) selectedImage = null;
				}}
				onkeydown={(e) => {
					if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') selectedImage = null;
				}}
			>
				<button
					class="absolute top-4 right-4 text-white/70 hover:text-white p-2"
					aria-label="Close"
					onclick={() => (selectedImage = null)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<div
					class="relative max-w-5xl w-full max-h-full flex items-center justify-center"
				>
					<img
						src={selectedImage}
						alt="Certificate Preview"
						class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
					/>
				</div>
			</div>
		{/if}
	</section>
{/if}