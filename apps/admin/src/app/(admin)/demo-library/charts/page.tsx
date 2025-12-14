/**
 * DEV ONLY — DO NOT SHIP
 * Demo Library: Charts Showcase
 * Registry IDs: charts__* (see darkone-demo-library.registry.json)
 */

import { Navigate } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, Alert } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import AllApexChart from '@/app/(admin)/apex-chart/component/AllApexChart'

const DemoLibraryCharts = () => {
  // Hard enforcement: redirect to 404 in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/error-pages/pages-404" replace />
  }

  return (
    <>
      <PageTitle 
        title="Charts Showcase" 
        breadcrumbs={[
          { name: 'Dashboard', link: '/' }, 
          { name: 'Demo Library', link: '/demo-library' },
          { name: 'Charts' }
        ]} 
      />
      
      <Container fluid>
        <Alert variant="warning" className="mb-4">
          <strong>⚠️ DEV ONLY — DO NOT SHIP</strong>
          <span className="ms-2">This showcase references existing Darkone chart components.</span>
        </Alert>

        <Card className="mb-4">
          <CardBody>
            <h5>Usage Notes</h5>
            <p className="text-muted mb-2">
              All charts use ApexCharts library. Copy chart configuration objects for reuse.
            </p>
            <h6>Registry IDs (AllowedReuseMode: COPY_SNIPPET)</h6>
            <Row>
              <Col md={4}>
                <ul className="small mb-0">
                  <li><code>charts__line_basic</code></li>
                  <li><code>charts__line_data_labels</code></li>
                  <li><code>charts__line_zoomable</code></li>
                  <li><code>charts__area_basic</code></li>
                  <li><code>charts__area_stacked</code></li>
                </ul>
              </Col>
              <Col md={4}>
                <ul className="small mb-0">
                  <li><code>charts__column_basic</code></li>
                  <li><code>charts__column_stacked</code></li>
                  <li><code>charts__bar_basic</code></li>
                  <li><code>charts__mixed_line_area</code></li>
                  <li><code>charts__pie_basic</code></li>
                </ul>
              </Col>
              <Col md={4}>
                <ul className="small mb-0">
                  <li><code>charts__donut_basic</code></li>
                  <li><code>charts__radial_basic</code></li>
                  <li><code>charts__candlestick</code></li>
                  <li><code>charts__heatmap</code></li>
                  <li><code>charts__treemap</code></li>
                </ul>
              </Col>
            </Row>
            <p className="text-muted mt-3 mb-0 small">
              <strong>Source:</strong> <code>apps/admin/src/app/(admin)/apex-chart/component/AllApexChart.tsx</code>
            </p>
          </CardBody>
        </Card>

        {/* Render the existing charts component */}
        <AllApexChart />
      </Container>
    </>
  )
}

export default DemoLibraryCharts
