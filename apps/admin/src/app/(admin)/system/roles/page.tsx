import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const SystemRolesPage = () => {
  return (
    <>
      <PageTitle subName="System" title="Roles" />
      
      <ComponentContainerCard
        id="roles-overview"
        title="Role Management"
        description="Define roles and permissions for admin users."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:key-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Roles Defined</h5>
            <p className="text-muted mb-0">
              This module will allow you to create custom roles with granular permissions.
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
            <li>Registry reference: <code>forms__basic</code> for role configuration</li>
            <li>Registry reference: <code>base-ui__tabs</code> for permission categories</li>
            <li>Supabase RLS integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default SystemRolesPage
