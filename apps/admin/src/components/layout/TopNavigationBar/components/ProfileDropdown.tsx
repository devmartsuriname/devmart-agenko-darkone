import avatar1 from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProfileDropdown = () => {
  const { signOut, user } = useAuthContext();

  const handleLogout = async () => {
    await signOut();
  };

  // Get display name
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User';
  
  // Get role badge color
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'editor':
        return 'warning';
      case 'viewer':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Dropdown className=" topbar-item">
      <DropdownToggle
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle"
            width={32}
            src={user?.avatar_url || avatar1}
            alt="avatar"
          />
        </span>
      </DropdownToggle>
      <DropdownMenu className=" dropdown-menu-end">
        <DropdownHeader className="d-flex flex-column">
          <span className="fw-semibold">{displayName}</span>
          {user?.email && (
            <small className="text-muted">{user.email}</small>
          )}
          {user?.roles && user.roles.length > 0 && (
            <div className="mt-2">
              {user.roles.map((role) => (
                <Badge 
                  key={role} 
                  bg={getRoleBadgeVariant(role)} 
                  className="me-1 text-capitalize"
                >
                  {role}
                </Badge>
              ))}
            </div>
          )}
        </DropdownHeader>
        <div className="dropdown-divider my-1" />
        <DropdownItem href="">
          <IconifyIcon icon="solar:user-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">My Account</span>
        </DropdownItem>
        <DropdownItem href="">
          <IconifyIcon icon="solar:settings-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Settings</span>
        </DropdownItem>
        <DropdownItem href="">
          <IconifyIcon icon="solar:help-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Help</span>
        </DropdownItem>
        <DropdownItem href="/auth/lock-screen">
          <IconifyIcon icon="solar:lock-keyhole-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Lock screen</span>
        </DropdownItem>
        <div className="dropdown-divider my-1" />
        <DropdownItem 
          as="button" 
          className="text-danger" 
          onClick={handleLogout}
        >
          <IconifyIcon icon="solar:logout-3-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
