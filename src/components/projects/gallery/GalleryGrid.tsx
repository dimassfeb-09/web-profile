"use client";

import { useState } from "react";
import GalleryItem from "./GalleryItem";
import ImageModal from "./ImageModal";

interface GalleryGridProps {
  screenshots: string[];
  projectTitle: string;
}

export default function GalleryGrid({
  screenshots,
  projectTitle,
}: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleOpen = (index: number) => setSelectedIndex(index);
  const handleClose = () => setSelectedIndex(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % screenshots.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (prev) => (prev! - 1 + screenshots.length) % screenshots.length
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {screenshots.map((img, i) => (
          <GalleryItem
            key={i}
            imageUrl={img}
            index={i}
            projectTitle={projectTitle}
            priority={i === 0}
            onClick={() => handleOpen(i)}
          />
        ))}
      </div>

      <ImageModal
        isOpen={selectedIndex !== null}
        onClose={handleClose}
        imageUrl={selectedIndex !== null ? screenshots[selectedIndex] : ""}
        altText={
          selectedIndex !== null
            ? `${projectTitle} screenshot ${selectedIndex + 1}`
            : ""
        }
        onNext={handleNext}
        onPrev={handlePrev}
        hasMultiple={screenshots.length > 1}
      />
    </>
  );
}
