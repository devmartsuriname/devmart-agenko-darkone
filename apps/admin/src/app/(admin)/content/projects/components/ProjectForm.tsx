/**
 * Project Form Modal
 * Create/Edit project with Zod validation
 * 
 * Features:
 * - Title, slug (auto-generated, editable), descriptions
 * - Content as Markdown textarea
 * - Thumbnail and Featured image upload
 * - Gallery multi-image upload
 * - Technologies tag input
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
import { ProjectImageUpload } from './ProjectImageUpload'
import { ProjectGalleryUpload } from './ProjectGalleryUpload'
import { TechnologiesInput } from './TechnologiesInput'
import type { Tables } from '@/integrations/supabase/types'

type Project = Tables<'projects'>

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  short_description: z.string().max(500, 'Description must be less than 500 characters').nullable(),
  content: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  featured_image_url: z.string().nullable(),
  gallery_urls: z.array(z.string()).nullable(),
  client_name: z.string().max(200).nullable(),
  project_url: z.string().url('Invalid URL format').nullable().or(z.literal('')).transform(v => v === '' ? null : v),
  technologies: z.array(z.string()).nullable(),
  category: z.string().max(100).nullable(),
  meta_title: z.string().max(200).nullable(),
  meta_description: z.string().max(500).nullable(),
  is_featured: z.boolean(),
  sort_order: z.number().int().min(0),
  status: z.enum(['draft', 'published']),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  show: boolean
  onHide: () => void
  project: Project | null
  onSuccess: () => void
}

export const ProjectForm = ({ show, onHide, project, onSuccess }: ProjectFormProps) => {
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [saving, setSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)

  const isEditing = !!project

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      short_description: null,
      content: null,
      thumbnail_url: null,
      featured_image_url: null,
      gallery_urls: null,
      client_name: null,
      project_url: null,
      technologies: null,
      category: null,
      meta_title: null,
      meta_description: null,
      is_featured: false,
      sort_order: 0,
      status: 'draft',
    },
  })

  const watchTitle = watch('title')
  const watchSlug = watch('slug')

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (show) {
      if (project) {
        reset({
          title: project.title,
          slug: project.slug,
          short_description: project.short_description,
          content: project.content,
          thumbnail_url: project.thumbnail_url,
          featured_image_url: project.featured_image_url,
          gallery_urls: project.gallery_urls,
          client_name: project.client_name,
          project_url: project.project_url,
          technologies: project.technologies,
          category: project.category,
          meta_title: project.meta_title,
          meta_description: project.meta_description,
          is_featured: project.is_featured,
          sort_order: project.sort_order,
          status: project.status as 'draft' | 'published',
        })
      } else {
        reset({
          title: '',
          slug: '',
          short_description: null,
          content: null,
          thumbnail_url: null,
          featured_image_url: null,
          gallery_urls: null,
          client_name: null,
          project_url: null,
          technologies: null,
          category: null,
          meta_title: null,
          meta_description: null,
          is_featured: false,
          sort_order: 0,
          status: 'draft',
        })
      }
      setSlugError(null)
    }
  }, [show, project, reset])

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
      
      // Exclude current project when editing
      const { data, error } = isEditing && project
        ? await supabase
            .from('projects')
            .select('id')
            .eq('slug', slug)
            .neq('id', project.id)
            .maybeSingle()
        : await supabase
            .from('projects')
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
  }, [isEditing, project])

  // Debounced slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchSlug && watchSlug.length > 0) {
        checkSlugUniqueness(watchSlug)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [watchSlug, checkSlugUniqueness])

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) return
    if (slugError) {
      showNotification({ message: 'Please fix the slug before saving', variant: 'danger' })
      return
    }

    try {
      setSaving(true)

      if (isEditing && project) {
        // Update existing project
        const updateData = {
          ...data,
          updated_by: user.id,
          // Set published_at if publishing
          ...(data.status === 'published' && !project.published_at
            ? { published_at: new Date().toISOString() }
            : {}),
        }

        const { error } = await supabase
          .from('projects')
          .update(updateData)
          .eq('id', project.id)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Project updated successfully', variant: 'success' })
      } else {
        // Create new project
        const insertData = {
          ...data,
          created_by: user.id,
          // Set published_at if creating as published
          ...(data.status === 'published' ? { published_at: new Date().toISOString() } : {}),
        }

        const { error } = await supabase.from('projects').insert(insertData)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Project created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving project:', err)
      const message = err instanceof Error ? err.message : 'Failed to save project'
      showNotification({ message, variant: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Project' : 'Add Project'}</Modal.Title>
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
                      placeholder="Enter project title"
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
                        placeholder="project-url-slug"
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
                      placeholder="Full project description (supports Markdown)"
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
                      label="Featured Project"
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

                  {/* Category */}
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('category')}
                      placeholder="e.g., Web Design, Mobile App"
                    />
                  </Form.Group>

                  {/* Client Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>Client Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('client_name')}
                      placeholder="Client or company name"
                    />
                  </Form.Group>

                  {/* Project URL */}
                  <Form.Group className="mb-3">
                    <Form.Label>Project URL</Form.Label>
                    <Form.Control
                      type="url"
                      {...register('project_url')}
                      isInvalid={!!errors.project_url}
                      placeholder="https://example.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.project_url?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            {/* Media Tab */}
            <Tab eventKey="media" title="Media">
              <Row>
                <Col md={6}>
                  {/* Thumbnail */}
                  <Form.Group className="mb-3">
                    <Form.Label>Thumbnail Image</Form.Label>
                    <Controller
                      name="thumbnail_url"
                      control={control}
                      render={({ field }) => (
                        <ProjectImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Thumbnail"
                        />
                      )}
                    />
                    <Form.Text className="text-muted">
                      Recommended: 800x600 (4:3)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  {/* Featured Image */}
                  <Form.Group className="mb-3">
                    <Form.Label>Featured Image</Form.Label>
                    <Controller
                      name="featured_image_url"
                      control={control}
                      render={({ field }) => (
                        <ProjectImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Featured Image"
                        />
                      )}
                    />
                    <Form.Text className="text-muted">
                      Recommended: 1920x1080 (16:9)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {/* Gallery */}
              <Form.Group className="mb-3">
                <Form.Label>Gallery Images</Form.Label>
                <Controller
                  name="gallery_urls"
                  control={control}
                  render={({ field }) => (
                    <ProjectGalleryUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxImages={10}
                    />
                  )}
                />
              </Form.Group>
            </Tab>

            {/* Details Tab */}
            <Tab eventKey="details" title="Details">
              {/* Technologies */}
              <Form.Group className="mb-3">
                <Form.Label>Technologies</Form.Label>
                <Controller
                  name="technologies"
                  control={control}
                  render={({ field }) => (
                    <TechnologiesInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Form.Group>

              {/* SEO Section */}
              <hr className="my-4" />
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
              'Update Project'
            ) : (
              'Create Project'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
