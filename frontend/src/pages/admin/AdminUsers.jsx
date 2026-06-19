import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import DataTable from '../../components/DataTable';
import { IconPlus, IconSearch } from '../../components/Icons';

const ROLE_LABEL = { admin: 'Admin', user: 'Normal User', owner: 'Store Owner' };
const ROLE_CLASS = { admin: 'role-admin', user: 'role-user', owner: 'role-owner' };

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
    {
      key: 'role',
      label: 'Role',
      render: (r) => <span className={`badge-role ${ROLE_CLASS[r.role]}`}>{ROLE_LABEL[r.role]}</span>,
    },
    {
      key: 'rating',
      label: 'Owner Rating',
      render: (r) => (r.role === 'owner' ? (r.rating ?? '—') : '—'),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">
          <h1>Users</h1>
          <p>Manage all administrators, normal users and store owners.</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">
          <IconPlus size={16} /> Add User
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters">
        <span className="search-field">
          <IconSearch size={16} />
          <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilter} />
        </span>
        <span className="search-field">
          <IconSearch size={16} />
          <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilter} />
        </span>
        <span className="search-field">
          <IconSearch size={16} />
          <input
            name="address"
            placeholder="Filter by address"
            value={filters.address}
            onChange={handleFilter}
          />
        </span>
        <select name="role" value={filters.role} onChange={handleFilter}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-wrap">
          <span className="loader" /> Loading users…
        </div>
      ) : (
        <DataTable columns={columns} rows={users} initialSort={{ key: 'name', dir: 'asc' }} />
      )}
    </div>
  );
}
