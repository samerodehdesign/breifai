import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { STATUS_CONFIG } from '@/lib/types'

export default async function BriefsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: briefs } = await supabase
    .from('briefs').select('*, clients(name)')
    .eq('user_id', user!.id).order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]">My Briefs</h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">{briefs?.length || 0} briefs total</p>
        </div>
        <Link href="/briefs/new" className="btn-primary">+ New Brief</Link>
      </div>

      {!briefs?.length ? (
        <div className="card flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-2xl mb-4">✦</div>
          <h2 className="font-bold text-[#0A0A0A] mb-2">Your canvas is ready</h2>
          <p className="text-sm text-[#6B6B6B] mb-6 max-w-xs">Create your first brief and let AI handle the heavy lifting of structuring client discovery.</p>
          <Link href="/briefs/new" className="btn-primary">✦ Create First Brief</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[1fr_160px_120px_100px_80px] gap-4 px-6 py-3 border-b border-[#F5F5F5] text-xs font-semibold text-[#B3B3B3]">
            <span>Project</span><span>Client</span><span>Status</span><span>Date</span><span></span>
          </div>
          {briefs.map(brief => {
            const cfg = STATUS_CONFIG[brief.status as keyof typeof STATUS_CONFIG]
            return (
              <div key={brief.id} className="grid grid-cols-[1fr_160px_120px_100px_80px] gap-4 px-6 py-4 border-b border-[#F5F5F5] last:border-0 items-center hover:bg-[#F5F5F5] transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#0A0A0A]">{brief.title}</p>
                  {brief.ai_enhanced && <span className="text-xs text-[#B3B3B3]">✦ AI Enhanced</span>}
                </div>
                <p className="text-sm text-[#6B6B6B]">{(brief as any).clients?.name || '—'}</p>
                <span className={`status-badge w-fit ${cfg?.color}`}>{cfg?.label}</span>
                <p className="text-xs text-[#B3B3B3]">{formatDate(brief.created_at)}</p>
                <Link href={`/briefs/${brief.id}`} className="text-xs font-semibold text-[#0A0A0A] hover:underline">View →</Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
