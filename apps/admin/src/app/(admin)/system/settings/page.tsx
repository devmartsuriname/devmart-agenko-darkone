import { useState, useEffect } from 'react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody, Form, Button, Spinner, Alert, Tabs, Tab, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'

// Default branding values
const DEFAULT_PRIMARY_COLOR = '#7e67fe'

// Settings interface matching site_settings table
interface SiteSettings {
  id: string | null
  site_name: string
  tagline: string
  primary_color: string
  logo_light_url: string
  logo_dark_url: string
  favicon_url: string
  meta_title_default: string
  meta_description_default: string
  social_image_url: string
  social_facebook: string
  social_twitter: string
  social_instagram: string
  social_linkedin: string
  social_github: string
  footer_copyright: string
  cta_heading: string
  cta_subheading: string
  cta_button_text: string
  cta_button_link: string
  newsletter_enabled: boolean
  newsletter_heading: string
  newsletter_placeholder: string
}

const defaultSettings: SiteSettings = {
  id: null,
  site_name: '',
  tagline: '',
  primary_color: DEFAULT_PRIMARY_COLOR,
  logo_light_url: '',
  logo_dark_url: '',
  favicon_url: '',
  meta_title_default: '',
  meta_description_default: '',
  social_image_url: '',
  social_facebook: '',
  social_twitter: '',
  social_instagram: '',
  social_linkedin: '',
  social_github: '',
  footer_copyright: '',
  cta_heading: '',
  cta_subheading: '',
  cta_button_text: '',
  cta_button_link: '',
  newsletter_enabled: true,
  newsletter_heading: '',
  newsletter_placeholder: ''
}

