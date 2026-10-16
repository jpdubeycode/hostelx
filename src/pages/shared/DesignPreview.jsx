import { useState } from 'react'
import { Users, DoorOpen, Wrench, Vote, Plus } from 'lucide-react'
import { Button, Card, CardHeader, Badge, StatusBadge, Input, Select, SearchBar, Modal, ProgressBar, StatCard, EmptyState, ErrorState, LoadingSpinner, Avatar } from '../../components/common'
import { useToast } from '../../context/ToastContext'

export default function DesignPreview() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Hostel<span className="text-brand-600">X</span> design system</h1>
        <p className="text-ink-soft">Foundation preview. Delete this page once routing lands.</p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Students" value="420" icon={Users} />
        <StatCard label="Occupied Rooms" value="138" icon={DoorOpen} tone="success" />
        <StatCard label="Pending Complaints" value="12" icon={Wrench} tone="warning" />
        <StatCard label="Active Polls" value="3" icon={Vote} tone="info" />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Buttons & badges" subtitle="Variants and statuses" />
          <div className="flex flex-wrap gap-2">
            <Button icon={Plus} onClick={() => toast.success('Complaint submitted successfully')}>Primary</Button>
            <Button variant="secondary" onClick={() => toast.info('Heads up!')}>Secondary</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="danger" onClick={() => toast.error('Something went wrong')}>Danger</Button>
            <Button loading>Saving</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['submitted', 'assigned', 'in_progress', 'resolved', 'high', 'emergency', 'active', 'closed', 'full', 'available'].map((s) => <StatusBadge key={s} status={s} />)}
            <Badge tone="brand">Custom</Badge>
          </div>
        </Card>

        <Card>
          <CardHeader title="Form controls" />
          <div className="space-y-3">
            <SearchBar value={q} onChange={setQ} placeholder="Search students, rooms…" />
            <Input label="Title" placeholder="Short summary" />
            <Select label="Category" placeholder="Select…" options={['Electrical', 'Plumbing', 'Cleaning', 'Internet']} />
            <Input label="Description" multiline placeholder="Describe the issue" error="Description is required" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Progress" subtitle="Poll result style" />
          <div className="space-y-3">
            <ProgressBar label="Biryani" value={48} showValue tone="success" />
            <ProgressBar label="Pizza" value={27} showValue />
            <ProgressBar label="Chowmein" value={15} showValue tone="warning" />
          </div>
          <div className="mt-5 flex items-center gap-3"><Avatar name="Jai Prakash Dubey" /><Avatar name="Rahul Kumar" /><Avatar name="Aman Singh" /></div>
        </Card>

        <Card>
          <CardHeader title="Modal" subtitle="Bottom sheet on mobile" />
          <Button variant="soft" onClick={() => setOpen(true)}>Open modal</Button>
        </Card>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <EmptyState title="No complaints found" message="You haven't raised any complaints yet." action={<Button icon={Plus}>Raise a Complaint</Button>} />
        <ErrorState onRetry={() => toast.info('Retrying…')} />
        <Card><LoadingSpinner /></Card>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Raise complaint"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); toast.success('Saved') }}>Submit</Button></>}>
        <Input label="Title" placeholder="e.g. Fan not working" />
      </Modal>
    </div>
  )
}
