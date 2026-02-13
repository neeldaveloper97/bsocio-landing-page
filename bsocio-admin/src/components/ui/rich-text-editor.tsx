"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  limit?: number;
  minHeight?: string;
}

// Toolbar button component with proper event handling
interface ToolbarButtonProps {
  onAction: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function ToolbarButton({ onAction, isActive, disabled, title, children, className }: ToolbarButtonProps) {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent focus loss from editor
    e.stopPropagation();
    // Execute action on mousedown to prevent any default behaviors
    onAction();
  }, [onAction]);

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      disabled={disabled}
      title={title}
      aria-label={title}
      data-active={isActive ? "true" : "false"}
      className={cn(
        "h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border-0 select-none",
        "hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-blue-600 text-white hover:bg-blue-700" 
          : "bg-transparent text-gray-700",
        className
      )}
      style={isActive ? { backgroundColor: '#2563eb', color: 'white' } : undefined}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  className,
  limit = 10000,
  minHeight = '250px'
}: RichTextEditorProps) {
  // Track active states explicitly for proper re-rendering
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    strike: false,
    h1: false,
    h2: false,
    h3: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  });

  const updateActiveStates = useCallback((editor: ReturnType<typeof useEditor>) => {
    if (!editor) return;
    setActiveStates({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      strike: editor.isActive('strike'),
      h1: editor.isActive('heading', { level: 1 }),
      h2: editor.isActive('heading', { level: 2 }),
      h3: editor.isActive('heading', { level: 3 }),
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
      blockquote: editor.isActive('blockquote'),
      alignLeft: editor.isActive({ textAlign: 'left' }),
      alignCenter: editor.isActive({ textAlign: 'center' }),
      alignRight: editor.isActive({ textAlign: 'right' }),
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        // Disable hardBreak to prevent extra line breaks
        hardBreak: false,
        // Configure paragraph to not add extra breaks
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      updateActiveStates(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateActiveStates(editor);
    },
    onTransaction: ({ editor }) => {
      updateActiveStates(editor);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[250px] p-4 cursor-text',
      },
    },
    immediatelyRender: false,
  });

  // Update active states when editor is ready
  useEffect(() => {
    if (editor) {
      updateActiveStates(editor);
    }
  }, [editor, updateActiveStates]);

  // Sync external value changes to editor
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.getHTML();
      // Only update if the external value is different from editor content
      // This prevents cursor jumping during typing
      if (value !== currentContent) {
        editor.commands.setContent(value);
      }
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const isOverLimit = characterCount > limit;

  return (
    <div className={cn("rich-text-editor-wrapper border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden w-full max-h-[600px] flex flex-col", className)}>
      {/* Toolbar - Sticky */}
      <div className="flex flex-wrap items-center gap-1 p-2 sm:p-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 flex-shrink-0">
        {/* History */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onAction={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleBold().run()}
            isActive={activeStates.bold}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleItalic().run()}
            isActive={activeStates.italic}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleStrike().run()}
            isActive={activeStates.strike}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={activeStates.h1}
            title="Heading 1"
            className="w-auto px-2"
          >
            <Heading1 className="h-4 w-4 mr-1" />
            <span className="text-xs">H1</span>
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={activeStates.h2}
            title="Heading 2"
            className="w-auto px-2"
          >
            <Heading2 className="h-4 w-4 mr-1" />
            <span className="text-xs">H2</span>
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={activeStates.h3}
            title="Heading 3"
            className="w-auto px-2"
          >
            <Heading3 className="h-4 w-4 mr-1" />
            <span className="text-xs">H3</span>
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleBulletList().run()}
            isActive={activeStates.bulletList}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={activeStates.orderedList}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={activeStates.blockquote}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onAction={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={activeStates.alignLeft}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={activeStates.alignCenter}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onAction={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={activeStates.alignRight}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div className="w-full flex-1 overflow-y-auto" role="textbox" aria-label="Rich text editor" aria-multiline="true">
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none [&_.ProseMirror]:cursor-text"
          style={{ minHeight }}
        />
      </div>

      {/* Character Count - sticky footer */}
      {limit && (
        <div className="flex justify-end px-3 py-1.5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <span aria-live="polite" className={cn("text-[10px] sm:text-xs", isOverLimit ? "text-red-500 font-medium" : "text-gray-500")}>
            {characterCount}/{limit}
            {isOverLimit && <span className="ml-1">Limit!</span>}
          </span>
        </div>
      )}
    </div>
  );
}