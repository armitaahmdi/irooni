"use client";

import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OrdersFilters from "@/components/admin/order/OrdersFilters";
import OrdersTable from "@/components/admin/order/OrdersTable";
import { useAdminOrders } from "@/hooks/useAdminOrders";

export default function AdminOrdersPage() {
  const {
    orders,
    isLoading,
    isAuthorized,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    detailsModal,
    setDetailsModal,
    fetchOrders,
  } = useAdminOrders();

  if (isLoading && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPageHeader
          title="مدیریت سفارش‌ها"
          description="مدیریت و پیگیری سفارش‌های مشتریان"
          icon={<Package className="w-6 h-6 text-white" />}
        />

        <OrdersFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          orders={orders}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
        />

        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          onViewClick={(order) => setDetailsModal({ isOpen: true, order })}
        />

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <OrderDetailsModal
        order={detailsModal.order}
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, order: null })}
        onUpdate={fetchOrders}
      />
    </div>
  );
}
