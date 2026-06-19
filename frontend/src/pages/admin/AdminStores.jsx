import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;
      const { data } = await api.get('/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const columns = [
    { key: 'name', label: 'Store Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    {
      key: 'rating',
      label: 'Rating',
      render: (r) => (
        <span className="rating-cell">
          <StarRating value={Number(r.rating)} readOnly />
          <span className="rating-number">{Number(r.rating).toFixed(2)}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Stores</h1>
        <Link to="/admin/stores/new" className="btn btn-primary">
          + Add Store
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters">
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilter} />
        <input
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleFilter}
        />
      </div>

      {loading ? <p>Loading...</p> : <DataTable columns={columns} rows={stores} initialSort={{ key: 'name', dir: 'asc' }} />}
    </div>
  );
}
