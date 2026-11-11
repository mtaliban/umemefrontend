'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Download, MessageSquare } from 'lucide-react';
import { adminInboxGet, adminInboxUpdate } from '@/lib/api';
import type { ServiceRequest, TrainingApplication, ContactMessage } from '@/lib/types';

type InboxItem = ServiceRequest | TrainingApplication | ContactMessage;

const STATUS_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  'service-requests': [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ],
  'training-applications': [
    { value: 'new', label: 'New' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ],
  messages: [
    { value: 'new', label: 'New' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
  ],
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
  params: Promise<{ type: string; id: string }>;
}

export default function AdminInboxDetailPage({ params }: PageProps) {
  const { type, id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<InboxItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    adminInboxGet<InboxItem>(type, id)
      .then(setItem)
      .catch(() => setError('Failed to load item'))
      .finally(() => setLoading(false));
  }, [type, id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!item) return;
    setStatusUpdating(true);
    try {
      const updated = await adminInboxUpdate<InboxItem>(type, id, { status: newStatus });
      setItem(updated);
    } catch {
      // silent
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !item) return;
    setAddingNote(true);
    try {
      const updated = await adminInboxUpdate<InboxItem>(type, id, { note: noteText });
      setItem(updated);
      setNoteText('');
    } catch {
      // silent
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <p className="text-red-500">{error || 'Item not found'}</p>
        <button
          type="button"
          onClick={() => router.push(`/admin/inbox/${type}`)}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Back to list
        </button>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('en-TZ', { dateStyle: 'medium', timeStyle: 'short' });

  const statusOptions = STATUS_OPTIONS[type] ?? [];
  const notes = 'notes' in item ? item.notes : [];

  const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
      <dt className="w-36 flex-shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="flex-1 text-sm text-gray-900">{value}</dd>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <button
        type="button"
        onClick={() => router.push(`/admin/inbox/${type}`)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to list
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-heading">
            {type === 'service-requests' ? 'Service Request' :
              type === 'training-applications' ? 'Training Application' : 'Contact Message'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{formatDate(item.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          {statusUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <StatusBadge status={item.status} />
          )}
          <select
            value={item.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={statusUpdating}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Detail fields */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <dl>
          <FieldRow label="Name" value={(item as ServiceRequest).name} />

          {type === 'service-requests' && (() => {
            const req = item as ServiceRequest;
            return (
              <>
                <FieldRow label="Phone" value={req.phone} />
                {req.email && <FieldRow label="Email" value={req.email} />}
                {req.organisation && <FieldRow label="Organisation" value={req.organisation} />}
                {req.region && <FieldRow label="Region" value={req.region} />}
                {req.district && <FieldRow label="District" value={req.district} />}
                {req.address && <FieldRow label="Address" value={req.address} />}
                <FieldRow label="Description" value={<p className="whitespace-pre-wrap">{req.description}</p>} />
                <FieldRow label="Contact Method" value={req.contact_method} />
                {req.photo && (
                  <FieldRow
                    label="Attachment"
                    value={
                      <a
                        href={req.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        Download Attachment
                      </a>
                    }
                  />
                )}
              </>
            );
          })()}

          {type === 'training-applications' && (() => {
            const app = item as TrainingApplication;
            return (
              <>
                <FieldRow label="Phone" value={app.phone} />
                {app.email && <FieldRow label="Email" value={app.email} />}
                {app.gender && <FieldRow label="Gender" value={app.gender} />}
                {app.region && <FieldRow label="Region" value={app.region} />}
                {app.education_level && <FieldRow label="Education Level" value={app.education_level} />}
                {app.cv && (
                  <FieldRow
                    label="CV"
                    value={
                      <a
                        href={app.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        Download CV
                      </a>
                    }
                  />
                )}
              </>
            );
          })()}

          {type === 'messages' && (() => {
            const msg = item as ContactMessage;
            return (
              <>
                {msg.phone && <FieldRow label="Phone" value={msg.phone} />}
                <FieldRow label="Email" value={msg.email} />
                {msg.subject && <FieldRow label="Subject" value={msg.subject} />}
                <FieldRow label="Message" value={<p className="whitespace-pre-wrap">{msg.message}</p>} />
              </>
            );
          })()}

          <FieldRow label="IP" value={(item as ServiceRequest).ip ?? '—'} />
        </dl>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 font-heading mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Internal Notes
        </h2>

        {Array.isArray(notes) && notes.length > 0 ? (
          <div className="space-y-3 mb-5">
            {notes.map((note, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{note.text}</p>
                <p className="text-xs text-gray-400 mt-1">{note.by} &bull; {formatDate(note.at)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-4">No notes yet.</p>
        )}

        <div className="space-y-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Add a note..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
          <button
            type="button"
            onClick={handleAddNote}
            disabled={addingNote || !noteText.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {addingNote && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}
