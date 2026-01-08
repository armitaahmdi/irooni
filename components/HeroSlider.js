"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSlider = ({ slides = [], autoPlayInterval = 4000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, autoPlayInterval, slides.length]);

  // Track viewport to swap desktop/mobile banners
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full flex justify-center mt-5 px-4 md:px-6 lg:px-8 mb-8 md:mb-12">
      {/* Slider Container */}
      <div
        className="relative w-full max-w-7xl h-[450px] sm:h-[500px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </>
        )}
        {/* Slides */}
        {slides.map((slide, index) => {
          const slideContent = (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image */}
              <div className="relative w-full h-full overflow-hidden bg-black">
                {slide.image ? (
                  <Image
                    src={
                      isMobile && slide.imageMobile ? slide.imageMobile : slide.image
                    }
                    alt={slide.alt || `Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    quality={95}
                    className="object-center"
                    sizes="100vw"
                  />
                ) : null}

                {/* Text Overlay */}
                {slide.title || slide.subtitle || slide.buttonText ? (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center px-4 md:px-8 max-w-4xl">
                      {slide.title && (
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl leading-tight tracking-tight">
                          {slide.title}
                        </h2>
                      )}
                      {slide.subtitle && (
                        <p className="text-lg md:text-2xl lg:text-3xl text-white/95 mb-8 drop-shadow-lg font-medium leading-relaxed">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.buttonText && (
                        <button className="bg-white text-gray-900 px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl">
                          {slide.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );

          // اگر لینک وجود دارد، بنر را در Link قرار می‌دهیم
          if (slide.link) {
            const isExternalLink = slide.link.startsWith("http://") || slide.link.startsWith("https://");
            
            if (isExternalLink) {
              return (
                <a
                  key={index}
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  {slideContent}
                </a>
              );
            } else {
              return (
                <Link key={index} href={slide.link} className="block w-full h-full">
                  {slideContent}
                </Link>
              );
            }
          }

          return <div key={index}>{slideContent}</div>;
        })}
      </div>

      {/* Dots Indicator - Bottom Center */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;

