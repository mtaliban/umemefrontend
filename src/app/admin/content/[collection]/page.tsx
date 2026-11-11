'use client';

import { use } from 'react';
import ContentList from '@/components/admin/ContentList';

interface CollectionConfig {
  title: string;
  hasPublish?: boolean;
  hasSort?: boolean;
  columns: Array<{
    key: string;
    label: string;
    render?: (item: Record<string, unknown>) => React.ReactNode;
  }>;
}

const COLLECTIONS: Record<string, CollectionConfig> = {
  'hero-slides': {
    title: 'Hero Slides',
    hasSort: true,
    columns: [
      { key: 'headline', label: 'Headline' },
      { key: 'sort', label: 'Sort' },
      {
        key: 'is_active',
        label: 'Active',
        render: (item) => (item.is_active ? '✓' : '—'),
      },
    ],
  },
  stats: {
    title: 'Statistics',
    hasSort: true,
    columns: [
      { key: 'label', label: 'Label' },
      { key: 'number', label: 'Number' },
      { key: 'suffix', label: 'Suffix' },
    ],
  },
  features: {
    title: 'Why Choose Us',
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'icon', label: 'Icon' },
    ],
  },
  'work-steps': {
    title: 'How We Work',
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'icon', label: 'Icon' },
    ],
  },
  pages: {
    title: 'Pages',
    columns: [
      { key: 'key', label: 'Page Key' },
      { key: 'title', label: 'Title' },
    ],
  },
  team: {
    title: 'Team Members',
    hasSort: true,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'position', label: 'Position' },
      {
        key: 'is_active',
        label: 'Active',
        render: (item) => (item.is_active ? '✓' : '—'),
      },
    ],
  },
  certifications: {
    title: 'Certifications',
    hasSort: true,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'issuer', label: 'Issuer' },
      { key: 'number', label: 'Number' },
    ],
  },
  'service-categories': {
    title: 'Service Categories',
    hasSort: true,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'icon', label: 'Icon' },
    ],
  },
  services: {
    title: 'Services',
    hasPublish: true,
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      {
        key: 'is_featured',
        label: 'Featured',
        render: (item) => (item.is_featured ? '⭐' : '—'),
      },
    ],
  },
  projects: {
    title: 'Projects',
    hasPublish: true,
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      {
        key: 'project_status',
        label: 'Status',
        render: (item) => {
          const s = item.project_status as string;
          return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s === 'completed' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
              {s}
            </span>
          );
        },
      },
      { key: 'region', label: 'Region' },
    ],
  },
  training: {
    title: 'Training Programmes',
    hasPublish: true,
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'mode', label: 'Mode' },
      {
        key: 'is_open',
        label: 'Open',
        render: (item) => (item.is_open ? '✓' : '—'),
      },
    ],
  },
  'training-intakes': {
    title: 'Training Intakes',
    columns: [
      { key: 'programme_id', label: 'Programme' },
      { key: 'start_date', label: 'Start Date' },
      { key: 'end_date', label: 'End Date' },
      { key: 'status', label: 'Status' },
      { key: 'seats', label: 'Seats' },
    ],
  },
  'training-steps': {
    title: 'Training Steps',
    hasSort: true,
    columns: [
      { key: 'number', label: '#' },
      { key: 'title', label: 'Title' },
    ],
  },
  clients: {
    title: 'Clients',
    hasSort: true,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      {
        key: 'is_featured',
        label: 'Featured',
        render: (item) => (item.is_featured ? '⭐' : '—'),
      },
    ],
  },
  testimonials: {
    title: 'Testimonials',
    hasSort: true,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'organisation', label: 'Organisation' },
      { key: 'rating', label: 'Rating' },
    ],
  },
  posts: {
    title: 'Posts / News',
    hasPublish: true,
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'slug', label: 'Slug' },
    ],
  },
  gallery: {
    title: 'Gallery Albums',
    hasPublish: true,
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'slug', label: 'Slug' },
    ],
  },
  faqs: {
    title: 'FAQs',
    hasSort: true,
    columns: [
      { key: 'question', label: 'Question' },
      { key: 'category', label: 'Category' },
      {
        key: 'is_active',
        label: 'Active',
        render: (item) => (item.is_active ? '✓' : '—'),
      },
    ],
  },
  offices: {
    title: 'Offices',
    hasSort: true,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      {
        key: 'is_head_office',
        label: 'Head Office',
        render: (item) => (item.is_head_office ? '⭐' : '—'),
      },
    ],
  },
  downloads: {
    title: 'Downloads',
    hasSort: true,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
    ],
  },
};

interface PageProps {
  params: Promise<{ collection: string }>;
}

export default function AdminCollectionPage({ params }: PageProps) {
  const { collection } = use(params);
  const config = COLLECTIONS[collection];

  if (!config) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500">Collection &ldquo;{collection}&rdquo; not found.</p>
      </div>
    );
  }

  return (
    <ContentList
      collection={collection}
      title={config.title}
      addHref={`/admin/content/${collection}/new`}
      editHref={(item) => `/admin/content/${collection}/${(item as { _id: string })._id}`}
      columns={config.columns}
      hasPublish={config.hasPublish}
      hasSort={config.hasSort}
    />
  );
}
