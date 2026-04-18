import React from 'react';

interface ContactData {
  headline: string;
  description: string;
  email: string;
  linkedin_url: string;
}

interface ContactSectionProps {
  data: ContactData;
}

const ContactSection: React.FC<ContactSectionProps> = ({ data }) => {
  return (
    <section className="pt-16 xs:pt-24 lg:pt-32 pb-12 text-center relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-40"></div>
      
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6">
          {data.headline}
        </h2>
        <p className="font-body text-base xs:text-lg md:text-xl text-on-surface-variant mb-12 leading-relaxed font-light">
          {data.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <a
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-label font-medium tracking-wide transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,62,199,0.3)] hover:-translate-y-1 active:translate-y-0"
            href={`mailto:${data.email}`}
          >
            Send an Email
          </a>
          <a
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface-container-highest text-on-surface font-label font-medium tracking-wide transition-all duration-300 hover:bg-surface-variant flex items-center justify-center gap-2"
            href={data.linkedin_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn Profile
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">mail</span>
          <span className="text-on-surface-variant font-label text-sm tracking-wide">{data.email}</span>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
