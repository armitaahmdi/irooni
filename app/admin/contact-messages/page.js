"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ContactMessagesFilters from "@/components/admin/ContactMessagesFilters";
import ContactMessagesTable from "@/components/admin/ContactMessagesTable";
import ContactMessageDetailModal from "@/components/admin/ContactMessageDetailModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { useContactMessages } from "@/hooks/useContactMessages";

export default function AdminContactMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: null,
    messageSubject: "",
    isLoading: false,
  });

  const messagesData = useContactMessages();

  const unreadCount = messagesData.messages.filter((m) => !m.isRead).length;

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleDeleteClick = (message) => {
    setDeleteModal({
      isOpen: true,
      messageId: message.id,
      messageSubject: message.subject,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.messageId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    const success = await messagesData.handleDelete(deleteModal.messageId);
    if (success) {
      setDeleteModal({ isOpen: false, messageId: null, messageSubject: "", isLoading: false });
    } else {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (messagesData.isLoading && !messagesData.isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!messagesData.isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AdminPageHeader
        title="پیام‌های تماس"
        icon={<MessageSquare className="w-8 h-8 text-[#286378]" />}
        description="مدیریت پیام‌های دریافتی از فرم تماس با ما"
      />

      <ContactMessagesFilters
        searchQuery={messagesData.searchQuery}
        setSearchQuery={messagesData.setSearchQuery}
        filterRead={messagesData.filterRead}
        setFilterRead={messagesData.setFilterRead}
        messages={messagesData.messages}
        unreadCount={unreadCount}
        onFilterChange={() => messagesData.setCurrentPage(1)}
      />

      <ContactMessagesTable
        messages={messagesData.messages}
        currentPage={messagesData.currentPage}
        totalPages={messagesData.totalPages}
        onPageChange={messagesData.setCurrentPage}
        onView={handleViewMessage}
        onDelete={handleDeleteClick}
        onMarkAsRead={messagesData.markAsRead}
      />

      {/* Message Detail Modal */}
      <ContactMessageDetailModal
        isOpen={showModal}
        message={selectedMessage}
        onClose={() => {
          setShowModal(false);
          setSelectedMessage(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, messageId: null, messageSubject: "", isLoading: false })
        }
        onConfirm={handleDeleteConfirm}
        title="حذف پیام"
        message={`آیا از حذف پیام "${deleteModal.messageSubject}" اطمینان دارید؟`}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}
