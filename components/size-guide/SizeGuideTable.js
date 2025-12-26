"use client";

/**
 * SizeGuideTable Component
 * Size table for selected category
 */
export default function SizeGuideTable({ guide }) {
  const keyMap = {
    "عرض سینه (cm)": "chest",
    "قد لباس (cm)": "length",
    "عرض شانه (cm)": "shoulder",
    "یقه (cm)": "collar",
    "دور کمر (cm)": "waist",
    "دور باسن (cm)": "hip",
    "قد شلوار (cm)": "length",
    "سایز ایران": "iran",
    "طول پا (cm)": "length",
    "عرض پا (cm)": "width",
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#286378] to-[#43909A] text-white p-6 md:p-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                {guide.icon}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">{guide.title}</h2>
                <p className="text-gray-200 text-sm md:text-base">{guide.description}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-6 md:p-8">
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full px-4 md:px-0">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      {guide.measurements.map((measurement, index) => (
                        <th
                          key={index}
                          className={`px-4 md:px-6 py-3 md:py-4 text-right font-bold text-gray-900 ${
                            index === 0 ? "sticky right-0 bg-gray-50 z-10" : ""
                          }`}
                        >
                          {measurement}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.sizes.map((size, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-[#286378]/5 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 text-center font-bold text-[#286378] sticky right-0 bg-inherit z-10">
                          {size.size}
                        </td>
                        {guide.measurements.slice(1).map((measurement, cellIndex) => {
                          const key = keyMap[measurement];
                          return (
                            <td
                              key={cellIndex}
                              className="px-4 md:px-6 py-3 md:py-4 text-center text-gray-700"
                            >
                              {size[key] || "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

