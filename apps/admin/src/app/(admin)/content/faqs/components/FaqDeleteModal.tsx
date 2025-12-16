/**
 * FAQ Delete Modal
 * Admin-only delete confirmation
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type Faq = Tables<'faqs'>

interface FaqDeleteModalProps {
  show: boolean
  onHide: () => void
  faq: Faq | null
  onSuccess: () => void
}

export const FaqDeleteModal = ({ show, onHide, faq, onSuccess }: FaqDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!faq) return

    try {
      setDeleting(true)
      const { error } = await supabase.from('faqs').delete().eq('id', faq.id)

      if (error) throw error

      showNotification({ message: 'FAQ deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting FAQ:', err)
      showNotification({ message: 'Failed to delete FAQ', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  if (!faq) return null

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon="mingcute:delete-2-line" className="me-2 text-danger" />
          Delete FAQ
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this FAQ?</p>
        <p className="fw-medium mb-0">"{faq.question}"</p>
        <p className="text-muted mt-2 small">This action cannot be undone.</p>
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
