"use client";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * AlignButtons Component
 * Text alignment buttons
 */
export default function AlignButtons({ editor }) {
  if (!editor) return null;

  return (
    <ToolbarGroup>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="تراز راست"
      >
        ⬅
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="تراز وسط"
      >
        ↔
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="تراز چپ"
      >
        ➡
      </ToolbarButton>
    </ToolbarGroup>
  );
}

