/**
 * Home About Section Form Modal
 * Create/Edit about sections with tabbed interface
 * 
 * Bullets input: textarea (one per line) → saved as jsonb array of strings
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
import { HomeAboutImageUpload } from './HomeAboutImageUpload'

// Type for home_about_sections table
interface HomeAboutSection {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  is_active: boolean
  sort_order: number
  eyebrow: string | null
  heading: string
  body: string | null
  bullets: string[] | null
  cta_text: string | null
  cta_link: string | null
  image_url: string | null
}

// Zod schema with z.preprocess for field normalization
const homeAboutSchema = z.object({
  // Required
  heading: z.string().min(1, 'Heading is required').max(500),
  
  // Optional strings (normalized)
  eyebrow: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(200).nullable()
  ),
  body: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(5000).nullable()
  ),
  
  // Bullets as textarea string (will be converted to array on save)
  bullets_text: z.string().optional(),
  
  // CTA
  cta_text: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(100).nullable()
  ),
  cta_link: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(500).nullable()
  ),
  
  // Media
  image_url: z.string().nullable(),
  
  // Boolean
  is_active: z.boolean(),
  
  // CRITICAL: sort_order uses preprocess - "" → 0, otherwise integer >= 0
  sort_order: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? 0 : Number(v)),
    z.number().int().min(0)
  ),
})

type HomeAboutFormData = z.infer<typeof homeAboutSchema>

interface HomeAboutFormProps {
  show: boolean
  onHide: () => void
  section: HomeAboutSection | null
  onSuccess: () => void
}

export const HomeAboutForm = ({ show, onHide, section, onSuccess }: HomeAboutFormProps) => {
  const { showNotification } = useNotificationContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const isEdit = !!section

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<HomeAboutFormData>({
    resolver: zodResolver(homeAboutSchema),
    defaultValues: {
      heading: '',
      eyebrow: null,
      body: null,
      bullets_text: '',
      cta_text: null,
      cta_link: null,
      image_url: null,
      is_active: true,
      sort_order: 0,
    },
  })

  // Convert bullets array to textarea string
  const bulletsToText = (bullets: string[] | null): string => {
    if (!bullets || !Array.isArray(bullets)) return ''
    return bullets.join('\n')
  }

  // Convert textarea string to bullets array (filter empty lines)
  const textToBullets = (text: string): string[] => {
    if (!text || !text.trim()) return []
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  // Reset form when modal opens/closes or section changes
  useEffect(() => {
    if (show && section) {
      reset({
        heading: section.heading,
        eyebrow: section.eyebrow,
        body: section.body,
        bullets_text: bulletsToText(section.bullets),
        cta_text: section.cta_text,
        cta_link: section.cta_link,
        image_url: section.image_url,
        is_active: section.is_active,
        sort_order: section.sort_order,
      })
    } else if (show) {
      reset({
        heading: '',
        eyebrow: null,
        body: null,
        bullets_text: '',
        cta_text: null,
        cta_link: null,
        image_url: null,
        is_active: true,
        sort_order: 0,
      })
    }
    setActiveTab('basic')
  }, [show, section, reset])

  const onSubmit = async (data: HomeAboutFormData) => {
    try {
      setLoading(true)

      // Convert bullets_text to jsonb array
      const bulletsArray = textToBullets(data.bullets_text || '')

      const payload = {
        heading: data.heading,
        eyebrow: data.eyebrow,
        body: data.body,
        bullets: bulletsArray,
        cta_text: data.cta_text,
        cta_link: data.cta_link,
        image_url: data.image_url,
        is_active: data.is_active,
        sort_order: data.sort_order,
        updated_by: user?.id || null,
      }

      if (isEdit && section) {
        const { error } = await supabase
          .from('home_about_sections')
          .update(payload)
          .eq('id', section.id)

        if (error) throw error
        showNotification({ message: 'About section updated successfully', variant: 'success' })
      } else {
        const { error } = await supabase
          .from('home_about_sections')
          .insert({
            ...payload,
            created_by: user?.id || null,
          })

        if (error) throw error
        showNotification({ message: 'About section created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving about section:', err)
      showNotification({ message: 'Failed to save about section', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon={isEdit ? 'mingcute:edit-line' : 'mingcute:add-line'} className="me-2" />
          {isEdit ? 'Edit About Section' : 'Add About Section'}
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
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Eyebrow</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('eyebrow')}
                        isInvalid={!!errors.eyebrow}
                        placeholder="e.g., Who We Are"
                      />
                      <Form.Text className="text-muted">
                        Small text above the heading
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.eyebrow?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Heading *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('heading')}
                        isInvalid={!!errors.heading}
                        placeholder="Main heading for this section"
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
                      <Form.Label>Body Text</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        {...register('body')}
                        isInvalid={!!errors.body}
                        placeholder="Paragraph description..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.body?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bullet Points</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        {...register('bullets_text')}
                        placeholder="One bullet point per line&#10;Example: Designing content with AI power&#10;Example: Trending marketing tools involve"
                      />
                      <Form.Text className="text-muted">
                        Enter one bullet point per line. Empty lines will be ignored.
                      </Form.Text>
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
                        placeholder="e.g., Learn More"
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
                        type="text"
                        {...register('cta_link')}
                        isInvalid={!!errors.cta_link}
                        placeholder="e.g., /about or https://..."
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
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section Image</Form.Label>
                      <Controller
                        name="image_url"
                        control={control}
                        render={({ field }) => (
                          <HomeAboutImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="About Section Image"
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Details Tab */}
              <Tab.Pane eventKey="details">
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sort Order</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        {...register('sort_order')}
                        isInvalid={!!errors.sort_order}
                      />
                      <Form.Text className="text-muted">
                        Lower numbers appear first
                      </Form.Text>
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
                        Active sections are visible on the public website.
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
