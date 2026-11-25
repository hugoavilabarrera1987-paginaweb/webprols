"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Italic, List, ListOrdered, Quote, Strikethrough } from "lucide-react";

export function RichTextEditor({
  initialContent,
  onChange,
}: {
  initialContent: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  if (!editor) return <div className="rich-editor-loading">Preparando editor…</div>;

  const controls = [
    { label: "Negrita", icon: <Bold size={16} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "Cursiva", icon: <Italic size={16} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "Tachado", icon: <Strikethrough size={16} />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
    { label: "Título", icon: <Heading2 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "Lista", icon: <List size={16} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "Lista numerada", icon: <ListOrdered size={16} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { label: "Cita", icon: <Quote size={16} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
  ];

  return (
    <div className="rich-editor">
      <div className="rich-toolbar" role="toolbar" aria-label="Formato del texto">
        {controls.map((control) => (
          <button key={control.label} type="button" aria-label={control.label} title={control.label} className={control.active ? "is-active" : ""} onClick={control.action}>
            {control.icon}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} className="rich-editor-content" />
    </div>
  );
}
