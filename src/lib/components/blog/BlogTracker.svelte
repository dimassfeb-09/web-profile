<script lang="ts">
	import { trackBlogRead } from '../analytics/ga4';

	let { title, slug }: { title: string; slug: string } = $props();

	$effect(() => {
		trackBlogRead(title, slug);
	});
</script>