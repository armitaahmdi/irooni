import { useState, useEffect, useCallback } from "react";
import { safeJsonParse } from "@/utils/api";
import { getCitiesByProvince } from "@/data/provinces";

const INITIAL_ADDRESS_FORM = {
  title: "",
  province: "",
  city: "",
  address: "",
  plaque: "",
  unit: "",
  postalCode: "",
  isDefault: false,
};

/**
 * Hook for managing addresses
 */
export function useAddresses(showToast, activeSection, isAuthenticated) {
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressModal, setAddressModal] = useState({
    isOpen: false,
    mode: "add",
    address: null,
    isLoading: false,
  });
  const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS_FORM);
  const [availableCities, setAvailableCities] = useState([]);

  const fetchAddresses = useCallback(async () => {
    setIsLoadingAddresses(true);
    try {
      const response = await fetch("/api/addresses");

      if (!response.ok) {
        if (response.status === 500) {
          console.warn("Address API returned 500, setting empty array");
          setAddresses([]);
          return;
        }

        const errorData = await safeJsonParse(response).catch(() => ({}));
        showToast(errorData.error || "خطا در دریافت آدرس‌ها", "error");
        setAddresses([]);
        return;
      }

      const data = await safeJsonParse(response);

      if (data.success) {
        setAddresses(data.data || []);
      } else {
        setAddresses([]);
        if (data.error && !data.error.includes("لطفاً ابتدا وارد شوید")) {
          showToast(data.error || "خطا در دریافت آدرس‌ها", "error");
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
      if (error.name !== "TypeError") {
        showToast("خطا در دریافت آدرس‌ها", "error");
      }
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [showToast]);

  useEffect(() => {
    if ((activeSection === "addresses" || activeSection === "dashboard") && isAuthenticated) {
      fetchAddresses();
    }
  }, [activeSection, isAuthenticated, fetchAddresses]);

  const handleAddAddress = useCallback(() => {
    setAddressForm(INITIAL_ADDRESS_FORM);
    setAvailableCities([]);
    setAddressModal({ isOpen: true, mode: "add", address: null, isLoading: false });
  }, []);

  const handleEditAddress = useCallback((address) => {
    const provinceName = address.province || "";
    setAddressForm({
      title: address.title || "",
      province: provinceName,
      city: address.city || "",
      address: address.address || "",
      plaque: address.plaque || "",
      unit: address.unit || "",
      postalCode: address.postalCode || "",
      isDefault: address.isDefault || false,
    });
    if (provinceName) {
      setAvailableCities(getCitiesByProvince(provinceName));
    } else {
      setAvailableCities([]);
    }
    setAddressModal({ isOpen: true, mode: "edit", address, isLoading: false });
  }, []);

  const handleDeleteAddress = useCallback(
    async (addressId) => {
      if (!confirm("آیا از حذف این آدرس مطمئن هستید؟")) return;

      try {
        const response = await fetch(`/api/addresses/${addressId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await safeJsonParse(response).catch(() => ({}));
          showToast(errorData.error || "خطا در حذف آدرس", "error");
          return;
        }

        const data = await safeJsonParse(response);

        if (data.success) {
          showToast("آدرس با موفقیت حذف شد", "success");
          fetchAddresses();
        } else {
          showToast(data.error || "خطا در حذف آدرس", "error");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        showToast("خطا در حذف آدرس", "error");
      }
    },
    [showToast, fetchAddresses]
  );

  const handleAddressSave = useCallback(async () => {
    if (!addressForm.title || !addressForm.province || !addressForm.city || !addressForm.address) {
      showToast("لطفاً فیلدهای الزامی را پر کنید", "error");
      return;
    }

    setAddressModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const url =
        addressModal.mode === "edit" ? `/api/addresses/${addressModal.address.id}` : "/api/addresses";
      const method = addressModal.mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressForm),
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response).catch(() => ({}));
        showToast(errorData.error || "خطا در ذخیره آدرس", "error");
        setAddressModal((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const data = await safeJsonParse(response);

      if (data.success) {
        showToast(
          addressModal.mode === "edit" ? "آدرس با موفقیت به‌روزرسانی شد" : "آدرس با موفقیت اضافه شد",
          "success"
        );
        setAddressModal({ isOpen: false, mode: "add", address: null, isLoading: false });
        fetchAddresses();
      } else {
        showToast(data.error || "خطا در ذخیره آدرس", "error");
        setAddressModal((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showToast("خطا در ذخیره آدرس", "error");
      setAddressModal((prev) => ({ ...prev, isLoading: false }));
    }
  }, [addressForm, addressModal, showToast, fetchAddresses]);

  const handleAddressCancel = useCallback(() => {
    setAddressModal({ isOpen: false, mode: "add", address: null, isLoading: false });
    setAddressForm(INITIAL_ADDRESS_FORM);
    setAvailableCities([]);
  }, []);

  return {
    addresses,
    isLoadingAddresses,
    addressModal,
    addressForm,
    setAddressForm,
    availableCities,
    setAvailableCities,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleAddressSave,
    handleAddressCancel,
  };
}

