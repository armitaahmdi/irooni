"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "@/store/api/productsApi";

import "swiper/css";
import "swiper/css/pagination";


const SpecialOffersSlider = () => {
  const swiperRef = useRef(null);
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 50,
    onSale: true,
  });

  // فیلتر کردن فقط محصولات تخفیف‌دار
  const discountedProducts = data?.success && Array.isArray(data.data)
    ? data.data.filter(
        (product) => product.discountPercent && product.discountPercent > 0
      )
    : [];

  if (isLoading) {
    return (
      <section className="relative w-full mt-10 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin" />
        </div>
      </section>
    );
  }

  if (!discountedProducts || discountedProducts.length === 0) return null;

  return (
    <section className="relative w-full py-8 sm:py-10 md:py-8 lg:py-10 overflow-hidden bg-gradient-to-br from-[#286378]/35 via-[#3A7A85]/40 to-[#43909A]/35">
      {/* Soft texture overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23286378' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Soft glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD60A]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#43909A]/35 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-6 md:mb-8">
          <div className="flex-1 h-px bg-white/30 hidden sm:block"></div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FFD60A]/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-[#FFD60A]/30 backdrop-blur-sm shadow-lg">
              <span className="text-lg sm:text-xl md:text-2xl">🔥</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              محصولات تخفیف‌دار
            </h2>
          </div>
          <div className="flex-1 h-px bg-white/30 hidden sm:block"></div>
        </div>

        {/* Swiper */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
            1280: { slidesPerView: 4, spaceBetween: 32 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={discountedProducts.length > 4}
        >
          {discountedProducts.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SpecialOffersSlider;
