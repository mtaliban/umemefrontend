'use client';
import ContentList from '@/components/admin/ContentList';

export default function AdminPostsPage() {
  return (
    <ContentList
      collection="posts"
      title="News & Posts"
      addHref="/admin/posts/new"
      editHref={(item) => `/admin/posts/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'slug', label: 'Slug' },
        { key: 'published_at', label: 'Published', render: (item) => {
          const d = (item as unknown as { published_at?: string }).published_at;
          return d ? new Date(d).toLocaleDateString() : '—';
        }},
      ]}
      hasPublish
    />
  );
}
