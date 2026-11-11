export const dynamic = 'force-dynamic';
import ContentList from '@/components/admin/ContentList';

export default function AdminTrainingStepsPage() {
  return (
    <ContentList
      collection="training-steps"
      title="Training Steps"
      addHref="/admin/training-steps/new"
      editHref={(item) => `/admin/training-steps/${item._id}`}
      columns={[
        { key: 'number', label: 'Step #' },
        { key: 'title', label: 'Title' },
      ]}
    />
  );
}
