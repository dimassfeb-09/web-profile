import GalleryGrid from "./GalleryGrid";

interface GallerySectionProps {
  screenshots: string[];
  projectTitle: string;
}

export default function GallerySection({
  screenshots,
  projectTitle,
}: GallerySectionProps) {
  if (!screenshots || screenshots.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
        Gallery
      </h2>
      <GalleryGrid screenshots={screenshots} projectTitle={projectTitle} />
    </section>
  );
}
