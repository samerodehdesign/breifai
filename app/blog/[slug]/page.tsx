import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('title, excerpt').eq('slug', slug).single()
  if (!post) return { title: 'Post not found' }
  return {
    title: `${post.title} — BriefAI Blog`,
    description: post.excerpt || '',
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const { data: related } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, read_time, published_at, created_at')
    .eq('status', 'published')
    .eq('category', post.category)
    .neq('id', post.id)
    .limit(2)

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
            <Link href="/blog" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">← All articles</Link>
            <Link href="/sign-up" className="bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A1A1A] transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-8">
          {post.category && (
            <span className="bg-[#F5F5F5] border border-[#E0E0E0] text-[#6B6B6B] text-xs font-semibold px-3 py-1.5 rounded-full">{post.category}</span>
          )}
          <span className="text-[#B3B3B3] text-xs">{post.read_time} min read</span>
          <span className="text-[#B3B3B3] text-xs">·</span>
          <span className="text-[#B3B3B3] text-xs">{formatDate(post.published_at || post.created_at)}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-tight mb-6">{post.title}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-[#6B6B6B] leading-relaxed mb-10 pb-10 border-b border-[#E0E0E0]">{post.excerpt}</p>
        )}

        {/* Author */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">SO</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0A0A0A]">{post.author}</p>
            <p className="text-xs text-[#B3B3B3]">Product Designer</p>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-16 bg-[#0A0A0A] rounded-2xl p-8 text-center">
          <p className="text-white font-black text-2xl mb-2">Ready to brief better?</p>
          <p className="text-[#6B6B6B] text-sm mb-6">Create your first AI-powered design brief in minutes.</p>
          <Link href="/sign-up" className="inline-block bg-white text-[#0A0A0A] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#F5F5F5] transition-colors">
            Start for Free →
          </Link>
        </div>

        {/* Related */}
        {related && related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-black text-[#0A0A0A] text-xl mb-6">More articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="card p-5 hover:shadow-md transition-all group">
                  {r.category && <p className="text-xs text-[#B3B3B3] mb-2">{r.category}</p>}
                  <h3 className="font-bold text-[#0A0A0A] text-sm leading-snug mb-2 group-hover:text-[#404040]">{r.title}</h3>
                  <p className="text-xs text-[#B3B3B3]">{r.read_time} min read →</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <style>{`
        .prose-content h2 {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0A0A0A;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .prose-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0A0A0A;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose-content p {
          font-size: 1rem;
          line-height: 1.8;
          color: #404040;
          margin-bottom: 1.25rem;
        }
        .prose-content ul, .prose-content ol {
          margin: 1.25rem 0;
          padding-left: 1.5rem;
        }
        .prose-content li {
          font-size: 1rem;
          line-height: 1.8;
          color: #404040;
          margin-bottom: 0.5rem;
        }
        .prose-content strong {
          font-weight: 700;
          color: #0A0A0A;
        }
        .prose-content a {
          color: #0A0A0A;
          text-decoration: underline;
        }
        .prose-content blockquote {
          border-left: 3px solid #0A0A0A;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6B6B6B;
        }
        .prose-content hr {
          border: none;
          border-top: 1px solid #E0E0E0;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  )
}
