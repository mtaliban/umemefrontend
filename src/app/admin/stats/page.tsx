import ContentList from '@/components/admin/ContentList';

export default function StatsPage() {
  return (
    <ContentList
      collection="stats"
      title="Statistics"
      addHref="/admin/content/stats/new"
      editHref={(item) => `/admin/content/stats/${item._id}`}
      columns={[
        { key: 'label', label: 'Label' },
        { key: 'number', label: 'Number' },
        { key: 'suffix', label: 'Suffix' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
