"use client";

import { ImageIcon } from "lucide-react";

/**
 * SlidesEmptyState Component
 * Empty state when no slides exist
 */
export default function SlidesEmptyState({ onAddSlide }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-12 text-center">
      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">بنری یافت نشد</p>
      <button
        onClick={onAddSlide}
        className="inline-block mt-4 text-[#286378] hover:text-[#43909A] font-medium"
      >
        افزودن اولین بنر
      </button>
    </div>
  );
}

