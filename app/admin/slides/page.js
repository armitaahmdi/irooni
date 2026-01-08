"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SlidesTable from "@/components/admin/SlidesTable";
import SlideFormModal from "@/components/admin/SlideFormModal";
import SlidesEmptyState from "@/components/admin/SlidesEmptyState";
import { useSlides } from "@/hooks/useSlides";
import { useSlideUpload } from "@/hooks/useSlideUpload";
import { useToast } from "@/components/providers/ToastProvider";

const INITIAL_FORM_DATA = {
  image: "",
  imageMobile: "",
  alt: "",
  link: "",
  overlay: true,
  order: 0,
  isActive: true,
};

export default function AdminSlidesPage() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    slideId: null,
    isLoading: false,
  });
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const slidesData = useSlides();
  const uploadData = useSlideUpload(showToast);

  const handleOpenModal = (slide = null) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        image: slide.image,
        imageMobile: slide.imageMobile,
        alt: slide.alt,
        link: slide.link || "",
        overlay: slide.overlay,
        order: slide.order,
        isActive: slide.isActive,
      });
    } else {
      setEditingSlide(null);
      setFormData({
        ...INITIAL_FORM_DATA,
        order: slidesData.slides.length,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (formData, editingSlide) => {
    const success = await slidesData.handleSave(formData, editingSlide);
    if (success) {
      handleCloseModal();
    }
  };

  const handleDeleteClick = (slide) => {
    setDeleteModal({
      isOpen: true,
      slideId: slide.id,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.slideId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    const success = await slidesData.handleDelete(deleteModal.slideId);
    if (success) {
      setDeleteModal({ isOpen: false, slideId: null, isLoading: false });
    } else {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, slideId: null, isLoading: false });
  };

  if (slidesData.isLoading && !slidesData.isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!slidesData.isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPageHeader
        title="مدیریت بنرها"
        addButtonText="افزودن بنر"
        onAddClick={() => handleOpenModal()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {slidesData.isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری بنرها...</p>
          </div>
        ) : slidesData.slides.length === 0 ? (
          <SlidesEmptyState onAddSlide={() => handleOpenModal()} />
        ) : (
          <SlidesTable
            slides={slidesData.slides}
            onEdit={handleOpenModal}
            onDelete={handleDeleteClick}
            onToggleActive={slidesData.handleToggleActive}
            onOrderChange={(slide, direction) =>
              slidesData.handleOrderChange(slide, direction, slidesData.slides)
            }
          />
        )}
      </main>

      {/* Add/Edit Modal */}
      <SlideFormModal
        isOpen={showModal}
        editingSlide={editingSlide}
        formData={formData}
        setFormData={setFormData}
        uploading={uploadData.uploading}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onFileUpload={uploadData.handleFileUpload}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteModal.isLoading}
        title="حذف بنر"
        message="آیا از حذف این بنر اطمینان دارید؟ این عمل غیرقابل بازگشت است."
      />
    </div>
  );
}
