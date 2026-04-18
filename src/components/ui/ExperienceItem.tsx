import React from 'react';

interface ExperienceItemProps {
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ role, company, start_date, end_date, description }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  };

  const periodString = `${formatDate(start_date)} — ${formatDate(end_date)}`;

  return (
    <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/10 hover:border-primary/20 transition-colors duration-300 relative group">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-2xl font-bold text-on-surface">{role}</h3>
          <p className="text-primary font-medium text-lg mt-1">{company}</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label text-sm inline-flex w-max">
          {periodString}
        </div>
      </div>
      <ul className="list-disc list-inside text-on-surface-variant font-body space-y-3">
        {description.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceItem;
