"use client";

import { useCheckout } from "@/hooks/useCheckout";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import AddressSelection from "@/components/checkout/AddressSelection";
import PaymentMethodSelection from "@/components/checkout/PaymentMethodSelection";
import CouponCode from "@/components/checkout/CouponCode";
import OrderNotes from "@/components/checkout/OrderNotes";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const {
    items,
    isAuthenticated,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    isLoadingAddresses,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isValidatingCoupon,
    discountAmount,
    finalTotal,
    shippingCost,
    total,
    orderLoading,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleSubmit,
  } = useCheckout();

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <CheckoutHeader />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
            <AddressSelection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              isLoadingAddresses={isLoadingAddresses}
            />

            <PaymentMethodSelection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <CouponCode
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              isValidatingCoupon={isValidatingCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />

            <OrderNotes notes={notes} setNotes={setNotes} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              total={total}
              discountAmount={discountAmount}
              shippingCost={shippingCost}
              finalTotal={finalTotal}
              appliedCoupon={appliedCoupon}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              orderLoading={orderLoading}
              onSubmit={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
