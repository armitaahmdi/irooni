/**
 * StatisticsSection Component
 * Reusable component for displaying statistics
 */
export default function StatisticsSection({ stats, className = "" }) {
  return (
    <section className={`py-16 md:py-20 bg-white -mt-8 relative z-10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 text-center border border-gray-100 hover:border-[#286378]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4 text-[#286378] group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#286378] mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

