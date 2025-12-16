/**
 * Testimonials CRUD Page
 * Admin module for managing client testimonials
 * 
 * RBAC: Admin + Editor can create/edit/toggle, Admin-only delete
 * Pattern: is_active boolean (NOT status/published_at)
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Badge, Spinner, Image } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import { TestimonialForm } from './components/TestimonialForm'
import { TestimonialDeleteModal } from './components/TestimonialDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type Testimonial = Tables<'testimonials'>

const TestimonialsPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestimonials(data || [])
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      showNotification({ message: 'Failed to load testimonials', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  // Handlers
  const handleAdd = () => {
    setSelectedTestimonial(null)
    setShowForm(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowForm(true)
  }

  const handleDelete = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowDeleteModal(true)
  }

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({
          is_active: !testimonial.is_active,
          updated_by: user?.id || null,
        })
        .eq('id', testimonial.id)

      if (error) throw error

      showNotification({
        message: `Testimonial ${testimonial.is_active ? 'deactivated' : 'activated'} successfully`,
        variant: 'success',
      })
      fetchTestimonials()
    } catch (err) {
      console.error('Error toggling testimonial status:', err)
      showNotification({ message: 'Failed to update testimonial status', variant: 'danger' })
    }
  }

  const handleToggleFeatured = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({
          is_featured: !testimonial.is_featured,
          updated_by: user?.id || null,
        })
        .eq('id', testimonial.id)

      if (error) throw error

      showNotification({
        message: `Testimonial ${testimonial.is_featured ? 'unfeatured' : 'featured'} successfully`,
        variant: 'success',
      })
      fetchTestimonials()
    } catch (err) {
      console.error('Error toggling testimonial featured status:', err)
      showNotification({ message: 'Failed to update testimonial', variant: 'danger' })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedTestimonial(null)
    fetchTestimonials()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedTestimonial(null)
    fetchTestimonials()
  }

  // Render rating stars
  const renderRating = (rating: number | null) => {
    if (!rating) return <span className="text-muted">—</span>
    return (
      <span className="text-warning">
        {Array.from({ length: 5 }, (_, i) => (
          <Icon
            key={i}
            icon={i < rating ? 'mingcute:star-fill' : 'mingcute:star-line'}
            className="me-1"
          />
        ))}
      </span>
    )
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
      <PageTitle title="Testimonials" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAdd}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add Testimonial
        </Button>
      </div>

      <ComponentContainerCard title="Testimonials">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:quote-left-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">No testimonials found.</p>
            <p className="text-muted">Click "Add Testimonial" to create one.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Client</th>
                <th style={{ width: '15%' }}>Company</th>
                <th style={{ width: '15%' }}>Rating</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%' }}>Featured</th>
                <th style={{ width: '5%' }}>Order</th>
                <th style={{ width: '10%' }}>Updated</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {testimonial.avatar_url ? (
                        <Image
                          src={testimonial.avatar_url}
                          alt={testimonial.client_name}
                          roundedCircle
                          width={40}
                          height={40}
                          className="me-2"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded-circle me-2 d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40 }}
                        >
                          <Icon icon="mingcute:user-3-line" className="text-white" />
                        </div>
                      )}
                      <div>
                        <div className="fw-medium">{testimonial.client_name}</div>
                        {testimonial.client_role && (
                          <small className="text-muted">{testimonial.client_role}</small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{testimonial.client_company || '—'}</td>
                  <td>{renderRating(testimonial.rating)}</td>
                  <td>
                    <Badge bg={testimonial.is_active ? 'success' : 'secondary'}>
                      {testimonial.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    {testimonial.is_featured ? (
                      <Icon icon="mingcute:star-fill" className="text-warning fs-5" />
                    ) : (
                      <Icon icon="mingcute:star-line" className="text-muted fs-5" />
                    )}
                  </td>
                  <td>{testimonial.sort_order}</td>
                  <td>
                    <small className="text-muted">{formatDate(testimonial.updated_at)}</small>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(testimonial)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" />
                    </Button>
                    <Button
                      variant={testimonial.is_active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleActive(testimonial)}
                      title={testimonial.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon icon={testimonial.is_active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} />
                    </Button>
                    <Button
                      variant={testimonial.is_featured ? 'outline-secondary' : 'outline-warning'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleFeatured(testimonial)}
                      title={testimonial.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <Icon icon={testimonial.is_featured ? 'mingcute:star-fill' : 'mingcute:star-line'} />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(testimonial)}
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
      <TestimonialForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setSelectedTestimonial(null)
        }}
        testimonial={selectedTestimonial}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal (Admin-only) */}
      {isAdmin && (
        <TestimonialDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setSelectedTestimonial(null)
          }}
          testimonial={selectedTestimonial}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default TestimonialsPage
