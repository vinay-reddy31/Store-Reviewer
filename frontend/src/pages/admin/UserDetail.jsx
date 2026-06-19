import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';

const ROLE_LABEL = { admin: 'System Administrator', user: 'Normal User', owner: 'Store Owner' };

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
  if (!user) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <Link to="/admin/users" className="back-link">← Back to users</Link>
      <h1>User Details</h1>
      <div className="card detail-card">
        <div className="detail-row"><span>Name</span><strong>{user.name}</strong></div>
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
