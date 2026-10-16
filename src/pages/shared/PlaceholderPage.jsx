import { Construction } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import { EmptyState } from '../../components/common'

/** Stand-in for pages that are not built yet. Replace the page's body, keep its file. */
export default function PlaceholderPage({ title, subtitle }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <EmptyState icon={Construction} title="Coming soon" message="This page is part of the build plan and will be filled in next." />
    </>
  )
}
