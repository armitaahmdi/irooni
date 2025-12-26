"use client";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * ListButtons Component
 * List and blockquote buttons
 */
export default function ListButtons({ editor }) {
  if (!editor) return null;

  return (
    <ToolbarGroup>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="لیست نقطه‌ای"
      >
        •
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="لیست شماره‌ای"
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="نقل قول"
      >
        "
      </ToolbarButton>
    </ToolbarGroup>
  );
}

