/**
 * Project Delete Confirmation Modal
 * Admin-only delete functionality
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type Project = Tables<'projects'>

interface ProjectDeleteModalProps {
  show: boolean
  onHide: () => void
  project: Project | null
  onSuccess: () => void
}

export const ProjectDeleteModal = ({ show, onHide, project, onSuccess }: ProjectDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!project) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) throw error

      showNotification({
        message: 'Project deleted successfully',
        variant: 'success',
      })
      onSuccess()
    } catch (err) {
      console.error('Error deleting project:', err)
      showNotification({
        message: 'Failed to delete project',
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
          Delete Project
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this project?</p>
        {project && (
          <div className="p-3 bg-light rounded">
            <strong>{project.title}</strong>
            <br />
            <small className="text-muted">/{project.slug}</small>
            {project.client_name && (
              <>
                <br />
                <small className="text-muted">Client: {project.client_name}</small>
              </>
            )}
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
            'Delete Project'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
