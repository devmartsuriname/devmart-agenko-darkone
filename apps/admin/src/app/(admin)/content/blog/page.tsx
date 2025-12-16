/**
 * Blog Posts List Page
 * Admin CRUD for blog posts
 * 
 * RBAC:
 * - Admin: Full access (view, create, edit, publish, delete)
 * - Editor: Can view, create, edit, publish (no delete)
 * - Viewer: Denied at route level
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Spinner, Badge, Card, CardBody, ButtonGroup } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { BlogPostForm } from './components/BlogPostForm'
import { BlogPostDeleteModal } from './components/BlogPostDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type BlogPost = Tables<'blog_posts'>

const ContentBlogPage = () => {
  const { userRoles } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const isAdmin = userRoles.includes('admin')
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null)
  
  // Action loading states
  const [publishingId, setPublishingId] = useState<string | null>(null)

  const loadBlogPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      setBlogPosts(data || [])
    } catch (err) {
      console.error('Error loading blog posts:', err)
      setError('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBlogPosts()
  }, [loadBlogPosts])

  // Modal handlers
  const handleCreate = () => {
    setSelectedBlogPost(null)
    setShowForm(true)
  }

  const handleEdit = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost)
    setShowForm(true)
  }

  const handleDelete = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost)
    setShowDeleteModal(true)
  }

  const handleTogglePublish = async (blogPost: BlogPost) => {
    try {
      setPublishingId(blogPost.id)
      
      const newStatus = blogPost.status === 'published' ? 'draft' : 'published'
      const updateData: Partial<BlogPost> = {
        status: newStatus,
        ...(newStatus === 'published' && !blogPost.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      }
      
      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', blogPost.id)
      
      if (error) throw error
      
      showNotification({
        message: `Blog post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
        variant: 'success',
      })
      
      loadBlogPosts()
    } catch (err) {
      console.error('Error toggling publish status:', err)
      showNotification({
        message: 'Failed to update publish status',
        variant: 'danger',
      })
    } finally {
      setPublishingId(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedBlogPost(null)
    loadBlogPosts()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedBlogPost(null)
    loadBlogPosts()
  }

  // Format date helper
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
      <PageTitle subName="Content" title="Blog Posts" />
      
      <ComponentContainerCard
        id="blog-list"
        title="Blog Posts"
        description="Create, edit, and publish blog posts."
        titleEnd={
          <Button variant="primary" size="sm" onClick={handleCreate}>
            <Icon icon="mingcute:add-line" className="me-1" />
            Add Blog Post
          </Button>
        }
      >
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:alert-line" className="fs-1 text-danger mb-3 d-block" />
            <p className="text-danger mb-2">{error}</p>
            <Button variant="outline-primary" size="sm" onClick={loadBlogPosts}>
              Try Again
            </Button>
          </div>
        ) : blogPosts.length === 0 ? (
          <Card className="border-0 bg-light">
            <CardBody className="text-center py-5">
              <Icon icon="mingcute:edit-line" className="fs-1 text-muted mb-3 d-block" />
              <h5 className="text-muted mb-2">No Blog Posts Yet</h5>
              <p className="text-muted mb-3">
                Create your first blog post to get started.
              </p>
              <Button variant="primary" onClick={handleCreate}>
                <Icon icon="mingcute:add-line" className="me-1" />
                Add Blog Post
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Updated</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((blogPost) => (
                  <tr key={blogPost.id}>
                    <td>
                      <strong>{blogPost.title}</strong>
                      <br />
                      <small className="text-muted">/{blogPost.slug}</small>
                    </td>
                    <td>
                      {blogPost.category ? (
                        <Badge bg="light" text="dark">
                          {blogPost.category}
                        </Badge>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={blogPost.status === 'published' ? 'success' : 'secondary'}>
                        {blogPost.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>
                      {blogPost.is_featured ? (
                        <Icon icon="mingcute:star-fill" className="text-warning" />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <small>{formatDate(blogPost.updated_at)}</small>
                    </td>
                    <td className="text-end">
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEdit(blogPost)}
                          title="Edit"
                        >
                          <Icon icon="mingcute:edit-line" />
                        </Button>
                        <Button
                          variant={blogPost.status === 'published' ? 'outline-warning' : 'outline-success'}
                          onClick={() => handleTogglePublish(blogPost)}
                          disabled={publishingId === blogPost.id}
                          title={blogPost.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {publishingId === blogPost.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <Icon icon={blogPost.status === 'published' ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} />
                          )}
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="outline-danger"
                            onClick={() => handleDelete(blogPost)}
                            title="Delete"
                          >
                            <Icon icon="mingcute:delete-2-line" />
                          </Button>
                        )}
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ComponentContainerCard>

      {/* Form Modal */}
      <BlogPostForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setSelectedBlogPost(null)
        }}
        blogPost={selectedBlogPost}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal (Admin only) */}
      {isAdmin && (
        <BlogPostDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setSelectedBlogPost(null)
          }}
          blogPost={selectedBlogPost}
          onSuccess={handleDeleteSuccess}
        />
      )}

      <Footer />
    </>
  )
}

export default ContentBlogPage
