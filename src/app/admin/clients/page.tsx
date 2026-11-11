'use client';
import ContentList from '@/components/admin/ContentList';

export default function AdminClientsPage() {
  return (
    <ContentList
      collection="clients"
      title="Clients"
      addHref="/admin/clients/new"
      editHref={(item) => `/admin/clients/${item._id}`}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'is_featured', label: 'Featured', render: (item) => (item as unknown as { is_featured: boolean }).is_featured ? '⭐' : '—' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
