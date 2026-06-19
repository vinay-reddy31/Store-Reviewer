import { useEffect, useState, useCallback } from 'react';
import api from '../../api/client';
import StarRating from '../../components/StarRating';
import { IconSearch, IconStore } from '../../components/Icons';

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { sortBy: sort.sortBy, order: sort.order };
      if (search.name) params.name = search.name;
      if (search.address) params.address = search.address;
      const { data } = await api.get('/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => setSearch({ ...search, [e.target.name]: e.target.value });

  const rate = async (storeId, rating) => {
    setMessage('');
    setError('');
    try {
      await api.post(`/stores/${storeId}/ratings`, { rating });
      setMessage('Your rating has been saved.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">
          <h1>Discover stores</h1>
          <p>Browse every registered store and share your rating.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="filters">
        <span className="search-field">
          <IconSearch size={16} />
          <input name="name" placeholder="Search by name" value={search.name} onChange={handleSearch} />
        </span>
        <span className="search-field">
          <IconSearch size={16} />
          <input
            name="address"
            placeholder="Search by address"
            value={search.address}
            onChange={handleSearch}
          />
        </span>
        <select
          value={`${sort.sortBy}:${sort.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split(':');
            setSort({ sortBy, order });
          }}
        >
          <option value="name:asc">Name (A–Z)</option>
          <option value="name:desc">Name (Z–A)</option>
          <option value="rating:desc">Rating (High–Low)</option>
          <option value="rating:asc">Rating (Low–High)</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-wrap">
          <span className="loader" /> Loading stores…
        </div>
      ) : stores.length === 0 ? (
        <div className="card">
          <p className="muted">No stores found.</p>
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-card-head">
                <span className="store-logo">{store.name.charAt(0)}</span>
                <h3>{store.name}</h3>
              </div>
              <p className="store-address">
                <IconStore size={14} /> {store.address}
              </p>
              <div className="store-rating-row">
                <span className="label">Overall</span>
                <StarRating value={Number(store.rating)} readOnly />
                <span className="rating-number">
                  {Number(store.rating).toFixed(2)} ({store.rating_count})
                </span>
              </div>
              <div className="store-rating-row">
                <span className="label">Your rating</span>
                {store.user_rating ? (
                  <span className="your-rating">{store.user_rating} / 5</span>
                ) : (
                  <span className="muted">Not rated yet</span>
                )}
              </div>
              <div className="store-action">
                <span className="label">
                  {store.user_rating ? 'Modify:' : 'Rate:'}
                </span>
                <StarRating value={store.user_rating || 0} onChange={(n) => rate(store.id, n)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
