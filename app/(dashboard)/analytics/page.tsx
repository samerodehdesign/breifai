import { createClient } from '@/lib/supabase/server'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: briefs }, { data: clients }] = await Promise.all([
    supabase.from('briefs').select('status, created_at, ai_enhanced').eq('user_id', user!.id),
    supabase.from('clients').select('id, created_at').eq('user_id', user!.id),
  ])

  const total = briefs?.length || 0
  const approved = briefs?.filter(b => b.status === 'approved').length || 0
  const aiEnhanced = briefs?.filter(b => b.ai_enhanced).length || 0
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0
  const timeSaved = aiEnhanced * 4

  const statusCounts = {
    draft: briefs?.filter(b => b.status === 'draft').length || 0,
    in_progress: briefs?.filter(b => b.status === 'in_progress').length || 0,
    completed: briefs?.filter(b => b.status === 'completed').length || 0,
    approved: approved,
  }

  const kpis = [
    { label: 'Total Briefs', value: total, change: 'All time', color: 'bg-[#0A0A0A]' },
    { label: 'Active Clients', value: clients?.length || 0, change: 'In workspace', color: 'bg-[#1A6B4A]' },
    { label: 'Hours Saved', value: `${timeSaved}h`, change: 'vs manual briefs', color: 'bg-[#1A1A6B]' },
    { label: 'Approval Rate', value: `${approvalRate}%`, change: 'Client approvals', color: 'bg-[#6B4E1A]' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]">Analytics</h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">Performance insights & business intelligence</p>
        </div>
        <div className="bg-white border border-[#E0E0E0] rounded-xl px-4 py-2 text-sm text-[#6B6B6B]">📅 All time</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="card p-6 overflow-hidden relative">
            <div className={`absolute top-0 left-0 right-0 h-1 ${k.color} rounded-t-2xl`} />
            <p className="text-xs text-[#6B6B6B] mt-1 mb-2">{k.label}</p>
            <p className="text-4xl font-black text-[#0A0A0A]">{k.value}</p>
            <p className="text-xs text-[#B3B3B3] mt-2">{k.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brief Status Breakdown */}
        <div className="card p-6">
          <h2 className="font-bold text-[#0A0A0A] mb-6">Brief Status Breakdown</h2>
          {total === 0 ? (
            <div className="text-center py-8 text-[#B3B3B3] text-sm">No briefs yet</div>
          ) : (
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                const labels: Record<string, string> = { draft: 'Draft', in_progress: 'In Progress', completed: 'Completed', approved: 'Approved' }
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-[#0A0A0A]">{labels[status]}</span>
                      <span className="text-sm font-bold text-[#0A0A0A]">{count}</span>
                    </div>
                    <div className="w-full bg-[#F5F5F5] rounded-full h-2">
                      <div className="bg-[#0A0A0A] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-[#B3B3B3] mt-1">{pct}%</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* AI Impact */}
        <div className="card p-6 bg-[#0A0A0A]">
          <h2 className="font-bold text-white mb-2">⏱ Time Saved with AI</h2>
          <p className="text-[#6B6B6B] text-sm mb-6">Based on {aiEnhanced} AI-generated briefs</p>
          <p className="text-7xl font-black text-white mb-2">{timeSaved}h</p>
          <p className="text-[#6B6B6B] text-sm mb-6">saved vs manual brief creation</p>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-white text-sm font-semibold">≈ ${timeSaved * 50} equivalent</p>
            <p className="text-[#6B6B6B] text-xs mt-1">in billable designer hours</p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-bold text-[#0A0A0A] mb-5">✦ AI Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🎯', text: `Your approval rate is ${approvalRate}% — keep up the great work with structured briefs.` },
              { icon: '⚡', text: `${aiEnhanced} of your ${total} briefs were AI-enhanced — that's ${aiEnhanced > 0 ? Math.round((aiEnhanced/Math.max(total,1))*100) : 0}% AI-powered.` },
              { icon: '💡', text: 'Consider sharing your briefs with clients for faster approval and reduced revision cycles.' },
            ].map((ins, i) => (
              <div key={i} className="bg-[#F5F5F5] rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0">{ins.icon}</span>
                <p className="text-sm text-[#0A0A0A] leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
