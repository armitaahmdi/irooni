"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export const Toast = ({ message, type = "success", isVisible, onClose }) => {
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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] sm:w-auto max-w-md px-4">
      <div
        className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl backdrop-blur-md border-2 w-full sm:min-w-[300px] ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        )}
        <span className="font-semibold text-sm md:text-base flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
