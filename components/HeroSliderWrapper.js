"use client";

import { useEffect, useState } from "react";
import HeroSlider from "./HeroSlider";

export default function HeroSliderWrapper() {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("/api/slides");
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          setSlides(data.data);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (isLoading) {
    return (
      <div className="relative w-full flex justify-center mt-5 px-4 md:px-6 lg:px-8 mb-8 md:mb-12">
        <div className="relative w-full max-w-7xl h-[450px] sm:h-[500px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return <HeroSlider slides={slides} autoPlayInterval={4000} />;
}

