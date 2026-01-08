"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export const Toast = ({ message, type = "success", isVisible, onClose }) => {
  // Ensure message is a string to prevent Error object rendering
  const safeMessage = message?.message || message || "خطایی رخ داده است";
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] sm:w-auto max-w-md px-4"
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div
        className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl backdrop-blur-md border-2 w-full sm:min-w-[300px] ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" aria-hidden="true" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
        )}
        <span className="font-semibold text-sm md:text-base flex-1">{safeMessage}</span>
        <button
          onClick={onClose}
          className="ml-2 min-w-[32px] min-h-[32px] p-1 hover:bg-black/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          aria-label="بستن پیام"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
