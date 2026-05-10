'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { getInitials } from '@/lib/utils'

export default function SettingsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ full_name: '', display_name: '' })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
      setProfile(data)
      setForm({ full_name: data?.full_name || '', display_name: data?.display_name || '' })
    }
    load()
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update(form).eq('id', user!.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Settings</h1>
        <p className="text-sm text-[#6B6B6B] mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="card p-8 mb-6">
        <h2 className="font-bold text-[#0A0A0A] mb-6">Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#F5F5F5]">
          <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">{getInitials(profile?.full_name)}</span>
          </div>
          <div>
            <p className="font-semibold text-[#0A0A0A]">{profile?.full_name || 'Your Name'}</p>
            <p className="text-sm text-[#6B6B6B]">{profile?.email}</p>
            <span className="text-xs bg-[#F5F5F5] border border-[#E0E0E0] px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
              {profile?.plan || 'free'} plan
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Samer Odeh" />
          </div>
          <div>
            <label className="label">Display Name</label>
            <input className="input" value={form.display_name} onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))} placeholder="Samer · Product Designer" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input className="input bg-[#F5F5F5]" value={profile?.email || ''} disabled />
            <p className="text-xs text-[#B3B3B3] mt-1">Email cannot be changed here.</p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Plan Section */}
      <div className="card p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#0A0A0A] mb-1">Current Plan</h2>
            <p className="text-sm text-[#6B6B6B] capitalize">{profile?.plan || 'free'} plan</p>
          </div>
          {profile?.plan === 'free' && (
            <a href="/billing" className="btn-primary text-sm">Upgrade to Pro →</a>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-8 border border-red-200">
        <h2 className="font-bold text-red-600 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0A0A0A]">Sign out</p>
            <p className="text-xs text-[#6B6B6B]">Sign out of your BriefAI account on this device.</p>
          </div>
          <button onClick={signOut} className="text-sm font-semibold text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
