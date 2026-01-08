"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * AdminPageHeader Component
 * Reusable header for admin pages
 */
export default function AdminPageHeader({
  title,
  description,
  icon,
  actionButton,
  addButtonText,
  onAddClick,
}) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-[#286378] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#286378] flex items-center gap-3">
                {icon}
                {title}
              </h1>
              {description && (
                <p className="text-gray-600 mt-2">{description}</p>
              )}
            </div>
          </div>
          {actionButton ||
            (addButtonText && onAddClick && (
              <button
                onClick={onAddClick}
                className="flex items-center gap-2 bg-[#286378] text-white px-4 py-2 rounded-lg hover:bg-[#43909A] transition-colors"
              >
                {addButtonText}
              </button>
            ))}
        </div>
      </div>
    </header>
  );
}

