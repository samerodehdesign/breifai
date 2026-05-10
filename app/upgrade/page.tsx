'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const PLANS = {
  pro: {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For freelance designers',
    features: ['Unlimited briefs', 'Unlimited clients', 'AI brief generation', 'Client portal', 'Analytics', 'Arabic & English'],
    yearly: '$23',
    yearlySave: 'Save $72/year',
  },
  studio: {
    name: 'Studio',
    price: '$79',
    period: '/month',
    desc: 'For agencies and teams',
    features: ['Everything in Pro', '5 team seats', 'Shared workspace', 'White-label briefs', 'API access'],
    yearly: '$63',
    yearlySave: 'Save $192/year',
  },
}

function UpgradeContent() {
  const params = useSearchParams()
  const planKey = (params.get('plan') || 'pro') as keyof typeof PLANS
  const plan = PLANS[planKey] || PLANS.pro
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvc: '' })

  function formatCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExpiry(val: string) {
    return val.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    window.location.href = '/dashboard?upgraded=true'
  }

  const price = billing === 'yearly' ? plan.yearly : plan.price

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E0E0E0]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-extrabold text-[#0A0A0A]">BriefAI</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span className="text-green-600">🔒</span> Secure checkout
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#0A0A0A] mb-2">Upgrade to {plan.name}</h1>
          <p className="text-[#6B6B6B]">Start your 14-day free trial. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 mb-4">
              <h2 className="font-bold text-[#0A0A0A] mb-6">Order Summary</h2>

              {/* Billing toggle */}
              <div className="flex items-center gap-3 p-1 bg-[#F5F5F5] rounded-xl mb-6">
                <button onClick={() => setBilling('monthly')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-white shadow-sm text-[#0A0A0A]' : 'text-[#6B6B6B]'}`}>
                  Monthly
                </button>
                <button onClick={() => setBilling('yearly')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${billing === 'yearly' ? 'bg-white shadow-sm text-[#0A0A0A]' : 'text-[#6B6B6B]'}`}>
                  Yearly
                  <span className="ml-1 text-xs text-green-600 font-bold">-20%</span>
                </button>
              </div>

              {/* Plan details */}
              <div className="bg-[#0A0A0A] rounded-xl p-5 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-bold">{plan.name} Plan</p>
                    <p className="text-[#6B6B6B] text-sm">{plan.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black text-xl">{price}</p>
                    <p className="text-[#6B6B6B] text-xs">{plan.period}</p>
                  </div>
                </div>
                {billing === 'yearly' && (
                  <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-lg w-fit">
                    ✓ {plan.yearlySave}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <p className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider mb-3">What&apos;s included</p>
                <ul className="space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className="w-4 h-4 bg-green-50 border border-green-200 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-[#404040]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🔒', label: 'SSL Encrypted' },
                { icon: '↩', label: '14-day refund' },
                { icon: '✕', label: 'Cancel anytime' },
              ].map(t => (
                <div key={t.label} className="bg-white rounded-xl border border-[#E0E0E0] p-3 text-center">
                  <p className="text-lg mb-1">{t.icon}</p>
                  <p className="text-xs text-[#6B6B6B] font-medium">{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Payment Form */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8">
            <h2 className="font-bold text-[#0A0A0A] mb-6">Payment Details</h2>

            <div className="bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="text-lg">🎁</span>
              <div>
                <p className="text-sm font-semibold text-[#0A0A0A]">14-day free trial</p>
                <p className="text-xs text-[#6B6B6B]">You won&apos;t be charged until your trial ends.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" placeholder="Samer Odeh" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input className="input" type="email" placeholder="samer@samerodeh.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Card Number</label>
                <input className="input font-mono" placeholder="4242 4242 4242 4242" value={form.card}
                  onChange={e => setForm(p => ({ ...p, card: formatCard(e.target.value) }))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Expiry Date</label>
                  <input className="input font-mono" placeholder="MM/YY" value={form.expiry}
                    onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} required />
                </div>
                <div>
                  <label className="label">CVC</label>
                  <input className="input font-mono" placeholder="123" maxLength={4} value={form.cvc}
                    onChange={e => setForm(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} required />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#0A0A0A] text-white font-semibold py-4 rounded-xl hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Start Free Trial — ${price}/mo`
                )}
              </button>

              <p className="text-xs text-center text-[#B3B3B3] pt-1">
                By subscribing you agree to our Terms of Service. Your card will be charged {price}/month after the 14-day trial.
              </p>
            </form>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[#F5F5F5]">
              {['Visa', 'Mastercard', 'Amex', 'Apple Pay'].map(p => (
                <span key={p} className="text-xs text-[#B3B3B3] font-medium">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#B3B3B3] mt-8">
          Questions? <a href="mailto:hello@briefai.co" className="text-[#0A0A0A] font-semibold hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#E0E0E0] border-t-[#0A0A0A] rounded-full animate-spin" /></div>}>
      <UpgradeContent />
    </Suspense>
  )
}
