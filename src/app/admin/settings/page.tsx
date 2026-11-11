'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableItem from '@/components/admin/SortableItem';
import TranslatableField from '@/components/admin/TranslatableField';
import ImageUploader from '@/components/admin/ImageUploader';
import { adminGetSettings, adminUpdateSettings } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminGetSettings()
      .then(setSettings)
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await adminUpdateSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const setT = (key: string, lang: 'en' | 'sw', val: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...(prev[key as keyof SiteSettings] as { en: string; sw: string } | undefined), [lang]: val },
    }));
  };

  const getT = (key: string, lang: 'en' | 'sw') => {
    const field = settings[key as keyof SiteSettings] as { en: string; sw: string } | undefined;
    return field?.[lang] ?? '';
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleSectionsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const sections = settings.home_sections ?? [];
    const oldIdx = sections.findIndex((s) => s.key === active.id);
    const newIdx = sections.findIndex((s) => s.key === over.id);
    const reordered = arrayMove(sections, oldIdx, newIdx).map((s, i) => ({ ...s, sort: i }));
    setSettings((prev) => ({ ...prev, home_sections: reordered }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900 font-heading border-b border-gray-100 pb-3">{title}</h2>
      {children}
    </div>
  );

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Site Settings</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}
      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">Settings saved successfully.</div>
      )}

      <div className="space-y-6">
        {/* Company Info */}
        <Section title="Company Information">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={settings.company_name ?? ''}
              onChange={(e) => setSettings((p) => ({ ...p, company_name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <TranslatableField
            label="Slogan"
            enValue={getT('slogan', 'en')}
            swValue={getT('slogan', 'sw')}
            onEnChange={(v) => setT('slogan', 'en', v)}
            onSwChange={(v) => setT('slogan', 'sw', v)}
          />
          <TranslatableField
            label="Working Hours"
            enValue={getT('working_hours', 'en')}
            swValue={getT('working_hours', 'sw')}
            onEnChange={(v) => setT('working_hours', 'en', v)}
            onSwChange={(v) => setT('working_hours', 'sw', v)}
          />
          <TranslatableField
            label="Address"
            enValue={getT('address', 'en')}
            swValue={getT('address', 'sw')}
            onEnChange={(v) => setT('address', 'en', v)}
            onSwChange={(v) => setT('address', 'sw', v)}
            multiline
          />
          {/* Phones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
            {(settings.phones ?? []).map((phone, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const phones = [...(settings.phones ?? [])];
                    phones[i] = e.target.value;
                    setSettings((p) => ({ ...p, phones }));
                  }}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const phones = (settings.phones ?? []).filter((_, j) => j !== i);
                    setSettings((p) => ({ ...p, phones }));
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSettings((p) => ({ ...p, phones: [...(p.phones ?? []), ''] }))}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" /> Add Phone
            </button>
          </div>
          {/* Emails */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
            {(settings.emails ?? []).map((email, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const emails = [...(settings.emails ?? [])];
                    emails[i] = e.target.value;
                    setSettings((p) => ({ ...p, emails }));
                  }}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const emails = (settings.emails ?? []).filter((_, j) => j !== i);
                    setSettings((p) => ({ ...p, emails }));
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSettings((p) => ({ ...p, emails: [...(p.emails ?? []), ''] }))}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" /> Add Email
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={settings.whatsapp_number ?? ''}
              onChange={(e) => setSettings((p) => ({ ...p, whatsapp_number: e.target.value }))}
              className={inputClass}
            />
          </div>
        </Section>

        {/* Logos */}
        <Section title="Logo & Favicon">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Logo (Light)</p>
              <ImageUploader
                value={settings.logo}
                onChange={(img) => setSettings((p) => ({ ...p, logo: img ?? undefined }))}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Logo (Dark)</p>
              <ImageUploader
                value={settings.logo_dark}
                onChange={(img) => setSettings((p) => ({ ...p, logo_dark: img ?? undefined }))}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Favicon</p>
              <ImageUploader
                value={settings.favicon}
                onChange={(img) => setSettings((p) => ({ ...p, favicon: img ?? undefined }))}
              />
            </div>
          </div>
        </Section>

        {/* Social Links */}
        <Section title="Social Media Links">
          {(['facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok'] as const).map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
              <input
                type="url"
                value={settings.social?.[platform] ?? ''}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    social: { ...p.social, [platform]: e.target.value },
                  }))
                }
                className={inputClass}
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </Section>

        {/* Footer */}
        <Section title="Footer">
          <TranslatableField
            label="Footer Text"
            enValue={getT('footer_text', 'en')}
            swValue={getT('footer_text', 'sw')}
            onEnChange={(v) => setT('footer_text', 'en', v)}
            onSwChange={(v) => setT('footer_text', 'sw', v)}
            multiline
          />
        </Section>

        {/* CTA */}
        <Section title="Call to Action (CTA)">
          <TranslatableField
            label="CTA Title"
            enValue={settings.cta?.title?.en ?? ''}
            swValue={settings.cta?.title?.sw ?? ''}
            onEnChange={(v) => setSettings((p) => ({ ...p, cta: { ...p.cta!, title: { ...p.cta?.title, en: v, sw: p.cta?.title?.sw ?? '' } } }))}
            onSwChange={(v) => setSettings((p) => ({ ...p, cta: { ...p.cta!, title: { ...p.cta?.title, en: p.cta?.title?.en ?? '', sw: v } } }))}
          />
          <TranslatableField
            label="CTA Text"
            enValue={settings.cta?.text?.en ?? ''}
            swValue={settings.cta?.text?.sw ?? ''}
            onEnChange={(v) => setSettings((p) => ({ ...p, cta: { ...p.cta!, text: { ...p.cta?.text, en: v, sw: p.cta?.text?.sw ?? '' } } }))}
            onSwChange={(v) => setSettings((p) => ({ ...p, cta: { ...p.cta!, text: { ...p.cta?.text, en: p.cta?.text?.en ?? '', sw: v } } }))}
            multiline
          />
          <TranslatableField
            label="Button Label"
            enValue={settings.cta?.button_label?.en ?? ''}
            swValue={settings.cta?.button_label?.sw ?? ''}
            onEnChange={(v) => setSettings((p) => ({ ...p, cta: { ...p.cta!, button_label: { ...p.cta?.button_label, en: v, sw: p.cta?.button_label?.sw ?? '' } } }))}
            onSwChange={(v) => setSettings((p) => ({ ...p, cta: { ...p.cta!, button_label: { ...p.cta?.button_label, en: p.cta?.button_label?.en ?? '', sw: v } } }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
            <input
              type="text"
              value={settings.cta?.button_url ?? ''}
              onChange={(e) => setSettings((p) => ({ ...p, cta: { ...p.cta!, button_url: e.target.value } }))}
              className={inputClass}
            />
          </div>
        </Section>

        {/* Home Sections */}
        <Section title="Home Page Sections (Order & Visibility)">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionsDragEnd}
          >
            <SortableContext
              items={(settings.home_sections ?? []).map((s) => s.key)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {(settings.home_sections ?? []).map((section) => (
                  <SortableItem key={section.key} id={section.key}>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-1 text-sm font-medium text-gray-700 capitalize">
                        {section.key.replace(/_/g, ' ')}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={(e) => {
                            const sections = (settings.home_sections ?? []).map((s) =>
                              s.key === section.key ? { ...s, enabled: e.target.checked } : s
                            );
                            setSettings((p) => ({ ...p, home_sections: sections }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Section>

        {/* Notifications */}
        <Section title="Notification Emails">
          {(settings.notify_emails ?? []).map((email, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const notify_emails = [...(settings.notify_emails ?? [])];
                  notify_emails[i] = e.target.value;
                  setSettings((p) => ({ ...p, notify_emails }));
                }}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => {
                  const notify_emails = (settings.notify_emails ?? []).filter((_, j) => j !== i);
                  setSettings((p) => ({ ...p, notify_emails }));
                }}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSettings((p) => ({ ...p, notify_emails: [...(p.notify_emails ?? []), ''] }))}
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4" /> Add Email
          </button>
        </Section>

        {/* Analytics */}
        <Section title="Analytics">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics 4 ID</label>
            <input
              type="text"
              value={settings.google_analytics_id ?? ''}
              onChange={(e) => setSettings((p) => ({ ...p, google_analytics_id: e.target.value }))}
              placeholder="G-XXXXXXXXXX"
              className={inputClass}
            />
          </div>
        </Section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
