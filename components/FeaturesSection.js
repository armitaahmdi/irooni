"use client";

import Image from "next/image";

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "ارسال رایگان بالای ۳ میلیون",
      image: "/features/tunk.png",
      badge: null,
      gradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      id: 2,
      title: "تضمین اصالت و عدم مغایرت کالا",
      image: "/features/bag.png",
      badge: null,
      gradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
    },
    {
      id: 3,
      title: "تحویل سریع و بدون دردسر",
      image: "/features/delivary.png",
      badge: null,
      gradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
    {
      id: 4,
      title: "تضمین بهترین قیمت بازار",
      image: "/features/price.webp",
      badge: null,
      gradient: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <section className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان بخش */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16">
          <div className="flex-1 h-px bg-gray-300 hidden sm:block"></div>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-[#286378] tracking-tight text-center">
            مزایای خرید از ایرونی
          </h2>
          <div className="flex-1 h-px bg-gray-300 hidden sm:block"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 border-2 ${feature.borderColor} hover:border-opacity-60 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden`}
            >
              {/* Background Gradient on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Image Container */}
                <div className="relative mb-3 sm:mb-4 md:mb-6 flex justify-center">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-contain drop-shadow-lg"
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 leading-tight sm:leading-relaxed text-center group-hover:text-gray-900 transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
