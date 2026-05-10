'use client'
import { useEffect, useRef, useState } from 'react'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

const TOOLS = [
  { cmd: 'bold', icon: 'B', title: 'Bold', style: 'font-bold' },
  { cmd: 'italic', icon: 'I', title: 'Italic', style: 'italic' },
  { cmd: 'underline', icon: 'U', title: 'Underline', style: 'underline' },
]

export default function RichEditor({ value, onChange, placeholder = 'Start writing...' }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEmpty, setIsEmpty] = useState(!value)

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value
      setIsEmpty(false)
    }
  }, [])

  function exec(cmd: string, val?: string) {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    handleInput()
  }

  function handleInput() {
    const html = editorRef.current?.innerHTML || ''
    const text = editorRef.current?.innerText || ''
    setIsEmpty(!text.trim())
    onChange(html)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault()
      exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
    }
  }

  function insertHeading(level: 'h2' | 'h3') {
    exec('formatBlock', level)
  }

  function insertList() {
    exec('insertUnorderedList')
  }

  function insertQuote() {
    exec('formatBlock', 'blockquote')
  }

  function insertDivider() {
    exec('insertHTML', '<hr/><p><br></p>')
  }

  function insertLink() {
    const url = prompt('Enter URL:')
    if (url) exec('createLink', url)
  }

  return (
    <div className="border border-[#E0E0E0] rounded-2xl overflow-hidden focus-within:border-[#0A0A0A] focus-within:ring-2 focus-within:ring-[#0A0A0A]/8 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-4 py-3 border-b border-[#E0E0E0] bg-[#F5F5F5] flex-wrap">
        {TOOLS.map(t => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            onMouseDown={e => { e.preventDefault(); exec(t.cmd) }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors"
          >
            <span className={t.style}>{t.icon}</span>
          </button>
        ))}

        <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

        <button type="button" title="Heading 2" onMouseDown={e => { e.preventDefault(); insertHeading('h2') }}
          className="px-2 h-8 rounded-lg text-xs font-bold text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors">H2</button>
        <button type="button" title="Heading 3" onMouseDown={e => { e.preventDefault(); insertHeading('h3') }}
          className="px-2 h-8 rounded-lg text-xs font-bold text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors">H3</button>

        <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

        <button type="button" title="Bullet list" onMouseDown={e => { e.preventDefault(); insertList() }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors text-sm">≡</button>
        <button type="button" title="Blockquote" onMouseDown={e => { e.preventDefault(); insertQuote() }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors text-sm">&ldquo;</button>
        <button type="button" title="Link" onMouseDown={e => { e.preventDefault(); insertLink() }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors text-sm">🔗</button>
        <button type="button" title="Divider" onMouseDown={e => { e.preventDefault(); insertDivider() }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors text-sm">—</button>

        <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

        <button type="button" title="Clear formatting" onMouseDown={e => { e.preventDefault(); exec('removeFormat') }}
          className="px-2 h-8 rounded-lg text-xs text-[#6B6B6B] hover:bg-white hover:text-[#0A0A0A] transition-colors">Clear</button>
      </div>

      {/* Editor area */}
      <div className="relative min-h-[480px]">
        {isEmpty && (
          <p className="absolute top-6 left-6 text-[#B3B3B3] text-base pointer-events-none select-none">{placeholder}</p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsEmpty(false)}
          onBlur={() => setIsEmpty(!(editorRef.current?.innerText?.trim()))}
          className="min-h-[480px] p-6 text-[#0A0A0A] text-base leading-relaxed outline-none rich-editor-content"
          style={{ wordBreak: 'break-word' }}
        />
      </div>

      <style>{`
        .rich-editor-content h2 { font-size: 1.4rem; font-weight: 900; color: #0A0A0A; margin: 1.5rem 0 0.75rem; }
        .rich-editor-content h3 { font-size: 1.15rem; font-weight: 700; color: #0A0A0A; margin: 1.25rem 0 0.5rem; }
        .rich-editor-content p { margin-bottom: 0.75rem; }
        .rich-editor-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
        .rich-editor-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
        .rich-editor-content li { margin-bottom: 0.35rem; }
        .rich-editor-content blockquote { border-left: 3px solid #0A0A0A; padding-left: 1rem; margin: 1rem 0; color: #6B6B6B; font-style: italic; }
        .rich-editor-content a { color: #0A0A0A; text-decoration: underline; }
        .rich-editor-content hr { border: none; border-top: 1px solid #E0E0E0; margin: 1.5rem 0; }
        .rich-editor-content strong { font-weight: 700; }
        .rich-editor-content em { font-style: italic; }
      `}</style>
    </div>
  )
}
