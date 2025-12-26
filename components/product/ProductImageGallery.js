"use client";

import Image from "next/image";
import { ZoomIn, X, ChevronLeft } from "lucide-react";
import { useState } from "react";

/**
 * ProductImageGallery Component
 * Displays product images with thumbnails and lightbox
 */
export default function ProductImageGallery({ product, hasDiscount, discountPercent, isProductOutOfStock, isNew }) {
  // ساخت لیست کامل عکس‌ها: عکس اصلی + عکس‌های اضافی (بدون تکرار)
  const allImages = (() => {
    const images = [];
    
    // اضافه کردن عکس اصلی
    if (product?.image) {
      images.push(product.image);
    }
    
    // اضافه کردن عکس‌های اضافی (بدون تکرار عکس اصلی)
    if (product?.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && img !== product.image && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    
    return images.length > 0 ? images : (product?.image ? [product.image] : []);
  })();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);

  if (!product) return null;

  // اگر عکسی وجود ندارد، چیزی نمایش نده
  if (allImages.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Main Image */}
        <div className="relative w-full md:px-4">
          <div
            className="relative w-full aspect-[2/3] md:aspect-[4/5] md:max-h-[450px] lg:max-h-[500px] md:rounded-2xl overflow-hidden bg-gray-50 md:bg-transparent cursor-zoom-in group"
            onClick={() => {
              setLightboxImage(selectedImage);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            />
            {hasDiscount && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs sm:text-sm md:text-base font-bold px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full shadow-xl">
                  {discountPercent}% تخفیف
                </div>
              </div>
            )}

            {/* Badge: اتمام موجودی یا جدید */}
            {isProductOutOfStock ? (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs sm:text-sm md:text-base font-bold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-xl">
                  اتمام موجودی
                </div>
              </div>
            ) : isNew ? (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs sm:text-sm md:text-base font-bold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-xl">
                  جدید
                </div>
              </div>
            ) : null}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3">
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails - Horizontal below main image */}
        {allImages.length > 1 && (
          <div className="flex gap-2 md:gap-3 justify-center md:justify-start overflow-x-auto pb-2 px-4 md:px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-[#286378] scale-105 shadow-xl ring-2 ring-[#286378] ring-offset-1"
                    : "border-gray-200 hover:border-gray-300 hover:scale-105 shadow-md"
                }`}
                title={`تصویر ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} - تصویر ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-[#286378]/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#286378] rounded-full shadow-lg"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={allImages[lightboxImage]}
                alt={product.name}
                width={1920}
                height={1920}
                className="max-w-full max-h-[95vh] w-auto h-auto rounded-2xl object-contain"
                sizes="100vw"
                unoptimized
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxImage((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setLightboxImage((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-20"
                  >
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

