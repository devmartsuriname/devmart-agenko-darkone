/**
 * DEV ONLY — DO NOT SHIP
 * Demo Library: Layouts Showcase
 * Registry IDs: layout__*, navigation__*, empty-states__*
 */

import { Navigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, Alert, Table } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

const layoutComponents = [
  { registryId: 'layout__admin_wrapper', name: 'AdminLayout', mode: 'REUSE_COMPONENT', file: 'layouts/AdminLayout.tsx' },
  { registryId: 'layout__auth_wrapper', name: 'AuthLayout', mode: 'REUSE_COMPONENT', file: 'layouts/AuthLayout.tsx' },
  { registryId: 'layout__page_title', name: 'PageTitle', mode: 'REUSE_COMPONENT', file: 'components/PageTitle.tsx' },
  { registryId: 'layout__component_container', name: 'ComponentContainerCard', mode: 'REUSE_COMPONENT', file: 'components/ComponentContainerCard.tsx' },
  { registryId: 'layout__iconify_wrapper', name: 'IconifyIcon', mode: 'REUSE_COMPONENT', file: 'components/wrapper/IconifyIcon.tsx' },
]

const navigationComponents = [
  { registryId: 'navigation__vertical_sidebar', name: 'VerticalNavigationBar', mode: 'REFERENCE_ONLY', file: 'components/layout/VerticalNavigationBar/' },
  { registryId: 'navigation__top_bar', name: 'TopNavigationBar', mode: 'REFERENCE_ONLY', file: 'components/layout/TopNavigationBar.tsx' },
]

const emptyStatePages = [
  { title: '404 Error Page', path: '/error-pages/pages-404', registryId: 'empty-states__404' },
  { title: '404 Alt Page', path: '/pages-404-alt', registryId: 'empty-states__404_alt' },
]

const DemoLibraryLayouts = () => {
  // Hard enforcement: redirect to 404 in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/error-pages/pages-404" replace />
  }

  return (
    <>
      <PageTitle 
        title="Layouts Showcase" 
        breadcrumbs={[
          { name: 'Dashboard', link: '/' }, 
          { name: 'Demo Library', link: '/demo-library' },
          { name: 'Layouts' }
        ]} 
      />
      
      <Container fluid>
        <Alert variant="warning" className="mb-4">
          <strong>⚠️ DEV ONLY — DO NOT SHIP</strong>
          <span className="ms-2">This showcase references existing Darkone layout components.</span>
        </Alert>

        <Row>
          <Col lg={6}>
            <Card className="mb-4">
              <CardBody>
                <h5 className="d-flex align-items-center">
                  <IconifyIcon icon="mingcute:layout-leftbar-close-line" className="me-2" />
                  Layout Components
                </h5>
                <p className="text-muted small">Core layout wrappers - REUSE_COMPONENT mode</p>
                <Table size="sm" className="small mb-0">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Registry ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {layoutComponents.map((c) => (
                      <tr key={c.registryId}>
                        <td><code>{c.name}</code></td>
                        <td><code className="text-muted">{c.registryId}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="mb-4">
              <CardBody>
                <h5 className="d-flex align-items-center">
                  <IconifyIcon icon="mingcute:menu-line" className="me-2" />
                  Navigation Components
                </h5>
                <p className="text-muted small">Sidebar and topbar - REFERENCE_ONLY mode</p>
                <Table size="sm" className="small mb-0">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Registry ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {navigationComponents.map((c) => (
                      <tr key={c.registryId}>
                        <td><code>{c.name}</code></td>
                        <td><code className="text-muted">{c.registryId}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <CardBody>
            <h5>Empty States & Error Pages</h5>
            <p className="text-muted small">Reference for error page structure</p>
            <Row>
              {emptyStatePages.map((page) => (
                <Col md={6} key={page.path}>
                  <div className="border rounded p-3 mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{page.title}</strong>
                        <br />
                        <code className="small text-muted">{page.registryId}</code>
                      </div>
                      <Link to={page.path} className="btn btn-soft-primary btn-sm">
                        View →
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h5>Usage Pattern: Page Structure</h5>
            <pre className="bg-light p-3 rounded small mb-0">
{`import PageTitle from '@/components/PageTitle'
import { Container, Card, CardBody } from 'react-bootstrap'

const MyPage = () => {
  return (
    <>
      <PageTitle 
        title="Page Name" 
        breadcrumbs={[
          { name: 'Dashboard', link: '/' },
          { name: 'Section', link: '/section' },
          { name: 'Page Name' }
        ]} 
      />
      <Container fluid>
        <Card>
          <CardBody>
            {/* Page content */}
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default MyPage`}
            </pre>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default DemoLibraryLayouts
