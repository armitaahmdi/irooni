"use client";

/**
 * OrderAdminControls Component
 * Admin controls for managing order
 */
export default function OrderAdminControls({ formData, setFormData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">مدیریت سفارش</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت سفارش</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          >
            <option value="pending">در انتظار</option>
            <option value="processing">در حال پردازش</option>
            <option value="shipped">ارسال شده</option>
            <option value="delivered">تحویل داده شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت پرداخت</label>
          <select
            value={formData.paymentStatus}
            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          >
            <option value="unpaid">پرداخت نشده</option>
            <option value="paid">پرداخت شده</option>
            <option value="refunded">بازگشت وجه</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره پیگیری پست
          </label>
          <input
            type="text"
            value={formData.trackingNumber}
            onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
            placeholder="مثال: 1234567890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت ادمین</label>
          <textarea
            value={formData.adminNotes}
            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent resize-none"
            placeholder="یادداشت برای سفارش..."
          />
        </div>
      </div>
    </div>
  );
}

