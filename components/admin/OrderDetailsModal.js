"use client";

import { X, Package, Save, Loader2 } from "lucide-react";
import { useOrderDetailsModal } from "@/hooks/useOrderDetailsModal";
import OrderCustomerInfo from "./order/OrderCustomerInfo";
import OrderStatusInfo from "./order/OrderStatusInfo";
import OrderShippingAddress from "./order/OrderShippingAddress";
import OrderUserNotes from "./order/OrderUserNotes";
import OrderItemsList from "./order/OrderItemsList";
import OrderAdminControls from "./order/OrderAdminControls";
import OrderDates from "./order/OrderDates";

export default function OrderDetailsModal({ order, isOpen, onClose, onUpdate }) {
  const { orderDetails, isLoading, isSaving, formData, setFormData, handleSave } =
    useOrderDetailsModal(order, isOpen, onClose, onUpdate);

  if (!isOpen || !order) return null;

  const displayOrder = orderDetails || order;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#286378] to-[#43909A] flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">جزئیات سفارش</h2>
              <p className="text-sm text-gray-500">{displayOrder.orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-[#286378]" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OrderCustomerInfo order={displayOrder} />
                <OrderStatusInfo order={displayOrder} />
              </div>

              {/* Shipping Address */}
              <OrderShippingAddress address={displayOrder.address} />

              {/* User Notes */}
              <OrderUserNotes notes={displayOrder.notes} />

              {/* Order Items */}
              <OrderItemsList items={displayOrder.items} totalAmount={displayOrder.totalAmount} />

              {/* Admin Controls */}
              <OrderAdminControls formData={formData} setFormData={setFormData} />

              {/* Order Dates */}
              <OrderDates order={displayOrder} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            بستن
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                ذخیره تغییرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
