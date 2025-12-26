"use client";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * TableButtons Component
 * Table add/remove buttons
 */
export default function TableButtons({ editor }) {
  if (!editor) return null;

  return (
    <ToolbarGroup>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        title="افزودن جدول"
      >
        ⚏
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
        title="حذف جدول"
      >
        ✕
      </ToolbarButton>
    </ToolbarGroup>
  );
}

