import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — BriefAI',
  description: 'Insights on design process, client management, and building a better creative practice.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, author, category, read_time, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const categories = ['All', ...Array.from(new Set(posts?.map(p => p.category).filter(Boolean)))]
  const featured = posts?.[0]
  const rest = posts?.slice(1)

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-extrabold text-[#0A0A0A]">BriefAI</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-semibold text-[#0A0A0A]">Blog</Link>
            <Link href="/sign-in" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">Sign in</Link>
            <Link href="/sign-up" className="bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A1A1A] transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-widest mb-3">BriefAI Blog</p>
          <h1 className="text-5xl font-black text-[#0A0A0A] mb-4">Design. Process. Business.</h1>
          <p className="text-lg text-[#6B6B6B] max-w-xl">Practical insights for designers who want to run better projects and build stronger client relationships.</p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block group mb-16">
            <div className="bg-[#0A0A0A] rounded-3xl p-10 md:p-14 hover:bg-[#1A1A1A] transition-colors">
              <div className="flex items-center gap-3 mb-6">
                {featured.category && (
                  <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">{featured.category}</span>
                )}
                <span className="text-[#6B6B6B] text-xs">{featured.read_time} min read</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-[#E0E0E0] transition-colors leading-tight">{featured.title}</h2>
              <p className="text-[#6B6B6B] text-base leading-relaxed mb-8 max-w-2xl">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">SO</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{featured.author}</p>
                    <p className="text-[#6B6B6B] text-xs">{formatDate(featured.published_at || featured.created_at)}</p>
                  </div>
                </div>
                <span className="text-white text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">Read article →</span>
              </div>
            </div>
          </Link>
        )}

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {categories.map((cat, i) => (
              <button key={cat} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${i === 0 ? 'bg-[#0A0A0A] text-white' : 'bg-white border border-[#E0E0E0] text-[#6B6B6B] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Articles grid */}
        {!rest?.length && !featured ? (
          <div className="text-center py-24 border border-[#E0E0E0] rounded-2xl">
            <p className="text-4xl mb-4">✦</p>
            <p className="font-bold text-[#0A0A0A] mb-2">No articles yet</p>
            <p className="text-sm text-[#6B6B6B]">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest?.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group card p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-2 mb-4">
                  {post.category && (
                    <span className="bg-[#F5F5F5] text-[#6B6B6B] text-xs font-semibold px-2.5 py-1 rounded-full">{post.category}</span>
                  )}
                  <span className="text-[#B3B3B3] text-xs">{post.read_time} min read</span>
                </div>
                <h2 className="font-black text-[#0A0A0A] text-lg leading-snug mb-3 group-hover:text-[#404040] transition-colors">{post.title}</h2>
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F5]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#0A0A0A] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">SO</span>
                    </div>
                    <span className="text-xs text-[#B3B3B3]">{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0A0A0A] group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E0E0E0] py-10 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0A0A0A] rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-bold text-sm">BriefAI</span>
          </div>
          <p className="text-xs text-[#B3B3B3]">© 2026 BriefAI. Built for designers.</p>
          <Link href="/sign-up" className="text-xs font-semibold text-[#0A0A0A] hover:underline">Start for free →</Link>
        </div>
      </footer>
    </div>
  )
}
