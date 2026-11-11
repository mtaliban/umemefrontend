export const dynamic = 'force-dynamic';
import ContentList from '@/components/admin/ContentList';

export default function AdminDownloadsPage() {
  return (
    <ContentList
      collection="downloads"
      title="Downloads"
      addHref="/admin/downloads/new"
      editHref={(item) => `/admin/downloads/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
