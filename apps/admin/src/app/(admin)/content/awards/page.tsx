/**
 * Awards CRUD Page
 * Admin module for managing awards and recognition
 * 
 * RBAC: Admin + Editor can create/edit/toggle, Admin-only delete
 * Pattern: is_active + is_featured boolean (NOT status/published_at)
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Badge, Spinner, Image } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import { AwardForm } from './components/AwardForm'
import { AwardDeleteModal } from './components/AwardDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type Award = Tables<'awards'>

const AwardsPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAward, setSelectedAward] = useState<Award | null>(null)

  // Fetch awards
  const fetchAwards = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setAwards(data || [])
    } catch (err) {
      console.error('Error fetching awards:', err)
      showNotification({ message: 'Failed to load awards', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchAwards()
  }, [fetchAwards])

  // Handlers
  const handleAdd = () => {
    setSelectedAward(null)
    setShowForm(true)
  }

  const handleEdit = (award: Award) => {
    setSelectedAward(award)
    setShowForm(true)
  }

  const handleDelete = (award: Award) => {
    setSelectedAward(award)
    setShowDeleteModal(true)
  }

  const handleToggleActive = async (award: Award) => {
    try {
      const { error } = await supabase
        .from('awards')
        .update({
          is_active: !award.is_active,
          updated_by: user?.id || null,
        })
        .eq('id', award.id)

      if (error) throw error

      showNotification({
        message: `Award ${award.is_active ? 'deactivated' : 'activated'} successfully`,
        variant: 'success',
      })
      fetchAwards()
    } catch (err) {
      console.error('Error toggling award status:', err)
      showNotification({ message: 'Failed to update award status', variant: 'danger' })
    }
  }

  const handleToggleFeatured = async (award: Award) => {
    try {
      const { error } = await supabase
        .from('awards')
        .update({
          is_featured: !award.is_featured,
          updated_by: user?.id || null,
        })
        .eq('id', award.id)

      if (error) throw error

      showNotification({
        message: `Award ${award.is_featured ? 'unfeatured' : 'featured'} successfully`,
        variant: 'success',
      })
      fetchAwards()
    } catch (err) {
      console.error('Error toggling award featured status:', err)
      showNotification({ message: 'Failed to update award', variant: 'danger' })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedAward(null)
    fetchAwards()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedAward(null)
    fetchAwards()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageTitle title="Awards" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAdd}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add Award
        </Button>
      </div>

      <ComponentContainerCard title="Awards">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading awards...</p>
          </div>
        ) : awards.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:trophy-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">No awards found.</p>
            <p className="text-muted">Click "Add Award" to create one.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Award</th>
                <th style={{ width: '15%' }}>Issuer</th>
                <th style={{ width: '10%' }}>Year</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%' }}>Featured</th>
                <th style={{ width: '5%' }}>Order</th>
                <th style={{ width: '10%' }}>Updated</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award) => (
                <tr key={award.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {award.image_url ? (
                        <Image
                          src={award.image_url}
                          alt={award.title}
                          rounded
                          width={40}
                          height={40}
                          className="me-2"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded me-2 d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40 }}
                        >
                          <Icon icon="mingcute:trophy-line" className="text-white" />
                        </div>
                      )}
                      <div>
                        <div className="fw-medium">{award.title}</div>
                        {award.link_url && (
                          <small className="text-muted">
                            <Icon icon="mingcute:link-line" className="me-1" />
                            Has link
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{award.issuer || '—'}</td>
                  <td>{award.year || '—'}</td>
                  <td>
                    <Badge bg={award.is_active ? 'success' : 'secondary'}>
                      {award.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    {award.is_featured ? (
                      <Icon icon="mingcute:star-fill" className="text-warning fs-5" />
                    ) : (
                      <Icon icon="mingcute:star-line" className="text-muted fs-5" />
                    )}
                  </td>
                  <td>{award.sort_order}</td>
                  <td>
                    <small className="text-muted">{formatDate(award.updated_at)}</small>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(award)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" />
                    </Button>
                    <Button
                      variant={award.is_active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleActive(award)}
                      title={award.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon icon={award.is_active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} />
                    </Button>
                    <Button
                      variant={award.is_featured ? 'outline-secondary' : 'outline-warning'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleFeatured(award)}
                      title={award.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <Icon icon={award.is_featured ? 'mingcute:star-fill' : 'mingcute:star-line'} />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(award)}
                        title="Delete"
                      >
                        <Icon icon="mingcute:delete-2-line" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      {/* Form Modal */}
      <AwardForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setSelectedAward(null)
        }}
        award={selectedAward}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal (Admin-only) */}
      {isAdmin && (
        <AwardDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setSelectedAward(null)
          }}
          award={selectedAward}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default AwardsPage
