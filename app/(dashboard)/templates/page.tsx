import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: templates } = await supabase.from('templates').select('*').order('is_popular', { ascending: false })

  const categories = ['All', 'Brand Identity', 'Web Design', 'Mobile Apps', 'E-commerce']

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0A0A0A]">Template Library</h1>
        <p className="text-sm text-[#6B6B6B] mt-0.5">Start with a template, finish with a perfect brief.</p>
      </div>

      {/* Hero */}
      <div className="bg-[#0A0A0A] rounded-2xl p-8 mb-8">
        <p className="text-[#6B6B6B] text-xs font-semibold mb-2 uppercase tracking-wider">Template Library</p>
        <h2 className="text-3xl font-black text-white mb-2">20+ AI-curated templates</h2>
        <p className="text-[#6B6B6B] text-sm">Designed by senior product designers for every project type.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {categories.map((cat, i) => (
          <button key={cat} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${i === 0 ? 'bg-[#0A0A0A] text-white' : 'bg-white border border-[#E0E0E0] text-[#6B6B6B] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(templates || []).map(tpl => (
          <div key={tpl.id} className="card overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-32 bg-[#F5F5F5] flex items-center justify-center relative">
              <span className="text-4xl opacity-20">📋</span>
              {tpl.is_popular && (
                <span className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-xs font-bold px-2 py-1 rounded-lg">★ Popular</span>
              )}
              {tpl.is_premium && (
                <span className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-xs font-bold px-2 py-1 rounded-lg">✦ Pro</span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs text-[#B3B3B3] mb-1">{tpl.category}</p>
              <h3 className="font-bold text-[#0A0A0A] mb-2 text-sm leading-snug">{tpl.title}</h3>
              <p className="text-xs text-[#6B6B6B] mb-4 line-clamp-2 leading-relaxed">{tpl.description}</p>
              <div className="flex items-center justify-between text-xs text-[#B3B3B3] mb-4">
                <span>📋 {tpl.sections_count} sections</span>
                <span>⏱ {tpl.estimated_time}</span>
              </div>
              <Link href={`/briefs/new?template=${tpl.id}`}
                className="block text-center bg-[#0A0A0A] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#1A1A1A] transition-colors">
                Use Template →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
