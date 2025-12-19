/**
 * Hero Section Delete Modal
 * Admin-only confirmation dialog for deleting hero sections
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type HeroSection = Tables<'hero_sections'>

interface HeroDeleteModalProps {
  show: boolean
  onHide: () => void
  hero: HeroSection | null
  onSuccess: () => void
}

export const HeroDeleteModal = ({ show, onHide, hero, onSuccess }: HeroDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!hero) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('hero_sections')
        .delete()
        .eq('id', hero.id)

      if (error) throw error

      showNotification({ message: 'Hero section deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting hero section:', err)
      showNotification({ message: 'Failed to delete hero section', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  // Truncate heading for display
  const truncatedHeading = hero?.heading 
    ? (hero.heading.length > 50 ? `${hero.heading.substring(0, 50)}...` : hero.heading)
    : ''

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:warning-line" className="me-2" />
          Delete Hero Section
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the hero section:</p>
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
