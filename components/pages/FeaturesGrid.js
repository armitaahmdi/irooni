/**
 * FeaturesGrid Component
 * Reusable component for displaying features in a grid
 */
export default function FeaturesGrid({ title, description, features, className = "" }) {
  return (
    <section className={`py-16 md:py-20 lg:py-24 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#286378] to-[#43909A] mx-auto rounded-full"></div>
          {description && (
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col gap-4 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#286378]/30"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

