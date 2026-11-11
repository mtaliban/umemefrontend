'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-5 z-40 flex items-center justify-center w-11 h-11 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
      style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}
      aria-label="Back to top"
    >
      <ArrowUp className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
    </button>
  );
}
