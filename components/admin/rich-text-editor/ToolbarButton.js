"use client";

/**
 * ToolbarButton Component
 * Reusable button for rich text editor toolbar
 */
export default function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive ? "bg-gray-300" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}

