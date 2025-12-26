"use client";

import Link from "next/link";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ArticlesTable from "@/components/admin/article/ArticlesTable";
import { useAdminArticles } from "@/hooks/useAdminArticles";

export default function AdminArticlesPage() {
  const {
    articles,
    isLoading,
    isAuthorized,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useAdminArticles();

  if (isLoading && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title="مدیریت مقالات"
        description="افزودن و مدیریت مقالات سایت"
        actionButton={
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 bg-[#286378] text-white px-6 py-3 rounded-lg hover:bg-[#43909A] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>مقاله جدید</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجوی مقالات..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
            />
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <ArticlesTable articles={articles} onDelete={openDeleteModal} isLoading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                صفحه {currentPage} از {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="حذف مقاله"
        message={`آیا از حذف "${deleteModal.articleTitle}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
        isLoading={deleteModal.isLoading}
        confirmText="حذف"
        cancelText="انصراف"
      />
    </div>
  );
}
