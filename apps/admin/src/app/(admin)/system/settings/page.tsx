import { useState, useEffect } from 'react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody, Form, Button, Spinner, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'

// Default branding values
const DEFAULT_PRIMARY_COLOR = '#7e67fe'

const SystemSettingsPage = () => {
  const { isAdmin, isEditor, isViewer } = useAuthContext()
  
  // State
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [settingsId, setSettingsId] = useState<string | null>(null)

  // RBAC: Admin can edit, Editor can view, Viewer no access
  const canEdit = isAdmin
  const canView = isAdmin || isEditor

  // Fetch current settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('id, primary_color')
          .limit(1)
          .maybeSingle()

        if (error) throw error

        if (data) {
          setSettingsId(data.id)
          setPrimaryColor(data.primary_color || DEFAULT_PRIMARY_COLOR)
        }
      } catch (err) {
        console.error('Error fetching settings:', err)
        setError('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEdit) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      if (settingsId) {
        // Update existing row
        const { error } = await supabase
          .from('site_settings')
          .update({ primary_color: primaryColor })
          .eq('id', settingsId)

        if (error) throw error
      } else {
        // Insert new row (first time setup)
        const { data, error } = await supabase
          .from('site_settings')
          .insert({ primary_color: primaryColor })
          .select('id')
          .single()

        if (error) throw error
        setSettingsId(data.id)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Validate hex color
  const isValidHex = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color)

  // Viewer has no access
  if (isViewer && !isAdmin && !isEditor) {
    return (
      <>
        <PageTitle subName="System" title="Settings" />
        <Card>
          <CardBody className="text-center py-5">
            <IconifyIcon icon="mingcute:lock-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">Access Denied</h5>
            <p className="text-muted mb-0">You don't have permission to view this page.</p>
          </CardBody>
        </Card>
        <Footer />
      </>
    )
  }

  return (
    <>
      <PageTitle subName="System" title="Settings" />
      
      {/* Frontend Branding Section */}
      <ComponentContainerCard
        id="frontend-branding"
        title="Frontend Branding"
        description="Configure the public website's primary brand color. This affects buttons, links, and accent elements on the frontend only. Admin theme remains unchanged."
      >
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Loading settings...</span>
          </div>
        ) : (
          <Form onSubmit={handleSave}>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
                Settings saved successfully!
              </Alert>
            )}

            <div className="row align-items-end">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Primary Color (Hex)</Form.Label>
                  <div className="d-flex gap-3 align-items-center">
                    {/* Color Picker */}
                    <Form.Control
                      type="color"
                      value={isValidHex(primaryColor) ? primaryColor : DEFAULT_PRIMARY_COLOR}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      disabled={!canEdit}
                      style={{ width: 60, height: 40, padding: 4 }}
                    />
                    {/* Text Input */}
                    <Form.Control
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#7e67fe"
                      disabled={!canEdit}
                      isInvalid={primaryColor.length > 0 && !isValidHex(primaryColor)}
                      style={{ maxWidth: 140 }}
                    />
                    {/* Preview Swatch */}
                    <div
                      style={{
                        width: 80,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: isValidHex(primaryColor) ? primaryColor : '#ccc',
                        border: '1px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 500,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      Preview
                    </div>
                  </div>
                  <Form.Text className="text-muted">
                    Enter a valid hex color code (e.g., #fd6219). This color will be applied to the public website.
                  </Form.Text>
                  {primaryColor.length > 0 && !isValidHex(primaryColor) && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      Please enter a valid hex color (e.g., #ff0000)
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>

            {canEdit && (
              <div className="mt-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving || !isValidHex(primaryColor)}
                >
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <IconifyIcon icon="mingcute:save-line" className="me-1" />
                      Save Branding Settings
                    </>
                  )}
                </Button>
              </div>
            )}

            {!canEdit && (
              <Alert variant="info" className="mt-3 mb-0">
                <IconifyIcon icon="mingcute:information-line" className="me-1" />
                You have view-only access. Only administrators can modify branding settings.
              </Alert>
            )}
          </Form>
        )}
      </ComponentContainerCard>

      {/* Info Card */}
      <Card className="mt-3">
        <CardBody>
          <h6 className="text-muted mb-3">
            <IconifyIcon icon="mingcute:info-line" className="me-1" />
            Usage Notes
          </h6>
          <ul className="text-muted small mb-0">
            <li><strong>Frontend Only:</strong> This setting affects only the public website. The admin theme remains unchanged.</li>
            <li><strong>Live Updates:</strong> Changes take effect on the frontend after page refresh.</li>
            <li><strong>Affected Elements:</strong> Buttons, links, icons, accent backgrounds, and other brand-colored elements.</li>
            <li><strong>Fallback:</strong> If no color is set, the default theme color (#fd6219) is used.</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default SystemSettingsPage
