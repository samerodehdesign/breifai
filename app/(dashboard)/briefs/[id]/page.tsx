'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Brief, STATUS_CONFIG } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function BriefDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('briefs').select('*, clients(*)').eq('id', id).single()
      setBrief(data)
      setLoading(false)
    }
    load()
  }, [id])

  async function toggleShare() {
    if (!brief) return
    setSharing(true)
    const newVal = !brief.share_enabled
    await supabase.from('briefs').update({ share_enabled: newVal }).eq('id', brief.id)
    setBrief(p => p ? { ...p, share_enabled: newVal } : p)
    setSharing(false)
  }

  async function copyLink() {
    if (!brief) return
    const url = `${window.location.origin}/portal/${brief.share_token}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function deleteBrief() {
    if (!brief || !confirm('Delete this brief? This cannot be undone.')) return
    await supabase.from('briefs').delete().eq('id', brief.id)
    router.push('/briefs')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-[#E0E0E0] border-t-[#0A0A0A] rounded-full animate-spin" />
    </div>
  )

  if (!brief) return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-6xl font-black text-[#F5F5F5] mb-4">404</p>
      <h2 className="font-bold text-[#0A0A0A] mb-2">Brief not found</h2>
      <p className="text-sm text-[#6B6B6B] mb-6">This brief may have been deleted or moved.</p>
      <Link href="/briefs" className="btn-primary">← Back to Briefs</Link>
    </div>
  )

  const cfg = STATUS_CONFIG[brief.status]
  const sections = Array.isArray(brief.sections) ? brief.sections : []

  return (
    <div className="p-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#B3B3B3] mb-6">
        <Link href="/briefs" className="hover:text-[#0A0A0A]">My Briefs</Link>
        <span>/</span>
        <span className="text-[#6B6B6B]">{brief.title}</span>
      </div>

      {/* Hero Card */}
      <div className="card p-8 mb-6">
        <div className="h-1 bg-[#0A0A0A] rounded-full -mt-8 -mx-8 mb-8 rounded-t-2xl" />
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`status-badge ${cfg?.color}`}>{cfg?.label}</span>
              {brief.ai_enhanced && <span className="status-badge bg-[#0A0A0A] text-white">✦ AI Enhanced</span>}
            </div>
            <h1 className="text-3xl font-black text-[#0A0A0A] mb-4">{brief.title}</h1>
            <div className="flex items-center gap-6 text-sm text-[#6B6B6B] flex-wrap">
              {(brief as any).clients?.name && <span>👤 {(brief as any).clients.name}</span>}
              {brief.budget && <span>💰 {brief.budget}</span>}
              {brief.deadline && <span>📅 {formatDate(brief.deadline)}</span>}
              <span>Created {formatDate(brief.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={copyLink} className="btn-secondary text-xs py-2 px-3">
              {copied ? '✓ Copied!' : '↗ Copy Link'}
            </button>
            <button onClick={toggleShare} disabled={sharing}
              className={`text-xs py-2 px-3 rounded-xl font-semibold transition-all ${brief.share_enabled ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'btn-secondary'}`}>
              {sharing ? '...' : brief.share_enabled ? '● Live' : 'Share'}
            </button>
            <button onClick={deleteBrief} className="text-xs py-2 px-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all">
              Delete
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B6B6B]">{sections.length} of {sections.length} sections complete</span>
            <span className="text-xs text-[#B3B3B3]">100%</span>
          </div>
          <div className="w-full bg-[#F5F5F5] rounded-full h-1.5">
            <div className="bg-[#0A0A0A] h-1.5 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Share Banner */}
      {brief.share_enabled && (
        <div className="card p-4 mb-6 flex items-center gap-4 bg-[#F5F5F5]">
          <span className="text-green-500 font-bold text-sm">● Live</span>
          <p className="text-sm text-[#6B6B6B] flex-1">Client portal is active. Share this link:</p>
          <code className="text-xs bg-white border border-[#E0E0E0] rounded-lg px-3 py-1.5 text-[#0A0A0A] flex-1 truncate">
            {typeof window !== 'undefined' ? `${window.location.origin}/portal/${brief.share_token}` : ''}
          </code>
          <button onClick={copyLink} className="btn-primary text-xs py-2 px-3 shrink-0">
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      )}

      {/* Brief Sections */}
      {sections.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[#B3B3B3] text-sm">No sections yet. This brief is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section: any, i: number) => (
            <div key={section.id || i} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold text-[#6B6B6B]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-bold text-[#0A0A0A]">{section.title}</h3>
              </div>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI Insight */}
      <div className="mt-6 bg-[#0A0A0A] rounded-2xl p-6 flex items-start gap-4">
        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white">✦</span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-1">AI Insight</p>
          <p className="text-[#6B6B6B] text-sm">Your brief is structured and comprehensive. Consider adding visual reference examples to strengthen alignment with your client before sharing.</p>
        </div>
      </div>
    </div>
  )
}
