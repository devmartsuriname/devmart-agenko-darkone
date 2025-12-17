import { useEffect } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'

const subscriberSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  source: z.string().default('admin'),
})

type SubscriberFormData = z.infer<typeof subscriberSchema>

interface SubscriberFormModalProps {
  show: boolean
  onHide: () => void
  onSuccess: () => void
  subscriber?: {
    id: string
    email: string
    source: string | null
    is_active: boolean
  } | null
}

const SubscriberFormModal = ({
  show,
  onHide,
  onSuccess,
  subscriber,
}: SubscriberFormModalProps) => {
  const { showNotification } = useNotificationContext()
  const isEditMode = !!subscriber

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: '',
      source: 'admin',
    },
  })

  useEffect(() => {
    if (show) {
      if (subscriber) {
        reset({
          email: subscriber.email,
          source: subscriber.source || 'admin',
        })
      } else {
        reset({
          email: '',
          source: 'admin',
        })
      }
    }
  }, [show, subscriber, reset])

  const onSubmit = async (data: SubscriberFormData) => {
    try {
      if (isEditMode && subscriber) {
        // Update existing subscriber
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({
            email: data.email.trim().toLowerCase(),
          })
          .eq('id', subscriber.id)

        if (error) {
          if (error.code === '23505') {
            showNotification({
              message: 'This email is already subscribed',
              variant: 'warning',
            })
            return
          }
          throw error
        }

        showNotification({
          message: 'Subscriber updated successfully',
          variant: 'success',
        })
      } else {
        // Create new subscriber
        const { error } = await supabase.from('newsletter_subscribers').insert({
          email: data.email.trim().toLowerCase(),
          source: data.source,
          is_active: true,
        })

        if (error) {
          if (error.code === '23505') {
            showNotification({
              message: 'This email is already subscribed',
              variant: 'warning',
            })
            return
          }
          throw error
        }

        showNotification({
          message: 'Subscriber added successfully',
          variant: 'success',
        })
      }

      onSuccess()
      onHide()
    } catch (error) {
      console.error('Error saving subscriber:', error)
      showNotification({
        message: 'Failed to save subscriber. Please try again.',
        variant: 'danger',
      })
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? 'Edit Subscriber' : 'Add Subscriber'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email Address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="subscriber@example.com"
                  {...register('email')}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {!isEditMode && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Control
                    type="text"
                    value="admin"
                    disabled
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    Manual entries are tagged as "admin" source
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          )}

          {isEditMode && subscriber && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Control
                    type="text"
                    value={subscriber.source || 'unknown'}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    type="text"
                    value={subscriber.is_active ? 'Subscribed' : 'Unsubscribed'}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEditMode
                ? 'Update Subscriber'
                : 'Add Subscriber'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SubscriberFormModal
