import React from "react";

interface Role {
  role: string;
  start_date: string | Date;
  end_date: string | Date | null;
  description: string[];
  tags?: string[];
}

interface ExperienceItemProps {
  company: string;
  roles: Role[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ company, roles }) => {
  const formatDate = (dateValue: string | Date | null) => {
    if (!dateValue) return "Present";
    const date = new Date(dateValue);
    return new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/10 hover:border-primary/20 transition-colors duration-300 relative group">
      <div className="mb-10">
        <h3 className="font-headline text-3xl font-bold text-on-surface mb-2">
          {company}
        </h3>
        <div className="h-1 w-12 bg-primary rounded-full" />
      </div>

      <div className="relative space-y-12">
        {/* Vertical Line */}
        {roles.length > 1 && (
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant/30 hidden sm:block" />
        )}

        {roles.map((item, idx) => (
          <div key={idx} className="relative sm:pl-10">
            {/* Dot */}
            {roles.length > 1 && (
              <div className="absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-surface-container-lowest bg-primary hidden sm:block z-10" />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                <h4 className="font-headline text-xl font-bold text-on-surface">
                  {item.role}
                </h4>
                <div className="mt-1 text-on-surface-variant font-label text-sm">
                  {formatDate(item.start_date)} — {formatDate(item.end_date)}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {item.description.length > 0 && (
                <p className="text-on-surface-variant font-body leading-relaxed">
                  {item.description[0]}
                </p>
              )}

              {item.description.length > 1 && (
                <ul className="list-disc list-outside ml-5 text-on-surface-variant font-body space-y-3">
                  {item.description.slice(1).map((point, pIdx) => (
                    <li key={pIdx} className="pl-2">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 text-[10px] font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant/10 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceItem;
