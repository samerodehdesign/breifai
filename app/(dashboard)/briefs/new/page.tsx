'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateBriefWithAI } from '@/lib/ai'

const STEPS = ['Project Overview', 'Target Audience', 'Brand Direction', 'Technical Scope', 'Timeline & Budget', 'Review & Generate']

export default function NewBriefPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', projectType: 'Brand Identity', clientName: '',
    targetAudience: '', problem: '', brandDirection: '',
    technicalScope: '', timeline: '', budget: '',
  })

  function update(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function handleGenerate() {
    if (!form.title) { setError('Please enter a project title'); return }
    setGenerating(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const sections = await generateBriefWithAI({
        projectTitle: form.title, projectType: form.projectType,
        targetAudience: form.targetAudience, problem: form.problem,
        brandDirection: form.brandDirection, technicalScope: form.technicalScope,
        timeline: form.timeline, budget: form.budget,
      })

      let clientId = null
      if (form.clientName) {
        const { data: existing } = await supabase.from('clients').select('id').eq('user_id', user.id).ilike('name', form.clientName).single()
        if (existing) {
          clientId = existing.id
        } else {
          const { data: newClient } = await supabase.from('clients').insert({ user_id: user.id, name: form.clientName }).select('id').single()
          clientId = newClient?.id
        }
      }

      const { data: brief, error: briefErr } = await supabase.from('briefs').insert({
        user_id: user.id, client_id: clientId, title: form.title,
        budget: form.budget, sections, status: 'draft', ai_enhanced: true, progress: 100,
      }).select('id').single()

      if (briefErr) throw briefErr
      router.push(`/briefs/${brief.id}`)
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.')
      setGenerating(false)
    }
  }

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#0A0A0A] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl animate-pulse">✦</span>
          </div>
          <h2 className="text-2xl font-black text-[#0A0A0A] mb-2">AI is working its magic...</h2>
          <p className="text-sm text-[#6B6B6B] mb-8">Generating your structured brief. This usually takes 8–15 seconds.</p>
          <div className="w-full bg-[#E0E0E0] rounded-full h-1.5">
            <div className="bg-[#0A0A0A] h-1.5 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
          <p className="text-xs text-[#B3B3B3] mt-3">Analyzing your inputs · Structuring sections · Writing content</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Left Progress Panel */}
      <div className="w-72 bg-white border-r border-[#E0E0E0] p-6 flex flex-col shrink-0">
        <div className="mb-8">
          <h2 className="font-bold text-[#0A0A0A] text-lg">Create Brief</h2>
          <p className="text-xs text-[#6B6B6B] mt-1 truncate">{form.title || 'New Project'}</p>
        </div>
        <div className="space-y-1 flex-1">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${i === step ? 'bg-[#F5F5F5]' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < step ? 'bg-[#0A0A0A] text-white' : i === step ? 'bg-[#0A0A0A] text-white ring-4 ring-[#0A0A0A]/10' : 'bg-[#F5F5F5] text-[#B3B3B3] border border-[#E0E0E0]'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'font-semibold text-[#0A0A0A]' : i < step ? 'font-medium text-[#6B6B6B]' : 'text-[#B3B3B3]'}`}>{s}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 bg-[#0A0A0A] rounded-2xl p-4">
          <p className="text-white text-xs font-semibold mb-1">✦ AI Suggestion</p>
          <p className="text-[#6B6B6B] text-xs leading-relaxed">
            {step === 0 && 'Be specific with your project title. It sets the tone for everything.'}
            {step === 1 && 'Specific demographics will help AI build a sharper brief.'}
            {step === 2 && 'Reference brands you admire to give AI clear direction.'}
            {step === 3 && 'List all platforms — web, mobile, tablet — you need covered.'}
            {step === 4 && 'Include a realistic budget range so AI can calibrate scope.'}
            {step === 5 && 'Review your inputs then let AI generate the complete brief.'}
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-auto p-8">
        {/* Progress bar */}
        <div className="w-full bg-[#E0E0E0] rounded-full h-1 mb-8">
          <div className="bg-[#0A0A0A] h-1 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <div className="max-w-2xl">
          <div className="bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-3 py-1.5 inline-flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-[#6B6B6B]">Step {step + 1} of {STEPS.length}</span>
          </div>
          <h1 className="text-3xl font-black text-[#0A0A0A] mb-1">{STEPS[step]}</h1>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm my-4">{error}</div>}

          <div className="mt-8 space-y-6">
            {step === 0 && <>
              <div>
                <label className="label">Project Title *</label>
                <input className="input" placeholder="Luxury Brand Identity for Al-Futtaim" value={form.title} onChange={e => update('title', e.target.value)} />
              </div>
              <div>
                <label className="label">Project Type</label>
                <select className="input" value={form.projectType} onChange={e => update('projectType', e.target.value)}>
                  {['Brand Identity', 'Web Design', 'Mobile App UX', 'E-commerce', 'Marketing', 'Product Design', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Client Name (optional)</label>
                <input className="input" placeholder="Al-Futtaim Retail Division" value={form.clientName} onChange={e => update('clientName', e.target.value)} />
              </div>
            </>}

            {step === 1 && <>
              <div>
                <label className="label">Who is your primary target audience? *</label>
                <p className="text-xs text-[#B3B3B3] mb-2">Demographics, lifestyle, income level, behavior patterns</p>
                <textarea className="input resize-none h-32" placeholder="High-income women aged 28–45 in Dubai and Abu Dhabi, interested in luxury fashion and exclusive experiences..." value={form.targetAudience} onChange={e => update('targetAudience', e.target.value)} />
              </div>
              <div>
                <label className="label">What problem does this solve for them?</label>
                <p className="text-xs text-[#B3B3B3] mb-2">Focus on emotional or practical value delivered</p>
                <textarea className="input resize-none h-28" placeholder="They want an exclusive, curated luxury shopping experience that feels personal..." value={form.problem} onChange={e => update('problem', e.target.value)} />
              </div>
            </>}

            {step === 2 && <>
              <div>
                <label className="label">Brand Direction & Visual Style</label>
                <p className="text-xs text-[#B3B3B3] mb-2">Aesthetic, references, tone, color direction</p>
                <textarea className="input resize-none h-40" placeholder="Minimalist luxury aesthetic with dark mode primary, editorial typography, generous whitespace. Inspired by Net-a-Porter..." value={form.brandDirection} onChange={e => update('brandDirection', e.target.value)} />
              </div>
            </>}

            {step === 3 && <>
              <div>
                <label className="label">Technical Scope & Platforms</label>
                <p className="text-xs text-[#B3B3B3] mb-2">Devices, platforms, integrations, accessibility requirements</p>
                <textarea className="input resize-none h-40" placeholder="Responsive web (desktop, tablet, mobile), iOS and Android native apps. WCAG 2.2 AA compliance required..." value={form.technicalScope} onChange={e => update('technicalScope', e.target.value)} />
              </div>
            </>}

            {step === 4 && <>
              <div>
                <label className="label">Timeline</label>
                <input className="input" placeholder="12 weeks — 3 phases" value={form.timeline} onChange={e => update('timeline', e.target.value)} />
              </div>
              <div>
                <label className="label">Budget</label>
                <input className="input" placeholder="$8,500 — $12,000" value={form.budget} onChange={e => update('budget', e.target.value)} />
              </div>
            </>}

            {step === 5 && (
              <div className="space-y-4">
                <p className="text-sm text-[#6B6B6B]">Review your inputs below, then click Generate to create your AI-powered brief.</p>
                {[
                  ['Project', form.title], ['Type', form.projectType], ['Client', form.clientName],
                  ['Audience', form.targetAudience], ['Brand Direction', form.brandDirection],
                  ['Tech Scope', form.technicalScope], ['Timeline', form.timeline], ['Budget', form.budget],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="bg-[#F5F5F5] rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#B3B3B3] mb-1">{k}</p>
                    <p className="text-sm text-[#0A0A0A] line-clamp-2">{v}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E0E0E0]">
            <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0}
              className="btn-secondary disabled:opacity-40">← Back</button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => { if (step === 0 && !form.title) { setError('Enter a project title to continue'); return } setError(''); setStep(p => p + 1) }} className="btn-primary">Continue →</button>
            ) : (
              <button onClick={handleGenerate} className="btn-primary px-8">✦ Generate Brief</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
