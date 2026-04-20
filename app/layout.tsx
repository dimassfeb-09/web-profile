import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import Shell from "@/src/components/layout/Shell";
import IconLoader from "@/src/components/common/IconLoader";
import Script from "next/script";
import "./globals.css";
import "@/src/styles/highlight-theme.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
});

const BASE_URL = "https://www.dimassfeb.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Dimas Febriyanto — Fullstack & Mobile Developer (Golang + Flutter)",
    template: "%s | Dimas Febriyanto",
  },
  description:
    "Dimas Febriyanto — Software Engineer spesialis Golang & Flutter, Universitas Gunadarma. 3 app live di Play Store, pengalaman magang, certified Junior Mobile Programmer BNSP. Rekruter & klien: cek portofolio lengkap di sini.",
  keywords: [
    "Dimas Febriyanto",
    "Dimas Febriyanto Gunadarma",
    "Dimas Febriyanto Software Engineer",
    "Fullstack Developer",
    "Mobile Developer",
    "Flutter Developer Indonesia",
    "Golang Developer Indonesia",
    "Flutter Developer Bekasi",
    "Software Engineer Gunadarma",
    "Junior Mobile Developer",
    "Portfolio Developer Indonesia",
  ],
  authors: [{ name: "Dimas Febriyanto", url: BASE_URL }],
  creator: "Dimas Febriyanto",
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "Dimas Febriyanto",
    title: "Dimas Febriyanto — Software Engineer",
    description:
      "Portfolio of Dimas Febriyanto, a Software Engineer specializing in Flutter & Golang.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dimas Febriyanto — Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dimas Febriyanto — Software Engineer",
    description:
      "Portfolio of Dimas Febriyanto, a Software Engineer specializing in Flutter & Golang.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "dMV7PozYETjXCdfSgpj2dI8_X1UPwn8us9ntkgcsjyY",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.dimassfeb.com/#person",
  name: "Dimas Febriyanto",
  givenName: "Dimas",
  familyName: "Febriyanto",
  url: "https://www.dimassfeb.com",
  jobTitle: "Fullstack & Mobile Developer",
  description:
    "Fullstack & Mobile Developer spesialisasi Golang (backend) dan Flutter (mobile). Aktif sebagai Junior Mobile Developer di Sagara Technology dan Teaching Lab Assistant di Universitas Gunadarma.",
  email: "dimassfeb@gmail.com",
  image: {
    "@type": "ImageObject",
    url: "https://www.dimassfeb.com/og-image.png",
    width: 1200,
    height: 630,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bekasi",
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Universitas Gunadarma",
    url: "https://www.gunadarma.ac.id",
  },
  worksFor: {
    "@type": "Organization",
    name: "Sagara Technology",
  },
  knowsAbout: [
    "Golang",
    "Flutter",
    "Dart",
    "React.js",
    "REST API",
    "Microservices",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Docker",
    "Mobile Application Development",
    "Backend Development",
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Junior Mobile Programmer",
      credentialCategory: "Professional Certification",
      recognizedBy: {
        "@type": "Organization",
        name: "Badan Nasional Sertifikasi Profesi (BNSP)",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Junior Mobile Programmer",
      credentialCategory: "Professional Certification",
      recognizedBy: {
        "@type": "Organization",
        name: "VSGA Digitalent",
      },
    },
  ],
  sameAs: [
    "https://www.linkedin.com/in/dimassfeb/",
    "https://github.com/dimassfeb-09",
    "https://www.dimassfeb.com",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Dimas Febriyanto",
  url: BASE_URL,
  author: { "@id": `${BASE_URL}/#person` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pre-fetch home data on server to avoid client-side waterfalls in Navbar
  const { HomeService } = await import("@/src/services/home.service");
  const homeData = await HomeService.getHomeData();
  const cvUrl = homeData.data?.cv_url || "#";

  const { ContactService } = await import("@/src/services/contact.service");
  const { SectionOrderService } = await import("@/src/services/section_order.service");
  
  const [contactData, sectionResult] = await Promise.all([
    ContactService.getContactData(),
    SectionOrderService.getAllSections()
  ]);

  const navLinks = (sectionResult.data || [])
    .filter(s => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index)
    .map(s => ({
      name: s.section_label,
      href: s.section_key === 'blog' ? '/blog' : `#${s.section_key}`
    }));

  return (
    <html lang="id" data-scroll-behavior="smooth" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://atgnqunmelvquqdwkmnq.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <IconLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, websiteSchema]) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${spaceGrotesk.variable} min-h-screen relative`}
        suppressHydrationWarning={true}
      >
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] blur-ambient mix-blend-multiply opacity-70 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] blur-ambient mix-blend-multiply opacity-50 -translate-x-1/3 translate-y-1/3"></div>
        </div>
        <Shell 
          cvUrl={cvUrl} 
          contactData={contactData.data || {}} 
          navLinks={navLinks}
        >
          {children}
        </Shell>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
