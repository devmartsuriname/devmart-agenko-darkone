/**
 * Page Form Modal
 * Create/Edit page with Zod validation
 * 
 * Features:
 * - Title, slug (auto-generated, editable), content
 * - Content as Markdown textarea
 * - Featured image upload
 * - Slug uniqueness pre-check
 * - Sort order field
 * - SEO fields (meta_title, meta_description)
 */
import { useState, useEffect, useCallback } from 'react'
import { Modal, Form, Button, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { PageImageUpload } from './PageImageUpload'
import type { Tables } from '@/integrations/supabase/types'

type Page = Tables<'pages'>

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  content: z.string().nullable(),
  featured_image_url: z.string().nullable(),
  meta_title: z.string().max(200).nullable(),
  meta_description: z.string().max(500).nullable(),
  status: z.enum(['draft', 'published']),
  sort_order: z.number().int().min(0, 'Sort order must be 0 or greater'),
})

type PageFormData = z.infer<typeof pageSchema>

interface PageFormProps {
  show: boolean
  onHide: () => void
  page: Page | null
  onSuccess: () => void
}

export const PageForm = ({ show, onHide, page, onSuccess }: PageFormProps) => {
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [saving, setSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)

  const isEditing = !!page

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: null,
      featured_image_url: null,
      meta_title: null,
      meta_description: null,
      status: 'draft',
      sort_order: 0,
    },
  })

  const watchTitle = watch('title')
  const watchSlug = watch('slug')

  // Reset form when modal opens/closes or page changes
  useEffect(() => {
    if (show) {
      if (page) {
        reset({
          title: page.title,
          slug: page.slug,
          content: page.content,
          featured_image_url: page.featured_image_url,
          meta_title: page.meta_title,
          meta_description: page.meta_description,
          status: page.status as 'draft' | 'published',
          sort_order: page.sort_order,
        })
      } else {
        reset({
          title: '',
          slug: '',
          content: null,
          featured_image_url: null,
          meta_title: null,
          meta_description: null,
          status: 'draft',
          sort_order: 0,
        })
      }
      setSlugError(null)
    }
  }, [show, page, reset])

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
      
      // Exclude current page when editing
      const { data, error } = isEditing && page
        ? await supabase
            .from('pages')
            .select('id')
            .eq('slug', slug)
            .neq('id', page.id)
            .maybeSingle()
        : await supabase
            .from('pages')
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
  }, [isEditing, page])

  // Debounced slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchSlug && watchSlug.length > 0) {
        checkSlugUniqueness(watchSlug)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [watchSlug, checkSlugUniqueness])

  const onSubmit = async (data: PageFormData) => {
    if (!user) return
    if (slugError) {
      showNotification({ message: 'Please fix the slug before saving', variant: 'danger' })
      return
    }

    try {
      setSaving(true)

      if (isEditing && page) {
        // Update existing page
        const updateData = {
          ...data,
          updated_by: user.id,
          // Set published_at if publishing
          ...(data.status === 'published' && !page.published_at
            ? { published_at: new Date().toISOString() }
            : {}),
        }

        const { error } = await supabase
          .from('pages')
          .update(updateData)
          .eq('id', page.id)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Page updated successfully', variant: 'success' })
      } else {
        // Create new page
        const insertData = {
          ...data,
          created_by: user.id,
          // Set published_at if creating as published
          ...(data.status === 'published' ? { published_at: new Date().toISOString() } : {}),
        }

        const { error } = await supabase.from('pages').insert(insertData)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Page created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving page:', err)
      const message = err instanceof Error ? err.message : 'Failed to save page'
      showNotification({ message, variant: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Page' : 'Add Page'}</Modal.Title>
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
                      placeholder="Enter page title"
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
                        placeholder="page-url-slug"
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

                  {/* Content (Markdown) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      {...register('content')}
                      placeholder="Full page content (supports Markdown)"
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

                  {/* Sort Order */}
                  <Form.Group className="mb-3">
                    <Form.Label>Sort Order</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      {...register('sort_order', { valueAsNumber: true })}
                      isInvalid={!!errors.sort_order}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sort_order?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Lower numbers appear first
                    </Form.Text>
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
                        <PageImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Featured Image"
                        />
                      )}
                    />
                    <Form.Text className="text-muted">
                      Optional: Hero or header image for the page
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
              'Update Page'
            ) : (
              'Create Page'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
