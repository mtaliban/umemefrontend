import ContentList from '@/components/admin/ContentList';

export default function AdminServicesPage() {
  return (
    <ContentList
      collection="services"
      title="Services"
      addHref="/admin/services/new"
      editHref={(item) => `/admin/services/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'is_featured', label: 'Featured', render: (item) => (item as unknown as { is_featured: boolean }).is_featured ? '⭐' : '—' },
      ]}
      hasPublish
      hasSort
    />
  );
}
