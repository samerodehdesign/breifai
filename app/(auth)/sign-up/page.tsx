'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName } },
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Black Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">B</span>
          </div>
          <span className="text-white font-extrabold text-lg">BriefAI</span>
        </Link>
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-6">
            Start creating better<br />client briefs today.
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed mb-10">
            Join 2,400+ designers who have eliminated client miscommunication forever.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
              &ldquo;BriefAI saved me 6 hours on my last project. My client was actually impressed by the brief quality.&rdquo;
            </p>
            <p className="text-[#6B6B6B] text-xs font-medium">Layla Hassan · Brand Designer, Dubai</p>
          </div>
        </div>
        <p className="text-[#404040] text-xs">© 2026 BriefAI</p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-extrabold">BriefAI</span>
          </Link>

          <h1 className="text-3xl font-black text-[#0A0A0A] mb-1">Create your account</h1>
          <p className="text-sm text-[#6B6B6B] mb-8">Free forever · No credit card required</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Samer Odeh" value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="samer@samerodeh.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min. 8 characters" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} minLength={8} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0E0E0]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#B3B3B3]">or continue with</span>
            </div>
          </div>

          <button onClick={handleGoogleSignUp} className="btn-secondary w-full py-3.5 text-sm">
            <span className="mr-2">G</span> Continue with Google
          </button>

          <p className="text-center text-sm text-[#6B6B6B] mt-8">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#0A0A0A] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
