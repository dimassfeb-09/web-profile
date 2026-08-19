<script lang="ts">
	import '../app.css';
	import '../styles/highlight-theme.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

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
		givenName: 'Dimas',
		familyName: 'Febriyanto',
		url: BASE_URL,
		jobTitle: 'Fullstack & Mobile Developer',
		description:
			'Fullstack & Mobile Developer with expertise in Golang (backend) and Flutter (mobile). Aktif sebagai Junior Mobile Developer di Sagara Technology dan Teaching Lab Assistant di Universitas Gunadarma.',
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
			name: 'Sagara Technology'
		},
		knowsAbout: [
			'Golang',
			'Flutter',
			'Dart',
			'React.js',
			'REST API',
			'Microservices',
			'PostgreSQL',
			'MySQL',
			'Redis',
			'Docker',
			'Mobile Application Development',
			'Backend Development'
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
		'@id': `${BASE_URL}/`,
		name: 'Dimas Febriyanto',
		url: BASE_URL,
		author: { '@id': `${BASE_URL}/` },
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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
		rel="stylesheet"
	/>

	<title>Dimas Febriyanto — Fullstack & Mobile Developer (Golang + Flutter)</title>
	<meta name="description" content="Portfolio of Dimas Febriyanto, Fullstack & Mobile Developer (Golang + Flutter). 3 apps live on Play Store. Berpengalaman di bidang backend microservices dan mobile development lintas platform. Certified Junior Mobile Programmer BNSP." />
	<meta name="keywords" content="Dimas Febriyanto,Dimas Febriyanto Software Engineer,Dimas Febriyanto Gunadarma,Fullstack Developer,Mobile Developer Indonesia,Flutter Developer,Golang Backend Engineer,Jasa Pembuatan Website,Jasa Pembuatan Aplikasi Mobile,Freelance Developer Bekasi,Software Engineer Portfolio" />
	<meta name="author" content="Dimas Febriyanto" />
	<meta name="creator" content="Dimas Febriyanto" />
	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
	<meta name="google-site-verification" content="dMV7PozYETjXCdfSgpj2dI8_X1UPwn8us9ntkgcsjyY" />
	<link rel="canonical" href={BASE_URL} />

	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:locale:alternate" content="en_US" />
	<meta property="og:url" content={BASE_URL} />
	<meta property="og:site_name" content="Dimas Febriyanto" />
	<meta property="og:title" content="Dimas Febriyanto — Software Engineer" />
	<meta property="og:description" content="Portfolio of Dimas Febriyanto, Fullstack & Mobile Developer specializing in Golang & Flutter. Berpengalaman membangun aplikasi berskala produksi." />
	<meta property="og:image" content={`${BASE_URL}/og-image.png`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Dimas Febriyanto — Software Engineer Portfolio" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Dimas Febriyanto — Software Engineer" />
	<meta name="twitter:description" content="Portfolio of Dimas Febriyanto, Fullstack & Mobile Developer specializing in Golang & Flutter. Berpengalaman membangun backend dan aplikasi mobile." />
	<meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />

	<script type="application/ld+json">{jsonLd}</script>
</svelte:head>

{@render children()}