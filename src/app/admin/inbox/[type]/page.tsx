'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { adminInboxList, adminInboxExportUrl } from '@/lib/api';
import type { ServiceRequest, TrainingApplication, ContactMessage } from '@/lib/types';

type InboxItem = ServiceRequest | TrainingApplication | ContactMessage;

type InboxType = 'service-requests' | 'training-applications' | 'messages';

const TYPE_CONFIG: Record<string, {
  title: string;
  statusOptions: Array<{ value: string; label: string }>;
}> = {
  'service-requests': {
    title: 'Service Requests',
    statusOptions: [
      { value: 'new', label: 'New' },
      { value: 'contacted', label: 'Contacted' },
      { value: 'quoted', label: 'Quoted' },
      { value: 'won', label: 'Won' },
      { value: 'lost', label: 'Lost' },
    ],
  },
  'training-applications': {
    title: 'Training Applications',
    statusOptions: [
      { value: 'new', label: 'New' },
      { value: 'shortlisted', label: 'Shortlisted' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
  messages: {
    title: 'Contact Messages',
    statusOptions: [
      { value: 'new', label: 'New' },
      { value: 'read', label: 'Read' },
      { value: 'replied', label: 'Replied' },
    ],
  },
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-green-100 text-green-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    read: 'bg-yellow-100 text-yellow-700',
    quoted: 'bg-amber-100 text-amber-700',
    won: 'bg-green-100 text-green-700',
    accepted: 'bg-green-100 text-green-700',
    replied: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
    shortlisted: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

interface PageProps {
  params: Promise<{ type: string }>;
}

export default function AdminInboxPage({ params }: PageProps) {
  const { type } = use(params);
  const config = TYPE_CONFIG[type];

  const [items, setItems] = useState<InboxItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminInboxList<InboxItem>(type, {
        status: statusFilter || undefined,
        page,
      });
      setItems(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type, statusFilter, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (!config) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <p className="text-gray-500">Invalid inbox type: {type}</p>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-TZ', { day: 'numeric', month: 'short', year: 'numeric' });

  const renderRow = (item: InboxItem) => {
    const id = item._id;
    if (type === 'service-requests') {
      const req = item as ServiceRequest;
      return (
        <tr key={id} className="hover:bg-gray-50 border-t border-gray-100">
          <td className="px-4 py-3 text-sm font-medium text-gray-900">{req.name}</td>
          <td className="px-4 py-3 text-sm text-gray-600">{req.phone}</td>
          <td className="px-4 py-3 text-sm text-gray-600">{req.region ?? '—'}</td>
          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(req.created_at)}</td>
          <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
          <td className="px-4 py-3 text-right">
            <Link
              href={`/admin/inbox/${type}/${id}`}
              className="text-xs text-primary hover:underline"
            >
              View
            </Link>
          </td>
        </tr>
      );
    }
    if (type === 'training-applications') {
      const app = item as TrainingApplication;
      return (
        <tr key={id} className="hover:bg-gray-50 border-t border-gray-100">
          <td className="px-4 py-3 text-sm font-medium text-gray-900">{app.name}</td>
          <td className="px-4 py-3 text-sm text-gray-600">{app.phone}</td>
          <td className="px-4 py-3 text-sm text-gray-600">{app.region ?? '—'}</td>
          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(app.created_at)}</td>
          <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
          <td className="px-4 py-3 text-right">
            <Link
              href={`/admin/inbox/${type}/${id}`}
              className="text-xs text-primary hover:underline"
            >
              View
            </Link>
          </td>
        </tr>
      );
    }
    // messages
    const msg = item as ContactMessage;
    return (
      <tr key={id} className="hover:bg-gray-50 border-t border-gray-100">
        <td className="px-4 py-3 text-sm font-medium text-gray-900">{msg.name}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{msg.email}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{msg.subject ?? '—'}</td>
        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(msg.created_at)}</td>
        <td className="px-4 py-3"><StatusBadge status={msg.status} /></td>
        <td className="px-4 py-3 text-right">
          <Link
            href={`/admin/inbox/${type}/${id}`}
            className="text-xs text-primary hover:underline"
          >
            View
          </Link>
        </td>
      </tr>
    );
  };

  const headers =
    type === 'service-requests'
      ? ['Name', 'Phone', 'Region', 'Date', 'Status', '']
      : type === 'training-applications'
      ? ['Name', 'Phone', 'Region', 'Date', 'Status', '']
      : ['Name', 'Email', 'Subject', 'Date', 'Status', ''];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">{config.title}</h1>
        <a
          href={adminInboxExportUrl(type, { status: statusFilter || undefined })}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          {config.statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 self-center">{total} total</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length} className="text-center py-12 text-gray-400">
                      No items found
                    </td>
                  </tr>
                ) : (
                  items.map(renderRow)
                )}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">Page {page} of {pages}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
