"use client";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * HeadingButtons Component
 * Heading level buttons (H1, H2, H3)
 */
export default function HeadingButtons({ editor }) {
  if (!editor) return null;

  return (
    <ToolbarGroup>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="عنوان 1"
        className="text-sm"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="عنوان 2"
        className="text-sm"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="عنوان 3"
        className="text-sm"
      >
        H3
      </ToolbarButton>
    </ToolbarGroup>
  );
}

