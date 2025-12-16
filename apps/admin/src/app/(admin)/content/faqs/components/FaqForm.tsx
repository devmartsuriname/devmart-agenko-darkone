/**
 * FAQ Form Modal
 * Create/Edit FAQs with tabbed interface
 * 
 * IMPORTANT: Uses z.preprocess for field normalization:
 * - category: "" → null (trimmed)
 * - sort_order: "" or NaN → 0, otherwise integer >= 0
 * 
 * NOTE: 2 tabs only (Basic Info | Details) - NO Media tab (no image_url in schema)
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
import type { Tables } from '@/integrations/supabase/types'

type Faq = Tables<'faqs'>

// Zod schema with z.preprocess for field normalization
const faqSchema = z.object({
  // Required
  question: z.string().min(1, 'Question is required').max(500),
  answer: z.string().min(1, 'Answer is required'),
  
  // Optional string (normalized: "" → null)
  category: z.preprocess(
    (v) => (v === '' || v == null ? null : String(v).trim()),
    z.string().max(100).nullable()
  ),
  
  // Booleans
  is_active: z.boolean(),
  is_featured: z.boolean(),
  
  // CRITICAL: sort_order uses preprocess - "" or NaN → 0, otherwise integer >= 0
  sort_order: z.preprocess(
    (v) => {
      if (v === '' || v == null || v === undefined) return 0
      const num = Number(v)
      return isNaN(num) ? 0 : num
    },
    z.number().int().min(0)
  ),
})

type FaqFormData = z.infer<typeof faqSchema>

interface FaqFormProps {
  show: boolean
  onHide: () => void
  faq: Faq | null
  onSuccess: () => void
}

export const FaqForm = ({ show, onHide, faq, onSuccess }: FaqFormProps) => {
  const { showNotification } = useNotificationContext()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const isEdit = !!faq

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
      category: null,
      is_active: true,   // Matches DB default
      is_featured: false, // Matches DB default
      sort_order: 0,      // Matches DB default
    },
  })

  // Reset form when modal opens/closes or faq changes
  useEffect(() => {
    if (show && faq) {
      reset({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        is_active: faq.is_active,
        is_featured: faq.is_featured,
        sort_order: faq.sort_order,
      })
    } else if (show) {
      reset({
        question: '',
        answer: '',
        category: null,
        is_active: true,
        is_featured: false,
        sort_order: 0,
      })
    }
    setActiveTab('basic')
  }, [show, faq, reset])

  const onSubmit = async (data: FaqFormData) => {
    try {
      setLoading(true)

      // Data is already normalized by z.preprocess:
      // - category: null if empty
      // - sort_order: 0 if empty/NaN
      const payload = {
        question: data.question,
        answer: data.answer,
        category: data.category,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order,
        updated_by: user?.id || null,
      }

      if (isEdit && faq) {
        const { error } = await supabase
          .from('faqs')
          .update(payload)
          .eq('id', faq.id)

        if (error) throw error
        showNotification({ message: 'FAQ updated successfully', variant: 'success' })
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert({
            ...payload,
            created_by: user?.id || null,
          })

        if (error) throw error
        showNotification({ message: 'FAQ created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving FAQ:', err)
      showNotification({ message: 'Failed to save FAQ', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon={isEdit ? 'mingcute:edit-line' : 'mingcute:add-line'} className="me-2" />
          {isEdit ? 'Edit FAQ' : 'Add FAQ'}
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
                <Nav.Link eventKey="details">Details</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Basic Info Tab */}
              <Tab.Pane eventKey="basic">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Question *</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('question')}
                        isInvalid={!!errors.question}
                        placeholder="e.g., How do I reset my password?"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.question?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Answer *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        {...register('answer')}
                        isInvalid={!!errors.answer}
                        placeholder="Provide a clear, helpful answer..."
                      />
                      <Form.Text className="text-muted">
                        Supports plain text. Markdown is not rendered.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.answer?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('category')}
                        isInvalid={!!errors.category}
                        placeholder="e.g., General, Billing, Technical"
                      />
                      <Form.Text className="text-muted">
                        Optional. Used to group FAQs by topic.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.category?.message}
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
                        Lower numbers appear first.
                      </Form.Text>
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
                        Active FAQs are visible on the public website.
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
                        Featured FAQs may appear on the homepage.
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
