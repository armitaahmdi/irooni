"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * ProductFormHeader Component
 * Header for product form pages
 */
export default function ProductFormHeader({ title = "ویرایش محصول" }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-gray-600 hover:text-[#286378] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#286378]">{title}</h1>
        </div>
      </div>
    </header>
  );
}

