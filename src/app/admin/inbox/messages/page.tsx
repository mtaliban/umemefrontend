'use client';

import { useState, useEffect } from 'react';
import { adminInboxList, adminInboxUpdate, adminInboxExportUrl } from '@/lib/api';
import type { ContactMessage } from '@/lib/types';
import { Download, ChevronRight } from 'lucide-react';

export default function MessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminInboxList<ContactMessage>('contact-messages', {
        status: statusFilter || undefined,
        page,
      });
      setItems(result.items);
      setTotalPages(result.pages);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter, page]);

  const handleStatusChange = async (id: string, status: string) => {
    await adminInboxUpdate('contact-messages', id, { status });
    load();
  };

  const statusColors: Record<string, string> = {
    new: 'bg-green-100 text-green-800',
    read: 'bg-yellow-100 text-yellow-800',
    replied: 'bg-green-100 text-green-800',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Contact Messages</h1>
        <a href={adminInboxExportUrl('contact-messages')} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-surface">
          <Download className="w-4 h-4" />Export Excel
        </a>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">No messages found</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <button key={item._id} type="button" className={`w-full text-left p-4 hover:bg-surface/50 transition-colors flex items-start gap-3 ${selected?._id === item._id ? 'bg-primary/5' : ''}`} onClick={() => setSelected(item)}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.subject || item.message.slice(0, 50)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[item.status] ?? 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900 font-heading">{selected.name}</h2>
              <select value={selected.status} onChange={(e) => handleStatusChange(selected._id, e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
            <dl className="space-y-2 text-sm mb-4">
              {[['Email', selected.email], ['Phone', selected.phone], ['Subject', selected.subject], ['Date', new Date(selected.created_at).toLocaleString()]].map(([l, v]) => v ? (
                <div key={l} className="flex gap-2">
                  <dt className="text-gray-500 w-24 flex-shrink-0">{l}</dt>
                  <dd className="text-gray-900">{v}</dd>
                </div>
              ) : null)}
            </dl>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
            </div>
            <div className="mt-3">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? ''}`} className="text-sm text-primary hover:underline font-medium">Reply by email</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
