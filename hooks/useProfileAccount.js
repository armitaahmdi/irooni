import { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchSession } from "@/store/slices/authSlice";
import { safeJsonParse } from "@/utils/api";

/**
 * Hook for managing profile account settings
 */
export function useProfileAccount(user, showToast) {
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setAccountForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleAccountSave = useCallback(async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: accountForm.name,
          email: accountForm.email,
        }),
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response).catch(() => ({}));
        showToast(errorData.error || "خطا در به‌روزرسانی اطلاعات", "error");
        setIsSaving(false);
        return;
      }

      const data = await safeJsonParse(response);

      if (data.success) {
        showToast("اطلاعات با موفقیت به‌روزرسانی شد", "success");
        await dispatch(fetchSession());
      } else {
        showToast(data.error || "خطا در به‌روزرسانی اطلاعات", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("خطا در به‌روزرسانی اطلاعات", "error");
    } finally {
      setIsSaving(false);
    }
  }, [user, accountForm, showToast, dispatch]);

  return {
    accountForm,
    setAccountForm,
    isSaving,
    handleAccountSave,
  };
}

