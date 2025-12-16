/**
 * Testimonial Delete Modal
 * Admin-only confirmation dialog for deleting testimonials
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type Testimonial = Tables<'testimonials'>

interface TestimonialDeleteModalProps {
  show: boolean
  onHide: () => void
  testimonial: Testimonial | null
  onSuccess: () => void
}

export const TestimonialDeleteModal = ({ show, onHide, testimonial, onSuccess }: TestimonialDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!testimonial) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonial.id)

      if (error) throw error

      showNotification({ message: 'Testimonial deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting testimonial:', err)
      showNotification({ message: 'Failed to delete testimonial', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:warning-line" className="me-2" />
          Delete Testimonial
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the testimonial from:</p>
        <p className="fw-bold">&quot;{testimonial?.client_name}&quot;</p>
        <p className="text-muted mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Deleting...
            </>
          ) : (
            <>
              <Icon icon="mingcute:delete-2-line" className="me-1" />
              Delete
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
