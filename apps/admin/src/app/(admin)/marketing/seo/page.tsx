import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const MarketingSeoPage = () => {
  return (
    <>
      <PageTitle subName="Marketing" title="SEO" />
      
      <ComponentContainerCard
        id="seo-overview"
        title="SEO Settings"
        description="Manage meta tags, sitemaps, and search engine optimization."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:search-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">SEO Configuration Pending</h5>
            <p className="text-muted mb-0">
              This module will allow you to configure global SEO settings, meta tags, and analytics.
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
            <li>Registry reference: <code>forms__basic</code> for meta input fields</li>
            <li>Will include Google Analytics integration</li>
            <li>Database integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default MarketingSeoPage
