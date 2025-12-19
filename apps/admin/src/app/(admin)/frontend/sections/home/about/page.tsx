/**
 * Home About Sections CRUD Page
 * Admin module for managing Home page About sections
 * 
 * RBAC: Admin + Editor can create/edit/toggle, Admin-only delete
 * Pattern: is_active boolean toggle
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Badge, Spinner, Image, Form, InputGroup } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import { HomeAboutForm } from './components/HomeAboutForm'
import { HomeAboutDeleteModal } from './components/HomeAboutDeleteModal'

// Type for home_about_sections table
interface HomeAboutSection {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  is_active: boolean
  sort_order: number
  eyebrow: string | null
  heading: string
  body: string | null
  bullets: string[] | null
  cta_text: string | null
  cta_link: string | null
  image_url: string | null
}

type StatusFilter = 'all' | 'active' | 'inactive'

const HomeAboutSectionsPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [sections, setSections] = useState<HomeAboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState<HomeAboutSection | null>(null)

  // Fetch sections
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('home_about_sections')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })

      if (error) throw error
      setSections(data || [])
    } catch (err) {
      console.error('Error fetching home about sections:', err)
      showNotification({ message: 'Failed to load about sections', variant: 'danger' })
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
      const matchesHeading = section.heading?.toLowerCase().includes(query)
      const matchesEyebrow = section.eyebrow?.toLowerCase().includes(query)
      if (!matchesHeading && !matchesEyebrow) return false
    }

    return true
  })

  // Handlers
  const handleAdd = () => {
    setSelectedSection(null)
    setShowForm(true)
  }

  const handleEdit = (section: HomeAboutSection) => {
    setSelectedSection(section)
    setShowForm(true)
  }

  const handleDelete = (section: HomeAboutSection) => {
    setSelectedSection(section)
    setShowDeleteModal(true)
  }

  const handleToggleActive = async (section: HomeAboutSection) => {
    try {
      const { error } = await supabase
        .from('home_about_sections')
        .update({
          is_active: !section.is_active,
          updated_by: user?.id || null,
        })
        .eq('id', section.id)

      if (error) throw error

      showNotification({
        message: `About section ${section.is_active ? 'deactivated' : 'activated'} successfully`,
        variant: 'success',
      })
      fetchSections()
    } catch (err) {
      console.error('Error toggling about section status:', err)
      showNotification({ message: 'Failed to update about section status', variant: 'danger' })
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

  // Truncate text
  const truncate = (text: string | null, maxLength: number) => {
    if (!text) return '—'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <>
      <PageTitle title="Home About Sections" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAdd}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add About Section
        </Button>
      </div>

      <ComponentContainerCard title="Home About Sections">
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
              placeholder="Search heading..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                <Icon icon="mingcute:close-line" />
              </Button>
            )}
          </InputGroup>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading about sections...</p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:information-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">No about sections found.</p>
            <p className="text-muted">Click "Add About Section" to create one.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th style={{ width: '25%' }}>Heading</th>
                <th style={{ width: '15%' }}>Eyebrow</th>
                <th style={{ width: '10%' }}>CTA</th>
                <th style={{ width: '8%' }}>Status</th>
                <th style={{ width: '5%' }}>Order</th>
                <th style={{ width: '12%' }}>Updated</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((section) => (
                <tr key={section.id}>
                  <td>
                    {section.image_url ? (
                      <Image
                        src={section.image_url}
                        alt={section.heading}
                        rounded
                        width={50}
                        height={35}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-secondary rounded d-flex align-items-center justify-content-center"
                        style={{ width: 50, height: 35 }}
                      >
                        <Icon icon="mingcute:image-line" className="text-white" />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="fw-medium">{truncate(section.heading, 40)}</div>
                  </td>
                  <td>
                    <small className="text-muted">{truncate(section.eyebrow, 25)}</small>
                  </td>
                  <td>
                    {section.cta_text ? (
                      <Badge bg="info">{truncate(section.cta_text, 15)}</Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
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
      <HomeAboutForm
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
        <HomeAboutDeleteModal
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

export default HomeAboutSectionsPage
