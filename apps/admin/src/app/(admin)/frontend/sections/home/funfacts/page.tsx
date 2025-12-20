/**
 * Home FunFacts CRUD Page
 * Admin module for managing Home page FunFacts/Stats section
 * 
 * CONSTRAINT: Max 4 items (enforced at DB level)
 * RBAC: Admin + Editor can create/edit/toggle, Admin-only delete
 * Pattern: is_active boolean toggle
 */
import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Badge, Spinner, Form, InputGroup } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { supabase } from '@/lib/supabase'
import { FunFactForm } from './components/FunFactForm'
import { FunFactDeleteModal } from './components/FunFactDeleteModal'

// Type for home_funfacts table
interface HomeFunFact {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  is_active: boolean
  sort_order: number
  title: string
  number: string
}

type StatusFilter = 'all' | 'active' | 'inactive'

const HomeFunFactsPage = () => {
  const { user, isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [funfacts, setFunfacts] = useState<HomeFunFact[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedFunfact, setSelectedFunfact] = useState<HomeFunFact | null>(null)

  // Max 4 constraint check
  const canAddMore = funfacts.length < 4

  // Fetch funfacts
  const fetchFunfacts = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('home_funfacts')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) throw error
      setFunfacts(data || [])
    } catch (err) {
      console.error('Error fetching home funfacts:', err)
      showNotification({ message: 'Failed to load funfacts', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchFunfacts()
  }, [fetchFunfacts])

  // Filtered funfacts
  const filteredFunfacts = funfacts.filter((funfact) => {
    // Status filter
    if (statusFilter === 'active' && !funfact.is_active) return false
    if (statusFilter === 'inactive' && funfact.is_active) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = funfact.title?.toLowerCase().includes(query)
      const matchesNumber = funfact.number?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesNumber) return false
    }

    return true
  })

  // Handlers
  const handleAdd = () => {
    if (!canAddMore) {
      showNotification({ message: 'Maximum 4 funfacts allowed', variant: 'warning' })
      return
    }
    setSelectedFunfact(null)
    setShowForm(true)
  }

  const handleEdit = (funfact: HomeFunFact) => {
    setSelectedFunfact(funfact)
    setShowForm(true)
  }

  const handleDelete = (funfact: HomeFunFact) => {
    setSelectedFunfact(funfact)
    setShowDeleteModal(true)
  }

  const handleToggleActive = async (funfact: HomeFunFact) => {
    try {
      const { error } = await supabase
        .from('home_funfacts')
        .update({
          is_active: !funfact.is_active,
          updated_by: user?.id || null,
        })
        .eq('id', funfact.id)

      if (error) throw error

      showNotification({
        message: `FunFact ${funfact.is_active ? 'deactivated' : 'activated'} successfully`,
        variant: 'success',
      })
      fetchFunfacts()
    } catch (err) {
      console.error('Error toggling funfact status:', err)
      showNotification({ message: 'Failed to update funfact status', variant: 'danger' })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedFunfact(null)
    fetchFunfacts()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedFunfact(null)
    fetchFunfacts()
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
      <PageTitle title="Home FunFacts" />

      {/* Add button placed ABOVE ComponentContainerCard */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {!canAddMore && (
            <small className="text-muted">
              <Icon icon="mingcute:information-line" className="me-1" />
              Maximum 4 items reached
            </small>
          )}
        </div>
        <Button 
          variant="primary" 
          onClick={handleAdd}
          disabled={!canAddMore}
          title={canAddMore ? 'Add FunFact' : 'Maximum 4 items'}
        >
          <Icon icon="mingcute:add-line" className="me-1" />
          Add FunFact
        </Button>
      </div>

      <ComponentContainerCard title="Home FunFacts / Stats Section">
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
              placeholder="Search title or number..."
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
              {funfacts.length} / 4 items
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading funfacts...</p>
          </div>
        ) : filteredFunfacts.length === 0 ? (
          <div className="text-center py-5">
            <Icon icon="mingcute:chart-line-line" className="fs-1 text-muted mb-3 d-block" />
            <p className="text-muted mb-0">No funfacts found.</p>
            {canAddMore && (
              <p className="text-muted">Click "Add FunFact" to create one.</p>
            )}
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Title</th>
                <th style={{ width: '20%' }}>Number</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%' }}>Order</th>
                <th style={{ width: '15%' }}>Updated</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFunfacts.map((funfact) => (
                <tr key={funfact.id}>
                  <td>
                    <div className="fw-medium">{funfact.title}</div>
                  </td>
                  <td>
                    <Badge bg="info" className="fs-6">{funfact.number}</Badge>
                  </td>
                  <td>
                    <Badge bg={funfact.is_active ? 'success' : 'secondary'}>
                      {funfact.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>{funfact.sort_order}</td>
                  <td>
                    <small className="text-muted">{formatDate(funfact.updated_at)}</small>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(funfact)}
                      title="Edit"
                    >
                      <Icon icon="mingcute:edit-line" />
                    </Button>
                    <Button
                      variant={funfact.is_active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      className="me-1"
                      onClick={() => handleToggleActive(funfact)}
                      title={funfact.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Icon icon={funfact.is_active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(funfact)}
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
      <FunFactForm
        show={showForm}
        onHide={() => {
          setShowForm(false)
          setSelectedFunfact(null)
        }}
        funfact={selectedFunfact}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal (Admin-only) */}
      {isAdmin && (
        <FunFactDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false)
            setSelectedFunfact(null)
          }}
          funfact={selectedFunfact}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}

export default HomeFunFactsPage
