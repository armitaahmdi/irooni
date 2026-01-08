import Link from "next/link";
import { MapPin } from "lucide-react";

/**
 * MapPlaceholder Component
 * Reusable map placeholder component
 */
export default function MapPlaceholder({ mapLink, addressText }) {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden h-80 border-2 border-gray-300 shadow-lg relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#286378]/5 to-[#43909A]/5"></div>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-center z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-2">{addressText || "آدرس ما"}</p>
          {mapLink && (
            <Link
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#286378] hover:text-[#43909A] transition-colors font-medium"
            >
              مشاهده روی نقشه
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

