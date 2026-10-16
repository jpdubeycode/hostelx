import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button, EmptyState } from '../../components/common'
import { useAuth } from '../../context/AuthContext'

export default function NotFound() {
  const { homePath } = useAuth()
  return (
    <div className="mx-auto max-w-md p-6 pt-24">
      <EmptyState icon={Compass} title="Page not found" message="That page doesn't exist or has moved."
        action={<Button as={Link} to={homePath}>Go to home</Button>} />
    </div>
  )
}
