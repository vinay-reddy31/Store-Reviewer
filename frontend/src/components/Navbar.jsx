import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconStar, IconLogout } from './Icons';

const ROLE_LABEL = {
  admin: 'System Administrator',
  user: 'Normal User',
  owner: 'Store Owner',
};

function initials(name = '') {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'U';
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <IconStar size={18} />
        </span>
        Store Rating
      </Link>

      <div className="navbar-links">
        {user.role === 'admin' && (
          <>
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/users">Users</NavLink>
            <NavLink to="/admin/stores">Stores</NavLink>
          </>
        )}
        {user.role === 'user' && <NavLink to="/stores">Stores</NavLink>}
        {user.role === 'owner' && <NavLink to="/owner" end>Dashboard</NavLink>}
        <NavLink to="/account/password">Change Password</NavLink>
      </div>

      <div className="navbar-user">
        <div className="user-chip">
          <span className="avatar">{initials(user.name)}</span>
          <span className="user-meta">
            <span className="u-role">{ROLE_LABEL[user.role]}</span>
            <span className="u-email">{user.email}</span>
          </span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          <IconLogout size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}
