'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { adminGetSettings, adminUpdateSettings } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';
import SortableItem from '@/components/admin/SortableItem';
import ImageUploader from '@/components/admin/ImageUploader';

export default function SettingsPageClient() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    adminGetSettings()
      .then(setSettings)
      .catch(() => setSettings({}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await adminUpdateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const sections = settings.home_sections ?? [];
    const oldIndex = sections.findIndex((s) => s.key === active.id);
    const newIndex = sections.findIndex((s) => s.key === over.id);
    setSettings((s) => ({
      ...s,
      home_sections: arrayMove(sections, oldIndex, newIndex).map((sec, i) => ({
        ...sec,
        sort: i,
      })),
    }));
  };

  const updateField = (key: string, val: unknown) => {
    setSettings((s) => ({ ...s, [key]: val }));
  };

  const updateT = (field: string, lang: 'en' | 'sw', val: string) => {
    setSettings((s) => ({
      ...s,
      [field]: { ...((s as Record<string, unknown>)[field] as object ?? {}), [lang]: val },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Site Settings</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-orange-800 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 font-heading mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.company_name ?? ''}
                onChange={(e) => updateField('company_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-primary font-medium">EN</span>
                  <input
                    type="text"
                    value={(settings.slogan as { en: string; sw: string } | undefined)?.en ?? ''}
                    onChange={(e) => updateT('slogan', 'en', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <span className="text-xs text-green-600 font-medium">SW</span>
                  <input
                    type="text"
                    value={(settings.slogan as { en: string; sw: string } | undefined)?.sw ?? ''}
                    onChange={(e) => updateT('slogan', 'sw', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={settings.whatsapp_number ?? ''}
                  onChange={(e) => updateField('whatsapp_number', e.target.value)}
                  placeholder="+255712345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.google_analytics_id ?? ''}
                  onChange={(e) => updateField('google_analytics_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 font-heading mb-4">Logo</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Light Background)</label>
              <ImageUploader
                value={settings.logo}
                onChange={(img) => updateField('logo', img)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Dark Background)</label>
              <ImageUploader
                value={settings.logo_dark}
                onChange={(img) => updateField('logo_dark', img)}
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 font-heading mb-4">Social Media</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok'] as const).map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                <input
                  type="url"
                  value={settings.social?.[platform] ?? ''}
                  onChange={(e) => updateField('social', { ...settings.social, [platform]: e.target.value })}
                  placeholder={`https://${platform}.com/...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Home Sections */}
        {settings.home_sections && settings.home_sections.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 font-heading mb-4">Home Page Sections</h2>
            <p className="text-sm text-gray-500 mb-4">Drag to reorder. Toggle to show/hide.</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext
                items={(settings.home_sections ?? []).map((s) => s.key)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {settings.home_sections.map((section) => (
                    <SortableItem key={section.key} id={section.key}>
                      <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-gray-100">
                        <span className="flex-1 text-sm font-medium text-gray-900 capitalize">
                          {section.key.replace(/_/g, ' ')}
                        </span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={(e) => {
                              setSettings((s) => ({
                                ...s,
                                home_sections: s.home_sections?.map((sec) =>
                                  sec.key === section.key
                                    ? { ...sec, enabled: e.target.checked }
                                    : sec
                                ),
                              }));
                            }}
                            className="w-4 h-4 text-primary focus:ring-primary rounded"
                          />
                          <span className="text-xs text-gray-500">Enabled</span>
                        </label>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}
