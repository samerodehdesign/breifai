'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Client } from '@/lib/types'
import { getInitials, formatDate } from '@/lib/utils'

const COLORS = ['#0A0A0A','#1A6B4A','#6B1A1A','#1A1A6B','#6B4E1A','#4E1A6B','#1A6B6B','#6B1A6B']

export default function ClientsPage() {
  const supabase = createClient()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', industry: '', location: '' })

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('clients').select('*').eq('user_id', user!.id).order('created_at', { ascending: false })
    setClients(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addClient(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    await supabase.from('clients').insert({ ...form, user_id: user!.id, avatar_color: color })
    setForm({ name: '', email: '', company: '', industry: '', location: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function deleteClient(id: string) {
    if (!confirm('Delete this client?')) return
    await supabase.from('clients').delete().eq('id', id)
    setClients(p => p.filter(c => c.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0A0A0A]">Clients</h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">{clients.length} clients in your workspace</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New Client</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-8">
            <h2 className="text-xl font-black text-[#0A0A0A] mb-6">Add New Client</h2>
            <form onSubmit={addClient} className="space-y-4">
              <div>
                <label className="label">Client Name *</label>
                <input className="input" placeholder="Al-Futtaim" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="contact@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Industry</label>
                <input className="input" placeholder="Retail, SaaS, Architecture..." value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" placeholder="Dubai, UAE" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add Client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#E0E0E0] border-t-[#0A0A0A] rounded-full animate-spin" /></div>
      ) : !clients.length ? (
        <div className="card flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-2xl mb-4">👥</div>
          <h2 className="font-bold text-[#0A0A0A] mb-2">No clients yet</h2>
          <p className="text-sm text-[#6B6B6B] mb-6 max-w-xs">Add clients to keep all their projects, briefs, and communication in one place.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">+ Add First Client</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {clients.map(client => (
            <div key={client.id} className="card p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: client.avatar_color }}>
                  <span className="text-white font-bold">{getInitials(client.name)}</span>
                </div>
                <button onClick={() => deleteClient(client.id)} className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 transition-all">✕</button>
              </div>
              <h3 className="font-bold text-[#0A0A0A] mb-1">{client.name}</h3>
              {client.industry && <p className="text-xs text-[#6B6B6B]">{client.industry}</p>}
              {client.location && <p className="text-xs text-[#B3B3B3]">{client.location}</p>}
              {client.email && <p className="text-xs text-[#B3B3B3] mt-1 truncate">{client.email}</p>}
              <p className="text-xs text-[#B3B3B3] mt-3 pt-3 border-t border-[#F5F5F5]">Added {formatDate(client.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
