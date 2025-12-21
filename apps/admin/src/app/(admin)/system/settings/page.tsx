import { useState, useEffect, useCallback } from 'react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody, Form, Button, Spinner, Alert, Tabs, Tab, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'

// Default branding values
const DEFAULT_PRIMARY_COLOR = '#7e67fe'

// Default map URLs (prefill when empty)
const DEFAULT_MAP_EMBED_URL = 'https://www.google.com/maps?ll=5.811011,-55.21039&z=16&t=m&hl=en&gl=US&mapclient=embed&cid=1270414310031602223'
const DEFAULT_MAP_LINK_URL = 'https://www.google.com/maps?cid=1270414310031602223'

// Footer link item interface
interface FooterLinkItem {
  key: string
  label: string
  href: string
}

// Available pages for footer links (fixed whitelist)
const AVAILABLE_FOOTER_PAGES: FooterLinkItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'services', label: 'Services', href: '/service' },
  { key: 'portfolio', label: 'Portfolio', href: '/portfolio' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'faq', label: 'FAQ', href: '/faq' },
  { key: 'contact', label: 'Contact', href: '/contact' },
]

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
  // Footer About
  footer_about_title: string
  footer_about_description: string
  // Contact Info
  contact_email: string
  contact_phone: string
  contact_address_line1: string
  contact_address_line2: string
  contact_city: string
  contact_country: string
  // Map
  contact_map_embed_url: string
  contact_map_link_url: string
  // Footer Links
  footer_links: FooterLinkItem[] | null
  // CTA
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
  footer_about_title: '',
  footer_about_description: '',
  contact_email: '',
  contact_phone: '',
  contact_address_line1: '',
  contact_address_line2: '',
  contact_city: '',
  contact_country: '',
  contact_map_embed_url: '',
  contact_map_link_url: '',
  footer_links: null,
  cta_heading: '',
  cta_subheading: '',
  cta_button_text: '',
  cta_button_link: '',
  newsletter_enabled: true,
  newsletter_heading: '',
  newsletter_placeholder: ''
}

// ============================================================================
// STABLE FIELD COMPONENTS (defined OUTSIDE the page component to prevent re-creation)
// ============================================================================

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helpText?: string
  type?: string
  disabled?: boolean
}

/**
 * Text input field - stable component defined outside SystemSettingsPage
 * to prevent re-mounting on every keystroke
 */
const TextField = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  helpText = '',
  type = 'text',
  disabled = false
}: TextFieldProps) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
    {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
  </Form.Group>
)

interface UrlFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helpText?: string
  showPreview?: boolean
  disabled?: boolean
}

/**
 * URL input field with optional preview - stable component defined outside
 * SystemSettingsPage to prevent re-mounting on every keystroke.
 * Uses type="text" to allow relative paths like "/contact"
 */
