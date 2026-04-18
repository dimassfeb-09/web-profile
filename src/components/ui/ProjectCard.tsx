import React from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
  linkUrl: string;
  linkText: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  features,
  linkUrl,
  linkText,
}) => {
  const [imgSrc, setImgSrc] = React.useState(imageUrl);
  const fallbackImage = '/images/project-placeholder.jpeg'; // Path ke gambar dummy Anda

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="aspect-[1024/500] w-full bg-surface-container-high relative overflow-hidden">
        <Image
          alt={`${title} Screenshot`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imgSrc}
          width={1024}
          height={500}
          onError={() => setImgSrc(fallbackImage)}
        />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant font-body text-sm mb-4">{description}</p>
        <div className="mb-6">
          <p className="text-xs font-label text-outline mb-2 uppercase tracking-wider">Features</p>
          <ul className="text-sm font-body text-on-surface-variant space-y-1">
            {features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>
        <div className="mt-auto pt-4 border-t border-outline-variant/10">
          <a
            className="inline-flex items-center text-primary font-label font-medium hover:text-primary-container transition-colors"
            href={linkUrl}
          >
            {linkText}
            <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
