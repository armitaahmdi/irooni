"use client";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * ColorButtons Component
 * Text color and highlight buttons
 */
export default function ColorButtons({ editor }) {
  if (!editor) return null;

  return (
    <>
      <ToolbarGroup>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 cursor-pointer border border-gray-300 rounded"
          title="رنگ متن"
          defaultValue="#000000"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetColor().run()}
          title="حذف رنگ"
          className="text-xs"
        >
          ✕
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
          }
          className="w-8 h-8 cursor-pointer border border-gray-300 rounded"
          title="رنگ پس‌زمینه"
          defaultValue="#ffff00"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          title="حذف هایلایت"
          className="text-xs"
        >
          ✕
        </ToolbarButton>
      </ToolbarGroup>
    </>
  );
}

