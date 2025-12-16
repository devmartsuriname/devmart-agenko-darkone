/**
 * Award Delete Modal
 * Admin-only confirmation dialog for deleting awards
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type Award = Tables<'awards'>

interface AwardDeleteModalProps {
  show: boolean
  onHide: () => void
  award: Award | null
  onSuccess: () => void
}

export const AwardDeleteModal = ({ show, onHide, award, onSuccess }: AwardDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!award) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('awards')
        .delete()
        .eq('id', award.id)

      if (error) throw error

      showNotification({ message: 'Award deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting award:', err)
      showNotification({ message: 'Failed to delete award', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:warning-line" className="me-2" />
          Delete Award
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the award:</p>
        <p className="fw-bold">&quot;{award?.title}&quot;</p>
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
