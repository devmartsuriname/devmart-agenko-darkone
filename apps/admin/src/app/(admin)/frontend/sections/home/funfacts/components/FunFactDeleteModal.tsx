/**
 * FunFact Delete Modal
 * Admin-only confirmation dialog for deleting funfacts
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'

// Type for home_funfacts table
interface HomeFunFact {
  id: string
  title: string
  number: string
}

interface FunFactDeleteModalProps {
  show: boolean
  onHide: () => void
  funfact: HomeFunFact | null
  onSuccess: () => void
}

export const FunFactDeleteModal = ({ show, onHide, funfact, onSuccess }: FunFactDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!funfact) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('home_funfacts')
        .delete()
        .eq('id', funfact.id)

      if (error) throw error

      showNotification({ message: 'FunFact deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting funfact:', err)
      showNotification({ message: 'Failed to delete funfact', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:warning-line" className="me-2" />
          Delete FunFact
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the funfact:</p>
        <p className="fw-bold">
          &quot;{funfact?.title}&quot; — {funfact?.number}
        </p>
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
