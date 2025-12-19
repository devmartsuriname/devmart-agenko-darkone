/**
 * Hero Section Form Modal
 * Create/Edit hero sections with tabbed interface
 * 
 * IMPORTANT: Uses z.preprocess for field normalization:
 * - sort_order: "" → 0, otherwise integer >= 0
 * - overlay_opacity: "" → 50, otherwise integer 0-100
 * - cta_link: "" → null, validate URL only when present
 * - subheading/cta_text: "" → null (trimmed)
 */
import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Spinner, Tab, Nav } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useAuthContext } from '@/context/useAuthContext'
import { HeroImageUpload } from './HeroImageUpload'
import type { Tables } from '@/integrations/supabase/types'

type HeroSection = Tables<'hero_sections'>

// Zod schema with z.preprocess for field normalization
const heroSchema = z.object({
  // Required
  heading: z.string().min(1, 'Heading is required').max(500),
  
  // Optional strings (normalized)
  subheading: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(1000).nullable()
  ),
  
  // Media
  background_image_url: z.string().nullable(),
  background_video_url: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().url('Please enter a valid URL').nullable().or(z.null())
  ),
  
  // CTA
  cta_text: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(100).nullable()
  ),
  cta_link: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().url('Please enter a valid URL').nullable().or(z.null())
  ),
  
  // Layout
  text_alignment: z.enum(['left', 'center', 'right']),
  
  // CRITICAL: overlay_opacity uses preprocess - "" → 50, otherwise integer 0-100
  overlay_opacity: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? 50 : Number(v)),
    z.number().int().min(0).max(100)
  ),
  
  // Boolean
  is_active: z.boolean(),
  
  // CRITICAL: sort_order uses preprocess - "" → 0, otherwise integer >= 0
  sort_order: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? 0 : Number(v)),
    z.number().int().min(0)
  ),
})

type HeroFormData = z.infer<typeof heroSchema>

interface HeroFormProps {
  show: boolean
  onHide: () => void
  hero: HeroSection | null
  onSuccess: () => void
}

export const HeroForm = ({ show, onHide, hero, onSuccess }: HeroFormProps) => {
  const { showNotification } = useNotificationContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const isEdit = !!hero

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      heading: '',
      subheading: null,
      background_image_url: null,
      background_video_url: null,
      cta_text: null,
      cta_link: null,
      text_alignment: 'center',
      overlay_opacity: 50,
      is_active: true,
      sort_order: 0,
    },
  })

  // Reset form when modal opens/closes or hero changes
  useEffect(() => {
    if (show && hero) {
      reset({
        heading: hero.heading,
        subheading: hero.subheading,
        background_image_url: hero.background_image_url,
        background_video_url: hero.background_video_url,
        cta_text: hero.cta_text,
        cta_link: hero.cta_link,
        text_alignment: hero.text_alignment as 'left' | 'center' | 'right',
        overlay_opacity: hero.overlay_opacity,
        is_active: hero.is_active,
        sort_order: hero.sort_order,
      })
    } else if (show) {
      reset({
        heading: '',
        subheading: null,
        background_image_url: null,
        background_video_url: null,
        cta_text: null,
        cta_link: null,
        text_alignment: 'center',
        overlay_opacity: 50,
        is_active: true,
        sort_order: 0,
      })
    }
    setActiveTab('basic')
  }, [show, hero, reset])

  const onSubmit = async (data: HeroFormData) => {
    try {
      setLoading(true)

      const payload = {
        heading: data.heading,
        subheading: data.subheading,
        background_image_url: data.background_image_url,
        background_video_url: data.background_video_url,
        cta_text: data.cta_text,
        cta_link: data.cta_link,
        text_alignment: data.text_alignment,
        overlay_opacity: data.overlay_opacity,
        is_active: data.is_active,
        sort_order: data.sort_order,
        updated_by: user?.id || null,
      }

      if (isEdit && hero) {
        const { error } = await supabase
          .from('hero_sections')
          .update(payload)
          .eq('id', hero.id)

        if (error) throw error
        showNotification({ message: 'Hero section updated successfully', variant: 'success' })
      } else {
        const { error } = await supabase
          .from('hero_sections')
          .insert({
            ...payload,
            created_by: user?.id || null,
          })

        if (error) throw error
        showNotification({ message: 'Hero section created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving hero section:', err)
      showNotification({ message: 'Failed to save hero section', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon={isEdit ? 'mingcute:edit-line' : 'mingcute:add-line'} className="me-2" />
          {isEdit ? 'Edit Hero Section' : 'Add Hero Section'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'basic')}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="basic">Basic Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="media">Media</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="details">Details</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Basic Info Tab */}
              <Tab.Pane eventKey="basic">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Heading *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('heading')}
                        isInvalid={!!errors.heading}
                        placeholder="Welcome to Our Agency"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.heading?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subheading</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...register('subheading')}
                        isInvalid={!!errors.subheading}
                        placeholder="Brief description or tagline..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.subheading?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CTA Button Text</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('cta_text')}
                        isInvalid={!!errors.cta_text}
                        placeholder="Get Started"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cta_text?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CTA Button Link</Form.Label>
                      <Form.Control
                        type="url"
                        {...register('cta_link')}
                        isInvalid={!!errors.cta_link}
                        placeholder="https://example.com/contact"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cta_link?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Media Tab */}
              <Tab.Pane eventKey="media">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Background Image</Form.Label>
                      <Controller
                        name="background_image_url"
                        control={control}
                        render={({ field }) => (
                          <HeroImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Background Image"
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Background Video URL</Form.Label>
                      <Form.Control
                        type="url"
                        {...register('background_video_url')}
                        isInvalid={!!errors.background_video_url}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                      <Form.Text className="text-muted">
                        Optional. YouTube embed URL or direct video link.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.background_video_url?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Overlay Opacity (%)</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        max={100}
                        {...register('overlay_opacity')}
                        isInvalid={!!errors.overlay_opacity}
                      />
                      <Form.Text className="text-muted">
                        0 = fully transparent, 100 = fully opaque. Default: 50
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.overlay_opacity?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Details Tab */}
              <Tab.Pane eventKey="details">
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Text Alignment</Form.Label>
                      <Form.Select {...register('text_alignment')}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sort Order</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        {...register('sort_order')}
                        isInvalid={!!errors.sort_order}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sort_order?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3 pt-4">
                      <Form.Check
                        type="switch"
                        id="is_active"
                        label="Active"
                        {...register('is_active')}
                      />
                      <Form.Text className="text-muted">
                        Active heroes are visible on the public website.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="mingcute:check-line" className="me-1" />
                {isEdit ? 'Update' : 'Create'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
