import { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { sendOTP, login, clearError } from "@/store/slices/authSlice";
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
  const { showToast } = useToast();
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
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
      showToast(error || "خطا در ارسال کد تأیید", "error");
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

    try {
      await dispatch(login({ phone: phoneNumber, otp: otp.join("") })).unwrap();
      window.location.href = "/";
    } catch (error) {
      showToast(error || "خطا در ورود", "error");
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
      showToast(error || "خطا در ارسال مجدد کد", "error");
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setCountdown(0);
    dispatch(clearError());
  };

  return {
    step,
    phoneNumber,
    setPhoneNumber: (value) => setPhoneNumber(formatPhoneNumber(value)),
    otp,
    countdown,
    otpInputRefs,
    handlePhoneSubmit,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleOtpSubmit,
    handleResendOtp,
    handleBackToPhone,
  };
}

