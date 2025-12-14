import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'

const SystemSettingsPage = () => {
  return (
    <>
      <PageTitle subName="System" title="Settings" />
      
      <ComponentContainerCard
        id="settings-overview"
        title="Site Settings"
        description="Configure global site settings and preferences."
      >
        <Card className="border-0 bg-light">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:settings-3-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">Settings Not Configured</h5>
            <p className="text-muted mb-0">
              This module will allow you to configure site name, logo, contact info, and other global settings.
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
            <li>Registry reference: <code>forms__basic</code> for settings forms</li>
            <li>Registry reference: <code>forms__file-uploads</code> for logo upload</li>
            <li>Database integration pending (Phase 4+)</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default SystemSettingsPage
