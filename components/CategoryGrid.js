"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const CategoryGrid = () => {
  const categories = [
    // 1: کفش
    { id: 1, name: "کفش", image: "/category/shoes.png", color: "bg-[#286378]", href: "/shoes" },
    // 2: تیشرت
    { id: 2, name: "تیشرت", image: "/category/category.png", color: "bg-[#43909A]", href: "/tshirt" },
    // 3: شلوار
    { id: 3, name: "شلوار", image: "/category/jeans.png", color: "bg-[#A2CFFF]", href: "/pants" },
    // 4: ست ورزشی
    { id: 4, name: "ست ورزشی", image: "/category/sport.png", color: "bg-[#286378]", href: "/sport-set" },
    // 5: اکسسوری
    { id: 5, name: "اکسسوری", image: "/category/accesory.png", color: "bg-[#43909A]", href: "/accessories" },
    // 6: پیراهن
    { id: 6, name: "پیراهن", image: "/category/shirt.png", color: "bg-[#A2CFFF]", href: "/shirt" },
  ];

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {/* عنوان بخش */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          <div className="flex-1 h-px bg-gray-300 hidden sm:block"></div>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-[#286378] tracking-tight text-center">
            برخی از دسته بندی‌ها
          </h2>
          <div className="flex-1 h-px bg-gray-300 hidden sm:block"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              prefetch={true}
              className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-500 hover:-translate-y-2 aspect-[4/5] sm:aspect-[5/6]"
            >
              {/* Soft Shadow Container */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl shadow-lg group-hover:shadow-2xl transition-shadow duration-500"
                style={{
                  boxShadow: `
                    0 4px 20px rgba(40, 99, 120, 0.15),
                    0 8px 30px rgba(40, 99, 120, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                }}
              ></div>

              {category.image ? (
                <>
                  {/* Image Container with Soft Background */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl sm:rounded-3xl overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Soft Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Soft Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#286378]/0 via-[#43909A]/0 to-[#FFD60A]/0 group-hover:from-[#286378]/10 group-hover:via-[#43909A]/10 group-hover:to-[#FFD60A]/10 transition-all duration-500"></div>
                  </div>

                  {/* Category Name - Always Visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                    <h3 className="text-white text-base sm:text-lg md:text-xl font-bold drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>

                  {/* Hover Overlay with Button */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#286378]/90 via-[#3A7A85]/90 to-[#43909A]/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-4 transition-all duration-500 backdrop-blur-sm">
                    <span className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg">
                      {category.name}
                    </span>
                    <span className="bg-white/95 text-[#286378] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-white transition-all duration-300 shadow-xl hover:scale-105">
                      مشاهده محصولات
                    </span>
                  </div>
                </>
              ) : (
                <div className={`${category.color} w-full h-full flex items-center justify-center rounded-2xl sm:rounded-3xl relative overflow-hidden`}>
                  {/* Soft Pattern Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <span className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg relative z-10">
                    {category.name}
                  </span>
                </div>
              )}

              {/* Decorative Corner Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;

