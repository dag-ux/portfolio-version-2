import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const FALLBACK_IMG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect fill="%231a1a1a" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ff0000" font-family="sans-serif" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';

export default function ImageCarousel({
  images,
  alt,
  autoPlay = true,
  interval = 3500,
  className = '',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter valid images
  const validImages = (images || []).filter(Boolean);

  // Reset index if images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [validImages.length]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || validImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, validImages.length, interval, isPaused]);

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    },
    [validImages.length]
  );

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex(
        (prev) => (prev - 1 + validImages.length) % validImages.length
      );
    },
    [validImages.length]
  );

  // No images
  if (validImages.length === 0) {
    return (
      <img
        src={FALLBACK_IMG}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  // Single image - no carousel
  if (validImages.length === 1) {
    return (
      <img
        src={validImages[0]}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${className}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_IMG;
        }}
      />
    );
  }

  // Multiple images - carousel
  return (
    <div
      className={`relative w-full h-full overflow-hidden group/carousel ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={validImages[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          loading="lazy"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMG;
          }}
        />
      </AnimatePresence>

      {/* Prev Arrow */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#ff0000] backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 z-10"
        aria-label="Previous image"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {/* Next Arrow */}
      <button
        type="button"
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#ff0000] backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 z-10"
        aria-label="Next image"
      >
        <FaChevronRight className="text-xs" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {validImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-6 bg-[#ff0000]'
                : 'w-1.5 bg-white/60 hover:bg-white/90'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium z-10">
        {currentIndex + 1} / {validImages.length}
      </div>
    </div>
  );
}