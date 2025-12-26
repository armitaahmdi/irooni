import Link from "next/link";

/**
 * CTASection Component
 * Reusable CTA (Call to Action) section for pages
 */
export default function CTASection({
  title,
  description,
  primaryButton,
  secondaryButton,
  className = "",
}) {
  return (
    <section className={`py-12 md:py-16 bg-gradient-to-br from-[#286378] to-[#43909A] text-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          {title}
        </h2>
        {description && (
          <p className="text-base md:text-lg text-white/90 mb-6">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryButton && (
            <Link
              href={primaryButton.href}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#286378] font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {primaryButton.label}
            </Link>
          )}
          {secondaryButton && (
            <Link
              href={secondaryButton.href}
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              {secondaryButton.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

