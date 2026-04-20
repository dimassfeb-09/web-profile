import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AchievementService } from '@/src/services/achievement.service';
import Breadcrumb from '@/src/components/common/Breadcrumb';
import BackButton from '@/src/components/common/BackButton';
import JsonLd from '@/src/components/common/JsonLd';
import { ExternalLink, Calendar, Building2, Tag, Users, Code2 } from 'lucide-react';

const BASE_URL = 'https://www.dimassfeb.com';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const result = await AchievementService.getAchievementById(id);

  if (!result.data) {
    return { title: 'Achievement Not Found' };
  }

  const { data } = result;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `${BASE_URL}/achievements/${id}`,
    },
    openGraph: {
      type: 'article',
      url: `${BASE_URL}/achievements/${id}`,
      title: data.title,
      description: data.description,
      images: data.image_url
        ? [{ url: data.image_url, width: 1200, height: 630, alt: data.title }]
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: data.title }],
    },
  };
}

export default async function AchievementDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const result = await AchievementService.getAchievementById(id);

  if (!result.data) notFound();

  const achievement = result.data;

  const formatDate = (d: string | Date | null) => {
    if (!d) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(d));
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: achievement.title,
    description: achievement.description,
    startDate: achievement.date ? new Date(achievement.date).toISOString() : undefined,
    organizer: achievement.event_organizer
      ? { '@type': 'Organization', name: achievement.event_organizer }
      : undefined,
    url: `${BASE_URL}/achievements/${id}`,
    image: achievement.image_url || `${BASE_URL}/og-image.png`,
  };

  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-5xl mx-auto pb-24">
      <JsonLd schema={schema} />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Achievements', href: '/achievements' },
        { label: achievement.title, href: `/achievements/${id}` },
      ]} />

      {achievement.image_url && (
        <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden mb-10 border border-outline-variant/10">
          <Image
            src={achievement.image_url}
            alt={`${achievement.title} - Achievement by Dimas Febriyanto`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      <header className="mb-10 space-y-4">
        <div className="flex flex-wrap gap-3">
          {achievement.category && (
            <span className="inline-flex items-center gap-1.5 font-label text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <Tag className="w-3 h-3" />
              {achievement.category}
            </span>
          )}
          {achievement.date && (
            <span className="inline-flex items-center gap-1.5 font-label text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-full">
              <Calendar className="w-3 h-3" />
              {formatDate(achievement.date)}
            </span>
          )}
        </div>

        <h1 className="font-headline text-3xl md:text-5xl font-bold text-on-surface leading-tight">
          {achievement.title}
        </h1>

        <p className="font-body text-on-surface-variant text-lg leading-relaxed">
          {achievement.description}
        </p>

        {achievement.event_organizer && (
          <div className="flex items-center gap-2 font-body text-sm text-on-surface-variant">
            <Building2 className="w-4 h-4 text-primary" />
            Organized by <span className="font-semibold text-on-surface">{achievement.event_organizer}</span>
          </div>
        )}
      </header>

      <div className="grid gap-6">
        {achievement.problem_statement && (
          <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-3">
              Problem Statement
            </h2>
            <p className="font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {achievement.problem_statement}
            </p>
          </section>
        )}

        {achievement.solution_overview && (
          <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-3">
              Solution Overview
            </h2>
            <p className="font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {achievement.solution_overview}
            </p>
          </section>
        )}

        {(achievement.tech_stack?.length || achievement.team_members?.length) ? (
          <div className="grid md:grid-cols-2 gap-6">
            {achievement.tech_stack?.length ? (
              <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
                <h2 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {achievement.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-label text-xs font-bold text-on-surface bg-surface-container-high border border-outline-variant/20 px-3 py-1.5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {achievement.team_members?.length ? (
              <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
                <h2 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Members
                </h2>
                <div className="flex flex-col gap-2">
                  {achievement.team_members.map((member) => (
                    <div
                      key={member}
                      className="font-body text-sm text-on-surface-variant flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {member}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        {achievement.credential_url && (
          <div className="flex justify-center pt-4">
            <a
              href={achievement.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white font-label font-bold tracking-wide transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,62,199,0.3)] hover:-translate-y-1 active:translate-y-0"
            >
              <ExternalLink className="w-4 h-4" />
              View Credential / Certificate
            </a>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
        <BackButton href="/achievements" label="Back to All Achievements" />
      </div>
    </main>
  );
}
