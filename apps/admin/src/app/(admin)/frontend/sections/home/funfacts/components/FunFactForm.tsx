/**
 * FunFact Form Modal
 * Create/Edit funfacts with tabbed interface
 * 
 * Fields: title (text), number (text)
 * No media for funfacts - Media tab present but disabled
 */
import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Spinner, Tab, Nav } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useAuthContext } from '@/context/useAuthContext'

// Type for home_funfacts table
interface HomeFunFact {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  is_active: boolean
  sort_order: number
  title: string
  number: string
}

// Zod schema with z.preprocess for field normalization
const funfactSchema = z.object({
  // Required
  title: z.string().min(1, 'Title is required').max(200),
  number: z.string().min(1, 'Number is required').max(50),
  
  // Boolean
  is_active: z.boolean(),
  
  // CRITICAL: sort_order uses preprocess - "" → 0, otherwise integer >= 0
  sort_order: z.preprocess(
    (v) => (v === '' || v == null || v === undefined ? 0 : Number(v)),
    z.number().int().min(0)
  ),
})

type FunFactFormData = z.infer<typeof funfactSchema>

interface FunFactFormProps {
  show: boolean
  onHide: () => void
  funfact: HomeFunFact | null
  onSuccess: () => void
}

export const FunFactForm = ({ show, onHide, funfact, onSuccess }: FunFactFormProps) => {
  const { showNotification } = useNotificationContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const isEdit = !!funfact

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FunFactFormData>({
    resolver: zodResolver(funfactSchema),
    defaultValues: {
      title: '',
      number: '',
      is_active: true,
      sort_order: 0,
    },
  })

  // Reset form when modal opens/closes or funfact changes
  useEffect(() => {
    if (show && funfact) {
      reset({
        title: funfact.title,
        number: funfact.number,
        is_active: funfact.is_active,
        sort_order: funfact.sort_order,
      })
    } else if (show) {
      reset({
        title: '',
        number: '',
        is_active: true,
        sort_order: 0,
      })
    }
    setActiveTab('basic')
  }, [show, funfact, reset])

  const onSubmit = async (data: FunFactFormData) => {
    try {
      setLoading(true)

      const payload = {
        title: data.title,
        number: data.number,
        is_active: data.is_active,
        sort_order: data.sort_order,
        updated_by: user?.id || null,
      }

      if (isEdit && funfact) {
        const { error } = await supabase
          .from('home_funfacts')
          .update(payload)
          .eq('id', funfact.id)

        if (error) throw error
        showNotification({ message: 'FunFact updated successfully', variant: 'success' })
      } else {
        const { error } = await supabase
          .from('home_funfacts')
          .insert({
            ...payload,
            created_by: user?.id || null,
          })

        if (error) {
          // Check for max 4 constraint violation
          if (error.message?.includes('maximum of 4')) {
            showNotification({ message: 'Maximum 4 funfacts allowed', variant: 'warning' })
            return
          }
          throw error
        }
        showNotification({ message: 'FunFact created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving funfact:', err)
      showNotification({ message: 'Failed to save funfact', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon={isEdit ? 'mingcute:edit-line' : 'mingcute:add-line'} className="me-2" />
          {isEdit ? 'Edit FunFact' : 'Add FunFact'}
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
                <Nav.Link eventKey="media" disabled>
                  Media <small className="text-muted">(N/A)</small>
                </Nav.Link>
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
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('title')}
                        isInvalid={!!errors.title}
                        placeholder="e.g., Active Clients"
                      />
                      <Form.Text className="text-muted">
                        Label for this stat (e.g., "Active Clients", "Projects Done")
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.title?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('number')}
                        isInvalid={!!errors.number}
                        placeholder="e.g., 22K or 15K+"
                      />
                      <Form.Text className="text-muted">
                        Display value (text, e.g., "22k", "15K+", "121")
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.number?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Media Tab (Disabled) */}
              <Tab.Pane eventKey="media">
                <div className="text-center py-5">
                  <Icon icon="mingcute:image-line" className="fs-1 text-muted mb-3 d-block" />
                  <p className="text-muted">No media fields for FunFacts.</p>
                </div>
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
                        Active funfacts are visible on the public website.
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
