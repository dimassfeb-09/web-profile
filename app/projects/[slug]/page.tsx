import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectService } from '@/src/services/project.service';
import Breadcrumb from '@/src/components/common/Breadcrumb';
import BackButton from '@/src/components/common/BackButton';
import JsonLd from '@/src/components/common/JsonLd';
import { ExternalLink, Calendar, Code2, CheckCircle2, Rocket } from 'lucide-react';

const BASE_URL = 'https://www.dimassfeb.com';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const result = await ProjectService.getProjectBySlug(slug);

  if (!result.data) {
    return { title: 'Project Not Found' };
  }

  const { data } = result;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `${BASE_URL}/projects/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `${BASE_URL}/projects/${slug}`,
      title: data.title,
      description: data.description,
      images: data.image_url
        ? [{ url: data.image_url, width: 1200, height: 630, alt: data.title }]
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: data.title }],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const result = await ProjectService.getProjectBySlug(slug);

  if (!result.data) notFound();

  const project = result.data;

  const formatDate = (d: string | Date | null) => {
    if (!d) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(d));
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: `${BASE_URL}/projects/${slug}`,
    image: project.image_url || `${BASE_URL}/og-image.png`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.dimassfeb.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://www.dimassfeb.com/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://www.dimassfeb.com/projects/${slug}`,
      },
    ],
  };

  const getStatusColor = (status: string | undefined) => {
    if (status?.toLowerCase() === 'completed') return 'text-green-700 bg-green-100 border-green-200';
    if (status?.toLowerCase() === 'in progress') return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-on-surface-variant bg-surface-container-high border-outline-variant/20';
  };

  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-5xl mx-auto pb-24 relative">
      <JsonLd schema={[schema, breadcrumbSchema]} />
      
      {/* Ambient Background specific to project detail */}
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-30 pointer-events-none"></div>

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: project.title, href: `/projects/${slug}` },
      ]} />

      {project.image_url && (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 border border-outline-variant/20 shadow-xl">
          <Image
            src={project.image_url}
            alt={`${project.title} - Project by Dimas Febriyanto`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>
      )}

      <header className="mb-12 space-y-6">
        <div className="flex flex-wrap gap-3">
          {project.status && (
            <span className={`inline-flex items-center gap-1.5 font-label text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(project.status)}`}>
              <Rocket className="w-3 h-3" />
              {project.status.toUpperCase()}
            </span>
          )}
          {project.date && (
            <span className="inline-flex items-center gap-1.5 font-label text-xs font-bold text-on-surface-variant bg-surface-container-highest px-3 py-1.5 rounded-full border border-outline-variant/20">
              <Calendar className="w-3 h-3" />
              {formatDate(project.date)}
            </span>
          )}
        </div>

        <h1 className="font-mono text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
          {project.title}
        </h1>

        <p className="font-body text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </header>

      <div className="grid gap-8">
        {(project.long_description || project.link_url) && (
          <section className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 border border-outline-variant/10 shadow-sm">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
              Overview
            </h2>
            {project.long_description && (
              <div className="prose prose-lg max-w-none font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap mb-8">
                {project.long_description}
              </div>
            )}
            
            {/* CTA section merged into overview or shown below */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-outline-variant/10">
               {project.link_url && (
                 <a
                    href={project.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-label font-bold transition-all hover:bg-primary-container active:scale-95"
                 >
                    <ExternalLink className="w-4 h-4" />
                    {project.link_text || 'Visit Project'}
                 </a>
               )}
               {project.external_links && Object.entries(project.external_links).map(([key, url]) => (
                  <a
                    key={key}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-label font-medium transition-all hover:bg-surface-variant active:scale-95 capitalize"
                  >
                     <ExternalLink className="w-4 h-4" />
                     {key}
                  </a>
               ))}
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8">
           {project.features && project.features.length > 0 && (
             <section className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
                <h2 className="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Key Features
                </h2>
                <ul className="grid gap-3">
                   {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-on-surface-variant">
                         <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">check_circle</span>
                         <span>{feature}</span>
                      </li>
                   ))}
                </ul>
             </section>
           )}

           {project.tech_stack && project.tech_stack.length > 0 && (
             <section className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 h-fit">
                <h2 className="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                   {project.tech_stack.map((tech) => (
                      <span
                         key={tech}
                         className="font-label text-sm font-medium text-on-surface bg-surface-container-highest border border-outline-variant/20 px-4 py-2 rounded-xl"
                      >
                         {tech}
                      </span>
                   ))}
                </div>
             </section>
           )}
        </div>

        {project.screenshots && project.screenshots.length > 0 && (
          <section className="mt-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
              Gallery
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {project.screenshots.map((img, i) => (
                  <div key={i} className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm group bg-surface-container">
                     <Image
                        src={img}
                        alt={`${project.title} screenshot ${i + 1} - Dimas Febriyanto Portfolio`}
                        fill
                        loading={i === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                  </div>
               ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-20 text-center">
        <BackButton href="/#projects" label="Back to Projects" />
      </div>
    </main>
  );
}
