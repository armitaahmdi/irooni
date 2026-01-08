"use client";

/**
 * ToolbarGroup Component
 * Groups toolbar buttons with a border separator
 */
export default function ToolbarGroup({ children, className = "" }) {
  return (
    <div className={`flex items-center gap-1 border-r border-gray-300 pr-2 ${className}`}>
      {children}
    </div>
  );
}

