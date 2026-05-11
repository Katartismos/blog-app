/**
 * Tiptap Rich Text Editor Component
 * 
 * Provides a WYSIWYG editing experience for blog posts.
 * Includes:
 * - StarterKit (bold, italic, headings, lists, etc.)
 * - Underline extension
 * - Placeholder extension
 * - Custom toolbar for formatting actions
 * - Real-time HTML updates via onChange callback
 */

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

interface TiptapEditorProps {
  onChange: (html: string) => void; // Function to bubble up the HTML content to the parent form
}

/**
 * ToolbarButton Component
 * 
 * A reusable sub-component for the editor's toolbar buttons.
 */
type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, isActive, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors duration-150 cursor-pointer ${
        isActive
          ? 'bg-amber-700 text-white'
          : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * ToolbarDivider Component
 */
function ToolbarDivider() {
  return <span className="w-px h-5 bg-gray-300 mx-1 self-center" />;
}

export default function TiptapEditor({ onChange }: TiptapEditorProps) {
  // Initialize the Tiptap editor with extensions and configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }, // Restrict headings to levels 1-3
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Write your blog post content here...',
      }),
    ],
    editorProps: {
      attributes: {
        // Tailwind classes for the editable area
        class:
          'min-h-[300px] px-4 py-3 text-gray-800 focus:outline-none leading-relaxed',
      },
    },
    // Trigger the callback whenever the content changes
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Don't render if the editor instance isn't ready
  if (!editor) return null;

  return (
    <div className="rounded-lg border border-gray-300 focus-within:ring-1 focus-within:ring-amber-700 focus-within:border-amber-700 transition duration-150 overflow-hidden bg-white">
      
      {/* Editor Toolbar: Contains all formatting controls */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-gray-200 bg-gray-50">
        
        {/* Text Style Controls */}
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        >
          <span style={{ textDecoration: 'underline' }}>U</span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Heading Level Controls */}
        <ToolbarButton
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
        >
          H3
        </ToolbarButton>

        <ToolbarDivider />

        {/* List Type Controls */}
        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          1. List
        </ToolbarButton>

        <ToolbarDivider />

        {/* Semantic/Structural Block Controls */}
        <ToolbarButton
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          &ldquo; Quote
        </ToolbarButton>
        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ── Rule
        </ToolbarButton>

        <ToolbarDivider />

        {/* History Management */}
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↩ Undo
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↪ Redo
        </ToolbarButton>
      </div>

      {/* Actual Editable Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
