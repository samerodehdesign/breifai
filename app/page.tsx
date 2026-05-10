import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, read_time, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0A0A0A] rounded-lg flex items-center justify-center"><span className="text-white font-black text-sm">B</span></div>
            <span className="font-extrabold text-lg text-[#0A0A0A]">BriefAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">Features</Link>
            <Link href="#pricing" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">Pricing</Link>
            <Link href="/blog" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">Blog</Link>
            <Link href="/sign-in" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">Sign in</Link>
            <Link href="/sign-up" className="btn-primary">Get Started Free</Link>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-[#6B6B6B]">Now live · 2,400+ designers using BriefAI</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-[#0A0A0A] leading-[0.95] tracking-tight mb-6">Design Briefs,<br /><span className="text-[#6B6B6B]">Reimagined by AI.</span></h1>
          <p className="text-lg md:text-xl text-[#6B6B6B] max-w-2xl mx-auto mb-10 leading-relaxed">Stop losing hours on client discovery. BriefAI generates structured, professional design briefs in minutes.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="btn-primary text-base px-8 py-4 shadow-xl shadow-black/10">Start for Free →</Link>
            <Link href="/sign-in" className="btn-secondary text-base px-8 py-4">Sign in</Link>
          </div>
          <p className="mt-6 text-xs text-[#B3B3B3]">Free forever · No credit card required</p>
        </div>
      </section>
      <section className="py-12 bg-[#F5F5F5] border-y border-[#E0E0E0]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-[#6B6B6B] mb-6">Trusted by designers at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {['Al-Futtaim','Ghada Shop','Seen Architects','WavelineAI','Kudzu.ai','LuxiCure'].map(n=><span key={n} className="text-sm font-bold text-[#0A0A0A]">{n}</span>)}
          </div>
        </div>
      </section>
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-4">Everything you need to brief better.</h2>
            <p className="text-lg text-[#6B6B6B] max-w-xl mx-auto">Built by designers, for designers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{icon:'✦',title:'AI Brief Generator',desc:'Answer guided questions and get a complete brief in under 3 minutes.'},{icon:'↗',title:'Client Portal',desc:'Share a branded brief link. Clients review, comment, and approve.'},{icon:'📋',title:'Template Library',desc:'20+ templates for every project type.'},{icon:'📊',title:'Analytics',desc:'Track approval rates, time saved, and pipeline.'},{icon:'🌍',title:'Arabic & English',desc:'Full RTL/LTR support for MENA and global markets.'},{icon:'↓',title:'PDF Export',desc:'Export polished PDFs ready to send or sign.'}].map(f=>(
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-4 text-lg">{f.icon}</div>
                <h3 className="font-bold text-[#0A0A0A] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {posts && posts.length > 0 && (
        <section className="py-24 px-6 bg-[#F5F5F5]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-widest mb-3">From the Blog</p>
                <h2 className="text-4xl font-black text-[#0A0A0A]">Design. Process. Business.</h2>
                <p className="text-lg text-[#6B6B6B] mt-3">Practical insights for designers who want to run better projects.</p>
              </div>
              <Link href="/blog" className="hidden md:block btn-secondary text-sm shrink-0">View all articles →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map(post=>(
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-[#E0E0E0] hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="h-1.5 bg-[#0A0A0A]" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {post.category&&<span className="bg-[#F5F5F5] text-[#6B6B6B] text-xs font-semibold px-2.5 py-1 rounded-full">{post.category}</span>}
                      <span className="text-[#B3B3B3] text-xs">{post.read_time} min read</span>
                    </div>
                    <h3 className="font-black text-[#0A0A0A] text-lg leading-snug mb-3 group-hover:text-[#404040]">{post.title}</h3>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-2 mb-5">{post.excerpt}</p>
                    <span className="text-xs font-semibold text-[#0A0A0A]">Read article →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-4">Simple, transparent pricing.</h2>
            <p className="text-lg text-[#6B6B6B]">Start free. Upgrade when ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{name:'Free',price:'Free',period:'/month',desc:'For trying things out',features:['10 briefs / month','3 clients','Basic templates','PDF export'],dark:false},{name:'Pro',price:'$29 ',period:'/month',desc:'For freelance designers',features:['Unlimited briefs','Unlimited clients','AI generation','Client portal','Analytics','Arabic & English'],dark:true},{name:'Studio',price:'$79',period:'/month',desc:'For agencies and teams',features:['Everything in Pro','5 team seats','Shared workspace','White-label','API access'],dark:false}].map(plan=>(
              <div key={plan.name} className={`rounded-2xl p-8 ${plan.dark?'bg-[#0A0A0A]':'bg-white border border-[#E0E0E0]'}`}>
                <p className="text-sm font-semibold mb-1 text-[#6B6B6B]">{plan.name}</p>
                <p className={`text-xs mb-4 ${plan.dark?'text-[#404040]':'text-[#B3B3B3]'}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6"><span className="text-5xl font-black">{plan.price}</span><span className={`text-sm ${plan.dark?'text-[#404040]':'text-[#B3B3B3]'}`}>{plan.period}</span></div>
                <Link href="/sign-up" className={`block text-center py-3 rounded-xl text-sm font-semibold mb-6 ${plan.dark?'bg-white text-[#0A0A0A] hover:bg-[#F5F5F5]':'bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]'}`}>Get Started</Link>
                <ul className="space-y-2.5">{plan.features.map(f=><li key={f} className="flex items-center gap-2 text-sm"><span className={plan.dark?'text-[#6B6B6B]':'text-green-600'}>✓</span><span className={plan.dark?'text-[#6B6B6B]':'text-[#6B6B6B]'}>{f}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-[#E0E0E0] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#0A0A0A] rounded-md flex items-center justify-center"><span className="text-white font-black text-xs">B</span></div><span className="font-bold text-sm">BriefAI</span></div>
          <p className="text-xs text-[#B3B3B3]">© 2026 BriefAI. Built for designers.</p>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-xs text-[#B3B3B3] hover:text-[#0A0A0A]">Blog</Link>
            <Link href="/sign-in" className="text-xs text-[#B3B3B3] hover:text-[#0A0A0A]">Sign in</Link>
            <Link href="/sign-up" className="text-xs text-[#B3B3B3] hover:text-[#0A0A0A]">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
