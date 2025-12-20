/**
 * Home WhyChoose CRUD Page
 * Admin module for managing Home page "Why Choose Us" section
 * 
 * HOMEPAGE-ONLY: This section is NOT reusable across other pages
 * Features stored as JSONB array: [{ title, content }]
 * RBAC: Admin + Editor can create/edit/toggle, Admin-only delete
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Badge, Spinner, Form, InputGroup } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import { WhyChooseForm } from './components/WhyChooseForm'
import { WhyChooseDeleteModal } from './components/WhyChooseDeleteModal'

// Type for home_whychoose table
interface HomeWhyChoose {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  is_active: boolean
  sort_order: number
  section_title: string
  section_subtitle: string | null
  thumbnail_url: string | null
  features: Array<{ title: string; content: string }>
}

type StatusFilter = 'all' | 'active' | 'inactive'

const HomeWhyChoosePage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [sections, setSections] = useState<HomeWhyChoose[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<HomeWhyChoose | null>(null)

  // Fetch sections
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('home_whychoose')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) throw error
      setSections(data || [])
    } catch (err) {
      console.error('Error fetching home whychoose sections:', err)
      showNotification({ message: 'Failed to load WhyChoose sections', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  // Filtered sections
  const filteredSections = sections.filter((section) => {
    // Status filter
    if (statusFilter === 'active' && !section.is_active) return false
    if (statusFilter === 'inactive' && section.is_active) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = section.section_title?.toLowerCase().includes(query)
      const matchesSubtitle = section.section_subtitle?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesSubtitle) return false
    }

    return true
  })

  // Handlers
  const handleAdd = () => {
    setSelectedSection(null)
    setShowForm(true)
  }

  const handleEdit = (section: HomeWhyChoose) => {
    setSelectedSection(section)
    setShowForm(true)
  }

  const handleDelete = (section: HomeWhyChoose) => {
    setSelectedSection(section)
    setShowDeleteModal(true)
  }

  const handleToggleActive = async (section: HomeWhyChoose) => {
    try {
      const { error } = await supabase
        .from('home_whychoose')
        .update({
          is_active: !section.is_active,
          updated_by: user?.id || null,
        })
        .eq('id', section.id)

      if (error) throw error

      showNotification({
        message: `Section ${section.is_active ? 'deactivated' : 'activated'} successfully`,
        variant: 'success',
      })
      fetchSections()
    } catch (err) {
      console.error('Error toggling section status:', err)
      showNotification({ message: 'Failed to update section status', variant: 'danger' })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedSection(null)
    fetchSections()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedSection(null)
    fetchSections()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageTitle title="Home WhyChoose" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <small className="text-muted">
            <Icon icon="mingcute:information-line" className="me-1" />
            Homepage-only section — typically 1 active section
          </small>
        </div>
        <Button variant="primary" onClick={handleAdd}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add Section
        </Button>
      </div>

      <ComponentContainerCard title="Home WhyChoose / Why Choose Us Section">
        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 mb-3">
          <Form.Group style={{ minWidth: '150px' }}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text>
              <Icon icon="mingcute:search-line" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                <Icon icon="mingcute:close-line" />
              </Button>
            )}
          </InputGroup>

          <div className="ms-auto">
            <Badge bg="secondary" className="fs-6">
              {sections.length} section{sections.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading sections...</p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:question-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">No WhyChoose sections found.</p>
            <p className="text-muted">Click "Add Section" to create one.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Title</th>
                <th style={{ width: '20%' }}>Subtitle</th>
                <th style={{ width: '10%' }}>Features</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%' }}>Order</th>
                <th style={{ width: '10%' }}>Updated</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((section) => (
                <tr key={section.id}>
                  <td>
                    <div className="fw-medium">{section.section_title}</div>
                  </td>
                  <td>
                    <span className="text-muted">{section.section_subtitle || '—'}</span>
                  </td>
                  <td>
                    <Badge bg="info">{section.features?.length || 0} items</Badge>
                  </td>
                  <td>
                    <Badge bg={section.is_active ? 'success' : 'secondary'}>
                      {section.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>{section.sort_order}</td>
                  <td>
                    <small className="text-muted">{formatDate(section.updated_at)}</small>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(section)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" />
                    </Button>
                    <Button
                      variant={section.is_active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleActive(section)}
                      title={section.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon icon={section.is_active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(section)}
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
      <WhyChooseForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setSelectedSection(null)
        }}
        section={selectedSection}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal (Admin-only) */}
      {isAdmin && (
        <WhyChooseDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setSelectedSection(null)
          }}
          section={selectedSection}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default HomeWhyChoosePage