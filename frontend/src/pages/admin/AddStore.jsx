import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { validateEmail, validateAddress } from '../../utils/validation';

export default function AddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load store-owner users to optionally assign as the store's owner.
    api
      .get('/users', { params: { role: 'owner' } })
      .then((res) => setOwners(res.data.users))
      .catch(() => setOwners([]));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {
      name: form.name.trim() ? '' : 'Store name is required.',
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
        ownerId: form.ownerId ? Number(form.ownerId) : null,
      };
      await api.post('/stores', payload);
      navigate('/admin/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Add Store</h1>
      <div className="card form-card">
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Store Name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Address <span className="hint">(max 400 characters)</span>
            <textarea name="address" value={form.address} onChange={handleChange} rows={3} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </label>
          <label>
            Owner <span className="hint">(optional)</span>
            <select name="ownerId" value={form.ownerId} onChange={handleChange}>
              <option value="">No owner</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Create Store'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/stores')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
