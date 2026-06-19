import { useEffect, useState } from 'react';
import api from '../../api/client';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stores/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!data) return <div className="page"><p>Loading...</p></div>;

  const raterColumns = [
    { key: 'store_name', label: 'Store' },
    { key: 'user_name', label: 'User' },
    { key: 'user_email', label: 'Email' },
    {
      key: 'rating',
      label: 'Rating',
      render: (r) => <span className="rating-cell"><StarRating value={r.rating} readOnly /> {r.rating}</span>,
    },
    {
      key: 'updated_at',
      label: 'Submitted',
      render: (r) => new Date(r.updated_at).toLocaleString(),
    },
  ];

  return (
    <div className="page">
      <h1>Store Owner Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.overallAverage.toFixed(2)}</div>
          <div className="stat-label">Average Rating (all stores)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.stores.length}</div>
          <div className="stat-label">Your Stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.raters.length}</div>
          <div className="stat-label">Total Ratings Received</div>
        </div>
      </div>

      {data.stores.length === 0 ? (
        <div className="card"><p>No stores are assigned to your account yet.</p></div>
      ) : (
        <>
          <h2>Your Stores</h2>
          <div className="store-grid">
            {data.stores.map((s) => (
              <div key={s.id} className="store-card">
                <h3>{s.name}</h3>
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

          <h2>Users Who Rated Your Stores</h2>
          <DataTable columns={raterColumns} rows={data.raters} initialSort={{ key: 'updated_at', dir: 'desc' }} />
        </>
      )}
    </div>
  );
}
