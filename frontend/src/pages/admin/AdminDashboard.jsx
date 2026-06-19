import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/users/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats.'));
  }, []);

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalUsers : '—'}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalStores : '—'}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalRatings : '—'}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/admin/users/new" className="btn btn-primary">
          + Add User
        </Link>
        <Link to="/admin/stores/new" className="btn btn-primary">
          + Add Store
        </Link>
        <Link to="/admin/users" className="btn btn-secondary">
          Manage Users
        </Link>
        <Link to="/admin/stores" className="btn btn-secondary">
          Manage Stores
        </Link>
      </div>
    </div>
  );
}
