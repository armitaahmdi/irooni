"use client";

/**
 * OrderNotes Component
 * Optional notes input for order
 */
export default function OrderNotes({ notes, setNotes }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
        یادداشت سفارش (اختیاری)
      </h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent resize-none"
        placeholder="در صورت نیاز، یادداشتی برای سفارش خود بنویسید..."
      />
    </div>
  );
}

