"use client";

import HeroSlider from "./HeroSlider";
import { useGetSlidesQuery } from "@/store/api/productsApi";

export default function HeroSliderWrapper() {
  const { data, isLoading, error } = useGetSlidesQuery();

  if (isLoading) {
    return (
      <div className="relative w-full flex justify-center mt-5 px-4 md:px-6 lg:px-8 mb-8 md:mb-12">
        <div className="relative w-full max-w-7xl h-[450px] sm:h-[500px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (error || !data?.success || !data?.data || data.data.length === 0) {
    return null;
  }

  return <HeroSlider slides={data.data} autoPlayInterval={4000} />;
}

