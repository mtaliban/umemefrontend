'use client';
import ContentList from '@/components/admin/ContentList';

export default function FeaturesPage() {
  return (
    <ContentList
      collection="features"
      title="Why Choose Us"
      addHref="/admin/content/features/new"
      editHref={(item) => `/admin/content/features/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
