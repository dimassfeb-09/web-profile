"use client";

import Image from "next/image";

interface GalleryItemProps {
  imageUrl: string;
  index: number;
  projectTitle: string;
  priority?: boolean;
  onClick: () => void;
}

export default function GalleryItem({
  imageUrl,
  index,
  projectTitle,
  priority = false,
  onClick,
}: GalleryItemProps) {
  return (
    <div
      className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm group bg-surface-container cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${projectTitle} screenshot ${index + 1}`}
    >
      <Image
        src={imageUrl}
        alt={`${projectTitle} screenshot ${index + 1} - Dimas Febriyanto Portfolio`}
        fill
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}
