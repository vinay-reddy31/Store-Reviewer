import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import DataTable from '../../components/DataTable';

const ROLE_LABEL = { admin: 'Admin', user: 'Normal User', owner: 'Store Owner' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const { data } = await api.get('/users', { params });
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (r) => <Link to={`/admin/users/${r.id}`}>{r.name}</Link>,
    },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role', render: (r) => ROLE_LABEL[r.role] || r.role },
    {
      key: 'rating',
      label: 'Rating (Owner)',
      render: (r) => (r.role === 'owner' ? (r.rating ?? 'No ratings') : '—'),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
        <Link to="/admin/users/new" className="btn btn-primary">
          + Add User
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters">
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilter} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilter} />
        <input
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleFilter}
        />
        <select name="role" value={filters.role} onChange={handleFilter}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : <DataTable columns={columns} rows={users} initialSort={{ key: 'name', dir: 'asc' }} />}
    </div>
  );
}
