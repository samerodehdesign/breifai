import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { STATUS_CONFIG } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: briefs }, { data: clients }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('briefs').select('*, clients(name)').eq('user_id', user!.id).order('updated_at', { ascending: false }).limit(5),
    supabase.from('clients').select('*').eq('user_id', user!.id).limit(5),
  ])

  const totalBriefs = briefs?.length || 0
  const totalClients = clients?.length || 0
  const approvedBriefs = briefs?.filter(b => b.status === 'approved').length || 0
  const approvalRate = totalBriefs > 0 ? Math.round((approvedBriefs / totalBriefs) * 100) : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]">{greeting}, {firstName} ✦</h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">Here&apos;s what&apos;s happening with your briefs today.</p>
        </div>
        <Link href="/briefs/new" className="btn-primary">+ New Brief</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Briefs', value: totalBriefs, sub: 'All time' },
          { label: 'Active Clients', value: totalClients, sub: 'In workspace' },
          { label: 'Avg Time Saved', value: '4 min', sub: 'vs manual briefs' },
          { label: 'Approval Rate', value: `${approvalRate}%`, sub: 'Client approvals' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-[#6B6B6B] mb-1">{s.label}</p>
            <p className="text-3xl font-black text-[#0A0A0A]">{s.value}</p>
            <p className="text-xs text-[#B3B3B3] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Briefs */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A0A0A]">Recent Briefs</h2>
            <Link href="/briefs" className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A]">View all →</Link>
          </div>
          {!briefs?.length ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">✦</p>
              <p className="font-semibold text-[#0A0A0A] mb-1">No briefs yet</p>
              <p className="text-sm text-[#6B6B6B] mb-4">Create your first brief and let AI handle the structure.</p>
              <Link href="/briefs/new" className="btn-primary text-sm">Create First Brief</Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F5F5F5]">
              {briefs.map(brief => {
                const cfg = STATUS_CONFIG[brief.status as keyof typeof STATUS_CONFIG]
                return (
                  <Link key={brief.id} href={`/briefs/${brief.id}`} className="flex items-center gap-4 py-3.5 hover:bg-[#F5F5F5] -mx-2 px-2 rounded-xl transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0A0A0A] truncate">{brief.title}</p>
                      <p className="text-xs text-[#B3B3B3] mt-0.5">{(brief as any).clients?.name || 'No client'}</p>
                    </div>
                    <span className={`status-badge ${cfg?.color}`}>{cfg?.label}</span>
                    <span className="text-xs text-[#B3B3B3] shrink-0">{formatRelativeTime(brief.updated_at)}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions + Recent Clients */}
        <div className="space-y-5">
          <div className="card p-6">
            <h2 className="font-bold text-[#0A0A0A] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: '/briefs/new', icon: '✦', label: 'Generate AI Brief', primary: true },
                { href: '/clients', icon: '👥', label: 'Add New Client', primary: false },
                { href: '/templates', icon: '📁', label: 'Browse Templates', primary: false },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${a.primary ? 'bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]' : 'bg-[#F5F5F5] text-[#0A0A0A] hover:bg-[#E0E0E0]'}`}>
                  <span>{a.icon}</span>{a.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0A0A0A]">Recent Clients</h2>
              <Link href="/clients" className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A]">View all →</Link>
            </div>
            {!clients?.length ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#6B6B6B] mb-3">No clients yet</p>
                <Link href="/clients" className="text-xs font-semibold text-[#0A0A0A] hover:underline">+ Add your first client</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {clients.map(client => (
                  <div key={client.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: client.avatar_color }}>
                      <span className="text-white text-xs font-bold">{getInitials(client.name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0A0A0A] truncate">{client.name}</p>
                      <p className="text-xs text-[#B3B3B3]">{client.industry || client.location || 'Client'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
