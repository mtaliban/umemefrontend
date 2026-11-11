'use client';
import ContentList from '@/components/admin/ContentList';

export default function AdminTrainingPage() {
  return (
    <ContentList
      collection="training"
      title="Training Programmes"
      addHref="/admin/training/new"
      editHref={(item) => `/admin/training/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'is_open', label: 'Open', render: (item) => (item as unknown as { is_open: boolean }).is_open ? '✓ Open' : 'Closed' },
      ]}
      hasPublish
    />
  );
}
