<script lang="ts">
	import type { PageProps } from './$types';
	import CertificatesSection from '$lib/components/sections/CertificatesSection.svelte';
	import SortFilter from '$lib/components/common/SortFilter.svelte';
	import BackButton from '$lib/components/common/BackButton.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Certificates | Dimas Febriyanto</title>
	<meta name="description" content="Certifications and licenses attained throughout my career." />
</svelte:head>

<main class="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-20">
	<div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
		<BackButton href="/#certificates" />
		<SortFilter />
	</div>
	<CertificatesSection certificates={data.certificates} />
</main>