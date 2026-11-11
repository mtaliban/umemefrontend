import ContentList from '@/components/admin/ContentList';

export default function AdminGalleryPage() {
  return (
    <ContentList
      collection="gallery"
      title="Gallery Albums"
      addHref="/admin/gallery/new"
      editHref={(item) => `/admin/gallery/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'slug', label: 'Slug' },
      ]}
      hasPublish
    />
  );
}
