'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const supabase = createClient()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">B</span>
          </div>
          <span className="text-white font-extrabold text-lg">BriefAI</span>
        </Link>
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-6">Welcome back.<br />Your briefs are waiting.</h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">Pick up where you left off. Your clients, briefs, and AI history are all here.</p>
        </div>
        <p className="text-[#404040] text-xs">© 2026 BriefAI</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-extrabold">BriefAI</span>
          </Link>
          <h1 className="text-3xl font-black text-[#0A0A0A] mb-1">Sign in</h1>
          <p className="text-sm text-[#6B6B6B] mb-8">Good to have you back.</p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="samer@samerodeh.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E0E0E0]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-[#B3B3B3]">or</span></div>
          </div>
          <button onClick={handleGoogle} className="btn-secondary w-full py-3.5 text-sm">
            <span className="mr-2">G</span> Continue with Google
          </button>
          <p className="text-center text-sm text-[#6B6B6B] mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#0A0A0A] font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
