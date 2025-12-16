/**
 * Blog Post Delete Confirmation Modal
 * Admin-only delete functionality
 */
import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import type { Tables } from '@/integrations/supabase/types'

type BlogPost = Tables<'blog_posts'>

interface BlogPostDeleteModalProps {
  show: boolean
  onHide: () => void
  blogPost: BlogPost | null
  onSuccess: () => void
}

export const BlogPostDeleteModal = ({ show, onHide, blogPost, onSuccess }: BlogPostDeleteModalProps) => {
  const { showNotification } = useNotificationContext()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!blogPost) return

    try {
      setDeleting(true)

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', blogPost.id)

      if (error) throw error

      showNotification({
        message: 'Blog post deleted successfully',
        variant: 'success',
      })
      onSuccess()
    } catch (err) {
      console.error('Error deleting blog post:', err)
      showNotification({
        message: 'Failed to delete blog post',
        variant: 'danger',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <Icon icon="mingcute:alert-line" className="me-2" />
          Delete Blog Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this blog post?</p>
        {blogPost && (
          <div className="p-3 bg-light rounded">
            <strong>{blogPost.title}</strong>
            <br />
            <small className="text-muted">/{blogPost.slug}</small>
            {blogPost.category && (
              <>
                <br />
                <small className="text-muted">Category: {blogPost.category}</small>
              </>
            )}
          </div>
        )}
        <p className="text-danger mt-3 mb-0">
          <small>This action cannot be undone.</small>
        </p>
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
            'Delete Blog Post'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
