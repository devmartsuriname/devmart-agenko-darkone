/**
 * Pages CRUD Page
 * Full CRUD for static pages (About, Terms, Privacy, etc.)
 * 
 * RBAC:
 * - Admin: full access (create, edit, publish, delete)
 * - Editor: create, edit, publish (no delete)
 * - Viewer: denied at route level
 */
import { useState, useEffect, useCallback } from 'react'
import { Table, Button, Spinner, Badge } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { PageForm } from './components/PageForm'
import { PageDeleteModal } from './components/PageDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type Page = Tables<'pages'>

const ContentPagesPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form modal state
  const [showForm, setShowForm] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingPage, setDeletingPage] = useState<Page | null>(null)

  // Fetch pages
  const fetchPages = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (err) {
      console.error('Error fetching pages:', err)
      showNotification({ message: 'Failed to load pages', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  // Handle create
  const handleCreate = () => {
    setEditingPage(null)
    setShowForm(true)
  }

  // Handle edit
  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setShowForm(true)
  }

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingPage(null)
    fetchPages()
  }

  // Handle publish/unpublish
  const handleTogglePublish = async (page: Page) => {
    if (!user) return

    const newStatus = page.status === 'published' ? 'draft' : 'published'
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_by: user.id,
    }

    // Set published_at when publishing (if not already set)
    if (newStatus === 'published' && !page.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    try {
      const { error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', page.id)

      if (error) throw error

      showNotification({
        message: `Page ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
        variant: 'success',
      })
      fetchPages()
    } catch (err) {
      console.error('Error updating page status:', err)
      showNotification({ message: 'Failed to update page status', variant: 'danger' })
    }
  }

  // Handle delete click (Admin only)
  const handleDeleteClick = (page: Page) => {
    setDeletingPage(page)
    setShowDeleteModal(true)
  }

  // Handle delete success
  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setDeletingPage(null)
    fetchPages()
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
      <PageTitle subName="Content" title="Pages" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleCreate}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add Page
        </Button>
      </div>

      <ComponentContainerCard
        id="pages-list"
        title="Pages"
        description="Manage static pages for your website (About, Terms, Privacy, etc.)"
      >
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:file-line" className="fs-1 text-muted mb-3 d-block" />
            <h5 className="text-muted mb-2">No Pages Yet</h5>
            <p className="text-muted mb-3">Create your first static page to get started.</p>
            <Button variant="primary" onClick={handleCreate}>
              <Icon icon="mingcute:add-line" className="me-1" />
              Add Page
            </Button>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Sort Order</th>
                <th>Updated</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td>
                    <strong>{page.title}</strong>
                  </td>
                  <td>
                    <code className="small">/{page.slug}</code>
                  </td>
                  <td>
                    <Badge bg={page.status === 'published' ? 'success' : 'secondary'}>
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td>{page.sort_order}</td>
                  <td>{formatDate(page.updated_at)}</td>
                  <td className="text-end">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-1 me-1"
                      onClick={() => handleEdit(page)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" className="fs-5" />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className={`p-1 me-1 ${page.status === 'published' ? 'text-warning' : 'text-success'}`}
                      onClick={() => handleTogglePublish(page)}
                      title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      <Icon
                        icon={page.status === 'published' ? 'mingcute:eye-close-line' : 'mingcute:eye-line'}
                        className="fs-5"
                      />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-1 text-danger"
                        onClick={() => handleDeleteClick(page)}
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

      {/* Page Form Modal */}
      <PageForm
        show={showForm}
        onHide={() => setShowForm(false)}
        page={editingPage}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal (Admin only) */}
      {isAdmin && (
        <PageDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          page={deletingPage}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default ContentPagesPage
