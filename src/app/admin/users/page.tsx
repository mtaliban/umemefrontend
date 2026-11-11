'use client';

import { useState, useEffect } from 'react';
import { adminListUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '@/lib/api';
import type { User } from '@/lib/types';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'editor', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminListUsers();
      setUsers(result.items);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editingUser) {
        await adminUpdateUser(editingUser._id, { name: form.name, role: form.role as User['role'], ...(form.password ? { password: form.password } : {}) });
      } else {
        await adminCreateUser({ name: form.name, email: form.email, role: form.role, password: form.password });
      }
      setShowForm(false);
      setEditingUser(null);
      setForm({ name: '', email: '', role: 'editor', password: '' });
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminDeleteUser(id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const roleColors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-800',
    editor: 'bg-green-100 text-green-800',
    writer: 'bg-green-100 text-green-800',
    inbox_officer: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Users</h1>
        <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-orange-800 transition-colors">
          <Plus className="w-4 h-4" />Add User
        </button>
      </div>

      {/* Add/Edit form */}
      {(showForm || editingUser) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 font-heading mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
          {error && <div className="mb-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="super_admin">Super Admin</option>
                <option value="editor">Editor</option>
                <option value="writer">Writer</option>
                <option value="inbox_officer">Inbox Officer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingUser ? 'New Password (leave blank to keep)' : 'Password *'}
              </label>
              <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-orange-800 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingUser(null); }} className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-surface">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-gray-100">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Role</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-gray-50 hover:bg-surface/50">
                    <td className="p-3 font-medium text-gray-900">{user.name}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => { setEditingUser(user); setForm({ name: user.name, email: user.email, role: user.role, password: '' }); }} className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(user._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
