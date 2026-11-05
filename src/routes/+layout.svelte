<script lang="ts">
	import '../app.css';
	import '../styles/fonts.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { theme } from '$lib/theme.svelte';

	let { children } = $props();

	// ponytail: register SW for image cross-origin cacheFirst (offline + instant repeat)
	onMount(() => {
		theme.init();
		const idle = (cb: () => void) => {
			const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
			if (ric) ric(cb, { timeout: 2000 });
			else setTimeout(cb, 1200);
		};
		idle(() => {
			if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js').catch(() => {});
		});
	});

	const BASE_URL = 'https://www.dimassfeb.com';

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${BASE_URL}/#person`,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${BASE_URL}/`
		},
		name: 'Dimas Febriyanto',
		alternateName: ['dimassfeb', 'Dimas'],
		givenName: 'Dimas',
		familyName: 'Febriyanto',
		url: BASE_URL,
		jobTitle: 'Full-Stack Developer & Mobile Engineer',
		description:
			'Dimas Febriyanto is a Full-Stack Developer and Mobile Engineer from Indonesia specializing in Golang, Laravel, Flutter, React.js, and backend development.',
		email: 'dimassfeb@gmail.com',
		image: {
			'@type': 'ImageObject',
			url: `${BASE_URL}/og-image.png`,
			width: 1200,
			height: 630
		},
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Bekasi',
			addressRegion: 'Jawa Barat',
			addressCountry: 'ID'
		},
		alumniOf: {
			'@type': 'EducationalOrganization',
			name: 'Universitas Gunadarma',
			url: 'https://www.gunadarma.ac.id'
		},
		worksFor: {
			'@type': 'Organization',
			name: 'PT Cipta Krida Bahari'
		},
		knowsAbout: [
			'Golang',
			'Flutter',
			'Dart',
			'React.js',
			'Laravel',
			'Express.js',
			'Next.js',
			'REST API',
			'Microservices',
			'PostgreSQL',
			'MySQL',
			'Redis',
			'Docker',
			'Mobile Application Development',
			'Backend Development',
			'Web Application Development',
			'REST API Development',
			'Fullstack Development'
		],
		hasCredential: [
			{
				'@type': 'EducationalOccupationalCredential',
				name: 'Junior Mobile Programmer',
				credentialCategory: 'Professional Certification',
				description: 'Sertifikasi dari BNSP melalui program VSGA Digitalent',
				recognizedBy: {
					'@type': 'Organization',
					name: 'Badan Nasional Sertifikasi Profesi (BNSP)'
				}
			},
			{
				'@type': 'EducationalOccupationalCredential',
				name: 'Junior Mobile Programmer',
				credentialCategory: 'Professional Certification',
				recognizedBy: {
					'@type': 'Organization',
					name: 'VSGA Digitalent'
				}
			}
		],
		sameAs: [
			'https://www.linkedin.com/in/dimassfeb/',
			'https://github.com/dimassfeb-09',
			'https://www.dimassfeb.com'
		],
		nationality: {
			'@type': 'Country',
			name: 'Indonesia'
		},
		gender: 'Male'
	};

	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${BASE_URL}/#website`,
		name: 'Dimas Febriyanto — Portfolio',
		alternateName: 'dimassfeb',
		url: BASE_URL,
		author: { '@id': `${BASE_URL}/#person` },
		description: 'Portfolio of Dimas Febriyanto, Full-Stack Developer and Mobile Engineer specializing in Golang, Laravel, Flutter, and React.js.',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${BASE_URL}/blog?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	};

	const jsonLd = JSON.stringify([personSchema, websiteSchema]);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<link rel="preconnect" href="https://atgnqunmelvquqdwkmnq.supabase.co" crossorigin="anonymous" />
	<link
		rel="preload"
		href="/fonts/plus-jakarta-sans-variable-latin.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/inter-variable-latin.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>

	<title>Dimas Febriyanto - Full-Stack & Mobile Developer</title>
	<!-- ponytail: description + canonical milik masing-masing page (layout render duluan = meniban nilai page di mata crawler) -->
	<meta name="keywords" content="Dimas Febriyanto,Dimas Febriyanto Software Engineer,Dimas Febriyanto Gunadarma,Full-Stack Developer,Backend Developer,Mobile Engineer,Flutter Developer,Golang Developer,Mobile Developer Indonesia,REST API Development,Web Application Development,Freelance Developer Bekasi,Software Engineer Portfolio" />
	<meta name="author" content="Dimas Febriyanto" />
	<meta name="creator" content="Dimas Febriyanto" />
	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
	<meta name="google-site-verification" content="dMV7PozYETjXCdfSgpj2dI8_X1UPwn8us9ntkgcsjyY" />
	<!-- ponytail: canonical + og:url/title/description/image milik masing-masing page (lihat komentar di atas) -->

	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:locale:alternate" content="en_US" />
	<meta property="og:site_name" content="Dimas Febriyanto" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Dimas Febriyanto - Full-Stack & Mobile Developer" />
	<meta name="twitter:description" content="Dimas Febriyanto is a Full-Stack Developer and Mobile Engineer from Indonesia specializing in Golang, Laravel, Flutter, React.js, and backend development." />
	<meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />

	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

{@render children()}