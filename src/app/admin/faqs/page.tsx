'use client';
import ContentList from '@/components/admin/ContentList';

export default function AdminFaqsPage() {
  return (
    <ContentList
      collection="faqs"
      title="FAQs"
      addHref="/admin/faqs/new"
      editHref={(item) => `/admin/faqs/${item._id}`}
      columns={[
        { key: 'question', label: 'Question' },
        { key: 'category', label: 'Category' },
        { key: 'is_active', label: 'Active', render: (item) => (item as unknown as { is_active: boolean }).is_active ? '✓' : '—' },
      ]}
      hasSort
    />
  );
}
