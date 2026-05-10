import Link from 'next/link'

const plans = [
  { name: 'Free', price: '$0', period: '/month', desc: 'Perfect for trying things out', features: ['10 briefs / month', '3 clients', 'Basic templates', 'PDF export'], dark: false, current: true },
  { name: 'Pro', price: '$29', period: '/month', desc: 'For freelance designers', features: ['Unlimited briefs', 'Unlimited clients', 'AI brief generation', 'Client portal', 'Analytics', 'Arabic & English'], dark: true, popular: true },
  { name: 'Studio', price: '$79', period: '/month', desc: 'For agencies and teams', features: ['Everything in Pro', '5 team seats', 'Shared workspace', 'White-label briefs', 'API access'], dark: false },
]

export default function BillingPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Plans & Billing</h1>
        <p className="text-sm text-[#6B6B6B] mt-0.5">Upgrade your plan or manage your subscription.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {plans.map(plan => (
          <div key={plan.name} className={`rounded-2xl p-8 ${plan.dark ? 'bg-[#0A0A0A]' : 'card'}`}>
            {plan.popular && (
              <span className="inline-block bg-white/10 text-white text-xs font-bold px-2 py-1 rounded-lg mb-4">MOST POPULAR</span>
            )}
            <p className={`text-sm font-semibold mb-1 ${plan.dark ? 'text-[#6B6B6B]' : 'text-[#6B6B6B]'}`}>{plan.name}</p>
            <p className={`text-xs mb-5 ${plan.dark ? 'text-[#404040]' : 'text-[#B3B3B3]'}`}>{plan.desc}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className={`text-4xl font-black ${plan.dark ? 'text-white' : 'text-[#0A0A0A]'}`}>{plan.price}</span>
              <span className={`text-sm ${plan.dark ? 'text-[#404040]' : 'text-[#B3B3B3]'}`}>{plan.period}</span>
            </div>
            <button disabled={plan.current}
              className={`w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-all ${plan.dark ? 'bg-white text-[#0A0A0A] hover:bg-[#F5F5F5]' : plan.current ? 'bg-[#F5F5F5] text-[#B3B3B3] cursor-not-allowed' : 'bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]'}`}>
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </button>
            <ul className="space-y-2.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className={plan.dark ? 'text-[#6B6B6B]' : 'text-green-600'}>✓</span>
                  <span className={plan.dark ? 'text-[#6B6B6B]' : 'text-[#6B6B6B]'}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6 max-w-4xl">
        <h2 className="font-bold text-[#0A0A0A] mb-1">Enterprise</h2>
        <p className="text-sm text-[#6B6B6B] mb-4">Custom pricing for organizations with advanced needs — unlimited seats, SSO, dedicated support, and custom AI training.</p>
        <a href="mailto:hello@briefai.co" className="btn-secondary text-sm">Contact Sales →</a>
      </div>
    </div>
  )
}
