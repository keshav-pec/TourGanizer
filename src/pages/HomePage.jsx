import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="landing-page">
      {/* Landing Navbar */}
      <nav className="landing-navbar">
        <div className="landing-nav-brand">
          <Link to="/" className="logo">
            <span className="logo-text">TourGanizer</span>
          </Link>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-secondary">Get Started</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Organize Tournaments
            <br />
            <span className="highlight">With Confidence</span>
          </h1>
          <p className="hero-description">
            The all-in-one platform for tournament organizers. Manage registrations,
            generate draws, track results, and publish standings — all in real-time.
          </p>
          <div className="hero-cta">
            <Link to="/login" className="btn btn-primary btn-large">
              Start Organizing
            </Link>
            <Link to="/tournaments" className="btn btn-secondary btn-large">
              View Demo Tournament
            </Link>
          </div>
          <p className="hero-note">✨ Organize Tournaments at Affordable Prices</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything you need to run professional tournaments</h2>
          {/* <p>Trusted by debate organizers, competition coordinators, and event managers worldwide</p> */}
        </div>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">⚙️</div>
            <h3>Easy Setup</h3>
            <p>Create your tournament in minutes. Add teams, set rules, and you're ready to go.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h3>Smart Draw Generation</h3>
            <p>Automated pairing algorithms with conflict resolution, power matching, and bracket management.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Standings</h3>
            <p>Live leaderboards and rankings updated instantly as results come in. Keep everyone informed.</p>
          </div>
          {/* <div className="feature-item">
            <div className="feature-icon">👥</div>
            <h3>Team Management</h3>
            <p>Handle registrations, track participants, manage conflicts, and communicate with teams effortlessly.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚖️</div>
            <h3>Adjudicator Allocation</h3>
            <p>Assign judges intelligently based on conflicts, experience, and availability.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <h3>Mobile-Friendly</h3>
            <p>Access your tournament dashboard anywhere. Judges and teams can check schedules on the go.</p>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to organize your next tournament?</h2>
          <p>Join hundreds of organizers who trust TourGanizer for their events</p>
          <Link to="/login" className="btn btn-primary btn-large">Get Started Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span >TourGanizer</span>
            </div>
            <p>Professional tournament management made simple</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <Link to="#">Features</Link>
              <Link to="#">Pricing</Link>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Documentation</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 TourGanizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
