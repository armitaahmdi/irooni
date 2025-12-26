/**
 * TimelineSection Component
 * Reusable component for displaying timeline
 */
export default function TimelineSection({ title, description, timeline, className = "" }) {
  return (
    <section className={`py-16 md:py-20 lg:py-24 bg-white ${className}`}>
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#286378] to-[#43909A] mx-auto rounded-full"></div>
          {description && (
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
        <div className="relative">
          {/* Timeline Line - Desktop: وسط صفحه، Mobile: سمت راست */}
          <div className="absolute right-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#286378] to-[#43909A] transform translate-x-1/2 hidden lg:block"></div>
          <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#286378] to-[#43909A] lg:hidden"></div>
          
          <div className="space-y-8 lg:space-y-12">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Mobile: Timeline با خط سمت راست */}
                <div className="flex items-start gap-4 w-full lg:hidden">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg relative z-10 border-4 border-white">
                      {index + 1}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b from-[#286378] to-[#43909A] mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 hover:border-[#286378]/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-extrabold text-[#286378]">{item.year}</span>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>

                {/* Desktop: Timeline با خط وسط */}
                <div className={`hidden lg:flex flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-[#286378]/30 hover:shadow-lg transition-all duration-300 w-full">
                    <div className="text-2xl md:text-3xl font-extrabold text-[#286378] mb-2">{item.year}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="hidden lg:flex flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full items-center justify-center text-white font-bold text-lg shadow-lg relative z-10">
                  {index + 1}
                </div>
                <div className="hidden lg:flex flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

