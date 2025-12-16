/**
 * Service Form Modal
 * Create/Edit service with Zod validation
 * 
 * Features:
 * - Title, slug (auto-generated, editable), descriptions
 * - Content as Markdown textarea
 * - Image upload to Supabase Storage
 * - Slug uniqueness pre-check
 */
import { useState, useEffect, useCallback } from 'react'
import { Modal, Form, Button, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { ServiceImageUpload } from './ServiceImageUpload'
import type { Tables } from '@/integrations/supabase/types'

type Service = Tables<'services'>

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  short_description: z.string().max(500, 'Description must be less than 500 characters').nullable(),
  content: z.string().nullable(),
  icon: z.string().nullable(),
  image_url: z.string().nullable(),
  meta_title: z.string().max(200).nullable(),
  meta_description: z.string().max(500).nullable(),
  is_featured: z.boolean(),
  sort_order: z.number().int().min(0),
  status: z.enum(['draft', 'published']),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  show: boolean
  onHide: () => void
  service: Service | null
  onSuccess: () => void
}

export const ServiceForm = ({ show, onHide, service, onSuccess }: ServiceFormProps) => {
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [saving, setSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)

  const isEditing = !!service

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      slug: '',
      short_description: null,
      content: null,
      icon: null,
      image_url: null,
      meta_title: null,
      meta_description: null,
      is_featured: false,
      sort_order: 0,
      status: 'draft',
    },
  })

  const watchTitle = watch('title')
  const watchSlug = watch('slug')

  // Reset form when modal opens/closes or service changes
  useEffect(() => {
    if (show) {
      if (service) {
        reset({
          title: service.title,
          slug: service.slug,
          short_description: service.short_description,
          content: service.content,
          icon: service.icon,
          image_url: service.image_url,
          meta_title: service.meta_title,
          meta_description: service.meta_description,
          is_featured: service.is_featured,
          sort_order: service.sort_order,
          status: service.status as 'draft' | 'published',
        })
      } else {
        reset({
          title: '',
          slug: '',
          short_description: null,
          content: null,
          icon: null,
          image_url: null,
          meta_title: null,
          meta_description: null,
          is_featured: false,
          sort_order: 0,
          status: 'draft',
        })
      }
      setSlugError(null)
    }
  }, [show, service, reset])

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
      
      const query = supabase
        .from('services')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      
      // Exclude current service when editing
      const { data, error } = isEditing && service
        ? await supabase
            .from('services')
            .select('id')
            .eq('slug', slug)
            .neq('id', service.id)
            .maybeSingle()
        : await query
      
      if (error) throw error
      
      if (data) {
        setSlugError('Slug already in use')
      }
    } catch (err) {
      console.error('Error checking slug:', err)
    } finally {
      setSlugChecking(false)
    }
  }, [isEditing, service])

  // Debounced slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchSlug && watchSlug.length > 0) {
        checkSlugUniqueness(watchSlug)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [watchSlug, checkSlugUniqueness])

  const onSubmit = async (data: ServiceFormData) => {
    if (!user) return
    if (slugError) {
      showNotification({ message: 'Please fix the slug before saving', variant: 'danger' })
      return
    }

    try {
      setSaving(true)

      if (isEditing && service) {
        // Update existing service
        const updateData = {
          ...data,
          updated_by: user.id,
          // Set published_at if publishing
          ...(data.status === 'published' && !service.published_at
            ? { published_at: new Date().toISOString() }
            : {}),
        }

        const { error } = await supabase
          .from('services')
          .update(updateData)
          .eq('id', service.id)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Service updated successfully', variant: 'success' })
      } else {
        // Create new service
        const insertData = {
          ...data,
          created_by: user.id,
          // Set published_at if creating as published
          ...(data.status === 'published' ? { published_at: new Date().toISOString() } : {}),
        }

        const { error } = await supabase.from('services').insert(insertData)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Service created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving service:', err)
      const message = err instanceof Error ? err.message : 'Failed to save service'
      showNotification({ message, variant: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Service' : 'Add Service'}</Modal.Title>
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
                      placeholder="Enter service title"
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
                        placeholder="service-url-slug"
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

                  {/* Short Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      {...register('short_description')}
                      isInvalid={!!errors.short_description}
                      placeholder="Brief description for cards and previews"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.short_description?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Content (Markdown) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      {...register('content')}
                      placeholder="Full service description (supports Markdown)"
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
                      label="Featured Service"
                      {...register('is_featured')}
                    />
                  </Form.Group>

                  {/* Sort Order */}
                  <Form.Group className="mb-3">
                    <Form.Label>Sort Order</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      {...register('sort_order', { valueAsNumber: true })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            {/* Media Tab */}
            <Tab eventKey="media" title="Media">
              <Row>
                <Col md={6}>
                  {/* Image Upload */}
                  <Form.Group className="mb-3">
                    <Form.Label>Service Image</Form.Label>
                    <Controller
                      name="image_url"
                      control={control}
                      render={({ field }) => (
                        <ServiceImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  {/* Icon */}
                  <Form.Group className="mb-3">
                    <Form.Label>Icon</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('icon')}
                      placeholder="mingcute:code-line"
                    />
                    <Form.Text className="text-muted">
                      Iconify icon name (e.g., mingcute:code-line)
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
              'Update Service'
            ) : (
              'Create Service'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
