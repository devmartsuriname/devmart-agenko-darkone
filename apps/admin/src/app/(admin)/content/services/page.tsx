/**
 * Services List Page
 * Phase A1: Admin CRUD Implementation
 * 
 * RBAC:
 * - Admin/Editor: Full access (list, create, edit, publish/unpublish)
 * - Admin only: Delete
 * - Viewer: Denied at route level
 */
import { useEffect, useState, useCallback } from 'react'
import { Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import { ServiceForm } from './components/ServiceForm'
import { ServiceDeleteModal } from './components/ServiceDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type Service = Tables<'services'>

const ServicesPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (fetchError) throw fetchError
      setServices(data || [])
    } catch (err) {
      console.error('Error loading services:', err)
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const handleCreate = () => {
    setEditingService(null)
    setShowForm(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleDelete = (service: Service) => {
    setDeletingService(service)
    setShowDeleteModal(true)
  }

  const handleTogglePublish = async (service: Service) => {
    if (!user) return
    
    try {
      setActionLoading(service.id)
      const newStatus = service.status === 'published' ? 'draft' : 'published'
      const updateData: Partial<Service> = {
        status: newStatus,
        updated_by: user.id,
      }
      
      // Set published_at when publishing
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString()
      }
      
      const { error: updateError } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', service.id)
      
      if (updateError) throw updateError
      
      showNotification({
        message: `Service ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
        variant: 'success',
      })
      await loadServices()
    } catch (err) {
      console.error('Error toggling publish status:', err)
      showNotification({
        message: 'Failed to update service status',
        variant: 'danger',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingService(null)
    loadServices()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setDeletingService(null)
    loadServices()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageTitle title="Services" />
      
      <ComponentContainerCard
        title="Services"
        description="Manage your service offerings"
        headerAction={
          <Button variant="primary" onClick={handleCreate}>
            <Icon icon="mingcute:add-line" className="me-1" />
            Add Service
          </Button>
        }
      >
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:folder-open-line" className="fs-1 text-muted mb-3" />
            <h5 className="text-muted">No services yet</h5>
            <p className="text-muted">Click "Add Service" to create your first service.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Sort Order</th>
                  <th>Updated</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {service.icon && (
                          <Icon icon={service.icon} className="me-2 fs-5 text-primary" />
                        )}
                        <div>
                          <div className="fw-medium">{service.title}</div>
                          <small className="text-muted">/{service.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg={service.status === 'published' ? 'success' : 'warning'}>
                        {service.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>
                      {service.is_featured ? (
                        <Icon icon="mingcute:star-fill" className="text-warning" />
                      ) : (
                        <Icon icon="mingcute:star-line" className="text-muted" />
                      )}
                    </td>
                    <td>{service.sort_order}</td>
                    <td>{formatDate(service.updated_at)}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-1">
                        <Button
                          variant="soft-primary"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          title="Edit"
                        >
                          <Icon icon="mingcute:edit-line" />
                        </Button>
                        <Button
                          variant={service.status === 'published' ? 'soft-warning' : 'soft-success'}
                          size="sm"
                          onClick={() => handleTogglePublish(service)}
                          disabled={actionLoading === service.id}
                          title={service.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {actionLoading === service.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <Icon
                              icon={
                                service.status === 'published'
                                  ? 'mingcute:eye-close-line'
                                  : 'mingcute:eye-line'
                              }
                            />
                          )}
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="soft-danger"
                            size="sm"
                            onClick={() => handleDelete(service)}
                            title="Delete"
                          >
                            <Icon icon="mingcute:delete-line" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ComponentContainerCard>

      {/* Create/Edit Form Modal */}
      <ServiceForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setEditingService(null)
        }}
        service={editingService}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {isAdmin && (
        <ServiceDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setDeletingService(null)
          }}
          service={deletingService}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default ServicesPage
