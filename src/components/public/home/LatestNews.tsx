import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, ArrowUpRight } from 'lucide-react';
import type { Post } from '@/lib/types';

interface LatestNewsProps {
  posts: Post[];
  locale: string;
  viewAllLabel: string;
}

const categoryConfig: Record<string, { bg: string; text: string; label: string }> = {
  news: { bg: 'bg-green-100', text: 'text-green-700', label: 'News' },
  announcement: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Announcement' },
  event: { bg: 'bg-green-100', text: 'text-green-700', label: 'Event' },
  tender: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Tender' },
};

export default function LatestNews({ posts, locale, viewAllLabel }: LatestNewsProps) {
  if (!posts || posts.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(
      locale === 'sw' ? 'sw-TZ' : 'en-TZ',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">
              {locale === 'sw' ? 'Habari' : 'News & Updates'}
            </span>
            <h2 className="mt-3 section-title">
              {locale === 'sw' ? 'Habari za Hivi Karibuni' : 'Latest News'}
            </h2>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors text-sm group"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {posts.slice(0, 3).map((post, index) => {
            const cat = categoryConfig[post.category] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: post.category };
            return (
              <article
                key={post._id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1 ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <Link href={`/news/${post.slug}`}>
                  {post.cover?.url ? (
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={post.cover.url}
                        alt={resolveT(post.cover.alt) || resolveT(post.title)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                          <ArrowUpRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-52 gradient-primary flex items-center justify-center">
                      <span className="text-white/20 text-6xl font-bold font-heading">
                        {resolveT(post.title).charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${cat.bg} ${cat.text}`}>
                        {cat.label}
                      </span>
                      {(post.published_at ?? post.created_at) && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.published_at ?? post.created_at)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 font-heading group-hover:text-primary transition-colors line-clamp-2 text-base leading-snug">
                      {resolveT(post.title)}
                    </h3>
                    <p className="mt-2.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {resolveT(post.excerpt)}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
