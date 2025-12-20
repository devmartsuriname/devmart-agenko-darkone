/**
 * WhyChoose Delete Modal
 * Admin-only confirmation dialog for deleting WhyChoose sections
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'

// Type for home_whychoose table
interface HomeWhyChoose {
  id: string
  section_title: string
  section_subtitle: string | null
}

interface WhyChooseDeleteModalProps {
  show: boolean
  onHide: () => void
  section: HomeWhyChoose | null
  onSuccess: () => void
}

export const WhyChooseDeleteModal = ({ show, onHide, section, onSuccess }: WhyChooseDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!section) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('home_whychoose')
        .delete()
        .eq('id', section.id)

      if (error) throw error

      showNotification({ message: 'WhyChoose section deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting WhyChoose section:', err)
      showNotification({ message: 'Failed to delete section', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:warning-line" className="me-2" />
          Delete WhyChoose Section
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the section:</p>
        <p className="fw-bold">
          &quot;{section?.section_title}&quot;
          {section?.section_subtitle && (
            <span className="text-muted fw-normal"> — {section.section_subtitle}</span>
          )}
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