'use client';

import { useState, useEffect } from 'react';
import { adminInboxList, adminInboxGet, adminInboxUpdate, adminInboxExportUrl } from '@/lib/api';
import type { ServiceRequest } from '@/lib/types';
import { Download, ChevronRight } from 'lucide-react';

export default function ServiceRequestsPage() {
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminInboxList<ServiceRequest>('service-requests', {
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
    await adminInboxUpdate('service-requests', id, { status });
    load();
    if (selected?._id === id) {
      const updated = await adminInboxGet<ServiceRequest>('service-requests', id);
      setSelected(updated);
    }
  };

  const handleAddNote = async () => {
    if (!selected || !noteText.trim()) return;
    setSavingNote(true);
    try {
      const updated = await adminInboxUpdate<ServiceRequest>('service-requests', selected._id, { note: noteText });
      setSelected(updated);
      setNoteText('');
    } finally {
      setSavingNote(false);
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-green-100 text-green-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Service Requests</h1>
        <a
          href={adminInboxExportUrl('service-requests', { status: statusFilter || undefined })}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-surface transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </a>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">No requests found</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className={`w-full text-left p-4 hover:bg-surface/50 transition-colors flex items-start gap-3 ${
                    selected?._id === item._id ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => setSelected(item)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.phone} · {item.region}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-50 flex justify-between">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-primary disabled:opacity-40">Previous</button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-primary disabled:opacity-40">Next</button>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900 font-heading">{selected.name}</h2>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <dl className="space-y-2 text-sm">
              {[
                ['Phone', selected.phone],
                ['Email', selected.email],
                ['Organisation', selected.organisation],
                ['Region', selected.region],
                ['District', selected.district],
                ['Address', selected.address],
                ['Contact Method', selected.contact_method],
                ['Date', new Date(selected.created_at).toLocaleString()],
              ].map(([label, val]) => val ? (
                <div key={label} className="flex gap-2">
                  <dt className="text-gray-500 w-32 flex-shrink-0">{label}</dt>
                  <dd className="text-gray-900">{val}</dd>
                </div>
              ) : null)}
            </dl>

            <div className="mt-4 p-3 bg-surface rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
              <p className="text-sm text-gray-600">{selected.description}</p>
            </div>

            {selected.photo && (
              <a
                href={`/api/admin/inbox/service-requests/${selected._id}/attachment`}
                className="mt-3 flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Download className="w-4 h-4" />
                Download Photo
              </a>
            )}

            {/* Notes */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Internal Notes</h3>
              {selected.notes.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {selected.notes.map((note, i) => (
                    <div key={i} className="bg-surface p-2.5 rounded text-sm">
                      <p className="text-gray-900">{note.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{note.by} · {new Date(note.at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="flex gap-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={2}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={savingNote || !noteText.trim()}
                  className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-orange-800 disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
