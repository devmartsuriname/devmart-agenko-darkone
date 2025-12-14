import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const ContentProjectsPage = () => {
  return (
    <>
      <PageTitle subName="Content" title="Projects" />
      
      <ComponentContainerCard
        id="projects-overview"
        title="Portfolio / Case Studies"
        description="Manage your portfolio projects and case studies."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:folder-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Projects Yet</h5>
            <p className="text-muted mb-0">
              This module will allow you to showcase portfolio items with images, descriptions, and client details.
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
            <li>Registry reference: <code>base-ui__cards</code> for project cards</li>
            <li>Registry reference: <code>forms__file-uploads</code> for project images</li>
            <li>Database integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default ContentProjectsPage
