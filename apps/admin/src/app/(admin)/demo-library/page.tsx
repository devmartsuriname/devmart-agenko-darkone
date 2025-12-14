/**
 * DEV ONLY — DO NOT SHIP
 * Demo Library Index Page
 * This route is only available in development builds.
 */

import { Navigate } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Link } from 'react-router-dom'

// Production safety: redirect to 404 if accessed in production
if (!import.meta.env.DEV) {
  console.warn('Demo Library accessed in production - redirecting to 404')
}

const showcases = [
  { title: 'Charts', icon: 'mingcute:chart-pie-line', path: '/demo-library/charts', description: 'ApexCharts collection (20+ chart types)' },
  { title: 'Forms', icon: 'mingcute:edit-line', path: '/demo-library/forms', description: 'Form inputs, validation, file upload, editors' },
  { title: 'Tables', icon: 'mingcute:table-2-line', path: '/demo-library/tables', description: 'Basic tables and GridJS DataTables' },
  { title: 'Icons', icon: 'mingcute:seal-fill', path: '/demo-library/icons', description: 'Boxicons and Solar icon sets' },
  { title: 'Modals & Toasts', icon: 'mingcute:window-line', path: '/demo-library/modals-toasts', description: 'Modal dialogs and toast notifications' },
  { title: 'Layouts', icon: 'mingcute:layout-leftbar-close-line', path: '/demo-library/layouts', description: 'Layout patterns and empty states' },
]

const DemoLibraryIndex = () => {
  // Hard enforcement: redirect in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/error-pages/pages-404" replace />
  }

  return (
    <>
      <PageTitle title="Demo Library" breadcrumbs={[{ name: 'Dashboard', link: '/' }, { name: 'Demo Library' }]} />
      
      <Container fluid>
        <div className="alert alert-warning mb-4">
          <strong>⚠️ DEV ONLY — DO NOT SHIP</strong>
          <p className="mb-0 mt-1">This Demo Library is for development reference only. These routes are not included in production builds.</p>
        </div>

        <Row>
          {showcases.map((showcase) => (
            <Col lg={4} md={6} key={showcase.path}>
              <Card className="mb-3">
                <CardBody>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                      <IconifyIcon icon={showcase.icon} className="text-primary" height={24} width={24} />
                    </div>
                    <h5 className="mb-0">{showcase.title}</h5>
                  </div>
                  <p className="text-muted mb-3">{showcase.description}</p>
                  <Link to={showcase.path} className="btn btn-soft-primary btn-sm">
                    View Showcase →
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="mt-3">
          <CardBody>
            <h5>Documentation</h5>
            <ul className="mb-0">
              <li><code>/docs/demo-library/README.md</code> - Registry rules and AllowedReuseMode</li>
              <li><code>/docs/demo-library/darkone-demo-library.registry.json</code> - Full registry manifest</li>
              <li><code>/docs/demo-library/Darkone_Admin_Theme.md</code> - Theme tokens and patterns</li>
              <li><code>/docs/demo-library/Darkone_Admin_Pages_Index.md</code> - Page-to-registry mapping</li>
            </ul>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default DemoLibraryIndex
