"use client";

import { FileText } from "lucide-react";

/**
 * OrderUserNotes Component
 * User notes section
 */
export default function OrderUserNotes({ notes }) {
  if (!notes) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">یادداشت مشتری</h3>
          <p className="text-xs text-gray-500">
            یادداشتی که کاربر هنگام ثبت سفارش اضافه کرده است
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-amber-200">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notes}</p>
      </div>
    </div>
  );
}

