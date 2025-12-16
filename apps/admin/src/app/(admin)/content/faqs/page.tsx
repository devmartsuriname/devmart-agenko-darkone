/**
 * FAQs CRUD Page
 * Admin module for managing FAQs
 * 
 * RBAC: Admin + Editor can create/edit/toggle, Admin-only delete
 * Pattern: is_active + is_featured boolean (NOT status/published_at)
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Badge, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import { FaqForm } from './components/FaqForm'
import { FaqDeleteModal } from './components/FaqDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type Faq = Tables<'faqs'>

const FaqsPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null)

  // Fetch FAQs
  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setFaqs(data || [])
    } catch (err) {
      console.error('Error fetching FAQs:', err)
      showNotification({ message: 'Failed to load FAQs', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  // Handlers
  const handleAdd = () => {
    setSelectedFaq(null)
    setShowForm(true)
  }

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq)
    setShowForm(true)
  }

  const handleDelete = (faq: Faq) => {
    setSelectedFaq(faq)
    setShowDeleteModal(true)
  }

  const handleToggleActive = async (faq: Faq) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({
          is_active: !faq.is_active,
          updated_by: user?.id || null,
        })
        .eq('id', faq.id)

      if (error) throw error

      showNotification({
        message: `FAQ ${faq.is_active ? 'deactivated' : 'activated'} successfully`,
        variant: 'success',
      })
      fetchFaqs()
    } catch (err) {
      console.error('Error toggling FAQ status:', err)
      showNotification({ message: 'Failed to update FAQ status', variant: 'danger' })
    }
  }

  const handleToggleFeatured = async (faq: Faq) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({
          is_featured: !faq.is_featured,
          updated_by: user?.id || null,
        })
        .eq('id', faq.id)

      if (error) throw error

      showNotification({
        message: `FAQ ${faq.is_featured ? 'unfeatured' : 'featured'} successfully`,
        variant: 'success',
      })
      fetchFaqs()
    } catch (err) {
      console.error('Error toggling FAQ featured status:', err)
      showNotification({ message: 'Failed to update FAQ', variant: 'danger' })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedFaq(null)
    fetchFaqs()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedFaq(null)
    fetchFaqs()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Truncate text
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <>
      <PageTitle title="FAQs" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAdd}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add FAQ
        </Button>
      </div>

      <ComponentContainerCard title="FAQs" id="faqs-list">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:question-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">No FAQs found.</p>
            <p className="text-muted">Click "Add FAQ" to create one.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Question</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%' }}>Featured</th>
                <th style={{ width: '5%' }}>Order</th>
                <th style={{ width: '10%' }}>Updated</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td>
                    <div className="fw-medium">{truncate(faq.question, 60)}</div>
                  </td>
                  <td>{faq.category || '—'}</td>
                  <td>
                    <Badge bg={faq.is_active ? 'success' : 'secondary'}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    {faq.is_featured ? (
                      <Icon icon="mingcute:star-fill" className="text-warning fs-5" />
                    ) : (
                      <Icon icon="mingcute:star-line" className="text-muted fs-5" />
                    )}
                  </td>
                  <td>{faq.sort_order}</td>
                  <td>
                    <small className="text-muted">{formatDate(faq.updated_at)}</small>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(faq)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" />
                    </Button>
                    <Button
                      variant={faq.is_active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleActive(faq)}
                      title={faq.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon icon={faq.is_active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} />
                    </Button>
                    <Button
                      variant={faq.is_featured ? 'outline-secondary' : 'outline-warning'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleFeatured(faq)}
                      title={faq.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <Icon icon={faq.is_featured ? 'mingcute:star-fill' : 'mingcute:star-line'} />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(faq)}
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
      <FaqForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setSelectedFaq(null)
        }}
        faq={selectedFaq}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal (Admin-only) */}
      {isAdmin && (
        <FaqDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setSelectedFaq(null)
          }}
          faq={selectedFaq}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default FaqsPage
