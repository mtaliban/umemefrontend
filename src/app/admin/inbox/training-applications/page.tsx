'use client';

import { useState, useEffect } from 'react';
import { adminInboxList, adminInboxGet, adminInboxUpdate, adminInboxExportUrl } from '@/lib/api';
import type { TrainingApplication } from '@/lib/types';
import { Download, ChevronRight } from 'lucide-react';

export default function TrainingApplicationsPage() {
  const [items, setItems] = useState<TrainingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TrainingApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminInboxList<TrainingApplication>('training-applications', {
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
    await adminInboxUpdate('training-applications', id, { status });
    load();
    if (selected?._id === id) {
      const updated = await adminInboxGet<TrainingApplication>('training-applications', id);
      setSelected(updated);
    }
  };

  const handleAddNote = async () => {
    if (!selected || !noteText.trim()) return;
    setSavingNote(true);
    try {
      const updated = await adminInboxUpdate<TrainingApplication>('training-applications', selected._id, { note: noteText });
      setSelected(updated);
      setNoteText('');
    } finally {
      setSavingNote(false);
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-green-100 text-green-800',
    shortlisted: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Training Applications</h1>
        <a
          href={adminInboxExportUrl('training-applications', { status: statusFilter || undefined })}
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
          <option value="shortlisted">Shortlisted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">No applications found</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <button key={item._id} type="button" className={`w-full text-left p-4 hover:bg-surface/50 transition-colors flex items-start gap-3 ${selected?._id === item._id ? 'bg-primary/5' : ''}`} onClick={() => setSelected(item)}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.phone} · {item.region}</p>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900 font-heading">{selected.name}</h2>
              <select value={selected.status} onChange={(e) => handleStatusChange(selected._id, e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="new">New</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <dl className="space-y-2 text-sm">
              {[
                ['Phone', selected.phone],
                ['Email', selected.email],
                ['Gender', selected.gender],
                ['Region', selected.region],
                ['Education', selected.education_level],
                ['Date', new Date(selected.created_at).toLocaleString()],
              ].map(([label, val]) => val ? (
                <div key={label} className="flex gap-2">
                  <dt className="text-gray-500 w-32 flex-shrink-0">{label}</dt>
                  <dd className="text-gray-900">{val}</dd>
                </div>
              ) : null)}
            </dl>

            {selected.cv && (
              <a href={`/api/admin/inbox/training-applications/${selected._id}/attachment`} className="mt-3 flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Download className="w-4 h-4" />
                Download CV
              </a>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              {selected.notes.map((note, i) => (
                <div key={i} className="bg-surface p-2.5 rounded text-sm mb-2">
                  <p className="text-gray-900">{note.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{note.by} · {new Date(note.at).toLocaleString()}</p>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={2} placeholder="Add a note..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={handleAddNote} disabled={savingNote || !noteText.trim()} className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-orange-800 disabled:opacity-40">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
