import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL = {
  admin: 'System Administrator',
  user: 'Normal User',
  owner: 'Store Owner',
};

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
      <div className="navbar-brand">⭐ Store Rating Platform</div>
      <div className="navbar-links">
        {user.role === 'admin' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}
        {user.role === 'user' && <Link to="/stores">Stores</Link>}
        {user.role === 'owner' && <Link to="/owner">Dashboard</Link>}
        <Link to="/account/password">Change Password</Link>
      </div>
      <div className="navbar-user">
        <span className="navbar-role">{ROLE_LABEL[user.role]}</span>
        <span className="navbar-email">{user.email}</span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