const UrlField = ({ 
  label, 
  value, 
  onChange, 
  placeholder = 'https://',
  helpText = '',
  showPreview = false,
  disabled = false
}: UrlFieldProps) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <div className="d-flex gap-2 align-items-start">
      <div className="flex-grow-1">
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
        {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
      </div>
      {showPreview && value && (
        <img 
          src={value} 
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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const SystemSettingsPage = () => {
  const { isAdmin, isEditor, isViewer, user } = useAuthContext()
  
  // State
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  // Save status instrumentation
  const [saveStatus, setSaveStatus] = useState<{
    lastSavedAt: string | null
    lastSaveResult: 'success' | 'error' | 'none'
    lastErrorMessage: string | null
    verified: boolean
  }>({
    lastSavedAt: null,
    lastSaveResult: 'none',
    lastErrorMessage: null,
    verified: false
  })

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
            footer_about_title: data.footer_about_title || '',
            footer_about_description: data.footer_about_description || '',
            contact_email: data.contact_email || '',
            contact_phone: data.contact_phone || '',
            contact_address_line1: data.contact_address_line1 || '',
            contact_address_line2: data.contact_address_line2 || '',
            contact_city: data.contact_city || '',
            contact_country: data.contact_country || '',
            // Prefill map URLs with defaults if empty (UI-only, user must save to persist)
            contact_map_embed_url: data.contact_map_embed_url || DEFAULT_MAP_EMBED_URL,
            contact_map_link_url: data.contact_map_link_url || DEFAULT_MAP_LINK_URL,
            footer_links: data.footer_links || null,
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

  // Handle field change - stable callback
  const handleChange = useCallback((field: keyof SiteSettings, value: string | boolean | FooterLinkItem[] | null) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }, [])

  // Handle save with full instrumentation
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const timestamp = new Date().toISOString()
    console.log('[SETTINGS_SAVE] SAVE_CLICKED at', timestamp)
    console.log('[SETTINGS_SAVE] Current user:', user?.email, 'Roles:', user?.roles)
    console.log('[SETTINGS_SAVE] canEdit:', canEdit, 'isAdmin:', isAdmin, 'isEditor:', isEditor)
    console.log('[SETTINGS_SAVE] settings.id:', settings.id)
    
    if (!canEdit) {
      const msg = 'Cannot save: User does not have edit permissions (requires admin role)'
      console.error('[SETTINGS_SAVE] BLOCKED:', msg)
      setError(msg)
      setSaveStatus({
        lastSavedAt: timestamp,
        lastSaveResult: 'error',
        lastErrorMessage: msg,
        verified: false
      })
      return
    }

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
        footer_about_title: settings.footer_about_title || null,
        footer_about_description: settings.footer_about_description || null,
        contact_email: settings.contact_email || null,
        contact_phone: settings.contact_phone || null,
        contact_address_line1: settings.contact_address_line1 || null,
        contact_address_line2: settings.contact_address_line2 || null,
        contact_city: settings.contact_city || null,
        contact_country: settings.contact_country || null,
        contact_map_embed_url: settings.contact_map_embed_url || null,
        contact_map_link_url: settings.contact_map_link_url || null,
        footer_links: settings.footer_links && settings.footer_links.length > 0 ? settings.footer_links : null,
        cta_heading: settings.cta_heading || null,
        cta_subheading: settings.cta_subheading || null,
        cta_button_text: settings.cta_button_text || null,
        cta_button_link: settings.cta_button_link || null,
        newsletter_enabled: settings.newsletter_enabled,
        newsletter_heading: settings.newsletter_heading || null,
        newsletter_placeholder: settings.newsletter_placeholder || null
      }

      // Log payload keys and value lengths (avoid printing full values for security)
      console.log('[SETTINGS_SAVE] Payload keys:', Object.keys(payload))
      console.log('[SETTINGS_SAVE] Payload summary:', Object.entries(payload).map(([k, v]) => 
        `${k}: ${v === null ? 'null' : typeof v === 'string' ? `string(${v.length})` : typeof v}`
      ))

      let saveError: Error | null = null
      let rowsAffected = 0

      if (settings.id) {
        // Update existing row - use .select() to verify affected rows
        console.log('[SETTINGS_SAVE] Attempting UPDATE for id:', settings.id)
        const { data: updateData, error: updateError } = await supabase
          .from('site_settings')
          .update(payload)
          .eq('id', settings.id)
          .select('id')

        saveError = updateError
        rowsAffected = updateData?.length || 0
        console.log('[SETTINGS_SAVE] UPDATE result:', { 
          error: updateError?.message || null, 
          rowsAffected,
          returnedData: updateData 
        })

        if (updateError) throw updateError
        
        // CRITICAL: If no rows affected, RLS might have blocked the update silently
        if (rowsAffected === 0) {
          const rlsMsg = 'Update returned 0 rows - RLS policy may have blocked the update. Ensure user has admin or editor role.'
          console.error('[SETTINGS_SAVE] RLS_BLOCK:', rlsMsg)
          throw new Error(rlsMsg)
        }
      } else {
        // Insert new row (first time setup)
        console.log('[SETTINGS_SAVE] Attempting INSERT (no existing id)')
        const { data, error } = await supabase
          .from('site_settings')
          .insert(payload)
          .select('id')
          .single()

        console.log('[SETTINGS_SAVE] INSERT result:', { error: error?.message || null, newId: data?.id })

        if (error) throw error
        setSettings(prev => ({ ...prev, id: data.id }))
        rowsAffected = 1
      }

      // VERIFICATION: Re-fetch from DB to confirm persistence
      console.log('[SETTINGS_SAVE] Verifying persistence...')
      const { data: verifyData, error: verifyError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', settings.id || '')
        .maybeSingle()

      if (verifyError) {
        console.error('[SETTINGS_SAVE] Verification fetch error:', verifyError)
      } else if (verifyData) {
        // Check a few key fields to confirm they persisted
        const verified = 
          verifyData.footer_about_title === (settings.footer_about_title || null) &&
          verifyData.contact_email === (settings.contact_email || null) &&
          verifyData.contact_map_embed_url === (settings.contact_map_embed_url || null)
        
        console.log('[SETTINGS_SAVE] Verification result:', { 
          verified,
          db_footer_about_title: verifyData.footer_about_title,
          local_footer_about_title: settings.footer_about_title || null,
          db_contact_email: verifyData.contact_email,
          local_contact_email: settings.contact_email || null
        })

        setSaveStatus({
          lastSavedAt: timestamp,
          lastSaveResult: 'success',
          lastErrorMessage: null,
          verified
        })
      }

      setSuccess(true)
      console.log('[SETTINGS_SAVE] SUCCESS - Save completed and verified')
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('[SETTINGS_SAVE] ERROR:', errorMessage, err)
      setError(`Failed to save settings: ${errorMessage}`)
      setSaveStatus({
        lastSavedAt: timestamp,
        lastSaveResult: 'error',
        lastErrorMessage: errorMessage,
        verified: false
      })
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
      
      {loading ? (
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Loading settings...</span>
          </CardBody>
        </Card>
      ) : (
        <Form onSubmit={handleSave}>
          {/* Debug Panel - Auth State */}
          <Alert variant="secondary" className="mb-3 small">
            <div className="d-flex flex-wrap gap-3">
              <span><strong>User:</strong> {user?.email || 'Not logged in'}</span>
              <span><strong>Roles:</strong> {user?.roles?.join(', ') || 'None'}</span>
              <span><strong>isAdmin:</strong> {isAdmin ? '✓' : '✗'}</span>
              <span><strong>isEditor:</strong> {isEditor ? '✓' : '✗'}</span>
              <span><strong>canEdit:</strong> {canEdit ? '✓' : '✗'}</span>
              <span><strong>Settings ID:</strong> {settings.id || 'NULL'}</span>
            </div>
          </Alert>
          
          {/* Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(false)} className="mb-3">
              Settings saved and verified!
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
                        value={settings.site_name}
                        onChange={(val) => handleChange('site_name', val)}
                        placeholder="My Website"
                        helpText="The name of your website"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="Tagline" 
                        value={settings.tagline}
                        onChange={(val) => handleChange('tagline', val)}
                        placeholder="Your site's tagline"
                        helpText="A short description or slogan"
                        disabled={!canEdit}
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
                        value={settings.logo_light_url}
                        onChange={(val) => handleChange('logo_light_url', val)}
                        helpText="Logo for light backgrounds"
                        showPreview
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="Logo (Dark Mode)" 
                        value={settings.logo_dark_url}
                        onChange={(val) => handleChange('logo_dark_url', val)}
                        helpText="Logo for dark backgrounds"
                        showPreview
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="Favicon URL" 
                        value={settings.favicon_url}
                        onChange={(val) => handleChange('favicon_url', val)}
                        helpText="Browser tab icon (recommended: 32x32 PNG)"
                        showPreview
                        disabled={!canEdit}
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
                        value={settings.meta_title_default}
                        onChange={(val) => handleChange('meta_title_default', val)}
                        placeholder="My Website | Tagline"
                        helpText="Default title for pages without custom SEO"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="Social Image URL" 
                        value={settings.social_image_url}
                        onChange={(val) => handleChange('social_image_url', val)}
                        helpText="Default image for social sharing (1200x630 recommended)"
                        showPreview
                        disabled={!canEdit}
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
                        value={settings.social_facebook}
                        onChange={(val) => handleChange('social_facebook', val)}
                        placeholder="https://facebook.com/yourpage"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="Twitter / X" 
                        value={settings.social_twitter}
                        onChange={(val) => handleChange('social_twitter', val)}
                        placeholder="https://twitter.com/yourhandle"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="Instagram" 
                        value={settings.social_instagram}
                        onChange={(val) => handleChange('social_instagram', val)}
                        placeholder="https://instagram.com/yourhandle"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="LinkedIn" 
                        value={settings.social_linkedin}
                        onChange={(val) => handleChange('social_linkedin', val)}
                        placeholder="https://linkedin.com/company/yourcompany"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="GitHub" 
                        value={settings.social_github}
                        onChange={(val) => handleChange('social_github', val)}
                        placeholder="https://github.com/yourusername"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                </Tab>

                {/* Footer Tab */}
                <Tab eventKey="footer" title="Footer">
                  {/* Existing Footer Copyright */}
                  <Row>
                    <Col md={8}>
                      <TextField 
                        label="Footer Copyright Text" 
                        value={settings.footer_copyright}
                        onChange={(val) => handleChange('footer_copyright', val)}
                        placeholder="© 2025 Your Company. All rights reserved."
                        helpText="Copyright text displayed in the footer"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <hr className="my-4" />
                  <h6 className="text-muted mb-3">Footer About</h6>
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="About Title" 
                        value={settings.footer_about_title}
                        onChange={(val) => handleChange('footer_about_title', val)}
                        placeholder="About Us"
                        helpText="Heading for the about section in the footer"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>About Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={settings.footer_about_description}
                          onChange={(e) => handleChange('footer_about_description', e.target.value)}
                          placeholder="Brief description about your company..."
                          disabled={!canEdit}
                          maxLength={500}
                        />
                        <Form.Text className="text-muted">
                          Short description displayed in the footer. {500 - (settings.footer_about_description?.length || 0)} chars remaining.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="my-4" />
                  <h6 className="text-muted mb-3">Contact Information</h6>
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="Email" 
                        value={settings.contact_email}
                        onChange={(val) => handleChange('contact_email', val)}
                        placeholder="hello@company.com"
                        type="email"
                        helpText="Contact email (displayed in footer and contact page)"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="Phone" 
                        value={settings.contact_phone}
                        onChange={(val) => handleChange('contact_phone', val)}
                        placeholder="+1 (555) 123-4567"
                        helpText="Contact phone number"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="Address Line 1" 
                        value={settings.contact_address_line1}
                        onChange={(val) => handleChange('contact_address_line1', val)}
                        placeholder="123 Main Street"
                        helpText="Street address"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="Address Line 2" 
                        value={settings.contact_address_line2}
                        onChange={(val) => handleChange('contact_address_line2', val)}
                        placeholder="Suite 100"
                        helpText="Optional additional address line"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="City" 
                        value={settings.contact_city}
                        onChange={(val) => handleChange('contact_city', val)}
                        placeholder="New York"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="Country" 
                        value={settings.contact_country}
                        onChange={(val) => handleChange('contact_country', val)}
                        placeholder="USA"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <hr className="my-4" />
                  <h6 className="text-muted mb-3">Map Settings</h6>
                  <Row>
                    <Col md={6}>
                      <UrlField 
                        label="Map Embed URL" 
                        value={settings.contact_map_embed_url}
                        onChange={(val) => handleChange('contact_map_embed_url', val)}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        helpText="Iframe embed URL for map display on Contact page"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <UrlField 
                        label="Map Link URL" 
                        value={settings.contact_map_link_url}
                        onChange={(val) => handleChange('contact_map_link_url', val)}
                        placeholder="https://maps.google.com/?q=..."
                        helpText="Fallback link if embed URL is not provided"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <hr className="my-4" />
                  <h6 className="text-muted mb-3">Footer Links</h6>
                  <p className="text-muted small mb-3">
                    Select which pages appear in the footer "Links" column and drag to reorder.
                  </p>
                  
                  {/* Footer Links Selection & Reorder */}
                  <div className="border rounded p-3 bg-light">
                    {(() => {
                      // Get selected links or default to all available
                      const selectedLinks = settings.footer_links || []
                      const selectedKeys = new Set(selectedLinks.map(l => l.key))
                      
                      // Toggle link inclusion
                      const toggleLink = (page: FooterLinkItem) => {
                        if (!canEdit) return
                        
                        if (selectedKeys.has(page.key)) {
                          // Remove from selection
                          const newLinks = selectedLinks.filter(l => l.key !== page.key)
                          handleChange('footer_links', newLinks.length > 0 ? newLinks : null)
                        } else {
                          // Add to selection (at end)
                          const newLinks = [...selectedLinks, page]
                          handleChange('footer_links', newLinks)
                        }
                      }
                      
                      // Move link up
                      const moveUp = (index: number) => {
                        if (!canEdit || index === 0) return
                        const newLinks = [...selectedLinks]
                        ;[newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]]
                        handleChange('footer_links', newLinks)
                      }
                      
                      // Move link down
                      const moveDown = (index: number) => {
                        if (!canEdit || index === selectedLinks.length - 1) return
                        const newLinks = [...selectedLinks]
                        ;[newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]]
                        handleChange('footer_links', newLinks)
                      }
                      
                      return (
                        <>
                          {/* Selected links with reorder controls */}
                          {selectedLinks.length > 0 && (
                            <div className="mb-3">
                              <small className="text-muted d-block mb-2">Selected (in order):</small>
                              {selectedLinks.map((link, index) => (
                                <div 
                                  key={link.key} 
                                  className="d-flex align-items-center gap-2 mb-2 p-2 bg-white rounded border"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    checked
                                    onChange={() => toggleLink(link)}
                                    disabled={!canEdit}
                                  />
                                  <span className="flex-grow-1">{link.label}</span>
                                  <small className="text-muted">{link.href}</small>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => moveUp(index)}
                                    disabled={!canEdit || index === 0}
                                    title="Move up"
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => moveDown(index)}
                                    disabled={!canEdit || index === selectedLinks.length - 1}
                                    title="Move down"
                                  >
                                    ↓
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Unselected pages */}
                          {AVAILABLE_FOOTER_PAGES.filter(p => !selectedKeys.has(p.key)).length > 0 && (
                            <div>
                              <small className="text-muted d-block mb-2">Available pages:</small>
                              {AVAILABLE_FOOTER_PAGES.filter(p => !selectedKeys.has(p.key)).map(page => (
                                <div 
                                  key={page.key} 
                                  className="d-flex align-items-center gap-2 mb-2 p-2 bg-white rounded border opacity-75"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    checked={false}
                                    onChange={() => toggleLink(page)}
                                    disabled={!canEdit}
                                  />
                                  <span className="flex-grow-1">{page.label}</span>
                                  <small className="text-muted">{page.href}</small>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {selectedLinks.length === 0 && (
                            <p className="text-muted small mb-0 mt-2">
                              <em>No links selected. The footer will show default links (all pages).</em>
                            </p>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </Tab>

                {/* CTA Tab */}
                <Tab eventKey="cta" title="CTA Section">
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="CTA Heading" 
                        value={settings.cta_heading}
                        onChange={(val) => handleChange('cta_heading', val)}
                        placeholder="Ready to get started?"
                        helpText="Main heading for the call-to-action section"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="CTA Subheading" 
                        value={settings.cta_subheading}
                        onChange={(val) => handleChange('cta_subheading', val)}
                        placeholder="Join thousands of satisfied customers"
                        helpText="Supporting text below the heading"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <TextField 
                        label="CTA Button Text" 
                        value={settings.cta_button_text}
                        onChange={(val) => handleChange('cta_button_text', val)}
                        placeholder="Get Started"
                        helpText="Text displayed on the CTA button"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      {/* Use TextField (type="text") for CTA Button Link to allow relative paths like "/contact" */}
                      <TextField 
                        label="CTA Button Link" 
                        value={settings.cta_button_link}
                        onChange={(val) => handleChange('cta_button_link', val)}
                        placeholder="/contact"
                        helpText="URL the button links to (relative paths like /contact allowed)"
                        disabled={!canEdit}
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
                        value={settings.newsletter_heading}
                        onChange={(val) => handleChange('newsletter_heading', val)}
                        placeholder="Subscribe to our newsletter"
                        helpText="Heading text for the newsletter section"
                        disabled={!canEdit}
                      />
                    </Col>
                    <Col md={6}>
                      <TextField 
                        label="Email Placeholder" 
                        value={settings.newsletter_placeholder}
                        onChange={(val) => handleChange('newsletter_placeholder', val)}
                        placeholder="Enter your email"
                        helpText="Placeholder text for the email input field"
                        disabled={!canEdit}
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
                  
                  {/* Save Status Instrumentation Row */}
                  {saveStatus.lastSaveResult !== 'none' && (
                    <div className={`mt-3 p-3 rounded border ${
                      saveStatus.lastSaveResult === 'success' 
                        ? 'border-success bg-success bg-opacity-10' 
                        : 'border-danger bg-danger bg-opacity-10'
                    }`}>
                      <div className="d-flex flex-wrap gap-3 align-items-center small">
                        <span>
                          <strong>Last Save:</strong>{' '}
                          {saveStatus.lastSavedAt ? new Date(saveStatus.lastSavedAt).toLocaleString() : 'Never'}
                        </span>
                        <span>
                          <strong>Result:</strong>{' '}
                          <span className={saveStatus.lastSaveResult === 'success' ? 'text-success' : 'text-danger'}>
                            {saveStatus.lastSaveResult.toUpperCase()}
                          </span>
                        </span>
                        {saveStatus.lastSaveResult === 'success' && (
                          <span>
                            <strong>Verified:</strong>{' '}
                            <span className={saveStatus.verified ? 'text-success' : 'text-warning'}>
                              {saveStatus.verified ? 'YES ✓' : 'PENDING'}
                            </span>
                          </span>
                        )}
                        {saveStatus.lastErrorMessage && (
                          <span className="text-danger">
                            <strong>Error:</strong> {saveStatus.lastErrorMessage}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 small text-muted">
                        <strong>Current User:</strong> {user?.email || 'Not logged in'} | 
                        <strong> Roles:</strong> {user?.roles?.join(', ') || 'None'} | 
                        <strong> Can Edit:</strong> {canEdit ? 'Yes' : 'No'}
                      </div>
                    </div>
                  )}
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
