"use client";

import { EditorContent } from "@tiptap/react";
import { useRichTextEditor } from "@/hooks/useRichTextEditor";
import RichTextEditorToolbar from "./rich-text-editor/RichTextEditorToolbar";

/**
 * RichTextEditor Component
 * Rich text editor using TipTap
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useRichTextEditor(value, onChange, placeholder);

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden bg-white">
      <RichTextEditorToolbar editor={editor} />

      {/* Editor Content */}
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto" dir="rtl">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .rich-text-editor .ProseMirror {
          outline: none;
          min-height: 400px;
          padding: 1rem;
          direction: rtl;
          text-align: right;
        }
        .rich-text-editor .ProseMirror p {
          margin: 0.5rem 0;
        }
        .rich-text-editor .ProseMirror h1,
        .rich-text-editor .ProseMirror h2,
        .rich-text-editor .ProseMirror h3 {
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        .rich-text-editor .ProseMirror h1 {
          font-size: 2em;
        }
        .rich-text-editor .ProseMirror h2 {
          font-size: 1.5em;
        }
        .rich-text-editor .ProseMirror h3 {
          font-size: 1.17em;
        }
        .rich-text-editor .ProseMirror ul,
        .rich-text-editor .ProseMirror ol {
          padding-right: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-editor .ProseMirror li {
          margin: 0.25rem 0;
        }
        .rich-text-editor .ProseMirror blockquote {
          border-right: 4px solid #ddd;
          padding-right: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        .rich-text-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1rem auto;
        }
        .rich-text-editor .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .rich-text-editor .ProseMirror .youtube-embed {
          width: 100%;
          max-width: 640px;
          height: 480px;
          margin: 1rem auto;
          display: block;
        }
        .rich-text-editor .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          table-layout: fixed;
          width: 100%;
          overflow: hidden;
        }
        .rich-text-editor .ProseMirror table td,
        .rich-text-editor .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #ced4da;
          padding: 8px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .rich-text-editor .ProseMirror table th {
          font-weight: bold;
          text-align: right;
          background-color: #f1f3f5;
        }
        .rich-text-editor .ProseMirror table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }
        .rich-text-editor .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
