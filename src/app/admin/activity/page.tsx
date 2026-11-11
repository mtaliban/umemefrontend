'use client';

import { useState, useEffect } from 'react';
import { adminGetActivity } from '@/lib/api';
import type { ActivityLog } from '@/lib/types';

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-800',
  update: 'bg-green-100 text-green-800',
  delete: 'bg-red-100 text-red-800',
  publish: 'bg-purple-100 text-purple-800',
  unpublish: 'bg-yellow-100 text-yellow-800',
  login: 'bg-gray-100 text-gray-700',
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminGetActivity({ page });
      setLogs(result.items);
      setTotalPages(result.pages);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">Activity Log</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-gray-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">User</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Action</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Collection</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Item</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-t border-gray-50 hover:bg-surface/50">
                      <td className="p-3 font-medium text-gray-900">{log.user_name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${actionColors[log.action] ?? 'bg-gray-100 text-gray-700'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{log.collection}</td>
                      <td className="p-3 text-gray-600">{log.item_label ?? log.item_id ?? '—'}</td>
                      <td className="p-3 text-gray-500 text-xs">
                        {new Date(log.at ?? log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-surface">Previous</button>
                  <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-surface">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
