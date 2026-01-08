"use client";

import { MapPin } from "lucide-react";

export default function SelectedAddress({ selectedLocation }) {
  if (!selectedLocation.address) return null;

  return (
    <div className="p-4 bg-gradient-to-br from-[#A2CFFF]/20 to-[#A2CFFF]/10 rounded-xl border border-[#A2CFFF]/30">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-[#286378] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-1">آدرس انتخاب شده:</p>
          <p className="text-sm text-gray-600">{selectedLocation.address}</p>
          <p className="text-xs text-gray-500 mt-1">
            مختصات: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}

