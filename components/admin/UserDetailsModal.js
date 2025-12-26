"use client";

import { useState } from "react";
import { X, User, Edit } from "lucide-react";
import { useUserDetailsModal } from "@/hooks/useUserDetailsModal";
import UserDetailsTabs from "./user/UserDetailsTabs";
import UserInfoTab from "./user/UserInfoTab";
import UserAddressesTab from "./user/UserAddressesTab";
import UserOrdersTab from "./user/UserOrdersTab";

export default function UserDetailsModal({ user, isOpen, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("info");
  const { userDetails, addresses, isLoading } = useUserDetailsModal(user, isOpen);

  if (!isOpen || !user) return null;

  const displayUser = userDetails || user;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#286378] to-[#43909A] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">جزئیات کاربر</h2>
              <p className="text-sm text-gray-500">{displayUser.phone}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <UserDetailsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          addressesCount={addresses.length}
        />

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378]"></div>
            </div>
          ) : (
            <>
              {activeTab === "info" && <UserInfoTab user={displayUser} />}
              {activeTab === "addresses" && <UserAddressesTab addresses={addresses} />}
              {activeTab === "orders" && <UserOrdersTab orders={userDetails?.orders} />}
            </>
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
          {onEdit && (
            <button
              onClick={() => {
                onEdit(displayUser);
                onClose();
              }}
              className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              ویرایش کاربر
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
