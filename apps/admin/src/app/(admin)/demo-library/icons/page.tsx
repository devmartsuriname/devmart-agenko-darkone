/**
 * DEV ONLY — DO NOT SHIP
 * Demo Library: Icons Showcase
 * Registry IDs: icons__* (see darkone-demo-library.registry.json)
 */

import { Navigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, Alert } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

const iconPages = [
  { 
    title: 'Boxicons', 
    path: '/icons/boxicons', 
    registryId: 'icons__boxicons', 
    mode: 'REFERENCE_ONLY',
    prefix: 'bx:',
    description: 'High quality web icons with solid and regular variants'
  },
  { 
    title: 'Solar Icons', 
    path: '/icons/solaricons', 
    registryId: 'icons__solar', 
    mode: 'REFERENCE_ONLY',
    prefix: 'solar:',
    description: 'Modern icon set with bold and linear styles'
  },
]

const DemoLibraryIcons = () => {
  // Hard enforcement: redirect to 404 in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/error-pages/pages-404" replace />
  }

  return (
    <>
      <PageTitle 
        title="Icons Showcase" 
        breadcrumbs={[
          { name: 'Dashboard', link: '/' }, 
          { name: 'Demo Library', link: '/demo-library' },
          { name: 'Icons' }
        ]} 
      />
      
      <Container fluid>
        <Alert variant="warning" className="mb-4">
          <strong>⚠️ DEV ONLY — DO NOT SHIP</strong>
          <span className="ms-2">This showcase references existing Darkone icon sets.</span>
        </Alert>

        <Card className="mb-4">
          <CardBody>
            <h5>Usage Notes</h5>
            <p className="text-muted mb-3">
              All icons use the <code>IconifyIcon</code> wrapper component with <code>@iconify/react</code>.
              The primary icon set is <strong>mingcute</strong> (used in sidebar), with Boxicons and Solar as alternatives.
            </p>
            <h6>Icon Usage Pattern</h6>
            <pre className="bg-light p-3 rounded small mb-0">
{`import IconifyIcon from '@/components/wrapper/IconifyIcon'

// Mingcute (sidebar icons)
<IconifyIcon icon="mingcute:home-5-line" />

// Boxicons
<IconifyIcon icon="bx:home" />

// Solar
<IconifyIcon icon="solar:home-2-bold" />`}
            </pre>
          </CardBody>
        </Card>

        <Row>
          {iconPages.map((page) => (
            <Col md={6} key={page.path}>
              <Card className="mb-3">
                <CardBody>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                      <IconifyIcon icon="mingcute:seal-fill" className="text-primary" height={24} width={24} />
                    </div>
                    <div>
                      <h5 className="mb-0">{page.title}</h5>
                      <small className="text-muted">{page.mode}</small>
                    </div>
                  </div>
                  <p className="text-muted mb-2">{page.description}</p>
                  <p className="small mb-3">
                    Prefix: <code>{page.prefix}</code> | Registry: <code>{page.registryId}</code>
                  </p>
                  <Link to={page.path} className="btn btn-soft-primary btn-sm">
                    View Icon Set →
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
              <li><code>apps/admin/src/components/wrapper/IconifyIcon.tsx</code> — Wrapper component (REUSE_COMPONENT)</li>
              <li><code>apps/admin/src/app/(admin)/icons/boxicons/page.tsx</code></li>
              <li><code>apps/admin/src/app/(admin)/icons/solaricons/page.tsx</code></li>
            </ul>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default DemoLibraryIcons