const SystemSettingsPage = () => {
  const { isAdmin, isEditor, isViewer } = useAuthContext()
  
  // State
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // RBAC: Admin can edit, Editor can view, Viewer no access
  const canEdit = isAdmin
  const canView = isAdmin || isEditor

  // Fetch current settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle()

        if (error) throw error

        if (data) {
          setSettings({
            id: data.id,
            site_name: data.site_name || '',
            tagline: data.tagline || '',
            primary_color: data.primary_color || DEFAULT_PRIMARY_COLOR,
            logo_light_url: data.logo_light_url || '',
            logo_dark_url: data.logo_dark_url || '',
            favicon_url: data.favicon_url || '',
            meta_title_default: data.meta_title_default || '',
            meta_description_default: data.meta_description_default || '',
            social_image_url: data.social_image_url || '',
            social_facebook: data.social_facebook || '',
            social_twitter: data.social_twitter || '',
            social_instagram: data.social_instagram || '',
            social_linkedin: data.social_linkedin || '',
            social_github: data.social_github || '',
            footer_copyright: data.footer_copyright || '',
            cta_heading: data.cta_heading || '',
            cta_subheading: data.cta_subheading || '',
            cta_button_text: data.cta_button_text || '',
            cta_button_link: data.cta_button_link || '',
            newsletter_enabled: data.newsletter_enabled ?? true,
            newsletter_heading: data.newsletter_heading || '',
            newsletter_placeholder: data.newsletter_placeholder || ''
          })
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

  // Handle field change
  const handleChange = (field: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEdit) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const payload = {
        site_name: settings.site_name,
        tagline: settings.tagline,
        primary_color: settings.primary_color,
        logo_light_url: settings.logo_light_url || null,
        logo_dark_url: settings.logo_dark_url || null,
        favicon_url: settings.favicon_url || null,
        meta_title_default: settings.meta_title_default || null,
        meta_description_default: settings.meta_description_default || null,
        social_image_url: settings.social_image_url || null,
        social_facebook: settings.social_facebook || null,
        social_twitter: settings.social_twitter || null,
        social_instagram: settings.social_instagram || null,
        social_linkedin: settings.social_linkedin || null,
        social_github: settings.social_github || null,
        footer_copyright: settings.footer_copyright || null,
        cta_heading: settings.cta_heading || null,
        cta_subheading: settings.cta_subheading || null,
        cta_button_text: settings.cta_button_text || null,
        cta_button_link: settings.cta_button_link || null,
        newsletter_enabled: settings.newsletter_enabled,
        newsletter_heading: settings.newsletter_heading || null,
        newsletter_placeholder: settings.newsletter_placeholder || null
      }

      if (settings.id) {
        // Update existing row
        const { error } = await supabase
          .from('site_settings')
          .update(payload)
          .eq('id', settings.id)

        if (error) throw error
      } else {
        // Insert new row (first time setup)
        const { data, error } = await supabase
          .from('site_settings')
          .insert(payload)
          .select('id')
          .single()

        if (error) throw error
        setSettings(prev => ({ ...prev, id: data.id }))
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

  // Text input field helper
  const TextField = ({ 
    label, 
    field, 
    placeholder = '', 
    helpText = '',
    type = 'text'
  }: { 
    label: string
    field: keyof SiteSettings
    placeholder?: string
    helpText?: string
    type?: string
  }) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={settings[field] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        disabled={!canEdit}
      />
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
    </Form.Group>
  )

  // URL field with preview helper
  const UrlField = ({ 
    label, 
    field, 
    placeholder = 'https://',
    helpText = '',
    showPreview = false
  }: { 
    label: string
    field: keyof SiteSettings
    placeholder?: string
    helpText?: string
    showPreview?: boolean
  }) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex gap-2 align-items-start">
        <div className="flex-grow-1">
          <Form.Control
            type="url"
            value={settings[field] as string}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            disabled={!canEdit}
          />
          {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
        </div>
        {showPreview && settings[field] && (
          <img 
            src={settings[field] as string} 
            alt="Preview" 
            style={{ 
              maxWidth: 80, 
              maxHeight: 40, 
              objectFit: 'contain',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 4,
              padding: 4,
              backgroundColor: '#f8f9fa'
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>
    </Form.Group>
  )

  return (
    <>
      <PageTitle subName="System" title="Settings" />
      
      {loading ? (
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Loading settings...</span>
          </CardBody>
        </Card>
      ) : (
        <Form onSubmit={handleSave}>
          {/* Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(false)} className="mb-3">
              Settings saved successfully!
            </Alert>
          )}

          {/* Tabbed Settings */}
          <Card className="mb-3">
            <CardBody>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'general')}
                className="mb-4"
              >
                {/* General Tab */}
                <Tab eventKey="general" title="General">
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="Site Name" 
                        field="site_name" 
                        placeholder="My Website"
                        helpText="The name of your website"
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="Tagline" 
                        field="tagline" 
                        placeholder="Your site's tagline"
                        helpText="A short description or slogan"
                      />
                    </Col>
                  </Row>
                </Tab>

                {/* Branding Tab */}
                <Tab eventKey="branding" title="Branding">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Primary Color (Hex)</Form.Label>
                        <div className="d-flex gap-3 align-items-center">
                          <Form.Control
                            type="color"
                            value={isValidHex(settings.primary_color) ? settings.primary_color : DEFAULT_PRIMARY_COLOR}
                            onChange={(e) => handleChange('primary_color', e.target.value)}
                            disabled={!canEdit}
                            style={{ width: 60, height: 40, padding: 4 }}
                          />
                          <Form.Control
                            type="text"
                            value={settings.primary_color}
                            onChange={(e) => handleChange('primary_color', e.target.value)}
                            placeholder="#7e67fe"
                            disabled={!canEdit}
                            isInvalid={settings.primary_color.length > 0 && !isValidHex(settings.primary_color)}
                            style={{ maxWidth: 140 }}
                          />
                          <div
                            style={{
                              width: 80,
                              height: 40,
                              borderRadius: 6,
                              backgroundColor: isValidHex(settings.primary_color) ? settings.primary_color : '#ccc',
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
                          Primary accent color for the public website
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="Logo (Light Mode)" 
                        field="logo_light_url" 
                        helpText="Logo for light backgrounds"
                        showPreview
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="Logo (Dark Mode)" 
                        field="logo_dark_url" 
                        helpText="Logo for dark backgrounds"
                        showPreview
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="Favicon URL" 
                        field="favicon_url" 
                        helpText="Browser tab icon (recommended: 32x32 PNG)"
                        showPreview
                      />
                    </Col>
                  </Row>
                </Tab>

                {/* SEO Tab */}
                <Tab eventKey="seo" title="SEO Defaults">
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="Default Meta Title" 
                        field="meta_title_default" 
                        placeholder="My Website | Tagline"
                        helpText="Default title for pages without custom SEO"
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="Social Image URL" 
                        field="social_image_url" 
                        helpText="Default image for social sharing (1200x630 recommended)"
                        showPreview
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Default Meta Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={settings.meta_description_default}
                          onChange={(e) => handleChange('meta_description_default', e.target.value)}
                          placeholder="A brief description of your website for search engines"
                          disabled={!canEdit}
                          maxLength={160}
                        />
                        <Form.Text className="text-muted">
                          Keep under 160 characters. {160 - (settings.meta_description_default?.length || 0)} remaining.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Social Links Tab */}
                <Tab eventKey="social" title="Social Links">
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="Facebook" 
                        field="social_facebook" 
                        placeholder="https://facebook.com/yourpage"
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="Twitter / X" 
                        field="social_twitter" 
                        placeholder="https://twitter.com/yourhandle"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="Instagram" 
                        field="social_instagram" 
                        placeholder="https://instagram.com/yourhandle"
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="LinkedIn" 
                        field="social_linkedin" 
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="GitHub" 
                        field="social_github" 
                        placeholder="https://github.com/yourusername"
                      />
                    </Col>
                  </Row>
                </Tab>

                {/* Footer Tab */}
                <Tab eventKey="footer" title="Footer">
                  <Row>
                    <Col md={8}>
                      <TextField 
                        label="Footer Copyright Text" 
                        field="footer_copyright" 
                        placeholder="© 2025 Your Company. All rights reserved."
                        helpText="Copyright text displayed in the footer"
                      />
                    </Col>
                  </Row>
                </Tab>

                {/* CTA Tab */}
                <Tab eventKey="cta" title="CTA Section">
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="CTA Heading" 
                        field="cta_heading" 
                        placeholder="Ready to get started?"
                        helpText="Main heading for the call-to-action section"
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="CTA Subheading" 
                        field="cta_subheading" 
                        placeholder="Join thousands of satisfied customers"
                        helpText="Supporting text below the heading"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="CTA Button Text" 
                        field="cta_button_text" 
                        placeholder="Get Started"
                        helpText="Text displayed on the CTA button"
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="CTA Button Link" 
                        field="cta_button_link" 
                        placeholder="/contact"
                        helpText="URL the button links to"
                      />
                    </Col>
                  </Row>
                </Tab>

                {/* Newsletter Tab */}
                <Tab eventKey="newsletter" title="Newsletter">
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="newsletter-enabled"
                          label="Enable Newsletter Section"
                          checked={settings.newsletter_enabled}
                          onChange={(e) => handleChange('newsletter_enabled', e.target.checked)}
                          disabled={!canEdit}
                        />
                        <Form.Text className="text-muted">
                          Show or hide the newsletter signup section on the public site
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="Newsletter Heading" 
                        field="newsletter_heading" 
                        placeholder="Subscribe to our newsletter"
                        helpText="Heading text for the newsletter section"
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="Email Placeholder" 
                        field="newsletter_placeholder" 
                        placeholder="Enter your email"
                        helpText="Placeholder text for the email input field"
                      />
                    </Col>
                  </Row>
                </Tab>
              </Tabs>

              {/* Save Button */}
              {canEdit && (
                <div className="mt-4 pt-3 border-top">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving || !isValidHex(settings.primary_color)}
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <IconifyIcon icon="mingcute:save-line" className="me-1" />
                        Save All Settings
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* View-only notice */}
              {!canEdit && (
                <Alert variant="info" className="mt-4 mb-0">
                  <IconifyIcon icon="mingcute:information-line" className="me-1" />
                  You have view-only access. Only administrators can modify settings.
                </Alert>
              )}
            </CardBody>
          </Card>

          {/* Info Card */}
          <Card>
            <CardBody>
              <h6 className="text-muted mb-3">
                <IconifyIcon icon="mingcute:info-line" className="me-1" />
                Usage Notes
              </h6>
              <ul className="text-muted small mb-0">
                <li><strong>Frontend Only:</strong> These settings affect only the public website. The admin theme remains unchanged.</li>
                <li><strong>Live Updates:</strong> Changes take effect on the frontend after page refresh.</li>
                <li><strong>Primary Color:</strong> Affects buttons, links, icons, and accent elements.</li>
                <li><strong>SEO Defaults:</strong> Used when pages don't have custom meta information.</li>
                <li><strong>CTA Section:</strong> Controls the call-to-action block on the homepage.</li>
              </ul>
            </CardBody>
          </Card>
        </Form>
      )}

      <Footer />
    </>
  )
}

export default SystemSettingsPage
