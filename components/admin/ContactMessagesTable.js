"use client";

import { Mail, MailOpen, Phone, Eye, Trash2, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";

/**
 * ContactMessagesTable Component
 * Table displaying contact messages
 */
export default function ContactMessagesTable({
  messages,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onDelete,
  onMarkAsRead,
}) {
  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">پیامی یافت نشد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">وضعیت</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">فرستنده</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">موضوع</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاریخ</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {messages.map((message) => (
              <tr
                key={message.id}
                className={`hover:bg-gray-50 transition-colors ${
                  !message.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  {message.isRead ? (
                    <MailOpen className="w-5 h-5 text-green-500" />
                  ) : (
                    <Mail className="w-5 h-5 text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900">{message.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3" />
                      {message.phone}
                    </div>
                    {message.email && (
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3" />
                        {message.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{message.subject}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">{message.message}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(message.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onView(message);
                        if (!message.isRead) {
                          onMarkAsRead(message.id);
                        }
                      }}
                      className="p-2 text-[#286378] hover:bg-[#286378]/10 rounded-lg transition-colors"
                      title="مشاهده"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(message)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            صفحه {currentPage} از {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

