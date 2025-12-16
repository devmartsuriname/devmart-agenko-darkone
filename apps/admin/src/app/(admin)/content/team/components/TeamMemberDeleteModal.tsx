/**
 * Team Member Delete Modal
 * Admin-only confirmation dialog for deleting team members
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type TeamMember = Tables<'team_members'>

interface TeamMemberDeleteModalProps {
  show: boolean
  onHide: () => void
  teamMember: TeamMember | null
  onSuccess: () => void
}

export const TeamMemberDeleteModal = ({ show, onHide, teamMember, onSuccess }: TeamMemberDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!teamMember) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', teamMember.id)

      if (error) throw error

      showNotification({ message: 'Team member deleted successfully', variant: 'success' })
      onSuccess()
    } catch (err) {
      console.error('Error deleting team member:', err)
      showNotification({ message: 'Failed to delete team member', variant: 'danger' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:warning-line" className="me-2" />
          Delete Team Member
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the team member:</p>
        <p className="fw-bold">&quot;{teamMember?.name}&quot;</p>
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
