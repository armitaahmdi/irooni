import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { sendOTP, login, clearError, fetchSession } from "@/store/slices/authSlice";
import { useToast } from "@/components/providers/ToastProvider";

const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 0) return "";
  if (numbers.startsWith("09")) return numbers.slice(0, 11);
  if (numbers.startsWith("9") && numbers.length > 1) return `0${numbers.slice(0, 10)}`;
  if (numbers.startsWith("0")) return numbers.slice(0, 11);
  return numbers.slice(0, 11);
};

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, step]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 11) return;

    try {
      const result = await dispatch(sendOTP(phoneNumber)).unwrap();
      setStep("otp");
      setCountdown(120);

      if (result.otp) {
        console.log("OTP:", result.otp);
        showToast(`کد تأیید (برای تست): ${result.otp}`, "success");
      }

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      showToast(error?.message || error || "خطا در ارسال کد تأیید", "error");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    const nextEmptyIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) return;

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await dispatch(login({ phone: phoneNumber, otp: otp.join("") })).unwrap();

      // بعد از login، session را fetch کن با retry mechanism بهینه شده (کاهش retry و delay)
      const fetchSessionWithRetry = async (retries = 2, initialDelay = 50) => {
        for (let i = 0; i < retries; i++) {
          try {
            const result = await dispatch(fetchSession()).unwrap();
            // اگر session موفقیت‌آمیز بود و user وجود داشت
            if (result?.user) {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("auth-state-change"));
                window.location.href = "/";
              }
              return;
            }
            // اگر user null بود و retry باقی مانده، کمی صبر کن
            if (i < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, initialDelay));
            }
          } catch (error) {
            // اگر خطا داشت و retry باقی مانده، کمی صبر کن
            if (i < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, initialDelay));
            }
          }
        }
        // اگر همه retry ها ناموفق بودند، باز هم redirect کن
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-state-change"));
          window.location.href = "/";
        }
      };

      // fetch session فوراً (بدون setTimeout)
      fetchSessionWithRetry();
    } catch (error) {
      setIsSubmitting(false);
      showToast(error?.message || error || "خطا در ورود", "error");
    } finally {
      // Reset submitting state after redirect (component will unmount anyway)
      // But we keep it here for safety
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    try {
      const result = await dispatch(sendOTP(phoneNumber)).unwrap();
      setCountdown(120);
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();

      if (result.otp) {
        console.log("OTP:", result.otp);
      }
    } catch (error) {
      showToast(error?.message || error || "خطا در ارسال مجدد کد", "error");
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setCountdown(0);
    setIsSubmitting(false);
    dispatch(clearError());
  };

  return {
    step,
    phoneNumber,
    setPhoneNumber: (value) => setPhoneNumber(formatPhoneNumber(value)),
    otp,
    countdown,
    otpInputRefs,
    isSubmitting,
    handlePhoneSubmit,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleOtpSubmit,
    handleResendOtp,
    handleBackToPhone,
  };
}