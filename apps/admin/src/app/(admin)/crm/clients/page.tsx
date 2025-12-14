import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const CrmClientsPage = () => {
  return (
    <>
      <PageTitle subName="CRM" title="Clients" />
      
      <ComponentContainerCard
        id="clients-overview"
        title="Client Management"
        description="Manage your client database and relationships."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:user-3-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Clients Yet</h5>
            <p className="text-muted mb-0">
              This module will allow you to track clients, their projects, and contact history.
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
            <li>Registry reference: <code>tables__gridjs</code> for client listing</li>
            <li>Registry reference: <code>forms__basic</code> for client forms</li>
            <li>Database integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default CrmClientsPage
