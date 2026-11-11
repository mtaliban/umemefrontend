import ContentList from '@/components/admin/ContentList';

export default function HeroSlidesPage() {
  return (
    <ContentList
      collection="hero-slides"
      title="Hero Slides"
      addHref="/admin/content/hero-slides/new"
      editHref={(item) => `/admin/content/hero-slides/${item._id}`}
      columns={[
        { key: 'headline', label: 'Headline' },
        { key: 'sort', label: 'Sort' },
        { key: 'is_active', label: 'Active', render: (item) => (item as unknown as { is_active: boolean }).is_active ? '✓' : '—' },
      ]}
      hasSort
    />
  );
}
