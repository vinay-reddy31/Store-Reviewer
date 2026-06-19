import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';
import { IconStar, IconStore, IconUsers } from '../../components/Icons';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stores/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="page">
        <div className="loading-wrap">
          <span className="loader" /> Loading your dashboard…
        </div>
      </div>
    );
  }

  const firstName = (user?.name || 'Owner').split(' ')[0];

  const raterColumns = [
    { key: 'store_name', label: 'Store' },
    { key: 'user_name', label: 'User' },
    { key: 'user_email', label: 'Email' },
    {
      key: 'rating',
      label: 'Rating',
      render: (r) => (
        <span className="rating-cell">
          <StarRating value={r.rating} readOnly /> <span className="rating-number">{r.rating}</span>
        </span>
      ),
    },
    {
      key: 'updated_at',
      label: 'Submitted',
      render: (r) => new Date(r.updated_at).toLocaleString(),
    },
  ];

  const cards = [
    {
      label: 'Average Rating',
      value: data.overallAverage.toFixed(2),
      icon: <IconStar size={24} />,
      cls: 'si-amber',
    },
    { label: 'Your Stores', value: data.stores.length, icon: <IconStore size={24} />, cls: 'si-indigo' },
    {
      label: 'Ratings Received',
      value: data.raters.length,
      icon: <IconUsers size={24} />,
      cls: 'si-emerald',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">
          <h1>Hello, {firstName} 👋</h1>
          <p>Track how customers rate your stores.</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-top">
              <div className={`stat-icon ${c.cls}`}>{c.icon}</div>
            </div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {data.stores.length === 0 ? (
        <div className="card">
          <p className="muted">No stores are assigned to your account yet.</p>
        </div>
      ) : (
        <>
          <div className="page-title" style={{ margin: '0.5rem 0 1rem' }}>
            <h1 style={{ fontSize: '1.25rem' }}>Your stores</h1>
          </div>
          <div className="store-grid">
            {data.stores.map((s) => (
              <div key={s.id} className="store-card">
                <div className="store-card-head">
                  <span className="store-logo">{s.name.charAt(0)}</span>
                  <h3>{s.name}</h3>
                </div>
                <p className="store-address">{s.address}</p>
                <div className="store-rating-row">
                  <span className="label">Average</span>
                  <StarRating value={Number(s.average_rating)} readOnly />
                  <span className="rating-number">
                    {Number(s.average_rating).toFixed(2)} ({s.rating_count})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="page-title" style={{ margin: '1.75rem 0 1rem' }}>
            <h1 style={{ fontSize: '1.25rem' }}>Customers who rated your stores</h1>
          </div>
          <DataTable
            columns={raterColumns}
            rows={data.raters}
            initialSort={{ key: 'updated_at', dir: 'desc' }}
          />
        </>
      )}
    </div>
  );
}
