/**
 * DEV ONLY — DO NOT SHIP
 * Demo Library: Forms Showcase
 * Registry IDs: forms__* (see darkone-demo-library.registry.json)
 */

import { Navigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, Alert } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

const formPages = [
  { title: 'Basic Elements', path: '/forms/basic', registryId: 'forms__basic_inputs', mode: 'REFERENCE_ONLY' },
  { title: 'Flatpickr Date/Time', path: '/forms/flat-picker', registryId: 'forms__flatpickr_datetime', mode: 'COPY_SNIPPET' },
  { title: 'Form Validation', path: '/forms/validation', registryId: 'forms__validation', mode: 'COPY_SNIPPET' },
  { title: 'File Uploads', path: '/forms/file-uploads', registryId: 'forms__file_upload', mode: 'COPY_SNIPPET' },
  { title: 'Rich Text Editors', path: '/forms/editors', registryId: 'forms__quill_editor', mode: 'COPY_SNIPPET' },
]

const DemoLibraryForms = () => {
  // Hard enforcement: redirect to 404 in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/error-pages/pages-404" replace />
  }

  return (
    <>
      <PageTitle 
        title="Forms Showcase" 
        breadcrumbs={[
          { name: 'Dashboard', link: '/' }, 
          { name: 'Demo Library', link: '/demo-library' },
          { name: 'Forms' }
        ]} 
      />
      
      <Container fluid>
        <Alert variant="warning" className="mb-4">
          <strong>⚠️ DEV ONLY — DO NOT SHIP</strong>
          <span className="ms-2">This showcase references existing Darkone form components.</span>
        </Alert>

        <Card className="mb-4">
          <CardBody>
            <h5>Usage Notes</h5>
            <p className="text-muted mb-3">
              Forms use react-bootstrap Form components with react-hook-form for validation.
              Flatpickr and react-dropzone are used for specialized inputs.
            </p>
            <h6>Dependencies</h6>
            <code className="small">react-bootstrap, react-hook-form, @hookform/resolvers, yup, react-flatpickr, react-dropzone, react-quill</code>
          </CardBody>
        </Card>

        <Row>
          {formPages.map((page) => (
            <Col lg={4} md={6} key={page.path}>
              <Card className="mb-3">
                <CardBody>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                      <IconifyIcon icon="mingcute:edit-line" className="text-primary" height={24} width={24} />
                    </div>
                    <div>
                      <h5 className="mb-0">{page.title}</h5>
                      <small className="text-muted">{page.mode}</small>
                    </div>
                  </div>
                  <p className="small text-muted mb-2">
                    <code>{page.registryId}</code>
                  </p>
                  <Link to={page.path} className="btn btn-soft-primary btn-sm">
                    View Component →
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="mt-3">
          <CardBody>
            <h6>Source Files</h6>
            <ul className="small mb-0">
              <li><code>apps/admin/src/app/(admin)/forms/basic/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/forms/flat-picker/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/forms/validation/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/forms/file-uploads/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/forms/editors/page.tsx</code></li>
            </ul>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default DemoLibraryForms
