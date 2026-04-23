"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultiple?: boolean;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  altText,
  onNext,
  onPrev,
  hasMultiple = false,
}: ImageModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (hasMultiple) {
        if (e.key === "ArrowRight" && onNext) onNext();
        if (e.key === "ArrowLeft" && onPrev) onPrev();
      }
    };

    if (isOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, onClose, onNext, onPrev, hasMultiple]);

  const [displayImage, setDisplayImage] = useState(imageUrl);
  const [displayAlt, setDisplayAlt] = useState(altText);

  useEffect(() => {
    if (imageUrl) {
      setDisplayImage(imageUrl);
      setDisplayAlt(altText);
    }
  }, [imageUrl, altText]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-center items-center bg-black/80 transition-opacity duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[101]"
        aria-label="Close image modal"
      >
        <X className="w-6 h-6" />
      </button>

      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev?.();
            }}
            className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[101]"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
            className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[101]"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div
        className={`relative w-[95vw] h-[85vh] max-w-6xl rounded-xl overflow-hidden transition-all duration-300 ease-out ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={onClose}
      >
        {displayImage && (
          <Image
            src={displayImage}
            alt={displayAlt}
            fill
            className="object-contain"
            sizes="95vw"
            priority
          />
        )}
      </div>
    </div>
  );
}
