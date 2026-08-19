<script lang="ts">
	import { trackProjectView } from '../analytics/ga4';

	let { title, slug }: { title: string; slug: string } = $props();

	$effect(() => {
		trackProjectView(title, slug);
	});
</script>