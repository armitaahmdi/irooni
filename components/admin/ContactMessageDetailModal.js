"use client";

import { X } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";

/**
 * ContactMessageDetailModal Component
 * Modal for displaying message details
 */
export default function ContactMessageDetailModal({
  isOpen,
  message,
  onClose,
}) {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">جزئیات پیام</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">نام</label>
              <div className="mt-1 text-lg font-medium text-gray-900">{message.name}</div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">شماره تماس</label>
              <div className="mt-1 text-lg font-medium text-gray-900">{message.phone}</div>
            </div>
            {message.email && (
              <div>
                <label className="text-sm font-semibold text-gray-600">ایمیل</label>
                <div className="mt-1 text-lg font-medium text-gray-900">{message.email}</div>
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-600">تاریخ ارسال</label>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {formatDate(message.createdAt)}
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">موضوع</label>
            <div className="mt-1 text-xl font-bold text-gray-900">{message.subject}</div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">پیام</label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
          {message.reply && (
            <div>
              <label className="text-sm font-semibold text-gray-600">پاسخ</label>
              <div className="mt-2 p-4 bg-blue-50 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {message.reply}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

