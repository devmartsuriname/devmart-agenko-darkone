/**
 * Team Member Form Modal
 * Create/Edit team member with Zod validation
 * 
 * Features:
 * - Name, slug (auto-generated, editable), role (job title)
 * - Bio as textarea
 * - Avatar image upload
 * - Social links (LinkedIn, GitHub, Twitter)
 * - Contact info (email, phone)
 * - is_active toggle, is_featured checkbox
 * - Slug uniqueness pre-check (excludes current record when editing)
 * - URL field normalization (trim, empty → null)
 */
import { useState, useEffect, useCallback } from 'react'
import { Modal, Form, Button, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { TeamMemberImageUpload } from './TeamMemberImageUpload'
import type { Tables } from '@/integrations/supabase/types'

type TeamMember = Tables<'team_members'>

// Helper to normalize optional URL fields: trim and convert empty/whitespace to null
const normalizeOptionalUrl = (val: string | null | undefined): string | null => {
  if (!val) return null
  const trimmed = val.trim()
  return trimmed === '' ? null : trimmed
}

// Helper to normalize optional string fields
const normalizeOptionalString = (val: string | null | undefined): string | null => {
  if (!val) return null
  const trimmed = val.trim()
  return trimmed === '' ? null : trimmed
}

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  role: z.string().min(1, 'Role is required').max(200, 'Role must be less than 200 characters'),
  bio: z.string().nullable(),
  avatar_url: z.string().nullable(),
  email: z.string().email('Invalid email format').nullable().or(z.literal('')),
  phone: z.string().nullable(),
  social_linkedin: z.string().url('Invalid LinkedIn URL').nullable().or(z.literal('')),
  social_github: z.string().url('Invalid GitHub URL').nullable().or(z.literal('')),
  social_twitter: z.string().url('Invalid Twitter URL').nullable().or(z.literal('')),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.number().int().min(0, 'Sort order must be 0 or greater'),
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

interface TeamMemberFormProps {
  show: boolean
  onHide: () => void
  teamMember: TeamMember | null
  onSuccess: () => void
}

export const TeamMemberForm = ({ show, onHide, teamMember, onSuccess }: TeamMemberFormProps) => {
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [saving, setSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)

  const isEditing = !!teamMember

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      slug: '',
      role: '',
      bio: null,
      avatar_url: null,
      email: null,
      phone: null,
      social_linkedin: null,
      social_github: null,
      social_twitter: null,
      is_active: true,
      is_featured: false,
      sort_order: 0,
    },
  })

  const watchName = watch('name')
  const watchSlug = watch('slug')

  // Reset form when modal opens/closes or teamMember changes
  useEffect(() => {
    if (show) {
      if (teamMember) {
        reset({
          name: teamMember.name,
          slug: teamMember.slug,
          role: teamMember.role,
          bio: teamMember.bio,
          avatar_url: teamMember.avatar_url,
          email: teamMember.email,
          phone: teamMember.phone,
          social_linkedin: teamMember.social_linkedin,
          social_github: teamMember.social_github,
          social_twitter: teamMember.social_twitter,
          is_active: teamMember.is_active,
          is_featured: teamMember.is_featured,
          sort_order: teamMember.sort_order,
        })
      } else {
        reset({
          name: '',
          slug: '',
          role: '',
          bio: null,
          avatar_url: null,
          email: null,
          phone: null,
          social_linkedin: null,
          social_github: null,
          social_twitter: null,
          is_active: true,
          is_featured: false,
          sort_order: 0,
        })
      }
      setSlugError(null)
    }
  }, [show, teamMember, reset])

  // Auto-generate slug from name (only when creating new)
  useEffect(() => {
    if (!isEditing && watchName) {
      const autoSlug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 200)
      setValue('slug', autoSlug)
    }
  }, [watchName, isEditing, setValue])

  // Check slug uniqueness (excludes current record when editing)
  const checkSlugUniqueness = useCallback(async (slug: string) => {
    if (!slug) return
    
    try {
      setSlugChecking(true)
      setSlugError(null)
      
      // Exclude current team member when editing
      const query = supabase
        .from('team_members')
        .select('id')
        .eq('slug', slug)
      
      // Add exclusion for current record when editing
      if (isEditing && teamMember) {
        query.neq('id', teamMember.id)
      }
      
      const { data, error } = await query.maybeSingle()
      
      if (error) throw error
      
      if (data) {
        setSlugError('Slug already in use')
      }
    } catch (err) {
      console.error('Error checking slug:', err)
    } finally {
      setSlugChecking(false)
    }
  }, [isEditing, teamMember])

  // Debounced slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchSlug && watchSlug.length > 0) {
        checkSlugUniqueness(watchSlug)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [watchSlug, checkSlugUniqueness])

  const onSubmit = async (data: TeamMemberFormData) => {
    if (!user) return
    if (slugError) {
      showNotification({ message: 'Please fix the slug before saving', variant: 'danger' })
      return
    }

    try {
      setSaving(true)

      // Normalize optional URL and string fields
      const normalizedData = {
        name: data.name.trim(),
        slug: data.slug,
        role: data.role.trim(),
        bio: normalizeOptionalString(data.bio),
        avatar_url: data.avatar_url,
        email: normalizeOptionalUrl(data.email),
        phone: normalizeOptionalString(data.phone),
        social_linkedin: normalizeOptionalUrl(data.social_linkedin),
        social_github: normalizeOptionalUrl(data.social_github),
        social_twitter: normalizeOptionalUrl(data.social_twitter),
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order,
      }

      if (isEditing && teamMember) {
        // Update existing team member
        const updateData = {
          ...normalizedData,
          updated_by: user.id,
        }

        const { error } = await supabase
          .from('team_members')
          .update(updateData)
          .eq('id', teamMember.id)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Team member updated successfully', variant: 'success' })
      } else {
        // Create new team member
        const insertData = {
          ...normalizedData,
          created_by: user.id,
        }

        const { error } = await supabase.from('team_members').insert(insertData)

        if (error) {
          // Check for unique constraint violation
          if (error.code === '23505' && error.message.includes('slug')) {
            setSlugError('Slug already in use')
            throw new Error('Slug already in use')
          }
          throw error
        }

        showNotification({ message: 'Team member created successfully', variant: 'success' })
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving team member:', err)
      const message = err instanceof Error ? err.message : 'Failed to save team member'
      showNotification({ message, variant: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Team Member' : 'Add Team Member'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Tabs defaultActiveKey="basic" className="mb-3">
            {/* Basic Info Tab */}
            <Tab eventKey="basic" title="Basic Info">
              <Row>
                <Col md={8}>
                  {/* Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('name')}
                      isInvalid={!!errors.name}
                      placeholder="Enter full name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.message}
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
                        placeholder="team-member-slug"
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
                      URL-friendly identifier (auto-generated from name)
                    </Form.Text>
                  </Form.Group>

                  {/* Role (Job Title) */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Role / Job Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('role')}
                      isInvalid={!!errors.role}
                      placeholder="e.g., CEO, Lead Developer, Designer"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.role?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Bio */}
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      {...register('bio')}
                      placeholder="Short biography or description"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  {/* Status (is_active) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => (
                        <Form.Select
                          value={field.value ? 'active' : 'inactive'}
                          onChange={(e) => field.onChange(e.target.value === 'active')}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Form.Select>
                      )}
                    />
                    <Form.Text className="text-muted">
                      Inactive members are hidden from the public site
                    </Form.Text>
                  </Form.Group>

                  {/* Is Featured */}
                  <Form.Group className="mb-3">
                    <Controller
                      name="is_featured"
                      control={control}
                      render={({ field }) => (
                        <Form.Check
                          type="checkbox"
                          label="Featured team member"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Form.Text className="text-muted">
                      Featured members may be highlighted on the homepage
                    </Form.Text>
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
                  {/* Avatar Image */}
                  <Form.Group className="mb-3">
                    <Form.Label>Avatar / Photo</Form.Label>
                    <Controller
                      name="avatar_url"
                      control={control}
                      render={({ field }) => (
                        <TeamMemberImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Avatar"
                        />
                      )}
                    />
                    <Form.Text className="text-muted">
                      Recommended: 400x400 pixels, square aspect ratio
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            {/* Details Tab */}
            <Tab eventKey="details" title="Details">
              {/* Contact Info */}
              <h6 className="mb-3">Contact Information</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...register('email')}
                      isInvalid={!!errors.email}
                      placeholder="email@example.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('phone')}
                      placeholder="+1 (555) 123-4567"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Social Links */}
              <h6 className="mb-3 mt-4">Social Links</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      type="url"
                      {...register('social_linkedin')}
                      isInvalid={!!errors.social_linkedin}
                      placeholder="https://linkedin.com/in/username"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.social_linkedin?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>GitHub</Form.Label>
                    <Form.Control
                      type="url"
                      {...register('social_github')}
                      isInvalid={!!errors.social_github}
                      placeholder="https://github.com/username"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.social_github?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Twitter / X</Form.Label>
                    <Form.Control
                      type="url"
                      {...register('social_twitter')}
                      isInvalid={!!errors.social_twitter}
                      placeholder="https://twitter.com/username"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.social_twitter?.message}
                    </Form.Control.Feedback>
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
              'Update Team Member'
            ) : (
              'Create Team Member'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
