"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductsFilters from "@/components/admin/ProductsFilters";
import ProductsTable from "@/components/admin/ProductsTable";
import ProductDetailsModal from "@/components/admin/ProductDetailsModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { useAdminProducts } from "@/hooks/useAdminProducts";

export default function AdminProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
    isLoading: false,
  });

  const productsData = useAdminProducts();

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteModal({
      isOpen: true,
      productId: product.id,
      productName: product.name,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.productId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    const success = await productsData.handleDelete(deleteModal.productId);
    if (success) {
      setDeleteModal({ isOpen: false, productId: null, productName: "", isLoading: false });
    } else {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (productsData.isLoading && !productsData.isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!productsData.isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPageHeader
        title="مدیریت محصولات"
        actionButton={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#286378] text-white px-4 py-2 rounded-lg hover:bg-[#43909A] transition-colors"
          >
            <Plus className="w-4 h-4" />
            افزودن محصول
          </Link>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsFilters
          searchQuery={productsData.searchQuery}
          setSearchQuery={productsData.setSearchQuery}
          selectedCategory={productsData.selectedCategory}
          setSelectedCategory={productsData.setSelectedCategory}
          onFilterChange={() => productsData.setCurrentPage(1)}
        />

        <ProductsTable
          products={productsData.products}
          isLoading={productsData.isLoading}
          currentPage={productsData.currentPage}
          totalPages={productsData.totalPages}
          onPageChange={productsData.setCurrentPage}
          onView={handleViewProduct}
          onEdit={(product) => {}}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, productId: null, productName: "", isLoading: false })
        }
        onConfirm={handleDeleteConfirm}
        title="حذف محصول"
        message="آیا از حذف این محصول مطمئن هستید؟"
        itemName={deleteModal.productName}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}
