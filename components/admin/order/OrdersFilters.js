"use client";

import { Search, Filter } from "lucide-react";

export default function OrdersFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  orders,
  onSearchChange,
}) {
  const todayOrdersCount = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="جستجو (شماره سفارش، نام، تلفن)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent appearance-none bg-white"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار</option>
            <option value="processing">در حال پردازش</option>
            <option value="shipped">ارسال شده</option>
            <option value="delivered">تحویل داده شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>
        <div className="flex items-center justify-end">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-sm text-blue-600">
              <span className="font-semibold">سفارش‌های امروز:</span> {todayOrdersCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

