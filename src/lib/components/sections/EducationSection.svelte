<script lang="ts">
	import CachedImage from '$lib/components/ui/CachedImage.svelte';

	interface Activity {
		title: string;
		role: string;
		description?: string | null;
		start_date?: string | null;
		end_date?: string | null;
	}

	interface Achievement {
		id: string;
		title: string;
		slug: string;
		date?: string | null;
		description?: string | null;
	}

	interface RelatedProject {
		id: string;
		title: string;
		slug: string;
	}

	interface RelatedCertificate {
		id: string;
		title: string;
		credential_url?: string | null;
	}

	interface Education {
		id: string;
		institution: string;
		degree?: string | null;
		major?: string | null;
		start_date: string | Date;
		end_date?: string | Date | null;
		is_current: boolean;
		description?: string | null;
		logo_url?: string | null;
		location?: string | null;
		gpa?: number | null;
		activities?: Activity[];
		achievements?: Achievement[];
		projects?: RelatedProject[];
		certificates?: RelatedCertificate[];
	}

	let { educations }: { educations: Education[] } = $props();

	function formatDate(date: string | Date | null | undefined) {
		if (!date) return '';
		const d = new Date(date);
		return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}
</script>

<section id="education" class="pt-8 xs:pt-12 lg:pt-16 scroll-mt-20 relative">
	<div class="max-w-2xl mb-16">
		<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-pretty">
			Education
		</h2>
		<p class="font-body text-zinc-500 text-base xs:text-lg leading-relaxed font-light mt-4">
			My academic journey, campus involvements, and certifications that have shaped my professional foundation.
		</p>
	</div>

	<div class="relative border-l border-zinc-200 pl-8 ml-3 space-y-16 py-2">
		{#each educations as edu}
			<div class="relative group">
				<div class="absolute -left-[38px] top-4 w-4 h-4 rounded-full bg-white border border-zinc-300 flex items-center justify-center group-hover:border-primary transition-colors duration-300">
					<div class="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors duration-300"></div>
				</div>

				<div class="flex flex-col gap-6">
					<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div class="flex items-start gap-4">
							{#if edu.logo_url}
								<div class="w-12 h-12 rounded-xl overflow-hidden relative bg-white border border-zinc-200 flex-shrink-0 flex items-center justify-center p-1 shadow-sm">
									<CachedImage src={edu.logo_url} alt={edu.institution} class="object-contain p-0.5 w-full h-full" />
								</div>
							{/if}
							<div>
								<h3 class="font-headline text-xl font-bold text-zinc-900 group-hover:text-primary transition-colors duration-300">
									{edu.institution}
								</h3>
								<p class="font-body text-sm text-zinc-600 mt-0.5 font-medium">
									{edu.degree}{edu.major ? ` in ${edu.major}` : ''}
									{#if edu.gpa}
										<span class="text-zinc-400 font-normal ml-2.5 pl-2.5 border-l border-zinc-200">
											GPA: {Number(edu.gpa).toFixed(2)} / 4.00
										</span>
									{/if}
								</p>
							</div>
						</div>

						<div class="flex flex-row sm:flex-col sm:items-end gap-3 text-xs text-zinc-400 font-medium sm:text-right">
							<span class="flex items-center gap-1.5">
								<svg class="w-3.5 h-3.5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
								{formatDate(edu.start_date)} — {edu.is_current ? 'Present' : formatDate(edu.end_date)}
							</span>
							{#if edu.location}
								<span class="flex items-center gap-1.5 sm:justify-end">
									<svg class="w-3.5 h-3.5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
									{edu.location}
								</span>
							{/if}
						</div>
					</div>

					{#if edu.description}
						<p class="font-body text-zinc-500 text-sm leading-relaxed max-w-3xl font-light">
							{edu.description}
						</p>
					{/if}

					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
						<div class="space-y-6">
							{#if edu.activities && edu.activities.length > 0}
								<div class="space-y-3">
									<h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
										Activities & Involvements
									</h4>
									<div class="space-y-4">
										{#each edu.activities as act}
											<div class="flex gap-3">
												<span class="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0"></span>
												<div class="flex flex-col">
													<span class="text-sm font-bold text-zinc-800 leading-tight">
														{act.title}
													</span>
													<span class="text-[11px] text-zinc-400 mt-0.5">
														{act.role}
														{#if act.start_date}
															({formatDate(act.start_date)} - {act.end_date ? formatDate(act.end_date) : 'Present'})
														{/if}
													</span>
													{#if act.description}
														<p class="text-xs text-zinc-400 mt-1.5 font-light leading-relaxed">
															{act.description}
														</p>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							{#if edu.achievements && edu.achievements.length > 0}
								<div class="space-y-3">
									<h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
										Competitions & Awards
									</h4>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{#each edu.achievements as ach}
											<a
												href={`/achievements/${ach.slug}`}
												target="_blank"
												class="group/ach flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-100 hover:border-primary/20 hover:bg-zinc-50/50 transition-all duration-300"
											>
												<svg class="w-3.5 h-3.5 text-zinc-300 group-hover/ach:text-primary transition-colors duration-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
													<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
												</svg>
												<div class="flex flex-col min-w-0">
													<span class="text-xs font-bold text-zinc-700 truncate group-hover/ach:text-primary transition-colors duration-300">
														{ach.title}
													</span>
												</div>
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<div class="space-y-6">
							{#if edu.projects && edu.projects.length > 0}
								<div class="space-y-3">
									<h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
										Academic Outputs
									</h4>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{#each edu.projects as proj}
											<a
												href={`/projects/${proj.slug}`}
												target="_blank"
												class="group/proj flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 hover:border-primary/20 hover:bg-zinc-50/50 transition-all duration-300"
											>
												<span class="text-xs font-bold text-zinc-700 truncate group-hover/proj:text-primary transition-colors duration-300">
													{proj.title}
												</span>
												<svg class="w-3 h-3 text-zinc-300 group-hover/proj:text-primary group-hover/proj:translate-x-0.5 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
													<line x1="5" y1="12" x2="19" y2="12" />
													<polyline points="12 5 19 12 12 19" />
												</svg>
											</a>
										{/each}
									</div>
								</div>
							{/if}

							{#if edu.certificates && edu.certificates.length > 0}
								<div class="space-y-3">
									<h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
										Certifications
									</h4>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{#each edu.certificates as cert}
											<a
												href={cert.credential_url || '#'}
												target="_blank"
												rel="noopener noreferrer"
												class="group/cert flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 hover:border-primary/20 hover:bg-zinc-50/50 transition-all duration-300"
											>
												<span class="text-xs font-bold text-zinc-700 truncate group-hover/cert:text-primary transition-colors duration-300">
													{cert.title}
												</span>
												<svg class="w-3 h-3 text-zinc-300 group-hover/cert:text-primary group-hover/cert:translate-x-0.5 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
													<line x1="5" y1="12" x2="19" y2="12" />
													<polyline points="12 5 19 12 12 19" />
												</svg>
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>