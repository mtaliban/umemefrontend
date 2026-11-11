'use client';
import ContentList from '@/components/admin/ContentList';

export default function AdminTestimonialsPage() {
  return (
    <ContentList
      collection="testimonials"
      title="Testimonials"
      addHref="/admin/testimonials/new"
      editHref={(item) => `/admin/testimonials/${item._id}`}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'organisation', label: 'Organisation' },
        { key: 'rating', label: 'Rating' },
        { key: 'is_active', label: 'Active', render: (item) => (item as unknown as { is_active: boolean }).is_active ? '✓' : '—' },
      ]}
      hasSort
    />
  );
}
