import ContentList from '@/components/admin/ContentList';

export default function AdminTeamPage() {
  return (
    <ContentList
      collection="team"
      title="Team Members"
      addHref="/admin/team/new"
      editHref={(item) => `/admin/team/${item._id}`}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'position', label: 'Position' },
        { key: 'is_active', label: 'Active', render: (item) => (item as { is_active: boolean }).is_active ? '✓' : '—' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
