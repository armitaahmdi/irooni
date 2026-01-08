"use client";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * UndoRedoButtons Component
 * Undo and redo buttons
 */
export default function UndoRedoButtons({ editor }) {
  if (!editor) return null;

  return (
    <ToolbarGroup className="border-r-0 pr-0">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="بازگردانی"
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="دوباره انجام"
      >
        ↷
      </ToolbarButton>
    </ToolbarGroup>
  );
}

