"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Minus,
  Terminal,
  ImagePlay,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  CheckSquare,
  Trash2,
} from "lucide-react";
import { JSONContent } from "@tiptap/react";
import { getTiptapExtensionsClient } from "@/src/lib/tiptap-extensions-client";
import MediaDialog from "./MediaDialog";
import "./editor.css";

interface BlogEditorProps {
  content: JSONContent | string;
  onChange: (json: JSONContent) => void;
  blogId: string;
}

const MenuBar = ({
  editor,
  blogId,
  onOpenMedia,
  onSetLink,
}: {
  editor: any;
  blogId: string;
  onOpenMedia: () => void;
  onSetLink: () => void;
}) => {
  if (!editor) return null;

  const buttons = [
    // Basic Formatting
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: "bold",
      title: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: "italic",
      title: "Italic",
    },
    {
      icon: UnderlineIcon,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: "underline",
      title: "Underline",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: "strike",
      title: "Strikethrough",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      active: "code",
      title: "Code",
    },
    {
      icon: Terminal,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: "codeBlock",
      title: "Code Block",
    },

    { type: "spacer" },

    // Headings
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: { heading: { level: 1 } },
      title: "Heading 1",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: { heading: { level: 2 } },
      title: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: { heading: { level: 3 } },
      title: "Heading 3",
    },

    { type: "spacer" },

    // Lists & Blocks
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: "bulletList",
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: "orderedList",
      title: "Numbered List",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: "blockquote",
      title: "Blockquote",
    },
    {
      icon: CheckSquare,
      action: () => editor.chain().focus().toggleTaskList().run(),
      active: "taskList",
      title: "Task List",
    },
    {
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      active: null,
      title: "Horizontal Rule",
    },

    { type: "spacer" },

    // Alignment
    {
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      active: { textAlign: "left" },
      title: "Align Left",
    },
    {
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      active: { textAlign: "center" },
      title: "Align Center",
    },
    {
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      active: { textAlign: "right" },
      title: "Align Right",
    },

    { type: "spacer" },

    {
      icon: SubscriptIcon,
      action: () => editor.chain().focus().toggleSubscript().run(),
      active: "subscript",
      title: "Subscript",
    },
    {
      icon: SuperscriptIcon,
      action: () => editor.chain().focus().toggleSuperscript().run(),
      active: "superscript",
      title: "Superscript",
    },

    { type: "spacer" },

    // Media & Links
    { icon: LinkIcon, action: onSetLink, active: "link", title: "Add Link" },
    {
      icon: ImageIcon,
      action: onOpenMedia,
      active: null,
      title: "Add Media (Upload, Link, GIF)",
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 md:p-3 border-b border-outline-variant/10 bg-surface sticky top-[5.25rem] lg:top-[6.25rem] z-50">
      {buttons.map((btn, i) => {
        if (btn.type === "spacer") {
          return (
            <div
              key={`spacer-${i}`}
              className="w-px h-6 bg-outline-variant/20 mx-1 self-center"
            />
          );
        }

        const Icon = (btn as any).icon;
        return (
          <button
            key={i}
            onClick={(btn as any).action}
            className={`p-2 rounded-lg transition-all duration-200 group ${
              (btn as any).active && editor.isActive((btn as any).active)
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
            }`}
            type="button"
            title={(btn as any).title}
          >
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        );
      })}

      <div className="flex-grow" />

      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary disabled:opacity-20 transition-all rounded-lg"
          type="button"
          title="Undo"
        >
          <Undo className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary disabled:opacity-20 transition-all rounded-lg"
          type="button"
          title="Redo"
        >
          <Redo className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default function BlogEditor({
  content,
  onChange,
  blogId,
}: BlogEditorProps) {
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getTiptapExtensionsClient(),
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-content max-w-none focus:outline-none p-4 md:p-12 min-h-[600px] selection:bg-primary/20",
      },
    },
  });

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("blogId", blogId);

    try {
      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        return data.url;
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
    return null;
  };

  const handleInsertMedia = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full border border-outline-variant/20 rounded-[1.5rem] md:rounded-[2.5rem] bg-surface shadow-xs ring-1 ring-black/[0.02] relative">
      <MenuBar
        editor={editor}
        blogId={blogId}
        onOpenMedia={() => setIsMediaDialogOpen(true)}
        onSetLink={handleSetLink}
      />

      {editor && (
        <BubbleMenu
          editor={editor}
          options={{ placement: "top" }}
          className="flex items-center gap-1 p-1.5 rounded-2xl bg-surface-container-high shadow-xl border border-outline-variant/20"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-all ${editor.isActive("bold") ? "bg-primary/20 text-primary" : "hover:bg-surface-variant text-on-surface-variant"}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-all ${editor.isActive("italic") ? "bg-primary/20 text-primary" : "hover:bg-surface-variant text-on-surface-variant"}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-all ${editor.isActive("underline") ? "bg-primary/20 text-primary" : "hover:bg-surface-variant text-on-surface-variant"}`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg transition-all ${editor.isActive("code") ? "bg-primary/20 text-primary" : "hover:bg-surface-variant text-on-surface-variant"}`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            onClick={handleSetLink}
            className={`p-1.5 rounded-lg transition-all ${editor.isActive("link") ? "bg-primary/20 text-primary" : "hover:bg-surface-variant text-on-surface-variant"}`}
            title="Add/Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-outline-variant/30 mx-1" />

          {/* Color Presets */}
          <div className="flex items-center gap-1.5 px-1">
            <button
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="w-5 h-5 rounded-full bg-on-surface border-2 border-surface shadow-sm hover:scale-110 transition-transform"
              title="Default Color"
            />
            <button
              onClick={() => editor.chain().focus().setColor("#3b82f6").run()}
              className="w-5 h-5 rounded-full bg-blue-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
              title="Blue"
            />
            <button
              onClick={() => editor.chain().focus().setColor("#ef4444").run()}
              className="w-5 h-5 rounded-full bg-red-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
              title="Red"
            />
            <button
              onClick={() => editor.chain().focus().setColor("#22c55e").run()}
              className="w-5 h-5 rounded-full bg-green-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
              title="Green"
            />
            <button
              onClick={() => editor.chain().focus().setColor("#a855f7").run()}
              className="w-5 h-5 rounded-full bg-purple-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
              title="Purple"
            />
          </div>

          <div className="w-px h-5 bg-outline-variant/30 mx-1" />

          {/* Highlight Presets */}
          <div className="flex items-center gap-1.5 px-1">
            <button
              onClick={() =>
                editor.chain().focus().unsetMark("highlight").run()
              }
              className="p-1 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all"
              title="No Highlight"
            >
              <Highlighter className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleMark("highlight", { color: "#fef08a" })
                  .run()
              } // Yellow
              className="w-5 h-5 rounded bg-yellow-200 border border-black/5 hover:scale-110 transition-transform"
              title="Highlight Yellow"
            />
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleMark("highlight", { color: "#bbf7d0" })
                  .run()
              } // Green
              className="w-5 h-5 rounded bg-green-200 border border-black/5 hover:scale-110 transition-transform"
              title="Highlight Green"
            />
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleMark("highlight", { color: "#bfdbfe" })
                  .run()
              } // Blue
              className="w-5 h-5 rounded bg-blue-200 border border-black/5 hover:scale-110 transition-transform"
              title="Highlight Blue"
            />
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleMark("highlight", { color: "#fbcfe8" })
                  .run()
              } // Pink
              className="w-5 h-5 rounded bg-pink-200 border border-black/5 hover:scale-110 transition-transform"
              title="Highlight Pink"
            />
          </div>

          <div className="w-px h-5 bg-outline-variant/30 mx-1" />

          <button
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
            title="Clear All Formatting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />

      <MediaDialog
        isOpen={isMediaDialogOpen}
        onClose={() => setIsMediaDialogOpen(false)}
        onUpload={handleUpload}
        onInsert={handleInsertMedia}
      />
    </div>
  );
}
