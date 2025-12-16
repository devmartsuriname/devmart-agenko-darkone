/**
 * Projects List Page
 * Phase A2: Admin CRUD Implementation
 * 
 * RBAC:
 * - Admin/Editor: Full access (list, create, edit, publish/unpublish)
 * - Admin only: Delete
 * - Viewer: Denied at route level
 */
import { useEffect, useState, useCallback } from 'react'
import { Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { supabase } from '@/lib/supabase'
import { useNotificationContext } from '@/context/useNotificationContext'
import { ProjectForm } from './components/ProjectForm'
import { ProjectDeleteModal } from './components/ProjectDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type Project = Tables<'projects'>

const ProjectsPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()
  
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (fetchError) throw fetchError
      setProjects(data || [])
    } catch (err) {
      console.error('Error loading projects:', err)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleCreate = () => {
    setEditingProject(null)
    setShowForm(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleDelete = (project: Project) => {
    setDeletingProject(project)
    setShowDeleteModal(true)
  }

  const handleTogglePublish = async (project: Project) => {
    if (!user) return
    
    try {
      setActionLoading(project.id)
      const newStatus = project.status === 'published' ? 'draft' : 'published'
      const updateData: Partial<Project> = {
        status: newStatus,
        updated_by: user.id,
      }
      
      // Set published_at when publishing
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString()
      }
      
      const { error: updateError } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', project.id)
      
      if (updateError) throw updateError
      
      showNotification({
        message: `Project ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
        variant: 'success',
      })
      await loadProjects()
    } catch (err) {
      console.error('Error toggling publish status:', err)
      showNotification({
        message: 'Failed to update project status',
        variant: 'danger',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProject(null)
    loadProjects()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setDeletingProject(null)
    loadProjects()
  }

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
      <PageTitle title="Projects" />
      
      <ComponentContainerCard
        title="Projects"
        description="Manage your portfolio projects and case studies"
        headerAction={
          <Button variant="primary" onClick={handleCreate}>
            <Icon icon="mingcute:add-line" className="me-1" />
            Add Project
          </Button>
        }
      >
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:folder-open-line" className="fs-1 text-muted mb-3" />
            <h5 className="text-muted">No projects yet</h5>
            <p className="text-muted">Click "Add Project" to create your first project.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Sort Order</th>
                  <th>Updated</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {project.thumbnail_url && (
                          <img
                            src={project.thumbnail_url}
                            alt=""
                            className="rounded me-2"
                            style={{ width: '40px', height: '30px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div className="fw-medium">{project.title}</div>
                          <small className="text-muted">/{project.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {project.category ? (
                        <Badge bg="light" text="dark">{project.category}</Badge>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={project.status === 'published' ? 'success' : 'warning'}>
                        {project.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>
                      {project.is_featured ? (
                        <Icon icon="mingcute:star-fill" className="text-warning" />
                      ) : (
                        <Icon icon="mingcute:star-line" className="text-muted" />
                      )}
                    </td>
                    <td>{project.sort_order}</td>
                    <td>{formatDate(project.updated_at)}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-1">
                        <Button
                          variant="soft-primary"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          title="Edit"
                        >
                          <Icon icon="mingcute:edit-line" />
                        </Button>
                        <Button
                          variant={project.status === 'published' ? 'soft-warning' : 'soft-success'}
                          size="sm"
                          onClick={() => handleTogglePublish(project)}
                          disabled={actionLoading === project.id}
                          title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {actionLoading === project.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <Icon
                              icon={
                                project.status === 'published'
                                  ? 'mingcute:eye-close-line'
                                  : 'mingcute:eye-line'
                              }
                            />
                          )}
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="soft-danger"
                            size="sm"
                            onClick={() => handleDelete(project)}
                            title="Delete"
                          >
                            <Icon icon="mingcute:delete-line" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ComponentContainerCard>

      {/* Create/Edit Form Modal */}
      <ProjectForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setEditingProject(null)
        }}
        project={editingProject}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {isAdmin && (
        <ProjectDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setDeletingProject(null)
          }}
          project={deletingProject}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default ProjectsPage
