"use client";

/**
 * UserDetailsTabs Component
 * Tab navigation for user details
 */
export default function UserDetailsTabs({ activeTab, onTabChange, addressesCount }) {
  return (
    <div className="border-b border-gray-200 px-6">
      <div className="flex gap-4">
        <button
          onClick={() => onTabChange("info")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "info"
              ? "border-[#286378] text-[#286378]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          اطلاعات کاربر
        </button>
        <button
          onClick={() => onTabChange("addresses")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "addresses"
              ? "border-[#286378] text-[#286378]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          آدرس‌ها ({addressesCount})
        </button>
        <button
          onClick={() => onTabChange("orders")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-[#286378] text-[#286378]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          سفارشات ({0})
        </button>
      </div>
    </div>
  );
}

