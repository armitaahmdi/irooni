"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/store/hooks";
import { logout, fetchSession } from "@/store/slices/authSlice";
import { fetchOrders } from "@/store/slices/ordersSlice";
import { useToast } from "@/components/providers/ToastProvider";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import DashboardSection from "@/components/profile/DashboardSection";
import OrdersSection from "@/components/profile/OrdersSection";
import AddressesSection from "@/components/profile/AddressesSection";
import ReviewsSection from "@/components/profile/ReviewsSection";
import AddressModal from "@/components/profile/AddressModal";
import AccountSection from "@/components/profile/AccountSection";
import SettingsSection from "@/components/profile/SettingsSection";
import { useOrderStats } from "@/hooks/useProfileData";
import { useAddresses } from "@/hooks/useAddresses";
import { useReviews } from "@/hooks/useReviews";
import { useProfileAccount } from "@/hooks/useProfileAccount";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const { orders, isLoading: ordersLoading } = useAppSelector((state) => state.orders);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [orderFilter, setOrderFilter] = useState(null);

  // Custom hooks for data management
  const addressesData = useAddresses(showToast, activeSection, isAuthenticated);
  const reviewsData = useReviews(showToast, activeSection, isAuthenticated);
  const accountData = useProfileAccount(user, showToast);
  const orderStats = useOrderStats(orders);

  // Session and auth management
  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchSession());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isInitialized, isLoading, isAuthenticated, router]);

  useEffect(() => {
    document.title = "پروفایل کاربری | پوشاک ایرونی";
  }, []);

  // Fetch orders when orders section is active or dashboard is active
  useEffect(() => {
    if ((activeSection === "orders" || activeSection === "dashboard") && isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [activeSection, isAuthenticated, dispatch]);

  const handleSignOut = useCallback(async () => {
    await dispatch(logout());
    router.push("/");
  }, [dispatch, router]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#286378] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <ProfileSidebar
            user={user}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onSignOut={handleSignOut}
          />

          {/* بخش محتوا */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {activeSection === "dashboard" && (
                <DashboardSection
                  orderStats={orderStats}
                  addresses={addressesData.addresses}
                  orders={orders}
                  onViewAllAddresses={() => setActiveSection("addresses")}
                  onAddAddress={addressesData.handleAddAddress}
                  onEditAddress={addressesData.handleEditAddress}
                  onDeleteAddress={addressesData.handleDeleteAddress}
                />
              )}

              {activeSection === "orders" && (
                <OrdersSection
                  orders={orders}
                  orderFilter={orderFilter}
                  setOrderFilter={setOrderFilter}
                  orderStats={orderStats}
                  isLoading={ordersLoading}
                />
              )}


              {activeSection === "addresses" && (
                <AddressesSection
                  addresses={addressesData.addresses}
                  isLoading={addressesData.isLoadingAddresses}
                  onAddAddress={addressesData.handleAddAddress}
                  onEditAddress={addressesData.handleEditAddress}
                  onDeleteAddress={addressesData.handleDeleteAddress}
                />
              )}

              {activeSection === "reviews" && (
                <ReviewsSection
                  reviews={reviewsData.reviews}
                  isLoading={reviewsData.isLoadingReviews}
                  reviewsPage={reviewsData.reviewsPage}
                  reviewsTotalPages={reviewsData.reviewsTotalPages}
                  setReviewsPage={reviewsData.setReviewsPage}
                />
              )}

              {activeSection === "account" && (
                <AccountSection
                  user={user}
                  accountForm={accountData.accountForm}
                  setAccountForm={accountData.setAccountForm}
                  isSaving={accountData.isSaving}
                  onSave={accountData.handleAccountSave}
                />
              )}

              {activeSection === "settings" && (
                <SettingsSection />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={addressesData.addressModal.isOpen}
        mode={addressesData.addressModal.mode}
        addressForm={addressesData.addressForm}
        setAddressForm={addressesData.setAddressForm}
        availableCities={addressesData.availableCities}
        setAvailableCities={addressesData.setAvailableCities}
        isLoading={addressesData.addressModal.isLoading}
        onSave={addressesData.handleAddressSave}
        onCancel={addressesData.handleAddressCancel}
      />
    </div>
  );
}

