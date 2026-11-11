'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('news');

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        aria-label="Share on X (Twitter)"
      >
        <Twitter className="w-4 h-4" />
        X
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-orange-800 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        aria-label={t('copyLink')}
      >
        <Link2 className="w-4 h-4" />
        {copied ? '✓ Copied!' : t('copyLink')}
      </button>
    </div>
  );
}
