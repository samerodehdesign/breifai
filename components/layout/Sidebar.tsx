'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { getInitials } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', icon: '⬛', label: 'Dashboard' },
  { href: '/briefs', icon: '📋', label: 'My Briefs' },
  { href: '/clients', icon: '👥', label: 'Clients' },
  { href: '/briefs/new', icon: '✦', label: 'AI Generator' },
  { href: '/templates', icon: '📁', label: 'Templates' },
  { href: '/analytics', icon: '📊', label: 'Analytics' },
]

export default function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-64 bg-white border-r border-[#E0E0E0] flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#E0E0E0]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">B</span>
          </div>
          <span className="font-extrabold text-[#0A0A0A]">BriefAI</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={active ? 'sidebar-item-active' : 'sidebar-item'}>
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Upgrade Banner */}
      {profile?.plan === 'free' && (
        <div className="mx-3 mb-3 bg-[#0A0A0A] rounded-2xl p-4">
          <p className="text-white text-xs font-semibold mb-1">Upgrade to Pro</p>
          <p className="text-[#6B6B6B] text-xs mb-3">Unlimited briefs + AI+</p>
          <Link href="/billing" className="block text-center bg-white text-[#0A0A0A] rounded-lg py-1.5 text-xs font-semibold hover:bg-[#F5F5F5] transition-colors">
            Upgrade →
          </Link>
        </div>
      )}

      {/* User */}
      <div className="p-3 border-t border-[#E0E0E0]">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F5] cursor-pointer group">
          <div className="w-8 h-8 bg-[#0A0A0A] rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{getInitials(profile?.full_name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#0A0A0A] truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-[#B3B3B3] truncate">{profile?.plan || 'free'} plan</p>
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/settings" className="opacity-0 group-hover:opacity-100 text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-all">⚙</Link>
            <button onClick={signOut} className="opacity-0 group-hover:opacity-100 text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-all">↗</button>
          </div>
        </div>
      </div>
    </aside>
  )
}
