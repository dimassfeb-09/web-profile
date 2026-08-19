<script lang="ts">
	import { page } from '$app/state';
	import { trackPageView } from './ga4';

	const measurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID || '';
	const isValid = !!measurementId && /^G-[a-zA-Z0-9]+$/.test(measurementId);

	$effect(() => {
		if (!isValid) return;
		trackPageView(page.url.pathname);
	});

	$effect(() => {
		if (!isValid || window.dataLayer) return;
		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag() {
			window.dataLayer!.push(arguments);
		};
		const s = document.createElement('script');
		s.async = true;
		s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
		document.head.appendChild(s);
		window.gtag('js', new Date());
		window.gtag('config', measurementId, { send_page_view: false });
	});
</script>

{#if isValid}
	<!-- GA4 injection handled in effect above -->
{/if}