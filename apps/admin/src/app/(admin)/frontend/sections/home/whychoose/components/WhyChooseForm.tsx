/**
 * WhyChoose Form Modal
 * Create/Edit WhyChoose section with tabbed interface
 * 
 * Fields: section_title, section_subtitle, thumbnail_url, features (JSONB array)
 * Features: Array of { title, content } objects
 */
import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Spinner, Tab, Nav, Card } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useAuthContext } from '@/context/useAuthContext'

// Type for home_whychoose table
interface HomeWhyChoose {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  is_active: boolean
  sort_order: number
  section_title: string
  section_subtitle: string | null
  thumbnail_url: string | null
  features: Array<{ title: string; content: string }>
}

// Feature item schema
const featureSchema = z.object({
  title: z.string().min(1, 'Feature title is required').max(200),
  content: z.string().min(1, 'Feature content is required').max(1000),
})

// Zod schema with z.preprocess for field normalization
const whyChooseSchema = z.object({
  // Required
  section_title: z.string().min(1, 'Section title is required').max(200),
  
  // Optional
  section_subtitle: z.preprocess(
    (v) => (v === '' ? null : v),
    z.string().max(100).nullable()
  ),
  thumbnail_url: z.preprocess(
    (v) => (v === '' ? null : v),
    z.string().max(500).nullable()
  ),
  
  // Features array
  features: z.array(featureSchema).min(1, 'At least one feature is required').max(10),
  
  // Boolean
  is_active: z.boolean(),
  
  // CRITICAL: sort_order uses preprocess - "" → 0, otherwise integer >= 0
  sort_order: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? 0 : Number(v)),
    z.number().int().min(0)
  ),
})

type WhyChooseFormData = z.infer<typeof whyChooseSchema>

interface WhyChooseFormProps {
  show: boolean
  onHide: () => void
  section: HomeWhyChoose | null
  onSuccess: () => void
}

export const WhyChooseForm = ({ show, onHide, section, onSuccess }: WhyChooseFormProps) => {
  const { showNotification } = useNotificationContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const isEdit = !!section

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<WhyChooseFormData>({
    resolver: zodResolver(whyChooseSchema),
    defaultValues: {
      section_title: '',
      section_subtitle: null,
      thumbnail_url: null,
      features: [{ title: '', content: '' }],
      is_active: true,
      sort_order: 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })

  // Reset form when modal opens/closes or section changes
  useEffect(() => {
    if (show && section) {
      reset({
        section_title: section.section_title,
        section_subtitle: section.section_subtitle,
        thumbnail_url: section.thumbnail_url,
        features: section.features?.length > 0 
          ? section.features 
          : [{ title: '', content: '' }],
        is_active: section.is_active,
        sort_order: section.sort_order,
      })
    } else if (show) {
      reset({
        section_title: '',
        section_subtitle: null,
        thumbnail_url: null,
        features: [{ title: '', content: '' }],
        is_active: true,
        sort_order: 0,
      })
    }
    setActiveTab('basic')
  }, [show, section, reset])

  const onSubmit = async (data: WhyChooseFormData) => {
    try {
      setLoading(true)

      const payload = {
        section_title: data.section_title,
        section_subtitle: data.section_subtitle,
        thumbnail_url: data.thumbnail_url,
        features: data.features,
        is_active: data.is_active,
        sort_order: data.sort_order,
        updated_by: user?.id || null,
      }

      if (isEdit && section) {
        const { error } = await supabase
          .from('home_whychoose')
          .update(payload)
          .eq('id', section.id)

        if (error) throw error
        showNotification({ message: 'WhyChoose section updated successfully', variant: 'success' })
      } else {
        const { error } = await supabase
          .from('home_whychoose')
          .insert({
            ...payload,
            created_by: user?.id || null,
          })

        if (error) throw error
        showNotification({ message: 'WhyChoose section created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving WhyChoose section:', err)
      showNotification({ message: 'Failed to save section', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddFeature = () => {
    if (fields.length < 10) {
      append({ title: '', content: '' })
    }
  }

  const handleRemoveFeature = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon={isEdit ? 'mingcute:edit-line' : 'mingcute:add-line'} className="me-2" />
          {isEdit ? 'Edit WhyChoose Section' : 'Add WhyChoose Section'}
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
                <Nav.Link eventKey="features">Features</Nav.Link>
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
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section Title *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('section_title')}
                        isInvalid={!!errors.section_title}
                        placeholder="e.g., We have depth of market knowledge"
                      />
                      <Form.Text className="text-muted">
                        Main heading for the WhyChoose section
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.section_title?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subtitle</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('section_subtitle')}
                        isInvalid={!!errors.section_subtitle}
                        placeholder="e.g., Why Choose Us"
                      />
                      <Form.Text className="text-muted">
                        Eyebrow text above the title
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.section_subtitle?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Features Tab */}
              <Tab.Pane eventKey="features">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Features</strong>
                    <span className="text-muted ms-2">({fields.length} / 10)</span>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddFeature}
                    disabled={fields.length >= 10}
                  >
                    <Icon icon="mingcute:add-line" className="me-1" />
                    Add Feature
                  </Button>
                </div>

                {errors.features?.message && (
                  <div className="alert alert-danger py-2 mb-3">
                    {errors.features.message}
                  </div>
                )}

                {fields.map((field, index) => (
                  <Card key={field.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <strong>Feature {index + 1}</strong>
                        {fields.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            <Icon icon="mingcute:close-line" />
                          </Button>
                        )}
                      </div>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-2">
                            <Form.Label>Title *</Form.Label>
                            <Form.Control
                              type="text"
                              {...register(`features.${index}.title`)}
                              isInvalid={!!errors.features?.[index]?.title}
                              placeholder="e.g., Talented, professional & expert team"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.features?.[index]?.title?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-0">
                            <Form.Label>Content *</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              {...register(`features.${index}.content`)}
                              isInvalid={!!errors.features?.[index]?.content}
                              placeholder="Description of this feature..."
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.features?.[index]?.content?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Tab.Pane>

              {/* Media Tab */}
              <Tab.Pane eventKey="media">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thumbnail Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('thumbnail_url')}
                        isInvalid={!!errors.thumbnail_url}
                        placeholder="/images/creative-agency/why_choose_us_img_3.jpeg"
                      />
                      <Form.Text className="text-muted">
                        Image displayed alongside the features accordion
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.thumbnail_url?.message}
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