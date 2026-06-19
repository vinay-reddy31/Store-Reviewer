import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';

const ROLE_LABEL = { admin: 'System Administrator', user: 'Normal User', owner: 'Store Owner' };
const ROLE_CLASS = { admin: 'role-admin', user: 'role-user', owner: 'role-owner' };

function initials(name = '') {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'U';
}

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user.'));
  }, [id]);

  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!user)
    return (
      <div className="page">
        <div className="loading-wrap">
          <span className="loader" /> Loading…
        </div>
      </div>
    );

  return (
    <div className="page">
      <Link to="/admin/users" className="back-link">← Back to users</Link>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className="avatar" style={{ width: 56, height: 56, fontSize: '1.2rem' }}>
          {initials(user.name)}
        </span>
        <div>
          <h1 style={{ fontSize: '1.4rem', margin: 0 }}>{user.name}</h1>
          <span className={`badge-role ${ROLE_CLASS[user.role]}`} style={{ marginTop: 6, display: 'inline-block' }}>
            {ROLE_LABEL[user.role]}
          </span>
        </div>
      </div>

      <div className="card detail-card">
        <div className="detail-row"><span>Email</span><strong>{user.email}</strong></div>
        <div className="detail-row"><span>Address</span><strong>{user.address || '—'}</strong></div>
        <div className="detail-row"><span>Role</span><strong>{ROLE_LABEL[user.role]}</strong></div>
        {user.role === 'owner' && (
          <div className="detail-row">
            <span>Store Rating</span>
            <strong>{user.rating ?? 'No ratings yet'}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
