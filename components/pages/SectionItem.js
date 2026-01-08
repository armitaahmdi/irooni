import { Phone } from "lucide-react";

/**
 * SectionItem Component
 * Reusable component for displaying items within a content section
 */
export default function SectionItem({
  item,
  sectionColor,
  index,
}) {
  const {
    icon: ItemIcon,
    title,
    description,
    highlight = false,
    warning = false,
    phone,
  } = item;

  const borderColor = highlight
    ? "border-green-300 bg-green-50/50 hover:border-green-400"
    : warning
    ? "border-orange-300 bg-orange-50/50 hover:border-orange-400"
    : "border-gray-100 hover:border-[#286378]";

  const titleColor = highlight
    ? "text-green-900"
    : warning
    ? "text-orange-900"
    : "text-gray-900";

  const descriptionColor = highlight
    ? "text-green-800"
    : warning
    ? "text-orange-800"
    : "text-gray-600";

  const iconBg = highlight
    ? "bg-green-500"
    : warning
    ? "bg-orange-500"
    : `bg-gradient-to-br ${sectionColor}`;

  return (
    <div
      className={`relative pl-6 pr-4 py-3 border-r-2 transition-colors duration-200 group ${borderColor}`}
    >
      <div className="flex items-start gap-3">
        {ItemIcon ? (
          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${iconBg}`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        ) : (
          <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${sectionColor} mt-0.5 flex items-center justify-center`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-base md:text-lg font-semibold mb-1.5 group-hover:text-[#286378] transition-colors ${titleColor}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm md:text-base leading-relaxed ${descriptionColor}`}>
            {description}
          </p>
          {phone && (
            <a
              href={`tel:+98${phone.replace(/^0/, '')}`}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors duration-200 font-semibold text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

