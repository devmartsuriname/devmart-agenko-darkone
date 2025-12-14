import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const ContentPagesPage = () => {
  return (
    <>
      <PageTitle subName="Content" title="Pages" />
      
      <ComponentContainerCard
        id="pages-overview"
        title="Pages Management"
        description="Create and manage static pages for your website."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:file-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Pages Yet</h5>
            <p className="text-muted mb-0">
              This module will allow you to create and manage static pages like About, Terms, Privacy, etc.
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
            <li>Registry reference: <code>pages__static</code> (planned)</li>
            <li>Database integration pending (Phase 4+)</li>
            <li>Will support rich text editing via Quill editor</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default ContentPagesPage
