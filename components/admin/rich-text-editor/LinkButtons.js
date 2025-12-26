"use client";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * LinkButtons Component
 * Link add/remove buttons
 */
export default function LinkButtons({ editor }) {
  if (!editor) return null;

  const handleAddLink = () => {
    const url = window.prompt("لینک را وارد کنید:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <ToolbarGroup>
      <ToolbarButton
        onClick={handleAddLink}
        isActive={editor.isActive("link")}
        title="افزودن لینک"
      >
        🔗
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="حذف لینک"
      >
        🔓
      </ToolbarButton>
    </ToolbarGroup>
  );
}

