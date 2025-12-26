import { Calendar } from "lucide-react";

/**
 * HeroSection Component
 * Reusable hero section for static pages
 */
export default function HeroSection({
  icon: Icon,
  title,
  description,
  showLastUpdate = false,
  lastUpdateDate,
  className = "",
}) {
  return (
    <section className={`relative bg-gradient-to-br from-[#286378] to-[#43909A] text-white py-12 md:py-16 overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center">
          {Icon && (
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl mb-4 backdrop-blur-sm border border-white/20">
              <Icon className="w-7 h-7 text-white" />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-white/90 mb-4">
              {description}
            </p>
          )}
          {showLastUpdate && (
            <div className="inline-flex items-center gap-2 text-xs md:text-sm text-white/80 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Calendar className="w-4 h-4" />
              <span>آخرین به‌روزرسانی:</span>
              <span className="font-semibold">
                {lastUpdateDate || new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

