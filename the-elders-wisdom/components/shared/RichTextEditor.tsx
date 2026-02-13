'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'allow-select',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-leather rounded-lg overflow-hidden shadow-inset-deep">
      {/* Toolbar */}
      <div className="leather-bg border-b-2 border-leather-dark p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('bold') ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Bold"
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('italic') ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Italic"
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('underline') ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Underline"
          type="button"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-leather-dark mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Heading 2"
          type="button"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Heading 3"
          type="button"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-leather-dark mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('bulletList') ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Bullet List"
          type="button"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('orderedList') ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Numbered List"
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive('blockquote') ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Quote"
          type="button"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-leather-dark mx-1" />

        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Align Left"
          type="button"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Align Center"
          type="button"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-leather-light transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-leather-light text-gold' : 'text-parchment'
          }`}
          title="Align Right"
          type="button"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  );
}
