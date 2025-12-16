/**
 * Page Delete Confirmation Modal
 * Admin-only delete functionality
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type Page = Tables<'pages'>

interface PageDeleteModalProps {
  show: boolean
  onHide: () => void
  page: Page | null
  onSuccess: () => void
}

export const PageDeleteModal = ({ show, onHide, page, onSuccess }: PageDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!page) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', page.id)

      if (error) throw error

      showNotification({
        message: 'Page deleted successfully',
        variant: 'success',
      })
      onSuccess()
    } catch (err) {
      console.error('Error deleting page:', err)
      showNotification({
        message: 'Failed to delete page',
        variant: 'danger',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:alert-line" className="me-2" />
          Delete Page
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this page?</p>
        {page && (
          <div className="p-3 bg-light rounded">
            <strong>{page.title}</strong>
            <br />
            <small className="text-muted">/{page.slug}</small>
          </div>
        )}
        <p className="text-danger mt-3 mb-0">
          <small>This action cannot be undone.</small>
        </p>
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
            'Delete Page'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
