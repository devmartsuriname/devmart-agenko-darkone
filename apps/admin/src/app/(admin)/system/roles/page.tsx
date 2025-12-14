import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody, Table, Badge, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { useAuthContext } from '@/context/useAuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type UserWithRoles = {
  user_id: string
  email: string
  full_name: string | null
  roles: string[]
}

const SystemRolesPage = () => {
  const { isAdmin, user } = useAuthContext()
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    } else {
      setLoading(false)
    }
  }, [isAdmin])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('list_users_with_roles')
      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      console.error('Error loading users:', err)
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'danger'
      case 'editor': return 'warning'
      case 'viewer': return 'info'
      default: return 'secondary'
    }
  }

  return (
    <>
      <PageTitle subName="System" title="Roles" />
      
      <ComponentContainerCard
        id="roles-overview"
        title="Role Management"
        description="View and manage user roles. Only admins can assign roles."
      >
        {!isAdmin ? (
          <Alert variant="warning">
            <IconifyIcon icon="mingcute:warning-line" className="me-2" />
            You need admin privileges to view this page.
          </Alert>
        ) : loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <Alert variant="danger">
            <IconifyIcon icon="mingcute:close-circle-line" className="me-2" />
            {error}
          </Alert>
        ) : users.length === 0 ? (
          <Card className="border-0 bg-light">
            <CardBody className="text-center py-5">
              <IconifyIcon icon="mingcute:user-3-line" className="fs-1 text-muted mb-3 d-block" />
              <h5 className="text-muted mb-2">No Users Found</h5>
              <p className="text-muted mb-0">
                Users will appear here after they sign up.
              </p>
            </CardBody>
          </Card>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Roles</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm me-2">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                          {(u.full_name || u.email).charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <span>{u.full_name || '(No name)'}</span>
                      {u.user_id === user?.id && (
                        <Badge bg="secondary" className="ms-2">You</Badge>
                      )}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    {u.roles && u.roles.length > 0 ? (
                      u.roles.map((role) => (
                        <Badge 
                          key={role} 
                          bg={getRoleBadgeVariant(role)}
                          className="me-1"
                        >
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted">No roles</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      <Card className="mt-3">
        <CardBody>
          <h6 className="text-muted mb-3">
            <IconifyIcon icon="mingcute:info-line" className="me-1" />
            Role Assignment Instructions
          </h6>
          <p className="text-muted small mb-2">
            To assign a role to a user, run this SQL in the Supabase SQL Editor:
          </p>
          <pre className="bg-light p-3 rounded small mb-3">
{`-- Assign admin role
INSERT INTO public.user_roles (user_id, role) 
VALUES ('<user-uuid>', 'admin');

-- Or use the RPC function
SELECT assign_role('<user-uuid>', 'admin');`}
          </pre>
          <h6 className="text-muted mb-3">
            <IconifyIcon icon="mingcute:key-line" className="me-1" />
            Available Roles
          </h6>
          <ul className="text-muted small mb-0">
            <li><Badge bg="danger">admin</Badge> — Full system access, can manage users and roles</li>
            <li><Badge bg="warning">editor</Badge> — Can edit content, CRM, and marketing modules</li>
            <li><Badge bg="info">viewer</Badge> — Read-only access to dashboard</li>
          </ul>
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default SystemRolesPage
