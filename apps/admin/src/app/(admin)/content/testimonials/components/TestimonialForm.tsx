/**
 * Testimonial Form Modal
 * Create/Edit testimonials with tabbed interface
 * 
 * IMPORTANT: Uses z.preprocess for numeric fields to handle HTML input strings:
 * - rating: "" → null, otherwise integer 1-5
 * - sort_order: "" → 0, otherwise integer >= 0
 * - project_id: "" → null (normalized before validation)
 */
import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Spinner, Tab, Nav, Alert } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useAuthContext } from '@/context/useAuthContext'
import { TestimonialImageUpload } from './TestimonialImageUpload'
import type { Tables } from '@/integrations/supabase/types'

type Testimonial = Tables<'testimonials'>
type Project = Tables<'projects'>

// Zod schema with z.preprocess for numeric handling
const testimonialSchema = z.object({
  client_name: z.string().min(1, 'Client name is required').max(200),
  client_role: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(200).nullable()
  ),
  client_company: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(200).nullable()
  ),
  quote: z.string().min(1, 'Quote is required'),
  avatar_url: z.string().nullable(),
  // CRITICAL: rating uses preprocess - "" → null, otherwise integer 1-5
  rating: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? null : Number(v)),
    z.number().int().min(1).max(5).nullable()
  ),
  // CRITICAL: project_id uses preprocess - "" → null
  project_id: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v)),
    z.string().uuid().nullable().or(z.null())
  ),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  // CRITICAL: sort_order uses preprocess - "" → 0, otherwise integer >= 0
  sort_order: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? 0 : Number(v)),
    z.number().int().min(0)
  ),
})

type TestimonialFormData = z.infer<typeof testimonialSchema>

interface TestimonialFormProps {
  show: boolean
  onHide: () => void
  testimonial: Testimonial | null
  onSuccess: () => void
}

export const TestimonialForm = ({ show, onHide, testimonial, onSuccess }: TestimonialFormProps) => {
  const { showNotification } = useNotificationContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  
  // Projects dropdown state with resilience
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  const isEdit = !!testimonial

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      client_name: '',
      client_role: null,
      client_company: null,
      quote: '',
      avatar_url: null,
      rating: null,
      project_id: null,
      is_active: true,
      is_featured: false,
      sort_order: 0,
    },
  })

  // Fetch projects for dropdown with resilience
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true)
      setProjectsError(null)
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, slug')
          .order('title', { ascending: true })

        if (error) throw error
        setProjects(data || [])
      } catch (err) {
        console.error('Error fetching projects:', err)
        setProjectsError('Projects unavailable')
        // Form still works without projects
      } finally {
        setProjectsLoading(false)
      }
    }

    if (show) {
      fetchProjects()
    }
  }, [show])

  // Reset form when modal opens/closes or testimonial changes
  useEffect(() => {
    if (show && testimonial) {
      reset({
        client_name: testimonial.client_name,
        client_role: testimonial.client_role,
        client_company: testimonial.client_company,
        quote: testimonial.quote,
        avatar_url: testimonial.avatar_url,
        rating: testimonial.rating,
        project_id: testimonial.project_id,
        is_active: testimonial.is_active,
        is_featured: testimonial.is_featured,
        sort_order: testimonial.sort_order,
      })
    } else if (show) {
      reset({
        client_name: '',
        client_role: null,
        client_company: null,
        quote: '',
        avatar_url: null,
        rating: null,
        project_id: null,
        is_active: true,
        is_featured: false,
        sort_order: 0,
      })
    }
    setActiveTab('basic')
  }, [show, testimonial, reset])

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      setLoading(true)

      // Data is already normalized by z.preprocess:
      // - rating: null if empty, otherwise 1-5
      // - sort_order: 0 if empty, otherwise >= 0
      // - project_id: null if empty
      const payload = {
        client_name: data.client_name,
        client_role: data.client_role,
        client_company: data.client_company,
        quote: data.quote,
        avatar_url: data.avatar_url,
        rating: data.rating,
        project_id: data.project_id,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order,
        updated_by: user?.id || null,
      }

      if (isEdit && testimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', testimonial.id)

        if (error) throw error
        showNotification({ message: 'Testimonial updated successfully', variant: 'success' })
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({
            ...payload,
            created_by: user?.id || null,
          })

        if (error) throw error
        showNotification({ message: 'Testimonial created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving testimonial:', err)
      showNotification({ message: 'Failed to save testimonial', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon={isEdit ? 'mingcute:edit-line' : 'mingcute:add-line'} className="me-2" />
          {isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client Name *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('client_name')}
                        isInvalid={!!errors.client_name}
                        placeholder="John Doe"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.client_name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client Role</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('client_role')}
                        isInvalid={!!errors.client_role}
                        placeholder="CEO, Marketing Director, etc."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.client_role?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client Company</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('client_company')}
                        isInvalid={!!errors.client_company}
                        placeholder="Acme Inc."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.client_company?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quote *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        {...register('quote')}
                        isInvalid={!!errors.quote}
                        placeholder="Enter the testimonial quote..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.quote?.message}
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
                      <Form.Label>Client Photo/Avatar</Form.Label>
                      <Controller
                        name="avatar_url"
                        control={control}
                        render={({ field }) => (
                          <TestimonialImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Client Avatar"
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
                      <Form.Label>Rating (1-5)</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        max={5}
                        {...register('rating')}
                        isInvalid={!!errors.rating}
                        placeholder="Leave empty if no rating"
                      />
                      <Form.Text className="text-muted">
                        Optional. Leave empty for no rating.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.rating?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Linked Project</Form.Label>
                      {projectsError && (
                        <Alert variant="warning" className="py-1 px-2 mb-2">
                          <small>{projectsError}</small>
                        </Alert>
                      )}
                      <Form.Select
                        {...register('project_id')}
                        isInvalid={!!errors.project_id}
                        disabled={projectsLoading}
                      >
                        <option value="">-- No project linked --</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Optional. Link to a project.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.project_id?.message}
                      </Form.Control.Feedback>
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
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="is_active"
                        label="Active"
                        {...register('is_active')}
                      />
                      <Form.Text className="text-muted">
                        Active testimonials are visible on the public website.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="is_featured"
                        label="Featured"
                        {...register('is_featured')}
                      />
                      <Form.Text className="text-muted">
                        Featured testimonials are highlighted on the homepage.
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
