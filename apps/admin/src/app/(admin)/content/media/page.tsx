import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const ContentMediaPage = () => {
  return (
    <>
      <PageTitle subName="Content" title="Media Library" />
      
      <ComponentContainerCard
        id="media-overview"
        title="Media Library"
        description="Upload and manage images, documents, and other media files."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:image-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Media Files Yet</h5>
            <p className="text-muted mb-0">
              This module will allow you to upload, organize, and manage all media assets.
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
            <li>Registry reference: <code>forms__file-uploads</code> for dropzone</li>
            <li>Will integrate with Supabase Storage (Phase 4+)</li>
            <li>Supports images, PDFs, and documents</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default ContentMediaPage
