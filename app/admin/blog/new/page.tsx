'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import RichEditor from '@/components/blog/RichEditor'

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function NewArticlePage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Samer Odeh',
    category: '',
    read_time: 5,
    status: 'draft' as 'draft' | 'published',
  })

  function update(k: string, v: any) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function handleTitleChange(title: string) {
    update('title', title)
    if (!form.slug || form.slug === slugify(form.title)) {
      update('slug', slugify(title))
    }
  }

  async function save(status: 'draft' | 'published') {
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.slug.trim()) { setError('Slug is required'); return }
    if (!form.content.trim()) { setError('Content cannot be empty'); return }

    setSaving(true)
    setError('')

    try {
      const payload: any = { ...form, status }
      if (status === 'published') payload.published_at = new Date().toISOString()

      const { data, error: err } = await supabase
        .from('posts')
        .insert(payload)
        .select('id')
        .single()

      if (err) throw err
      router.push(`/admin/blog/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to save article')
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">← Blog</Link>
          <span className="text-[#E0E0E0]">/</span>
          <span className="text-sm font-semibold text-[#0A0A0A]">New Article</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => save('draft')} disabled={saving}
            className="btn-secondary text-sm">
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => save('published')} disabled={saving}
            className="btn-primary text-sm">
            {saving ? 'Publishing...' : 'Publish →'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="label">Article Title *</label>
          <input className="input text-xl font-bold" placeholder="How to write a brief that gets approved..."
            value={form.title} onChange={e => handleTitleChange(e.target.value)} />
        </div>

        {/* Slug */}
        <div>
          <label className="label">URL Slug *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#B3B3B3] shrink-0">breifai.vercel.app/blog/</span>
            <input className="input flex-1" placeholder="how-to-write-brief-that-gets-approved"
              value={form.slug} onChange={e => update('slug', slugify(e.target.value))} />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="label">Excerpt</label>
          <textarea className="input resize-none h-20"
            placeholder="A short description that appears in the blog index and SEO preview..."
            value={form.excerpt} onChange={e => update('excerpt', e.target.value)} />
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => update('category', e.target.value)}>
              <option value="">Select category</option>
              {['Strategy', 'Process', 'Business', 'Design', 'Tools', 'MENA'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Read Time (minutes)</label>
            <input className="input" type="number" min={1} max={60}
              value={form.read_time} onChange={e => update('read_time', parseInt(e.target.value) || 5)} />
          </div>
          <div>
            <label className="label">Author</label>
            <input className="input" value={form.author}
              onChange={e => update('author', e.target.value)} />
          </div>
        </div>

        {/* Rich editor */}
        <div>
          <label className="label">Content *</label>
          <RichEditor
            value={form.content}
            onChange={v => update('content', v)}
            placeholder="Start writing your article... Use the toolbar above to format text."
          />
        </div>

        {/* Preview */}
        {form.content && (
          <div className="card p-6">
            <p className="text-xs font-semibold text-[#B3B3B3] mb-4 uppercase tracking-wider">Content Preview</p>
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: form.content }} />
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E0E0E0]">
          <Link href="/admin/blog" className="btn-secondary text-sm">Discard</Link>
          <div className="flex items-center gap-2">
            <button onClick={() => save('draft')} disabled={saving} className="btn-secondary text-sm">Save Draft</button>
            <button onClick={() => save('published')} disabled={saving} className="btn-primary text-sm">
              {saving ? 'Publishing...' : '✓ Publish Article'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .prose-content h2 { font-size: 1.4rem; font-weight: 900; color: #0A0A0A; margin: 1.5rem 0 0.75rem; }
        .prose-content h3 { font-size: 1.15rem; font-weight: 700; color: #0A0A0A; margin: 1.25rem 0 0.5rem; }
        .prose-content p { margin-bottom: 0.75rem; line-height: 1.8; color: #404040; }
        .prose-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
        .prose-content li { margin-bottom: 0.35rem; color: #404040; }
        .prose-content blockquote { border-left: 3px solid #0A0A0A; padding-left: 1rem; margin: 1rem 0; color: #6B6B6B; font-style: italic; }
        .prose-content strong { font-weight: 700; }
      `}</style>
    </div>
  )
}
