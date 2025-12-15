/**
 * Service Delete Confirmation Modal
 * Admin-only delete functionality
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type Service = Tables<'services'>

interface ServiceDeleteModalProps {
  show: boolean
  onHide: () => void
  service: Service | null
  onSuccess: () => void
}

export const ServiceDeleteModal = ({ show, onHide, service, onSuccess }: ServiceDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!service) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)

      if (error) throw error

      showNotification({
        message: 'Service deleted successfully',
        variant: 'success',
      })
      onSuccess()
    } catch (err) {
      console.error('Error deleting service:', err)
      showNotification({
        message: 'Failed to delete service',
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
          Delete Service
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this service?</p>
        {service && (
          <div className="p-3 bg-light rounded">
            <strong>{service.title}</strong>
            <br />
            <small className="text-muted">/{service.slug}</small>
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
            'Delete Service'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
