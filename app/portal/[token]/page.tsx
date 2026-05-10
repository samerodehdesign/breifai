'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Brief } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function ClientPortalPage() {
  const { token } = useParams()
  const supabase = createClient()
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [approved, setApproved] = useState(false)
  const [comments, setComments] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('briefs').select('*, clients(name)').eq('share_token', token).eq('share_enabled', true).single()
      setBrief(data)
      if (data) {
        const { data: comms } = await supabase.from('brief_comments').select('*').eq('brief_id', data.id).order('created_at')
        setComments(comms || [])
        setApproved(data.status === 'approved')
      }
      setLoading(false)
    }
    load()
  }, [token])

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!brief || !comment || !name) return
    setSubmitting(true)
    await supabase.from('brief_comments').insert({ brief_id: brief.id, author_name: name, author_email: email, content: comment, is_client: true })
    setComments(p => [...p, { author_name: name, content: comment, created_at: new Date().toISOString() }])
    setComment('')
    setSubmitting(false)
    setSubmitted(true)
  }

  async function approveBrief() {
    if (!brief) return
    await supabase.from('briefs').update({ status: 'approved' }).eq('id', brief.id)
    setApproved(true)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )

  if (!brief) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-center px-6">
      <p className="text-8xl font-black text-white/10 mb-4">404</p>
      <h1 className="text-2xl font-black text-white mb-2">Brief not found</h1>
      <p className="text-[#6B6B6B]">This link may be invalid or the brief is no longer shared.</p>
    </div>
  )

  const sections = Array.isArray(brief.sections) ? brief.sections : []

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Nav */}
      <nav className="bg-[#0A0A0A] border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#0A0A0A] font-black text-xs">B</span>
            </div>
            <span className="text-white font-extrabold">BriefAI</span>
          </div>
          <span className="text-[#6B6B6B] text-sm hidden md:block">Shared by designer</span>
          {!approved ? (
            <button onClick={approveBrief} className="bg-white text-[#0A0A0A] font-semibold text-sm px-4 py-2 rounded-xl hover:bg-[#F5F5F5] transition-colors">
              ✓ Approve Brief
            </button>
          ) : (
            <span className="bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-2 rounded-xl">✓ Approved</span>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 mb-8">
          <p className="text-[#6B6B6B] text-xs font-semibold mb-2 uppercase tracking-wider">Design Brief</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{brief.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[#6B6B6B] flex-wrap">
            {(brief as any).clients?.name && <span>👤 {(brief as any).clients.name}</span>}
            {brief.budget && <span>💰 {brief.budget}</span>}
            <span>📅 {formatDate(brief.created_at)}</span>
            <span>{sections.length} sections</span>
            {brief.ai_enhanced && <span className="text-[#6B6B6B]">✦ AI Enhanced</span>}
          </div>
        </div>

        {/* Approved Banner */}
        {approved && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-8 text-center">
            <p className="text-green-400 font-semibold">✓ You approved this brief</p>
            <p className="text-[#6B6B6B] text-sm mt-1">The designer has been notified.</p>
          </div>
        )}

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sections.map((section: any, i: number) => (
            <div key={section.id || i} className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#6B6B6B] text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-bold text-white text-sm">{section.title}</h3>
              </div>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Comments */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-5">💬 Comments & Feedback</h2>
          {comments.length > 0 && (
            <div className="space-y-4 mb-6">
              {comments.map((c, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{c.author_name[0]}</span>
                    </div>
                    <span className="text-white text-xs font-semibold">{c.author_name}</span>
                    <span className="text-[#6B6B6B] text-xs">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-[#B3B3B3] text-sm">{c.content}</p>
                </div>
              ))}
            </div>
          )}
          {submitted ? (
            <div className="text-center py-6">
              <p className="text-green-400 font-semibold">✓ Comment sent</p>
              <p className="text-[#6B6B6B] text-sm mt-1">The designer will be notified.</p>
            </div>
          ) : (
            <form onSubmit={submitComment} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Your name *" value={name} onChange={e => setName(e.target.value)} required />
                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Email (optional)" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-white/20 transition-colors resize-none h-24"
                placeholder="Leave a comment or request a revision..." value={comment} onChange={e => setComment(e.target.value)} required />
              <button type="submit" disabled={submitting} className="bg-white text-[#0A0A0A] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#F5F5F5] transition-colors disabled:opacity-50">
                {submitting ? 'Sending...' : 'Send Comment'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-[#404040]">Powered by <a href="/" className="hover:text-[#6B6B6B] transition-colors">BriefAI</a></p>
      </div>
    </div>
  )
}
