'use client';

import Link from 'next/link';

const pageKeys = [
  { key: 'about', label: 'About Us' },
  { key: 'services', label: 'Services' },
  { key: 'projects', label: 'Projects' },
  { key: 'training', label: 'Training' },
  { key: 'clients', label: 'Clients & Partners' },
  { key: 'news', label: 'News' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'faq', label: 'FAQ' },
  { key: 'contact', label: 'Contact Us' },
  { key: 'privacy', label: 'Privacy Policy' },
];

export default function AdminPagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">Pages</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {pageKeys.map((page) => (
          <div key={page.key} className="flex items-center justify-between p-4">
            <span className="font-medium text-gray-900">{page.label}</span>
            <Link
              href={`/admin/pages/${page.key}`}
              className="px-3 py-1.5 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
