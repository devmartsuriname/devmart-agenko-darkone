/**
 * Hero Sections CRUD Page
 * Admin module for managing homepage hero sections
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
import { HeroForm } from './components/HeroForm'
import { HeroDeleteModal } from './components/HeroDeleteModal'
import type { Tables } from '@/integrations/supabase/types'

type HeroSection = Tables<'hero_sections'>

type StatusFilter = 'all' | 'active' | 'inactive'

const HeroSectionsPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [heroes, setHeroes] = useState<HeroSection[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedHero, setSelectedHero] = useState<HeroSection | null>(null)

  // Fetch hero sections
  const fetchHeroes = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('hero_sections')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })

      if (error) throw error
      setHeroes(data || [])
    } catch (err) {
      console.error('Error fetching hero sections:', err)
      showNotification({ message: 'Failed to load hero sections', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchHeroes()
  }, [fetchHeroes])

  // Filtered heroes
  const filteredHeroes = heroes.filter((hero) => {
    // Status filter
    if (statusFilter === 'active' && !hero.is_active) return false
    if (statusFilter === 'inactive' && hero.is_active) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesHeading = hero.heading?.toLowerCase().includes(query)
      const matchesSubheading = hero.subheading?.toLowerCase().includes(query)
      if (!matchesHeading && !matchesSubheading) return false
    }

    return true
  })

  // Handlers
  const handleAdd = () => {
    setSelectedHero(null)
    setShowForm(true)
  }

  const handleEdit = (hero: HeroSection) => {
    setSelectedHero(hero)
    setShowForm(true)
  }

  const handleDelete = (hero: HeroSection) => {
    setSelectedHero(hero)
    setShowDeleteModal(true)
  }

  const handleToggleActive = async (hero: HeroSection) => {
    try {
      const { error } = await supabase
        .from('hero_sections')
        .update({
          is_active: !hero.is_active,
          updated_by: user?.id || null,
        })
        .eq('id', hero.id)

      if (error) throw error

      showNotification({
        message: `Hero section ${hero.is_active ? 'deactivated' : 'activated'} successfully`,
        variant: 'success',
      })
      fetchHeroes()
    } catch (err) {
      console.error('Error toggling hero status:', err)
      showNotification({ message: 'Failed to update hero status', variant: 'danger' })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedHero(null)
    fetchHeroes()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedHero(null)
    fetchHeroes()
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
      <PageTitle title="Hero Sections" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAdd}>
          <Icon icon="mingcute:add-line" className="me-1" />
          Add Hero Section
        </Button>
      </div>

      <ComponentContainerCard title="Hero Sections">
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
            <p className="mt-2 text-muted">Loading hero sections...</p>
          </div>
        ) : filteredHeroes.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:slideshow-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">No hero sections found.</p>
            <p className="text-muted">Click "Add Hero Section" to create one.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Heading</th>
                <th style={{ width: '20%' }}>Subheading</th>
                <th style={{ width: '10%' }}>CTA</th>
                <th style={{ width: '8%' }}>Status</th>
                <th style={{ width: '5%' }}>Order</th>
                <th style={{ width: '12%' }}>Updated</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHeroes.map((hero) => (
                <tr key={hero.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {hero.background_image_url ? (
                        <Image
                          src={hero.background_image_url}
                          alt={hero.heading}
                          rounded
                          width={50}
                          height={35}
                          className="me-2"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded me-2 d-flex align-items-center justify-content-center"
                          style={{ width: 50, height: 35 }}
                        >
                          <Icon icon="mingcute:image-line" className="text-white" />
                        </div>
                      )}
                      <div>
                        <div className="fw-medium">{truncate(hero.heading, 40)}</div>
                        <small className="text-muted">
                          Align: {hero.text_alignment || 'center'}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <small className="text-muted">{truncate(hero.subheading, 50)}</small>
                  </td>
                  <td>
                    {hero.cta_text ? (
                      <Badge bg="info">{truncate(hero.cta_text, 15)}</Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <Badge bg={hero.is_active ? 'success' : 'secondary'}>
                      {hero.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>{hero.sort_order}</td>
                  <td>
                    <small className="text-muted">{formatDate(hero.updated_at)}</small>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(hero)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" />
                    </Button>
                    <Button
                      variant={hero.is_active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleActive(hero)}
                      title={hero.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon icon={hero.is_active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(hero)}
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
      <HeroForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setSelectedHero(null)
        }}
        hero={selectedHero}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal (Admin-only) */}
      {isAdmin && (
        <HeroDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setSelectedHero(null)
          }}
          hero={selectedHero}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default HeroSectionsPage
