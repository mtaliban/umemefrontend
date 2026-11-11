import ContentList from '@/components/admin/ContentList';

export default function AdminTrainingIntakesPage() {
  return (
    <ContentList
      collection="training-intakes"
      title="Training Intakes"
      addHref="/admin/training-intakes/new"
      editHref={(item) => `/admin/training-intakes/${item._id}`}
      columns={[
        { key: 'programme_id', label: 'Programme' },
        { key: 'start_date', label: 'Start Date', render: (item) => {
          const d = (item as { start_date: string }).start_date;
          return new Date(d).toLocaleDateString();
        }},
        { key: 'end_date', label: 'End Date', render: (item) => {
          const d = (item as { end_date: string }).end_date;
          return new Date(d).toLocaleDateString();
        }},
        { key: 'status', label: 'Status' },
        { key: 'seats', label: 'Seats' },
      ]}
    />
  );
}
