'use client';

import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronUp, Trash2, Save, Globe } from 'lucide-react';
import TranslatableField from './TranslatableField';
import ImageUploader from './ImageUploader';
import TipTapEditor from './TipTapEditor';
import { adminGet, adminCreate, adminUpdate, adminDelete, adminPublish } from '@/lib/api';
import type { ImageField } from '@/lib/types';

export type FieldType =
  | 'text'
  | 'translatable'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'image'
  | 'select'
  | 'date'
  | 'email'
  | 'url'
  | 'slug';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  multiline?: boolean;
}

interface ContentEditorProps {
  collection: string;
  id?: string;
  fields: FieldConfig[];
  onSave?: () => void;
}

export default function ContentEditor({ collection, id, fields, onSave }: ContentEditorProps) {
  const isNew = !id || id === 'new';

  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [seoOpen, setSeoOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isNew) {
      adminGet<Record<string, unknown>>(collection, id!)
        .then(setData)
        .catch(() => setError('Failed to load item'))
        .finally(() => setLoading(false));
    }
  }, [collection, id, isNew]);

  const getVal = (key: string) => data[key];
  const setVal = (key: string, val: unknown) =>
    setData((p) => ({ ...p, [key]: val }));

  const getT = (key: string, lang: 'en' | 'sw') => {
    const field = data[key] as { en?: string; sw?: string } | undefined;
    return field?.[lang] ?? '';
  };
  const setT = (key: string, lang: 'en' | 'sw', val: string) => {
    setData((p) => ({
      ...p,
      [key]: { ...(p[key] as { en?: string; sw?: string } | undefined), [lang]: val },
    }));
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    setError('');
    try {
      let saved: Record<string, unknown>;
      if (isNew) {
        saved = await adminCreate<Record<string, unknown>>(collection, data);
      } else {
        saved = await adminUpdate<Record<string, unknown>>(collection, id!, data);
      }
      if (publish && saved._id) {
        await adminPublish(collection, saved._id as string);
      }
      setSuccess(publish ? 'Published!' : 'Saved!');
      setTimeout(() => setSuccess(''), 3000);
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await adminDelete(collection, id);
      setConfirmDelete(false);
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'translatable':
        return (
          <TranslatableField
            key={field.key}
            label={field.label}
            enValue={getT(field.key, 'en')}
            swValue={getT(field.key, 'sw')}
            onEnChange={(v) => setT(field.key, 'en', v)}
            onSwChange={(v) => setT(field.key, 'sw', v)}
            multiline={field.multiline}
            required={field.required}
          />
        );

      case 'richtext':
        return (
          <div key={field.key}>
            <p className="block text-sm font-medium text-gray-700 mb-2">{field.label}</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">EN</label>
                <TipTapEditor
                  value={getT(field.key, 'en')}
                  onChange={(v) => setT(field.key, 'en', v)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">SW</label>
                <TipTapEditor
                  value={getT(field.key, 'sw')}
                  onChange={(v) => setT(field.key, 'sw', v)}
                />
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <ImageUploader
            key={field.key}
            label={field.label}
            value={(getVal(field.key) as ImageField | undefined)}
            onChange={(img) => setVal(field.key, img ?? undefined)}
          />
        );

      case 'boolean':
        return (
          <div key={field.key} className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!getVal(field.key)}
                onChange={(e) => setVal(field.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
          </div>
        );

      case 'number':
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
              type="number"
              value={String(getVal(field.key) ?? '')}
              onChange={(e) =>
                setVal(
                  field.key,
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
              className={inputClass}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <select
              value={String(getVal(field.key) ?? '')}
              onChange={(e) => setVal(field.key, e.target.value)}
              className={inputClass}
            >
              <option value="">— Select —</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'date':
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="date"
              value={String(getVal(field.key) ?? '').slice(0, 10)}
              onChange={(e) => setVal(field.key, e.target.value)}
              className={inputClass}
            />
          </div>
        );

      default:
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {field.multiline ? (
              <textarea
                value={String(getVal(field.key) ?? '')}
                onChange={(e) => setVal(field.key, e.target.value)}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            ) : (
              <input
                type={
                  field.type === 'email'
                    ? 'email'
                    : field.type === 'url'
                    ? 'url'
                    : 'text'
                }
                value={String(getVal(field.key) ?? '')}
                onChange={(e) => setVal(field.key, e.target.value)}
                className={inputClass}
              />
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {!isNew && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-red-600 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Globe className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Main fields */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {fields.map(renderField)}
      </div>

      {/* SEO Panel */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setSeoOpen((v) => !v)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>SEO Settings</span>
          {seoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {seoOpen && (
          <div className="p-4 border-t border-gray-100 space-y-4">
            <TranslatableField
              label="Meta Title"
              enValue={
                ((data.seo as Record<string, unknown> | undefined)?.meta_title as { en?: string } | undefined)?.en ?? ''
              }
              swValue={
                ((data.seo as Record<string, unknown> | undefined)?.meta_title as { sw?: string } | undefined)?.sw ?? ''
              }
              onEnChange={(v) =>
                setData((p) => ({
                  ...p,
                  seo: {
                    ...(p.seo as Record<string, unknown> | undefined),
                    meta_title: {
                      ...((p.seo as Record<string, unknown> | undefined)?.meta_title as object | undefined),
                      en: v,
                    },
                  },
                }))
              }
              onSwChange={(v) =>
                setData((p) => ({
                  ...p,
                  seo: {
                    ...(p.seo as Record<string, unknown> | undefined),
                    meta_title: {
                      ...((p.seo as Record<string, unknown> | undefined)?.meta_title as object | undefined),
                      sw: v,
                    },
                  },
                }))
              }
            />
            <TranslatableField
              label="Meta Description"
              enValue={
                ((data.seo as Record<string, unknown> | undefined)?.meta_description as { en?: string } | undefined)?.en ?? ''
              }
              swValue={
                ((data.seo as Record<string, unknown> | undefined)?.meta_description as { sw?: string } | undefined)?.sw ?? ''
              }
              onEnChange={(v) =>
                setData((p) => ({
                  ...p,
                  seo: {
                    ...(p.seo as Record<string, unknown> | undefined),
                    meta_description: {
                      ...((p.seo as Record<string, unknown> | undefined)?.meta_description as object | undefined),
                      en: v,
                    },
                  },
                }))
              }
              onSwChange={(v) =>
                setData((p) => ({
                  ...p,
                  seo: {
                    ...(p.seo as Record<string, unknown> | undefined),
                    meta_description: {
                      ...((p.seo as Record<string, unknown> | undefined)?.meta_description as object | undefined),
                      sw: v,
                    },
                  },
                }))
              }
              multiline
            />
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Item</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
