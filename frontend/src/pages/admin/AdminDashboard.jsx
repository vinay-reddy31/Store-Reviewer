import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  IconUsers,
  IconStore,
  IconStar,
  IconPlus,
  IconArrowRight,
} from '../../components/Icons';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/users/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats.'));
  }, []);

  const firstName = (user?.name || 'Admin').split(' ')[0];

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: <IconUsers size={24} />, cls: 'si-indigo' },
    { label: 'Total Stores', value: stats?.totalStores, icon: <IconStore size={24} />, cls: 'si-emerald' },
    { label: 'Ratings Submitted', value: stats?.totalRatings, icon: <IconStar size={24} />, cls: 'si-amber' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">
          <h1>Welcome back, {firstName} 👋</h1>
          <p>Here's what's happening across your platform today.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-top">
              <div className={`stat-icon ${c.cls}`}>{c.icon}</div>
            </div>
            <div className="stat-value">{c.value ?? '—'}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="page-title" style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.2rem' }}>Quick actions</h1>
          <p>Jump straight to the most common admin tasks.</p>
        </div>
        <div className="quick-actions">
          <Link to="/admin/users/new" className="btn btn-primary">
            <IconPlus size={16} /> Add User
          </Link>
          <Link to="/admin/stores/new" className="btn btn-primary">
            <IconPlus size={16} /> Add Store
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            Manage Users <IconArrowRight size={16} />
          </Link>
          <Link to="/admin/stores" className="btn btn-secondary">
            Manage Stores <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
