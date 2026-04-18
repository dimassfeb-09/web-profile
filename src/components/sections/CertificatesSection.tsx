import React from 'react';

interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  issue_date: string | Date | null;
  credential_url: string | null;
  image_url: string | null;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const formatDate = (dateValue: string | Date | null) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  };

  if (certificates.length === 0) return null;

  return (
    <section className="pt-12 xs:pt-16 lg:pt-24 pb-20" id="certificates">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Certificates.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          Professional certifications and licenses I've earned.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {certificates.map((cert) => (
          <div 
            key={cert.id} 
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-container-low border border-outline-variant/10 rounded-2xl transition-all duration-300 hover:bg-surface-container-high"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg>
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface">{cert.title}</h3>
                <p className="font-body text-sm text-on-surface-variant">
                  {cert.issuer} • <span className="opacity-80">{formatDate(cert.issue_date)}</span>
                </p>
              </div>
            </div>
            
            {cert.credential_url && (
              <a 
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 sm:mt-0 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View Credential
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificatesSection;
