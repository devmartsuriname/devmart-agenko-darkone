import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const SystemUsersPage = () => {
  return (
    <>
      <PageTitle subName="System" title="Users" />
      
      <ComponentContainerCard
        id="users-overview"
        title="User Management"
        description="Manage admin users and their access permissions."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:user-add-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Users Configured</h5>
            <p className="text-muted mb-0">
              This module will allow you to manage admin users, invite team members, and control access.
            </p>
          </CardBody>
        </Card>
      </ComponentContainerCard>

      <Card className="mt-3">
        <CardBody>
          <h6 className="text-muted mb-3">
            <IconifyIcon icon="mingcute:info-line" className="me-1" />
            Usage Notes
          </h6>
          <ul className="text-muted small mb-0">
            <li>Registry reference: <code>tables__gridjs</code> for user listing</li>
            <li>Registry reference: <code>base-ui__avatar</code> for user avatars</li>
            <li>Supabase Auth integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default SystemUsersPage
