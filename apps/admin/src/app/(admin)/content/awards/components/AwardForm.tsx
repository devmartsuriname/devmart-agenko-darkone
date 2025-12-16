/**
 * Award Form Modal
 * Create/Edit awards with tabbed interface
 * 
 * IMPORTANT: Uses z.preprocess for field normalization:
 * - year: "" → null, otherwise integer 1900-2100
 * - sort_order: "" → 0, otherwise integer >= 0
 * - link_url: "" → null, validate URL only when present
 * - issuer/description: "" → null (trimmed)
 * 
 * NOTE: DB default for is_featured is TRUE, but form defaults to FALSE
 * to prevent all new awards appearing as featured.
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
import { AwardImageUpload } from './AwardImageUpload'
import type { Tables } from '@/integrations/supabase/types'

type Award = Tables<'awards'>

// Zod schema with z.preprocess for field normalization
const awardSchema = z.object({
  // Required
  title: z.string().min(1, 'Title is required').max(200),
  
  // Optional strings (normalized)
  issuer: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(200).nullable()
  ),
  description: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().nullable()
  ),
  
  // Image
  image_url: z.string().nullable(),
  
  // CRITICAL: year uses preprocess - "" → null, otherwise integer 1900-2100
  year: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? null : Number(v)),
    z.number().int().min(1900).max(2100).nullable()
  ),
  
  // CRITICAL: link_url normalized - "" → null, validate URL only when present
  link_url: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().url('Please enter a valid URL').nullable().or(z.null())
  ),
  
  // Booleans
  is_active: z.boolean(),
  is_featured: z.boolean(),
  
  // CRITICAL: sort_order uses preprocess - "" → 0, otherwise integer >= 0
  sort_order: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? 0 : Number(v)),
    z.number().int().min(0)
  ),
})

type AwardFormData = z.infer<typeof awardSchema>

interface AwardFormProps {
  show: boolean
  onHide: () => void
  award: Award | null
  onSuccess: () => void
}

export const AwardForm = ({ show, onHide, award, onSuccess }: AwardFormProps) => {
  const { showNotification } = useNotificationContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const isEdit = !!award

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AwardFormData>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      title: '',
      issuer: null,
      description: null,
      image_url: null,
      year: null,
      link_url: null,
      is_active: true,
      is_featured: false, // Explicitly FALSE to override DB default of TRUE
      sort_order: 0,
    },
  })

  // Reset form when modal opens/closes or award changes
  useEffect(() => {
    if (show && award) {
      reset({
        title: award.title,
        issuer: award.issuer,
        description: award.description,
        image_url: award.image_url,
        year: award.year,
        link_url: award.link_url,
        is_active: award.is_active,
        is_featured: award.is_featured,
        sort_order: award.sort_order,
      })
    } else if (show) {
      reset({
        title: '',
        issuer: null,
        description: null,
        image_url: null,
        year: null,
        link_url: null,
        is_active: true,
        is_featured: false, // Explicitly FALSE for new awards
        sort_order: 0,
      })
    }
    setActiveTab('basic')
  }, [show, award, reset])

  const onSubmit = async (data: AwardFormData) => {
    try {
      setLoading(true)

      // Data is already normalized by z.preprocess:
      // - year: null if empty, otherwise 1900-2100
      // - sort_order: 0 if empty, otherwise >= 0
      // - link_url: null if empty, otherwise valid URL
      // - issuer/description: null if empty
      const payload = {
        title: data.title,
        issuer: data.issuer,
        description: data.description,
        image_url: data.image_url,
        year: data.year,
        link_url: data.link_url,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order,
        updated_by: user?.id || null,
      }

      if (isEdit && award) {
        const { error } = await supabase
          .from('awards')
          .update(payload)
          .eq('id', award.id)

        if (error) throw error
        showNotification({ message: 'Award updated successfully', variant: 'success' })
      } else {
        const { error } = await supabase
          .from('awards')
          .insert({
            ...payload,
            created_by: user?.id || null,
          })

        if (error) throw error
        showNotification({ message: 'Award created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving award:', err)
      showNotification({ message: 'Failed to save award', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon={isEdit ? 'mingcute:edit-line' : 'mingcute:add-line'} className="me-2" />
          {isEdit ? 'Edit Award' : 'Add Award'}
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
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Award Title *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('title')}
                        isInvalid={!!errors.title}
                        placeholder="Best Digital Agency 2024"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        min={1900}
                        max={2100}
                        {...register('year')}
                        isInvalid={!!errors.year}
                        placeholder="2024"
                      />
                      <Form.Text className="text-muted">
                        Optional. Year award was received.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.year?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Issuer / Organization</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('issuer')}
                        isInvalid={!!errors.issuer}
                        placeholder="Awwwards, Clutch, etc."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.issuer?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        {...register('description')}
                        isInvalid={!!errors.description}
                        placeholder="Brief description of the award..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description?.message}
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
                      <Form.Label>Award Image / Badge</Form.Label>
                      <Controller
                        name="image_url"
                        control={control}
                        render={({ field }) => (
                          <AwardImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Award Image"
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
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Link URL</Form.Label>
                      <Form.Control
                        type="url"
                        {...register('link_url')}
                        isInvalid={!!errors.link_url}
                        placeholder="https://example.com/award-page"
                      />
                      <Form.Text className="text-muted">
                        Optional. Link to award page or verification.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.link_url?.message}
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
                        Active awards are visible on the public website.
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
                        Featured awards are highlighted on the homepage.
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
