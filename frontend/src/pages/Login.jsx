import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconStar, IconCheck, IconArrowRight } from '../components/Icons';

const HOME_BY_ROLE = { admin: '/admin', user: '/stores', owner: '/owner' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(HOME_BY_ROLE[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
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
          <h2>Welcome back to your dashboard.</h2>
          <p>
            Sign in to rate stores, track your reputation, or manage the platform — all from one
            place.
          </p>
          <ul className="auth-points">
            <li><span className="tick"><IconCheck size={15} /></span> Secure, role-based access</li>
            <li><span className="tick"><IconCheck size={15} /></span> Real-time ratings & insights</li>
            <li><span className="tick"><IconCheck size={15} /></span> Clean, fast experience</li>
          </ul>
        </div>
        <p className="auth-aside-foot">Trusted store ratings, made simple.</p>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <Link to="/" className="brand brand-mobile">
            <span className="brand-mark">
              <IconStar size={18} />
            </span>
            Store Rating
          </Link>
          <h1>Sign in</h1>
          <p className="auth-sub">Enter your credentials to continue</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              Email address
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
            <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <span className="loader" /> : <>Sign in <IconArrowRight size={18} /></>}
            </button>
          </form>

          <p className="auth-footer">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
