/**
 * Contact Submissions Page
 * Admin module for viewing contact form submissions (READ-ONLY).
 * 
 * Features:
 * - List view with status filters (All, New, Read, Archived)
 * - Search by name/email/subject
 * - View modal for full submission details
 * - Auto "Mark as Read" when opening a new submission
 * - Deactivate (archive) / Reactivate (restore) — Admin-only
 * 
 * RBAC:
 * - Admin + Editor: Can view list and open detail modal
 * - Admin-only: Can deactivate/reactivate
 * - Viewer: Blocked by route policy
 * 
 * NO Edit, NO Delete functionality.
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Badge, Spinner, Form, InputGroup } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import { ContactSubmissionViewModal } from './components/ContactSubmissionViewModal'
import type { Tables } from '@/integrations/supabase/types'

type ContactSubmission = Tables<'contact_submissions'>
type StatusFilter = 'all' | 'new' | 'read' | 'archived'

const ContactSubmissionsPage = () => {
  const { isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setSubmissions(data || [])
    } catch (err) {
      console.error('Error fetching submissions:', err)
      showNotification({ message: 'Failed to load submissions', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, showNotification])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  // Handlers
  const handleView = (submission: ContactSubmission) => {
    setSelectedSubmission(submission)
    setShowViewModal(true)
  }

  const handleStatusChange = () => {
    fetchSubmissions()
  }

  const handleDeactivate = async (submission: ContactSubmission) => {
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
      fetchSubmissions()
    } catch (err) {
      console.error('Error archiving submission:', err)
      showNotification({ message: 'Failed to archive submission', variant: 'danger' })
    }
  }

  const handleReactivate = async (submission: ContactSubmission) => {
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
      fetchSubmissions()
    } catch (err) {
      console.error('Error restoring submission:', err)
      showNotification({ message: 'Failed to restore submission', variant: 'danger' })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Truncate text
  const truncate = (text: string | null, maxLength: number) => {
    if (!text) return '—'
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  // Status badge
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

  // Filter submissions by search query (client-side)
  const filteredSubmissions = submissions.filter((s) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      (s.subject && s.subject.toLowerCase().includes(query))
    )
  })

  // Count badges for status filter
  const countByStatus = (status: string) =>
    submissions.filter((s) => s.status === status).length

  return (
    <>
      <PageTitle title="Contact Submissions" subName="CRM" />

      {/* Filters */}
      <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          style={{ width: 'auto' }}
        >
          <option value="all">All Statuses</option>
          <option value="new">New ({countByStatus('new')})</option>
          <option value="read">Read ({countByStatus('read')})</option>
          <option value="archived">Archived ({countByStatus('archived')})</option>
        </Form.Select>

        <InputGroup style={{ maxWidth: '300px' }}>
          <InputGroup.Text>
            <Icon icon="mingcute:search-line" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search name, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="outline-secondary"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <Icon icon="mingcute:close-line" />
            </Button>
          )}
        </InputGroup>

        <div className="ms-auto text-muted small">
          {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <ComponentContainerCard title="Submissions" id="contact-submissions-list">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:mail-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">
              {searchQuery
                ? 'No submissions match your search.'
                : statusFilter !== 'all'
                ? `No ${statusFilter} submissions.`
                : 'No contact submissions yet.'}
            </p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Name</th>
                <th style={{ width: '22%' }}>Email</th>
                <th style={{ width: '20%' }}>Subject</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '15%' }}>Submitted</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="fw-medium">{submission.name}</td>
                  <td>
                    <a href={`mailto:${submission.email}`} className="text-decoration-none">
                      {truncate(submission.email, 30)}
                    </a>
                  </td>
                  <td>{truncate(submission.subject, 30)}</td>
                  <td>{getStatusBadge(submission.status)}</td>
                  <td>
                    <small className="text-muted">{formatDate(submission.created_at)}</small>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleView(submission)}
                      title="View details"
                    >
                      <Icon icon="mingcute:eye-line" />
                    </Button>

                    {/* Admin-only: Deactivate/Reactivate */}
                    {isAdmin && (
                      <>
                        {submission.status !== 'archived' ? (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleDeactivate(submission)}
                            title="Archive"
                          >
                            <Icon icon="mingcute:archive-line" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleReactivate(submission)}
                            title="Restore"
                          >
                            <Icon icon="mingcute:refresh-2-line" />
                          </Button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      {/* View Modal */}
      <ContactSubmissionViewModal
        show={showViewModal}
        onHide={() => {
          setShowViewModal(false)
          setSelectedSubmission(null)
        }}
        submission={selectedSubmission}
        onStatusChange={handleStatusChange}
      />
    </>
  )
}

export default ContactSubmissionsPage
