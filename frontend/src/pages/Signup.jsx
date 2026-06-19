import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconStar, IconCheck, IconArrowRight } from '../components/Icons';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
} from '../utils/validation';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
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
      await signup(form);
      navigate('/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <IconStar size={20} />
          </span>
          Store Rating
        </Link>
        <div className="auth-aside-body">
          <h2>Join thousands rating their favourite stores.</h2>
          <p>
            Create a free account in seconds and start sharing your honest ratings with the
            community.
          </p>
          <ul className="auth-points">
            <li><span className="tick"><IconCheck size={15} /></span> Rate any store from 1 to 5</li>
            <li><span className="tick"><IconCheck size={15} /></span> Update your ratings anytime</li>
            <li><span className="tick"><IconCheck size={15} /></span> Free, forever</li>
          </ul>
        </div>
        <p className="auth-aside-foot">Your opinion helps others choose better.</p>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <Link to="/" className="brand brand-mobile">
            <span className="brand-mark">
              <IconStar size={18} />
            </span>
            Store Rating
          </Link>
          <h1>Create your account</h1>
          <p className="auth-sub">Register as a normal user</p>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <label>
              Full name <span className="hint">(20–60 characters)</span>
              <input
                name="name"
                placeholder="Your full legal name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label>
              Email address
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>
            <label>
              Address <span className="hint">(max 400 characters)</span>
              <textarea
                name="address"
                placeholder="Your address"
                value={form.address}
                onChange={handleChange}
                rows={2}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </label>
            <label>
              Password <span className="hint">(8–16, 1 uppercase, 1 special)</span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </label>
            <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <span className="loader" /> : <>Create account <IconArrowRight size={18} /></>}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
