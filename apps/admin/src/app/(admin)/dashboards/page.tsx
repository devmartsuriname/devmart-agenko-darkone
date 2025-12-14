import Footer from '@/components/layout/Footer'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// ============================================================================
// CMS DASHBOARD PLACEHOLDER
// This replaces the demo dashboard with CMS-ready placeholder content.
// Demo components (Cards, Chart, User) remain in ./components but are not used.
// Analytics/charts reference: charts__sparkline (REFERENCE_ONLY)
// ============================================================================

// KPI Placeholder Card (no ApexCharts, visual only)
const KpiPlaceholderCard = ({ title, icon }: { title: string; icon: string }) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col xs={6}>
            <p className="text-muted mb-0 text-truncate">{title}</p>
            <h3 className="text-dark mt-2 mb-0">—</h3>
          </Col>
          <Col xs={6}>
            <div className="ms-auto avatar-md bg-soft-primary rounded">
              <IconifyIcon style={{ padding: '12px' }} icon={icon} className="fs-32 avatar-title text-primary" />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const DashboardPage = () => {
  return (
    <>
      <PageTitle subName="CMS" title="Dashboard" />

      {/* Welcome Card */}
      <Row className="mb-3">
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-1">Welcome to the CMS</h4>
                  <p className="text-muted mb-3">
                    Manage your website content and system settings from here.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/content/pages" className="btn btn-soft-primary btn-sm">
                      <IconifyIcon icon="mingcute:file-line" className="me-1" />
                      Pages
                    </Link>
                    <Link to="/content/blog" className="btn btn-soft-primary btn-sm">
                      <IconifyIcon icon="mingcute:edit-line" className="me-1" />
                      Blog
                    </Link>
                    <Link to="/content/projects" className="btn btn-soft-primary btn-sm">
                      <IconifyIcon icon="mingcute:folder-line" className="me-1" />
                      Projects
                    </Link>
                    <Link to="/system/settings" className="btn btn-soft-primary btn-sm">
                      <IconifyIcon icon="mingcute:settings-3-line" className="me-1" />
                      Settings
                    </Link>
                  </div>
                </Col>
                <Col xs="auto" className="d-none d-md-block">
                  <div className="avatar-lg bg-soft-primary rounded">
                    <IconifyIcon 
                      style={{ padding: '16px' }} 
                      icon="mingcute:home-3-line" 
                      className="fs-36 avatar-title text-primary" 
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* KPI Placeholder Row */}
      <Row>
        <Col md={6} xl={3}>
          <KpiPlaceholderCard title="Pages" icon="mingcute:file-line" />
        </Col>
        <Col md={6} xl={3}>
          <KpiPlaceholderCard title="Blog Posts" icon="mingcute:edit-line" />
        </Col>
        <Col md={6} xl={3}>
          <KpiPlaceholderCard title="Projects" icon="mingcute:folder-line" />
        </Col>
        <Col md={6} xl={3}>
          <KpiPlaceholderCard title="Inquiries" icon="mingcute:mail-line" />
        </Col>
      </Row>

      {/* Analytics Placeholder Section */}
      {/* Registry reference: charts__sparkline (REFERENCE_ONLY) */}
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <CardBody>
              <h5 className="mb-3">Analytics Overview</h5>
              <div className="text-center py-5">
                <IconifyIcon 
                  icon="mingcute:chart-bar-line" 
                  className="fs-48 text-muted mb-3 d-block mx-auto" 
                />
                <p className="text-muted mb-0">
                  Analytics and charts will appear here once data is connected.
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Footer />
    </>
  )
}

export default DashboardPage
