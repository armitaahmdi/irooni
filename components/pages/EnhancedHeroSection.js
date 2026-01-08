import Image from "next/image";
import Link from "next/link";

/**
 * EnhancedHeroSection Component
 * Enhanced hero section with image and CTA buttons
 */
export default function EnhancedHeroSection({
  badge,
  title,
  description,
  primaryButton,
  secondaryButton,
  imageSrc,
  imageAlt,
  className = "",
}) {
  return (
    <section className={`relative w-full py-20 md:py-28 bg-gradient-to-br from-[#286378] via-[#43909A] to-[#286378] text-white overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 text-center md:text-right space-y-6">
            {badge && (
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                {badge}
              </div>
            )}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-2xl mx-auto md:mx-0">
                {description}
              </p>
            )}
            {(primaryButton || secondaryButton) && (
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                {primaryButton && (
                  <Link
                    href={primaryButton.href}
                    className="px-6 py-3 bg-white text-[#286378] font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {primaryButton.label}
                  </Link>
                )}
                {secondaryButton && (
                  <Link
                    href={secondaryButton.href}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
                  >
                    {secondaryButton.label}
                  </Link>
                )}
              </div>
            )}
          </div>
          {imageSrc && (
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 transform hover:scale-105 transition-transform duration-300">
                <Image
                  src={imageSrc}
                  alt={imageAlt || title}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#286378]/20 to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

