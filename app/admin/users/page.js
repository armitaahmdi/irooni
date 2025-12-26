"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import UsersFilters from "@/components/admin/UsersFilters";
import UsersTable from "@/components/admin/UsersTable";
import UserEditModal from "@/components/admin/UserEditModal";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export default function AdminUsersPage() {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
    isLoading: false,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    user: null,
    isLoading: false,
  });
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    user: null,
  });

  const usersData = useAdminUsers();

  const handleDeleteClick = (user) => {
    setDeleteModal({
      isOpen: true,
      userId: user.id,
      userName: user.name || user.phone,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.userId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    const success = await usersData.handleDelete(deleteModal.userId);
    if (success) {
      setDeleteModal({ isOpen: false, userId: null, userName: "", isLoading: false });
    } else {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditClick = (user) => {
    setEditModal({
      isOpen: true,
      user: { ...user },
      isLoading: false,
    });
  };

  const handleEditSave = async (userId, userData) => {
    setEditModal((prev) => ({ ...prev, isLoading: true }));
    const success = await usersData.handleUpdate(userId, userData);
    if (success) {
      setEditModal({ isOpen: false, user: null, isLoading: false });
    } else {
      setEditModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewClick = (user) => {
    setDetailsModal({
      isOpen: true,
      user: { ...user },
    });
  };

  if (usersData.isLoading && !usersData.isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!usersData.isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPageHeader title="مدیریت کاربران" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UsersFilters
          searchQuery={usersData.searchQuery}
          setSearchQuery={usersData.setSearchQuery}
          selectedRole={usersData.selectedRole}
          setSelectedRole={usersData.setSelectedRole}
          onFilterChange={() => usersData.setCurrentPage(1)}
        />

        <UsersTable
          users={usersData.users}
          isLoading={usersData.isLoading}
          currentPage={usersData.currentPage}
          totalPages={usersData.totalPages}
          onPageChange={usersData.setCurrentPage}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* Edit Modal */}
      <UserEditModal
        isOpen={editModal.isOpen}
        user={editModal.user}
        onClose={() => setEditModal({ isOpen: false, user: null, isLoading: false })}
        onSave={handleEditSave}
        isLoading={editModal.isLoading}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        user={detailsModal.user}
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, user: null })}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: "", isLoading: false })}
        onConfirm={handleDeleteConfirm}
        title="حذف کاربر"
        message="آیا از حذف این کاربر مطمئن هستید؟"
        itemName={deleteModal.userName}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}
