export const dynamic = 'force-dynamic';
import ContentList from '@/components/admin/ContentList';

export default function AdminOfficesPage() {
  return (
    <ContentList
      collection="offices"
      title="Offices"
      addHref="/admin/offices/new"
      editHref={(item) => `/admin/offices/${item._id}`}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'is_head_office', label: 'Head Office', render: (item) => (item as unknown as { is_head_office: boolean }).is_head_office ? '✓ HQ' : '—' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
