import ContentList from '@/components/admin/ContentList';

export default function AdminProjectsPage() {
  return (
    <ContentList
      collection="projects"
      title="Projects"
      addHref="/admin/projects/new"
      editHref={(item) => `/admin/projects/${item._id}`}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        {
          key: 'project_status',
          label: 'Project Status',
          render: (item) => {
            const status = (item as { project_status: string }).project_status;
            return (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'
              }`}>
                {status}
              </span>
            );
          },
        },
        { key: 'region', label: 'Region' },
      ]}
      hasPublish
      hasSort
    />
  );
}
