"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CouponsFilters from "@/components/admin/CouponsFilters";
import CouponsTable from "@/components/admin/CouponsTable";
import CouponFormModal, { INITIAL_FORM_DATA } from "@/components/admin/CouponFormModal";
import { useCoupons } from "@/hooks/useCoupons";
import { useToast } from "@/components/providers/ToastProvider";

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    couponId: null,
    couponCode: "",
    isLoading: false,
  });
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const couponsData = useCoupons();

  const handleCreate = () => {
    setEditingCoupon(null);
    setFormData(INITIAL_FORM_DATA);
    setShowModal(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchase: coupon.minPurchase?.toString() || "",
      maxDiscount: coupon.maxDiscount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (formData, editingCoupon) => {
    const success = await couponsData.handleSave(formData, editingCoupon);
    if (success) {
      setShowModal(false);
    }
  };

  const handleDeleteClick = (coupon) => {
    setDeleteModal({
      isOpen: true,
      couponId: coupon.id,
      couponCode: coupon.code,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.couponId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    const success = await couponsData.handleDelete(deleteModal.couponId);
    if (success) {
      setDeleteModal({
        isOpen: false,
        couponId: null,
        couponCode: "",
        isLoading: false,
      });
    } else {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (couponsData.isLoading || !couponsData.isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="مدیریت کدهای تخفیف"
          addButtonText="ایجاد کد تخفیف جدید"
          onAddClick={handleCreate}
        />

        <CouponsFilters
          searchQuery={couponsData.searchQuery}
          setSearchQuery={couponsData.setSearchQuery}
          filterActive={couponsData.filterActive}
          setFilterActive={couponsData.setFilterActive}
          onSearchChange={() => couponsData.setCurrentPage(1)}
        />

        <CouponsTable
          coupons={couponsData.coupons}
          isLoading={couponsData.isLoading}
          currentPage={couponsData.currentPage}
          totalPages={couponsData.totalPages}
          onPageChange={couponsData.setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Create/Edit Modal */}
      <CouponFormModal
        isOpen={showModal}
        editingCoupon={editingCoupon}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            ...deleteModal,
            isOpen: false,
          })
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isLoading}
        title="حذف کد تخفیف"
        description={`آیا از حذف کد تخفیف "${deleteModal.couponCode}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
      />
    </div>
  );
}
