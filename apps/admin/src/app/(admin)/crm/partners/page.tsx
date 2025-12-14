import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const CrmPartnersPage = () => {
  return (
    <>
      <PageTitle subName="CRM" title="Partners" />
      
      <ComponentContainerCard
        id="partners-overview"
        title="Partner Management"
        description="Manage business partners and collaborations."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:group-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Partners Yet</h5>
            <p className="text-muted mb-0">
              This module will allow you to track business partners and collaborative relationships.
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
            <li>Registry reference: <code>base-ui__cards</code> for partner cards</li>
            <li>Registry reference: <code>base-ui__avatar</code> for partner logos</li>
            <li>Database integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default CrmPartnersPage
