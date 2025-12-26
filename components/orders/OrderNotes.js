"use client";

import { FileText, Shield } from "lucide-react";

/**
 * OrderNotes Component
 * Displays order notes and admin notes
 */
export default function OrderNotes({ notes, adminNotes }) {
  return (
    <>
      {notes && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#286378] to-[#43909A] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">یادداشت سفارش</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notes}</p>
          </div>
        </div>
      )}

      {adminNotes && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl shadow-sm border-2 border-amber-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">یادداشت ادمین</h2>
              <p className="text-xs text-gray-600 mt-1">پیام مدیریت برای شما</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{adminNotes}</p>
          </div>
        </div>
      )}
    </>
  );
}

