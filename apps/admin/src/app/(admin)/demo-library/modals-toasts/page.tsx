/**
 * DEV ONLY — DO NOT SHIP
 * Demo Library: Modals & Toasts Showcase
 * Registry IDs: base-ui__modals, base-ui__toasts, base-ui__offcanvas
 */

import { Navigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, Alert } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

const modalToastPages = [
  { 
    title: 'Modals', 
    path: '/base-ui/modals', 
    registryId: 'base-ui__modals', 
    mode: 'COPY_SNIPPET',
    icon: 'mingcute:window-line',
    description: 'Dialog windows with various sizes and scroll behaviors'
  },
  { 
    title: 'Offcanvas', 
    path: '/base-ui/offcanvas', 
    registryId: 'base-ui__offcanvas', 
    mode: 'COPY_SNIPPET',
    icon: 'mingcute:layout-right-line',
    description: 'Slide-out panels for navigation or forms'
  },
  { 
    title: 'Toasts', 
    path: '/base-ui/toasts', 
    registryId: 'base-ui__toasts', 
    mode: 'COPY_SNIPPET',
    icon: 'mingcute:notification-line',
    description: 'Lightweight notification messages'
  },
  { 
    title: 'Tooltips', 
    path: '/base-ui/tooltips', 
    registryId: 'base-ui__tooltips', 
    mode: 'REFERENCE_ONLY',
    icon: 'mingcute:comment-line',
    description: 'Hover hints for additional context'
  },
  { 
    title: 'Popovers', 
    path: '/base-ui/popovers', 
    registryId: 'base-ui__popovers', 
    mode: 'REFERENCE_ONLY',
    icon: 'mingcute:chat-3-line',
    description: 'Rich content overlays triggered by click or hover'
  },
]

const DemoLibraryModalsToasts = () => {
  // Hard enforcement: redirect to 404 in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/error-pages/pages-404" replace />
  }

  return (
    <>
      <PageTitle 
        title="Modals & Toasts Showcase" 
        breadcrumbs={[
          { name: 'Dashboard', link: '/' }, 
          { name: 'Demo Library', link: '/demo-library' },
          { name: 'Modals & Toasts' }
        ]} 
      />
      
      <Container fluid>
        <Alert variant="warning" className="mb-4">
          <strong>⚠️ DEV ONLY — DO NOT SHIP</strong>
          <span className="ms-2">This showcase references existing Darkone overlay components.</span>
        </Alert>

        <Card className="mb-4">
          <CardBody>
            <h5>Usage Notes</h5>
            <p className="text-muted mb-3">
              Modals, Offcanvas, Toasts, Tooltips, and Popovers are all react-bootstrap components.
              For production toasts, consider using <code>react-toastify</code> for better UX.
            </p>
            <h6>Modal Pattern</h6>
            <pre className="bg-light p-3 rounded small mb-0">
{`import { Modal, Button } from 'react-bootstrap'
const [show, setShow] = useState(false)

<Button onClick={() => setShow(true)}>Open Modal</Button>
<Modal show={show} onHide={() => setShow(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
  </Modal.Footer>
</Modal>`}
            </pre>
          </CardBody>
        </Card>

        <Row>
          {modalToastPages.map((page) => (
            <Col lg={4} md={6} key={page.path}>
              <Card className="mb-3">
                <CardBody>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                      <IconifyIcon icon={page.icon} className="text-primary" height={24} width={24} />
                    </div>
                    <div>
                      <h5 className="mb-0">{page.title}</h5>
                      <small className="text-muted">{page.mode}</small>
                    </div>
                  </div>
                  <p className="text-muted mb-2">{page.description}</p>
                  <p className="small text-muted mb-3">
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
              <li><code>apps/admin/src/app/(admin)/base-ui/modals/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/base-ui/offcanvas/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/base-ui/toasts/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/base-ui/tooltips/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/base-ui/popovers/page.tsx</code></li>
            </ul>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default DemoLibraryModalsToasts
