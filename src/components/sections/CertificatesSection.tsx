"use client";

import React from "react";

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

const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateValue: string | Date | null) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (!mounted) return "...";
    return new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (certificates.length === 0) return null;

  return (
    <section className="pt-12 xs:pt-16 lg:pt-24 pb-20">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Certificates.
        </h2>
        <p className="text-zinc-500 font-body text-sm xs:text-base lg:text-lg mb-4 drop-shadow-sm">
          A showcase of my professional certifications and achievements,
          highlighting my commitment to continuous learning and excellence in
          technology.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => cert.image_url && setSelectedImage(cert.image_url)}
            className={`group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-container-low border border-outline-variant/10 rounded-2xl transition-all duration-300 hover:bg-surface-container-high ${cert.image_url ? "cursor-pointer hover:border-primary/30" : ""}`}
          >
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
                  {cert.issuer} •{" "}
                  <span className="opacity-80">
                    {formatDate(cert.issue_date)}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-3 sm:gap-6">
              {cert.image_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(cert.image_url);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Preview
                </button>
              )}

              {cert.image_url && cert.credential_url && (
                <div className="w-px h-4 bg-outline-variant/30 hidden sm:block" />
              )}

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                  Verify
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setSelectedImage(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Certificate Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificatesSection;
