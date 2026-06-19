import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
} from '../../utils/validation';

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
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
      await api.post('/users', form);
      navigate('/admin/users');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Link to="/admin/users" className="back-link">← Back to users</Link>
      <div className="page-title" style={{ marginBottom: '1.25rem' }}>
        <h1>Add User</h1>
        <p>Create an administrator, normal user or store owner.</p>
      </div>
      <div className="card form-card">
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Name <span className="hint">(20-60 characters)</span>
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
            Password <span className="hint">(8-16, 1 uppercase, 1 special)</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">System Administrator</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Create User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
