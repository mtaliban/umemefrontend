'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown, ChevronUp, Trash2, Save, Globe } from 'lucide-react';
import TranslatableField from '@/components/admin/TranslatableField';
import ImageUploader from '@/components/admin/ImageUploader';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { adminGet, adminCreate, adminUpdate, adminDelete, adminPublish } from '@/lib/api';
import type { ImageField } from '@/lib/types';

type FieldType = 'text' | 'translatable' | 'richtext' | 'number' | 'boolean' | 'image' | 'select' | 'date' | 'email' | 'url' | 'slug';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  multiline?: boolean;
}

interface CollectionEditorConfig {
  title: string;
  fields: FieldConfig[];
}

const COLLECTIONS: Record<string, CollectionEditorConfig> = {
  'hero-slides': {
    title: 'Hero Slide',
    fields: [
      { key: 'headline', label: 'Headline', type: 'translatable', required: true },
      { key: 'text', label: 'Sub-text', type: 'translatable', multiline: true },
      { key: 'image', label: 'Background Image', type: 'image' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  stats: {
    title: 'Statistic',
    fields: [
      { key: 'label', label: 'Label', type: 'translatable', required: true },
      { key: 'number', label: 'Number', type: 'number', required: true },
      { key: 'suffix', label: 'Suffix (e.g. +, %)', type: 'text' },
      { key: 'icon', label: 'Icon name (lucide)', type: 'text' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
  features: {
    title: 'Why Choose Us Feature',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'text', label: 'Description', type: 'translatable', multiline: true },
      { key: 'icon', label: 'Icon name (lucide)', type: 'text' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
  'work-steps': {
    title: 'How We Work Step',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'text', label: 'Description', type: 'translatable', multiline: true },
      { key: 'icon', label: 'Icon name (lucide)', type: 'text' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
  team: {
    title: 'Team Member',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'translatable', required: true },
      { key: 'bio', label: 'Biography', type: 'translatable', multiline: true },
      { key: 'photo', label: 'Photo', type: 'image' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  certifications: {
    title: 'Certification',
    fields: [
      { key: 'name', label: 'Name', type: 'translatable', required: true },
      { key: 'issuer', label: 'Issuing Body', type: 'text' },
      { key: 'number', label: 'Certificate Number', type: 'text' },
      { key: 'logo', label: 'Logo', type: 'image' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
  'service-categories': {
    title: 'Service Category',
    fields: [
      { key: 'name', label: 'Name', type: 'translatable', required: true },
      { key: 'slug', label: 'Slug', type: 'slug' },
      { key: 'icon', label: 'Icon name (lucide)', type: 'text' },
      { key: 'colour', label: 'Colour (hex)', type: 'text' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
  services: {
    title: 'Service',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'slug', label: 'Slug (EN)', type: 'slug' },
      { key: 'slug_sw', label: 'Slug (SW)', type: 'slug' },
      { key: 'summary', label: 'Summary', type: 'translatable', multiline: true },
      { key: 'body', label: 'Full Description', type: 'richtext' },
      { key: 'cover', label: 'Cover Image', type: 'image' },
      { key: 'icon', label: 'Icon name (lucide)', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
    ],
  },
  projects: {
    title: 'Project',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'slug', label: 'Slug (EN)', type: 'slug' },
      { key: 'slug_sw', label: 'Slug (SW)', type: 'slug' },
      { key: 'client_name', label: 'Client Name', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'region', label: 'Region', type: 'text' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
      {
        key: 'project_status', label: 'Project Status', type: 'select',
        options: [
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
        ],
      },
      { key: 'summary', label: 'Summary', type: 'translatable', multiline: true },
      { key: 'scope', label: 'Scope', type: 'richtext' },
      { key: 'outcome', label: 'Outcome', type: 'richtext' },
      { key: 'cover', label: 'Cover Image', type: 'image' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'hide_value', label: 'Hide Project Value', type: 'boolean' },
    ],
  },
  training: {
    title: 'Training Programme',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'slug', label: 'Slug (EN)', type: 'slug' },
      { key: 'slug_sw', label: 'Slug (SW)', type: 'slug' },
      { key: 'summary', label: 'Summary', type: 'translatable', multiline: true },
      { key: 'audience', label: 'Who Should Attend', type: 'translatable', multiline: true },
      { key: 'requirements', label: 'Requirements', type: 'translatable', multiline: true },
      { key: 'outline', label: 'Programme Outline', type: 'richtext' },
      { key: 'duration', label: 'Duration', type: 'translatable' },
      {
        key: 'mode', label: 'Delivery Mode', type: 'select',
        options: [
          { value: 'classroom', label: 'Classroom' },
          { value: 'field', label: 'Field' },
          { value: 'online', label: 'Online' },
          { value: 'blended', label: 'Blended' },
        ],
      },
      { key: 'fee_tzs', label: 'Fee (TZS)', type: 'number' },
      { key: 'certificate', label: 'Certificate', type: 'translatable' },
      { key: 'venue', label: 'Venue', type: 'translatable' },
      { key: 'cover', label: 'Cover Image', type: 'image' },
      { key: 'is_open', label: 'Applications Open', type: 'boolean' },
    ],
  },
  'training-intakes': {
    title: 'Training Intake',
    fields: [
      { key: 'start_date', label: 'Start Date', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', type: 'date', required: true },
      { key: 'venue', label: 'Venue', type: 'translatable' },
      { key: 'seats', label: 'Seats', type: 'number' },
      {
        key: 'status', label: 'Status', type: 'select',
        options: [
          { value: 'open', label: 'Open' },
          { value: 'closed', label: 'Closed' },
          { value: 'full', label: 'Full' },
        ],
      },
    ],
  },
  'training-steps': {
    title: 'Training Step',
    fields: [
      { key: 'number', label: 'Step Number', type: 'number', required: true },
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'text', label: 'Description', type: 'translatable', multiline: true },
      { key: 'icon', label: 'Icon name (lucide)', type: 'text' },
    ],
  },
  clients: {
    title: 'Client',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      {
        key: 'type', label: 'Type', type: 'select',
        options: [
          { value: 'government', label: 'Government' },
          { value: 'private', label: 'Private' },
          { value: 'ngo', label: 'NGO' },
        ],
      },
      { key: 'logo', label: 'Logo', type: 'image' },
      { key: 'url', label: 'Website URL', type: 'url' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
  testimonials: {
    title: 'Testimonial',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'translatable' },
      { key: 'organisation', label: 'Organisation', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'translatable', multiline: true },
      { key: 'photo', label: 'Photo', type: 'image' },
      {
        key: 'rating', label: 'Rating (1-5)', type: 'select',
        options: ['1', '2', '3', '4', '5'].map((v) => ({ value: v, label: `${v} star${v === '1' ? '' : 's'}` })),
      },
      { key: 'sort', label: 'Sort Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  posts: {
    title: 'Post / News',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'slug', label: 'Slug (EN)', type: 'slug' },
      { key: 'slug_sw', label: 'Slug (SW)', type: 'slug' },
      {
        key: 'category', label: 'Category', type: 'select',
        options: [
          { value: 'news', label: 'News' },
          { value: 'announcement', label: 'Announcement' },
          { value: 'event', label: 'Event' },
          { value: 'tender', label: 'Tender' },
        ],
      },
      { key: 'excerpt', label: 'Excerpt', type: 'translatable', multiline: true },
      { key: 'body', label: 'Body', type: 'richtext' },
      { key: 'cover', label: 'Cover Image', type: 'image' },
      { key: 'published_at', label: 'Published At', type: 'date' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
    ],
  },
  gallery: {
    title: 'Gallery Album',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'slug', label: 'Slug (EN)', type: 'slug' },
      { key: 'slug_sw', label: 'Slug (SW)', type: 'slug' },
      {
        key: 'category', label: 'Category', type: 'select',
        options: [
          { value: 'projects', label: 'Projects' },
          { value: 'training', label: 'Training' },
          { value: 'events', label: 'Events' },
          { value: 'team', label: 'Team' },
        ],
      },
      { key: 'cover', label: 'Cover Image', type: 'image' },
    ],
  },
  faqs: {
    title: 'FAQ',
    fields: [
      {
        key: 'category', label: 'Category', type: 'select',
        options: [
          { value: 'general', label: 'General' },
          { value: 'electricity', label: 'Electricity' },
          { value: 'water', label: 'Water' },
          { value: 'training', label: 'Training' },
        ],
      },
      { key: 'question', label: 'Question', type: 'translatable', required: true },
      { key: 'answer', label: 'Answer', type: 'translatable', multiline: true },
      { key: 'sort', label: 'Sort Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  offices: {
    title: 'Office',
    fields: [
      { key: 'name', label: 'Name', type: 'translatable', required: true },
      { key: 'address', label: 'Address', type: 'translatable', multiline: true },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'hours', label: 'Working Hours', type: 'translatable' },
      { key: 'lat', label: 'Latitude', type: 'number' },
      { key: 'lng', label: 'Longitude', type: 'number' },
      { key: 'is_head_office', label: 'Head Office', type: 'boolean' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
  downloads: {
    title: 'Download',
    fields: [
      { key: 'title', label: 'Title', type: 'translatable', required: true },
      { key: 'file', label: 'File URL', type: 'url' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'sort', label: 'Sort Order', type: 'number' },
    ],
  },
};

interface PageProps {
  params: Promise<{ collection: string; id: string }>;
}

export default function AdminContentEditorPage({ params }: PageProps) {
  const { collection, id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const config = COLLECTIONS[collection];
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [seoOpen, setSeoOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isNew && config) {
      adminGet<Record<string, unknown>>(collection, id)
        .then(setData)
        .catch(() => setError('Failed to load item'))
        .finally(() => setLoading(false));
    }
  }, [collection, id, isNew, config]);

  if (!config) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500">Collection &ldquo;{collection}&rdquo; not found.</p>
      </div>
    );
  }

  const getVal = (key: string) => data[key];
  const setVal = (key: string, val: unknown) => setData((p) => ({ ...p, [key]: val }));
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
        saved = await adminUpdate<Record<string, unknown>>(collection, id, data);
      }
      if (publish && saved._id) {
        await adminPublish(collection, saved._id as string);
      }
      setSuccess(publish ? 'Published successfully!' : 'Saved successfully!');
      setTimeout(() => {
        router.push(`/admin/content/${collection}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDelete(collection, id);
      router.push(`/admin/content/${collection}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary';

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
              onChange={(e) => setVal(field.key, e.target.value === '' ? undefined : Number(e.target.value))}
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
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
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
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            type="button"
            onClick={() => router.push(`/admin/content/${collection}`)}
            className="text-sm text-gray-500 hover:text-primary mb-1 flex items-center gap-1"
          >
            ← Back to {config.title}s
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            {isNew ? `Add ${config.title}` : `Edit ${config.title}`}
          </h1>
        </div>
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
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {config.fields.map(renderField)}
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
              enValue={getT('seo.meta_title', 'en')}
              swValue={getT('seo.meta_title', 'sw')}
              onEnChange={(v) => {
                setData((p) => ({
                  ...p,
                  seo: { ...(p.seo as Record<string, unknown> | undefined), meta_title: { ...(p.seo as Record<string, unknown> | undefined)?.meta_title as object, en: v } },
                }));
              }}
              onSwChange={(v) => {
                setData((p) => ({
                  ...p,
                  seo: { ...(p.seo as Record<string, unknown> | undefined), meta_title: { ...(p.seo as Record<string, unknown> | undefined)?.meta_title as object, sw: v } },
                }));
              }}
            />
            <TranslatableField
              label="Meta Description"
              enValue={(data.seo as Record<string, unknown> | undefined)?.meta_description ? ((data.seo as Record<string, unknown>).meta_description as { en?: string; sw?: string })?.en ?? '' : ''}
              swValue={(data.seo as Record<string, unknown> | undefined)?.meta_description ? ((data.seo as Record<string, unknown>).meta_description as { en?: string; sw?: string })?.sw ?? '' : ''}
              onEnChange={(v) => {
                setData((p) => ({
                  ...p,
                  seo: { ...(p.seo as Record<string, unknown> | undefined), meta_description: { ...(p.seo as Record<string, unknown> | undefined)?.meta_description as object, en: v } },
                }));
              }}
              onSwChange={(v) => {
                setData((p) => ({
                  ...p,
                  seo: { ...(p.seo as Record<string, unknown> | undefined), meta_description: { ...(p.seo as Record<string, unknown> | undefined)?.meta_description as object, sw: v } },
                }));
              }}
              multiline
            />
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Item</h3>
            <p className="text-sm text-gray-600 mb-5">Are you sure? This action cannot be undone.</p>
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
