import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import type { Post } from '@/lib/types';

interface LatestNewsProps {
  posts: Post[];
  locale: string;
  viewAllLabel: string;
}

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
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <h2 className="section-title">
            {locale === 'sw' ? 'Habari za Hivi Karibuni' : 'Latest News'}
          </h2>
          <Link
            href="/news"
            className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900 transition-colors text-sm group"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post) => (
            <article key={post._id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
              <Link href={`/news/${post.slug}`}>
                {post.cover?.url ? (
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={post.cover.url}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-4xl font-bold font-heading">
                      {resolveT(post.title).charAt(0)}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  {(post.published_at ?? post.created_at) && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.published_at ?? post.created_at)}
                    </p>
                  )}
                  <h3 className="font-bold text-gray-900 font-heading group-hover:text-gray-700 transition-colors line-clamp-2 text-sm leading-snug mb-2">
                    {resolveT(post.title)}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {resolveT(post.excerpt)}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
