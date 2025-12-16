/**
 * Team Members CRUD Page
 * Full CRUD for team members
 * 
 * RBAC:
 * - Admin: full access (create, edit, toggle active, delete)
 * - Editor: create, edit, toggle active (no delete)
 * - Viewer: denied at route level
 * 
 * Key Differences from Other Modules:
 * - Uses `is_active` boolean instead of `status`/`published_at`
 * - Status column shows "Active" / "Inactive"
 */
import { useState, useEffect, useCallback } from 'react'
import { Table, Button, Spinner, Badge } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { TeamMemberForm } from './components/TeamMemberForm'
import { TeamMemberDeleteModal } from './components/TeamMemberDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type TeamMember = Tables<'team_members'>

const ContentTeamPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form modal state
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null)

  // Fetch team members
  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (err) {
      console.error('Error fetching team members:', err)
      showNotification({ message: 'Failed to load team members', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  // Handle create
  const handleCreate = () => {
    setEditingMember(null)
    setShowForm(true)
  }

  // Handle edit
  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setShowForm(true)
  }

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingMember(null)
    fetchTeamMembers()
  }

  // Handle toggle active/inactive (uses is_active boolean ONLY)
  const handleToggleActive = async (member: TeamMember) => {
    if (!user) return

    const newIsActive = !member.is_active

    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          is_active: newIsActive,
          updated_by: user.id,
        })
        .eq('id', member.id)

      if (error) throw error

      showNotification({
        message: `Team member ${newIsActive ? 'activated' : 'deactivated'} successfully`,
        variant: 'success',
      })
      fetchTeamMembers()
    } catch (err) {
      console.error('Error updating team member status:', err)
      showNotification({ message: 'Failed to update team member status', variant: 'danger' })
    }
  }

  // Handle delete click (Admin only)
  const handleDeleteClick = (member: TeamMember) => {
    setDeletingMember(member)
    setShowDeleteModal(true)
  }

  // Handle delete success
  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setDeletingMember(null)
    fetchTeamMembers()
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageTitle subName="Content" title="Team" />

      {/* Add button placed above the card for reliability */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleCreate}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add Team Member
        </Button>
      </div>

      <ComponentContainerCard
        id="team-members-list"
        title="Team Members"
        description="Manage your team members displayed on the website"
      >
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:group-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Team Members Yet</h5>
            <p className="text-muted mb-3">Add your first team member to get started.</p>
            <Button variant="primary" onClick={handleCreate}>
              <Icon icon="mingcute:add-line" className="me-1" />
              Add Team Member
            </Button>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Sort Order</th>
                <th>Updated</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {member.avatar_url && (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="rounded-circle me-2"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                      )}
                      <strong>{member.name}</strong>
                    </div>
                  </td>
                  <td>{member.role}</td>
                  <td>
                    <Badge bg={member.is_active ? 'success' : 'secondary'}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    {member.is_featured && (
                      <Icon icon="mingcute:star-fill" className="text-warning" />
                    )}
                  </td>
                  <td>{member.sort_order}</td>
                  <td>{formatDate(member.updated_at)}</td>
                  <td className="text-end">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-1 me-1"
                      onClick={() => handleEdit(member)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" className="fs-5" />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className={`p-1 me-1 ${member.is_active ? 'text-warning' : 'text-success'}`}
                      onClick={() => handleToggleActive(member)}
                      title={member.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon
                        icon={member.is_active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'}
                        className="fs-5"
                      />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-1 text-danger"
                        onClick={() => handleDeleteClick(member)}
                        title="Delete"
                      >
                        <Icon icon="mingcute:delete-2-line" className="fs-5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      {/* Team Member Form Modal */}
      <TeamMemberForm
        show={showForm}
        onHide={() => setShowForm(false)}
        teamMember={editingMember}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal (Admin only) */}
      {isAdmin && (
        <TeamMemberDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          teamMember={deletingMember}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default ContentTeamPage
