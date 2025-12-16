/**
 * Blog Post Form Modal
 * Create/Edit blog post with Zod validation
 * 
 * Features:
 * - Title, slug (auto-generated, editable), excerpt, content
 * - Content as Markdown textarea
 * - Featured image upload
 * - Tags array input
 * - Slug uniqueness pre-check
 * - Auto-set author_id to current user on create
 */
import { useState, useEffect, useCallback } from 'react'
import { Modal, Form, Button, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { BlogPostImageUpload } from './BlogPostImageUpload'
import { TagsInput } from './TagsInput'
import type { Tables } from '@/integrations/supabase/types'

type BlogPost = Tables<'blog_posts'>

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').nullable(),
  content: z.string().nullable(),
  featured_image_url: z.string().nullable(),
  category: z.string().max(100).nullable(),
  tags: z.array(z.string()).nullable(),
  meta_title: z.string().max(200).nullable(),
  meta_description: z.string().max(500).nullable(),
  is_featured: z.boolean(),
  status: z.enum(['draft', 'published']),
})

type BlogPostFormData = z.infer<typeof blogPostSchema>

interface BlogPostFormProps {
  show: boolean
  onHide: () => void
  blogPost: BlogPost | null
  onSuccess: () => void
}

export const BlogPostForm = ({ show, onHide, blogPost, onSuccess }: BlogPostFormProps) => {
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [saving, setSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)

  const isEditing = !!blogPost

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: null,
      content: null,
      featured_image_url: null,
      category: null,
      tags: null,
      meta_title: null,
      meta_description: null,
      is_featured: false,
      status: 'draft',
    },
  })

  const watchTitle = watch('title')
  const watchSlug = watch('slug')

  // Reset form when modal opens/closes or blogPost changes
  useEffect(() => {
    if (show) {
      if (blogPost) {
        reset({
          title: blogPost.title,
          slug: blogPost.slug,
          excerpt: blogPost.excerpt,
          content: blogPost.content,
          featured_image_url: blogPost.featured_image_url,
          category: blogPost.category,
          tags: blogPost.tags,
          meta_title: blogPost.meta_title,
          meta_description: blogPost.meta_description,
          is_featured: blogPost.is_featured,
          status: blogPost.status as 'draft' | 'published',
        })
      } else {
        reset({
          title: '',
          slug: '',
          excerpt: null,
          content: null,
          featured_image_url: null,
          category: null,
          tags: null,
          meta_title: null,
          meta_description: null,
          is_featured: false,
          status: 'draft',
        })
      }
      setSlugError(null)
    }
  }, [show, blogPost, reset])

  // Auto-generate slug from title (only when creating new)
  useEffect(() => {
    if (!isEditing && watchTitle) {
      const autoSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 200)
      setValue('slug', autoSlug)
    }
  }, [watchTitle, isEditing, setValue])

  // Check slug uniqueness
  const checkSlugUniqueness = useCallback(async (slug: string) => {
    if (!slug) return
    
    try {
      setSlugChecking(true)
      setSlugError(null)
      
      // Exclude current blogPost when editing
      const { data, error } = isEditing && blogPost
        ? await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', slug)
            .neq('id', blogPost.id)
            .maybeSingle()
        : await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()
      
      if (error) throw error
      
      if (data) {
        setSlugError('Slug already in use')
      }
    } catch (err) {
      console.error('Error checking slug:', err)
    } finally {
      setSlugChecking(false)
    }
  }, [isEditing, blogPost])

  // Debounced slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchSlug && watchSlug.length > 0) {
        checkSlugUniqueness(watchSlug)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [watchSlug, checkSlugUniqueness])

  const onSubmit = async (data: BlogPostFormData) => {
    if (!user) return
    if (slugError) {
      showNotification({ message: 'Please fix the slug before saving', variant: 'danger' })
      return
    }

    try {
      setSaving(true)

      if (isEditing && blogPost) {
        // Update existing blog post
        const updateData = {
          ...data,
          updated_by: user.id,
          // Set published_at if publishing
          ...(data.status === 'published' && !blogPost.published_at
            ? { published_at: new Date().toISOString() }
            : {}),
        }

        const { error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', blogPost.id)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Blog post updated successfully', variant: 'success' })
      } else {
        // Create new blog post
        const insertData = {
          ...data,
          created_by: user.id,
          author_id: null, // Can be linked to team_members later if needed
          // Set published_at if creating as published
          ...(data.status === 'published' ? { published_at: new Date().toISOString() } : {}),
        }

        const { error } = await supabase.from('blog_posts').insert(insertData)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Blog post created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving blog post:', err)
      const message = err instanceof Error ? err.message : 'Failed to save blog post'
      showNotification({ message, variant: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Blog Post' : 'Add Blog Post'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Tabs defaultActiveKey="basic" className="mb-3">
            {/* Basic Info Tab */}
            <Tab eventKey="basic" title="Basic Info">
              <Row>
                <Col md={8}>
                  {/* Title */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('title')}
                      isInvalid={!!errors.title}
                      placeholder="Enter blog post title"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Slug */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Slug <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        {...register('slug')}
                        isInvalid={!!errors.slug || !!slugError}
                        placeholder="blog-post-url-slug"
                      />
                      {slugChecking && (
                        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                          <Spinner animation="border" size="sm" />
                        </div>
                      )}
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.slug?.message || slugError}
                    </Form.Control.Feedback>
                    {slugError && !errors.slug && (
                      <Form.Text className="text-danger">{slugError}</Form.Text>
                    )}
                    <Form.Text className="text-muted">
                      URL-friendly identifier (auto-generated from title)
                    </Form.Text>
                  </Form.Group>

                  {/* Excerpt */}
                  <Form.Group className="mb-3">
                    <Form.Label>Excerpt</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      {...register('excerpt')}
                      isInvalid={!!errors.excerpt}
                      placeholder="Brief summary for cards and previews"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.excerpt?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Content (Markdown) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      {...register('content')}
                      placeholder="Full blog post content (supports Markdown)"
                    />
                    <Form.Text className="text-muted">
                      Supports Markdown formatting
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  {/* Status */}
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select {...register('status')}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Featured */}
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="is_featured"
                      label="Featured Post"
                      {...register('is_featured')}
                    />
                  </Form.Group>

                  {/* Category */}
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('category')}
                      placeholder="e.g., Technology, Design"
                    />
                  </Form.Group>

                  {/* Tags */}
                  <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Controller
                      name="tags"
                      control={control}
                      render={({ field }) => (
                        <TagsInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            {/* Media Tab */}
            <Tab eventKey="media" title="Media">
              <Row>
                <Col md={6}>
                  {/* Featured Image */}
                  <Form.Group className="mb-3">
                    <Form.Label>Featured Image</Form.Label>
                    <Controller
                      name="featured_image_url"
                      control={control}
                      render={({ field }) => (
                        <BlogPostImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Featured Image"
                        />
                      )}
                    />
                    <Form.Text className="text-muted">
                      Recommended: 1200x600 (2:1)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            {/* Details Tab */}
            <Tab eventKey="details" title="Details">
              {/* SEO Settings */}
              <h6 className="mb-3">SEO Settings</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('meta_title')}
                      placeholder="SEO page title"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      {...register('meta_description')}
                      placeholder="SEO page description"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving || !!slugError}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : isEditing ? (
              'Update Blog Post'
            ) : (
              'Create Blog Post'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
