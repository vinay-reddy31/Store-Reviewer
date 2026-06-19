import { Link } from 'react-router-dom';
import {
  IconStar,
  IconShield,
  IconStore,
  IconUsers,
  IconChart,
  IconSearch,
  IconArrowRight,
  IconCheck,
  IconBolt,
} from '../components/Icons';

function Logo() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark">
        <IconStar size={20} />
      </span>
      Store Rating
    </Link>
  );
}

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <Logo />
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-ghost">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Get started <IconArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <span className="badge">
          <IconBolt size={14} /> Rate. Discover. Decide.
        </span>
        <h1>
          The smartest way to <span className="gradient-text">rate the stores</span> you love
        </h1>
        <p className="hero-sub">
          A single platform where customers share 1–5 star ratings, store owners track their
          reputation, and administrators manage everything — all in one beautifully simple place.
        </p>
        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create free account <IconArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign in
          </Link>
        </div>
        <p className="hero-trust">No credit card required · Three roles · Secure by design</p>
      </header>

      {/* Preview */}
      <div className="hero-preview">
        <div className="preview-card">
          <div className="preview-bar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-stats">
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon si-indigo">
                  <IconUsers />
                </div>
              </div>
              <div className="stat-value">14</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon si-emerald">
                  <IconStore />
                </div>
              </div>
              <div className="stat-value">8</div>
              <div className="stat-label">Total Stores</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon si-amber">
                  <IconStar />
                </div>
              </div>
              <div className="stat-value">31</div>
              <div className="stat-label">Ratings Submitted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features by role */}
      <section className="section" id="features">
        <div className="section-head">
          <span className="eyebrow">Built for everyone</span>
          <h2>One login, three tailored experiences</h2>
          <p>
            Every role gets exactly the tools they need — no clutter, no confusion, just a clean
            experience designed around what matters.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon fi-indigo">
              <IconShield />
            </div>
            <h3>System Administrator</h3>
            <p>Full control over the platform from a single dashboard.</p>
            <ul className="feature-list">
              <li><IconCheck size={16} /> Live counts of users, stores & ratings</li>
              <li><IconCheck size={16} /> Add stores and users of any role</li>
              <li><IconCheck size={16} /> Filter & sort every listing instantly</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon fi-emerald">
              <IconStar />
            </div>
            <h3>Normal User</h3>
            <p>Find great stores and share your honest opinion.</p>
            <ul className="feature-list">
              <li><IconCheck size={16} /> Browse & search every registered store</li>
              <li><IconCheck size={16} /> Submit and update 1–5 star ratings</li>
              <li><IconCheck size={16} /> See overall and your own rating side by side</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon fi-amber">
              <IconChart />
            </div>
            <h3>Store Owner</h3>
            <p>Understand your reputation and who's rating you.</p>
            <ul className="feature-list">
              <li><IconCheck size={16} /> Track your average rating over time</li>
              <li><IconCheck size={16} /> See every customer who rated your store</li>
              <li><IconCheck size={16} /> Manage your account securely</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon fi-indigo">
              <IconSearch />
            </div>
            <h3>Powerful search & filters</h3>
            <p>
              Find any store by name or address and sort every table ascending or descending in a
              single click.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon fi-emerald">
              <IconShield />
            </div>
            <h3>Secure by design</h3>
            <p>
              JWT-based authentication, hashed passwords, role-based access control and validated
              inputs at every layer.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon fi-amber">
              <IconBolt />
            </div>
            <h3>Fast & responsive</h3>
            <p>
              A modern React interface that feels instant on desktop and mobile, built for a smooth
              experience everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-band">
        <div className="cta-inner">
          <h2>Ready to start rating?</h2>
          <p>Join the platform in seconds and help others discover the best stores around.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get started for free <IconArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <Logo />
          <span>© {new Date().getFullYear()} Store Rating Platform. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
