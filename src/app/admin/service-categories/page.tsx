export const dynamic = 'force-dynamic';
import ContentList from '@/components/admin/ContentList';

export default function AdminServiceCategoriesPage() {
  return (
    <ContentList
      collection="service-categories"
      title="Service Categories"
      addHref="/admin/service-categories/new"
      editHref={(item) => `/admin/service-categories/${item._id}`}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
