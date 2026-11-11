import ContentList from '@/components/admin/ContentList';

export default function WorkStepsPage() {
  return (
    <ContentList
      collection="work-steps"
      title="How We Work"
      addHref="/admin/content/work-steps/new"
      editHref={(item) => `/admin/content/work-steps/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
