import ContentList from '@/components/admin/ContentList';

export default function AdminCertificationsPage() {
  return (
    <ContentList
      collection="certifications"
      title="Certifications"
      addHref="/admin/certifications/new"
      editHref={(item) => `/admin/certifications/${item._id}`}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'issuer', label: 'Issuer' },
        { key: 'number', label: 'Certificate Number' },
        { key: 'sort', label: 'Sort' },
      ]}
      hasSort
    />
  );
}
