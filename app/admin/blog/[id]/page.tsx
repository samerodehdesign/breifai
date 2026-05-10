'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import RichEditor from '@/components/blog/RichEditor'

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function EditArticlePage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    author: 'Samer Odeh', category: '', read_time: 5,
    status: 'draft' as 'draft' | 'published',
  })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single()
      if (data) {
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          author: data.author || 'Samer Odeh',
          category: data.category || '',
          read_time: data.read_time || 5,
          status: data.status || 'draft',
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  function update(k: string, v: any) { setForm(p => ({ ...p, [k]: v })) }

  async function save(status?: 'draft' | 'published') {
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')

    try {
      const payload: any = { ...form, status: status || form.status }
      if (status === 'published' && form.status !== 'published') {
        payload.published_at = new Date().toISOString()
      }

      const { error: err } = await supabase.from('posts').update(payload).eq('id', id)
      if (err) throw err
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (status) setForm(p => ({ ...p, status: status }))
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function deletePost() {
    if (!confirm('Delete this article permanently?')) return
    await supabase.from('posts').delete().eq('id', id)
    router.push('/admin/blog')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-[#E0E0E0] border-t-[#0A0A0A] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">← Blog</Link>
          <span className="text-[#E0E0E0]">/</span>
          <span className="text-sm font-semibold text-[#0A0A0A] truncate max-w-xs">{form.title || 'Edit Article'}</span>
        </div>
        <div className="flex items-center gap-2">
          {form.status === 'published' && (
            <Link href={`/blog/${form.slug}`} target="_blank" className="btn-secondary text-sm">View ↗</Link>
          )}
          <button onClick={deletePost} className="text-sm text-red-400 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors">Delete</button>
          <button onClick={() => save()} disabled={saving} className="btn-secondary text-sm">
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
          </button>
          {form.status === 'draft' ? (
            <button onClick={() => save('published')} disabled={saving} className="btn-primary text-sm">Publish →</button>
          ) : (
            <button onClick={() => save('draft')} disabled={saving} className="text-sm text-[#6B6B6B] border border-[#E0E0E0] px-4 py-2 rounded-xl hover:bg-[#F5F5F5] transition-colors">
              Unpublish
            </button>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl mb-6 w-fit text-sm font-semibold ${form.status === 'published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#F5F5F5] text-[#6B6B6B] border border-[#E0E0E0]'}`}>
        <span>{form.status === 'published' ? '● Published' : '○ Draft'}</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
      )}

      <div className="space-y-6">
        <div>
          <label className="label">Article Title *</label>
          <input className="input text-xl font-bold" value={form.title}
            onChange={e => update('title', e.target.value)} />
        </div>

        <div>
          <label className="label">URL Slug</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#B3B3B3] shrink-0">breifai.vercel.app/blog/</span>
            <input className="input flex-1" value={form.slug}
              onChange={e => update('slug', slugify(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="label">Excerpt</label>
          <textarea className="input resize-none h-20" value={form.excerpt}
            onChange={e => update('excerpt', e.target.value)} />
        </div>

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
            <label className="label">Read Time (min)</label>
            <input className="input" type="number" min={1} max={60} value={form.read_time}
              onChange={e => update('read_time', parseInt(e.target.value) || 5)} />
          </div>
          <div>
            <label className="label">Author</label>
            <input className="input" value={form.author} onChange={e => update('author', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Content *</label>
          <RichEditor value={form.content} onChange={v => update('content', v)} />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#E0E0E0]">
          <button onClick={deletePost} className="text-sm text-red-400 hover:text-red-600 transition-colors">Delete Article</button>
          <div className="flex items-center gap-2">
            <button onClick={() => save()} disabled={saving} className="btn-secondary text-sm">
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </button>
            {form.status === 'draft' && (
              <button onClick={() => save('published')} disabled={saving} className="btn-primary text-sm">✓ Publish</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
