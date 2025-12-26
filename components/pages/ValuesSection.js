/**
 * ValuesSection Component
 * Reusable component for displaying values/cards
 */
export default function ValuesSection({ title, description, values, className = "" }) {
  return (
    <section className={`py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#286378] to-[#43909A] mx-auto rounded-full"></div>
          {description && (
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {values.map((value, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#286378]/20 transform hover:-translate-y-2"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

