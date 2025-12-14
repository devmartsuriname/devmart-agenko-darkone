/**
 * DEV ONLY — DO NOT SHIP
 * Demo Library: Tables Showcase
 * Registry IDs: tables__* (see darkone-demo-library.registry.json)
 */

import { Navigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, Alert } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

const tablePages = [
  { 
    title: 'Basic Tables', 
    path: '/tables/basic', 
    registryId: 'tables__basic', 
    mode: 'REFERENCE_ONLY',
    description: 'Standard Bootstrap table variants (striped, bordered, hover)'
  },
  { 
    title: 'GridJS DataTable', 
    path: '/tables/gridjs', 
    registryId: 'tables__gridjs_datatable', 
    mode: 'COPY_SNIPPET',
    description: 'Interactive tables with search, sort, and pagination'
  },
]

const DemoLibraryTables = () => {
  // Hard enforcement: redirect to 404 in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/error-pages/pages-404" replace />
  }

  return (
    <>
      <PageTitle 
        title="Tables Showcase" 
        breadcrumbs={[
          { name: 'Dashboard', link: '/' }, 
          { name: 'Demo Library', link: '/demo-library' },
          { name: 'Tables' }
        ]} 
      />
      
      <Container fluid>
        <Alert variant="warning" className="mb-4">
          <strong>⚠️ DEV ONLY — DO NOT SHIP</strong>
          <span className="ms-2">This showcase references existing Darkone table components.</span>
        </Alert>

        <Card className="mb-4">
          <CardBody>
            <h5>Usage Notes</h5>
            <p className="text-muted mb-3">
              Basic tables use react-bootstrap Table component. GridJS provides advanced
              features like search, sorting, and pagination for data-heavy interfaces.
            </p>
            <h6>Dependencies</h6>
            <code className="small">react-bootstrap, gridjs, gridjs-react</code>
          </CardBody>
        </Card>

        <Row>
          {tablePages.map((page) => (
            <Col md={6} key={page.path}>
              <Card className="mb-3">
                <CardBody>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                      <IconifyIcon icon="mingcute:table-2-line" className="text-primary" height={24} width={24} />
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
              <li><code>apps/admin/src/app/(admin)/tables/basic/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/tables/gridjs/page.tsx</code></li>
            </ul>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default DemoLibraryTables
