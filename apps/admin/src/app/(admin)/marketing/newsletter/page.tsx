import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const MarketingNewsletterPage = () => {
  return (
    <>
      <PageTitle subName="Marketing" title="Newsletter" />
      
      <ComponentContainerCard
        id="newsletter-overview"
        title="Newsletter Management"
        description="Manage newsletter subscribers and campaigns."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:mail-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Subscribers Yet</h5>
            <p className="text-muted mb-0">
              This module will allow you to manage newsletter subscriptions and email campaigns.
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
            <li>Registry reference: <code>tables__gridjs</code> for subscriber list</li>
            <li>Registry reference: <code>forms__editors</code> for email composition</li>
            <li>Email integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default MarketingNewsletterPage
