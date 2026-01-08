"use client";

import TextFormattingButtons from "./TextFormattingButtons";
import HeadingButtons from "./HeadingButtons";
import ListButtons from "./ListButtons";
import AlignButtons from "./AlignButtons";
import ColorButtons from "./ColorButtons";
import MediaButtons from "./MediaButtons";
import LinkButtons from "./LinkButtons";
import TableButtons from "./TableButtons";
import UndoRedoButtons from "./UndoRedoButtons";

/**
 * RichTextEditorToolbar Component
 * Complete toolbar for rich text editor
 */
export default function RichTextEditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
      <TextFormattingButtons editor={editor} />
      <HeadingButtons editor={editor} />
      <ListButtons editor={editor} />
      <AlignButtons editor={editor} />
      <ColorButtons editor={editor} />
      <MediaButtons editor={editor} />
      <LinkButtons editor={editor} />
      <TableButtons editor={editor} />
      <UndoRedoButtons editor={editor} />
    </div>
  );
}

