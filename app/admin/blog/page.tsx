'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function AdminBlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, status, category, read_time, created_at, published_at')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleStatus(id: string, current: string) {
    const newStatus = current === 'published' ? 'draft' : 'published'
    const updates: any = { status: newStatus }
    if (newStatus === 'published') updates.published_at = new Date().toISOString()
    await supabase.from('posts').update(updates).eq('id', id)
    load()
  }

  async function deletePost(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await supabase.from('posts').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]">Blog</h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">{posts.length} articles total</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/blog" target="_blank" className="btn-secondary text-sm">View Blog ↗</Link>
          <Link href="/admin/blog/new" className="btn-primary">+ New Article</Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E0E0E0] border-t-[#0A0A0A] rounded-full animate-spin" />
        </div>
      ) : !posts.length ? (
        <div className="card flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-2xl mb-4">✍️</div>
          <h2 className="font-bold text-[#0A0A0A] mb-2">No articles yet</h2>
          <p className="text-sm text-[#6B6B6B] mb-6">Write your first article to attract designers to BriefAI.</p>
          <Link href="/admin/blog/new" className="btn-primary">Write First Article</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_100px_120px_140px] gap-4 px-6 py-3 border-b border-[#F5F5F5] text-xs font-semibold text-[#B3B3B3]">
            <span>Title</span>
            <span>Category</span>
            <span>Read time</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {posts.map(post => (
            <div key={post.id} className="grid grid-cols-[1fr_120px_100px_120px_140px] gap-4 px-6 py-4 border-b border-[#F5F5F5] last:border-0 items-center hover:bg-[#F5F5F5] transition-colors">
              <div>
                <p className="text-sm font-semibold text-[#0A0A0A] truncate">{post.title}</p>
                <p className="text-xs text-[#B3B3B3] mt-0.5">{formatDate(post.created_at)}</p>
              </div>
              <p className="text-sm text-[#6B6B6B]">{post.category || '—'}</p>
              <p className="text-sm text-[#6B6B6B]">{post.read_time} min</p>
              <button
                onClick={() => toggleStatus(post.id, post.status)}
                className={`w-fit px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  post.status === 'published'
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    : 'bg-[#F5F5F5] text-[#6B6B6B] border border-[#E0E0E0] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                }`}
              >
                {post.status === 'published' ? '● Published' : '○ Draft'}
              </button>
              <div className="flex items-center gap-2">
                <Link href={`/admin/blog/${post.id}`} className="text-xs font-semibold text-[#0A0A0A] hover:underline">Edit</Link>
                <span className="text-[#E0E0E0]">·</span>
                <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A]">View ↗</Link>
                <span className="text-[#E0E0E0]">·</span>
                <button
                  onClick={() => deletePost(post.id, post.title)}
                  disabled={deleting === post.id}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  {deleting === post.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {posts.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total Articles', value: posts.length },
            { label: 'Published', value: posts.filter(p => p.status === 'published').length },
            { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <p className="text-xs text-[#6B6B6B]">{s.label}</p>
              <p className="text-2xl font-black text-[#0A0A0A] mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
