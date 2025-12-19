/**
 * Home About Section Delete Modal
 * Admin-only confirmation dialog for deleting about sections
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'

// Type for home_about_sections table
interface HomeAboutSection {
  id: string
  heading: string
  eyebrow: string | null
}

interface HomeAboutDeleteModalProps {
  show: boolean
  onHide: () => void
  section: HomeAboutSection | null
  onSuccess: () => void
}

export const HomeAboutDeleteModal = ({ show, onHide, section, onSuccess }: HomeAboutDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!section) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('home_about_sections')
        .delete()
        .eq('id', section.id)

      if (error) throw error

      showNotification({ message: 'About section deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting about section:', err)
      showNotification({ message: 'Failed to delete about section', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  // Truncate heading for display
  const truncatedHeading = section?.heading 
    ? (section.heading.length > 50 ? `${section.heading.substring(0, 50)}...` : section.heading)
    : ''

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:warning-line" className="me-2" />
          Delete About Section
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the about section:</p>
        <p className="fw-bold">&quot;{truncatedHeading}&quot;</p>
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
