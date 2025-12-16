/**
 * ContactSubmissionViewModal
 * Read-only modal for viewing contact submission details.
 * 
 * Features:
 * - Read-only display of all submission fields
 * - Copy-to-clipboard for Email and Message
 * - Auto "Mark as Read" on open if status === 'new'
 * - Deactivate/Reactivate buttons (Admin-only)
 */
import { useEffect, useState } from 'react'
import { Modal, Badge, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/integrations/supabase/types'

type ContactSubmission = Tables<'contact_submissions'>

interface ContactSubmissionViewModalProps {
  show: boolean
  onHide: () => void
  submission: ContactSubmission | null
  onStatusChange: () => void
}

export const ContactSubmissionViewModal = ({
  show,
  onHide,
  submission,
  onStatusChange,
}: ContactSubmissionViewModalProps) => {
  const { isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasMarkedRead, setHasMarkedRead] = useState(false)

  // Auto "Mark as Read" when opening a 'new' submission
  useEffect(() => {
    if (show && submission && submission.status === 'new' && !hasMarkedRead) {
      markAsRead()
    }
    // Reset flag when modal closes
    if (!show) {
      setHasMarkedRead(false)
    }
  }, [show, submission?.id])

  const markAsRead = async () => {
    if (!submission) return
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', submission.id)

      if (error) throw error
      setHasMarkedRead(true)
      onStatusChange()
    } catch (err) {
      console.error('Error marking as read:', err)
      // Silent fail for auto-mark — not critical
    }
  }

  const handleDeactivate = async () => {
    if (!submission) return
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'archived' })
        .eq('id', submission.id)

      if (error) throw error

      showNotification({
        message: 'Submission archived successfully',
        variant: 'success',
      })
      onStatusChange()
      onHide()
    } catch (err) {
      console.error('Error archiving submission:', err)
      showNotification({
        message: 'Failed to archive submission',
        variant: 'danger',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReactivate = async () => {
    if (!submission) return
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', submission.id)

      if (error) throw error

      showNotification({
        message: 'Submission restored successfully',
        variant: 'success',
      })
      onStatusChange()
      onHide()
    } catch (err) {
      console.error('Error restoring submission:', err)
      showNotification({
        message: 'Failed to restore submission',
        variant: 'danger',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showNotification({
      message: `${label} copied to clipboard`,
      variant: 'success',
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge bg="info">New</Badge>
      case 'read':
        return <Badge bg="secondary">Read</Badge>
      case 'archived':
        return <Badge bg="warning" text="dark">Archived</Badge>
      default:
        return <Badge bg="light" text="dark">{status}</Badge>
    }
  }

  if (!submission) return null

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <Icon icon="mingcute:mail-line" />
          Contact Submission
          {getStatusBadge(submission.status)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Submitted timestamp */}
        <div className="text-muted mb-4">
          <Icon icon="mingcute:time-line" className="me-1" />
          Submitted: {formatDate(submission.created_at)}
        </div>

        {/* Contact Info */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label text-muted small">Name</label>
            <div className="fs-6 fw-medium">{submission.name}</div>
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small d-flex align-items-center gap-2">
              Email
              <Button
                variant="link"
                size="sm"
                className="p-0 text-muted"
                onClick={() => copyToClipboard(submission.email, 'Email')}
                title="Copy email"
              >
                <Icon icon="mingcute:copy-line" />
              </Button>
            </label>
            <div className="fs-6">
              <a href={`mailto:${submission.email}`}>{submission.email}</a>
            </div>
          </div>
        </div>

        {/* Subject */}
        {submission.subject && (
          <div className="mb-3">
            <label className="form-label text-muted small">Subject</label>
            <div className="fs-6">{submission.subject}</div>
          </div>
        )}

        {/* Message */}
        <div className="mb-3">
          <label className="form-label text-muted small d-flex align-items-center gap-2">
            Message
            <Button
              variant="link"
              size="sm"
              className="p-0 text-muted"
              onClick={() => copyToClipboard(submission.message, 'Message')}
              title="Copy message"
            >
              <Icon icon="mingcute:copy-line" />
            </Button>
          </label>
          <div
            className="p-3 bg-light rounded"
            style={{ maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          >
            {submission.message}
          </div>
        </div>

        {/* Metadata */}
        <div className="border-top pt-3 mt-3">
          <div className="row text-muted small">
            {submission.ip_address && (
              <div className="col-md-6 mb-2">
                <Icon icon="mingcute:location-line" className="me-1" />
                IP: {submission.ip_address}
              </div>
            )}
            {submission.user_agent && (
              <div className="col-12 mb-2">
                <Icon icon="mingcute:computer-line" className="me-1" />
                User Agent: <span className="text-break">{submission.user_agent}</span>
              </div>
            )}
            {submission.replied_at && (
              <div className="col-md-6 mb-2">
                <Icon icon="mingcute:reply-line" className="me-1" />
                Replied: {formatDate(submission.replied_at)}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          {/* Admin-only Deactivate/Reactivate */}
          {isAdmin && (
            <>
              {submission.status !== 'archived' ? (
                <Button
                  variant="warning"
                  onClick={handleDeactivate}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Spinner animation="border" size="sm" className="me-1" />
                  ) : (
                    <Icon icon="mingcute:archive-line" className="me-1" />
                  )}
                  Archive
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleReactivate}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Spinner animation="border" size="sm" className="me-1" />
                  ) : (
                    <Icon icon="mingcute:refresh-2-line" className="me-1" />
                  )}
                  Restore
                </Button>
              )}
            </>
          )}
        </div>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
