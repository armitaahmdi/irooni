import SectionItem from "./SectionItem";

/**
 * ContentSection Component
 * Reusable component for displaying content sections with items
 */
export default function ContentSection({ section, index }) {
  const { icon, title, color, badge, items } = section;

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${color} text-white shadow-sm flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {title}
          </h2>
          {badge && (
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-1 rounded bg-[#286378]/10 text-[#286378]">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Section Items */}
      <div className="space-y-4">
        {items.map((item, itemIndex) => (
          <SectionItem
            key={itemIndex}
            item={item}
            sectionColor={color}
            index={itemIndex}
          />
        ))}
      </div>
    </div>
  );
}

