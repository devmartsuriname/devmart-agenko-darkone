import { useState, useEffect, useCallback } from 'react'
import { Card, CardBody, Table, Button, Badge, Form, Row, Col, InputGroup } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import SubscriberFormModal from './components/SubscriberFormModal'

interface Subscriber {
  id: string
  email: string
  source: string | null
  is_active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
}

const MarketingNewsletterPage = () => {
  const { isAdmin } = useAuthContext()
  const { showNotification } = useNotificationContext()
  const canEdit = true // Admin + Editor can edit (route is already protected)

  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('subscribed')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })

      // Apply status filter
      if (statusFilter === 'subscribed') {
        query = query.eq('is_active', true)
      } else if (statusFilter === 'unsubscribed') {
        query = query.eq('is_active', false)
      }

      // Apply source filter
      if (sourceFilter !== 'all') {
        query = query.eq('source', sourceFilter)
      }

      // Apply search
      if (searchQuery.trim()) {
        query = query.ilike('email', `%${searchQuery.trim()}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setSubscribers(data || [])
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      showNotification({
        message: 'Failed to load subscribers',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, sourceFilter, searchQuery])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const handleUnsubscribe = async (subscriber: Subscriber) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('id', subscriber.id)

      if (error) throw error

      showNotification({
        message: 'Subscriber unsubscribed successfully',
        variant: 'success',
      })
      fetchSubscribers()
    } catch (error) {
      console.error('Error unsubscribing:', error)
      showNotification({
        message: 'Failed to unsubscribe',
        variant: 'danger',
      })
    }
  }

  const handleResubscribe = async (subscriber: Subscriber) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          unsubscribed_at: null,
        })
        .eq('id', subscriber.id)

      if (error) throw error

      showNotification({
        message: 'Subscriber resubscribed successfully',
        variant: 'success',
      })
      fetchSubscribers()
    } catch (error) {
      console.error('Error resubscribing:', error)
      showNotification({
        message: 'Failed to resubscribe',
        variant: 'danger',
      })
    }
  }

  const handleOpenCreate = () => {
    setSelectedSubscriber(null)
    setShowModal(true)
  }

  const handleOpenEdit = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber)
    setShowModal(true)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageTitle subName="Marketing" title="Newsletter Subscribers" />

      {/* Action Buttons Row */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            disabled
            title="Coming soon"
          >
            <IconifyIcon icon="mingcute:upload-line" className="me-1" />
            Import CSV (Coming soon)
          </Button>
          {canEdit && (
            <Button variant="primary" onClick={handleOpenCreate}>
              <IconifyIcon icon="mingcute:add-line" className="me-1" />
              Add Subscriber
            </Button>
          )}
        </Col>
      </Row>

      {/* Filters Row */}
      <Card className="mb-3">
        <CardBody>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Status</Form.Label>
                <Form.Select
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'subscribed' | 'unsubscribed')}
                >
                  <option value="all">All</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Source</Form.Label>
                <Form.Select
                  size="sm"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                >
                  <option value="all">All Sources</option>
                  <option value="admin">Admin</option>
                  <option value="public">Public</option>
                  <option value="footer">Footer</option>
                  <option value="import">Import</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Search</Form.Label>
                <InputGroup size="sm">
                  <InputGroup.Text>
                    <IconifyIcon icon="mingcute:search-line" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setStatusFilter('subscribed')
                  setSourceFilter('all')
                  setSearchQuery('')
                }}
              >
                Reset Filters
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <ComponentContainerCard
        id="newsletter-subscribers"
        title="Subscribers"
        description={`${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''} found`}
      >
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : subscribers.length === 0 ? (
          <Card className="border-0 bg-light">
            <CardBody className="text-center py-5">
              <IconifyIcon icon="mingcute:mail-line" className="fs-1 text-muted mb-3 d-block" />
              <h5 className="text-muted mb-2">No Subscribers Found</h5>
              <p className="text-muted mb-0">
                {statusFilter !== 'all' || sourceFilter !== 'all' || searchQuery
                  ? 'Try adjusting your filters or search query.'
                  : 'Add your first subscriber using the button above.'}
              </p>
            </CardBody>
          </Card>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Source</th>
                <th>Subscribed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>
                    <span className="fw-medium">{subscriber.email}</span>
                  </td>
                  <td>
                    {subscriber.is_active ? (
                      <Badge bg="success">Subscribed</Badge>
                    ) : (
                      <Badge bg="secondary">Unsubscribed</Badge>
                    )}
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="text-capitalize">
                      {subscriber.source || 'unknown'}
                    </Badge>
                  </td>
                  <td>{formatDate(subscriber.subscribed_at)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      {canEdit && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleOpenEdit(subscriber)}
                          title="Edit"
                        >
                          <IconifyIcon icon="mingcute:edit-line" />
                        </Button>
                      )}
                      {canEdit && (
                        subscriber.is_active ? (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleUnsubscribe(subscriber)}
                            title="Unsubscribe"
                          >
                            <IconifyIcon icon="mingcute:user-remove-line" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleResubscribe(subscriber)}
                            title="Resubscribe"
                          >
                            <IconifyIcon icon="mingcute:user-add-line" />
                          </Button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      <Footer />

      {/* Create/Edit Modal */}
      <SubscriberFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={fetchSubscribers}
        subscriber={selectedSubscriber}
      />
    </>
  )
}

export default MarketingNewsletterPage
