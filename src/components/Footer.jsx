import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <span>TourGanizer</span>
          </div>
          <p>Professional tournament management made simple</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/">Features</Link>
            <Link to="/">Pricing</Link>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <a href="/">Documentation</a>
            <a href="/">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 TourGanizer. All rights reserved.</p>
      </div>
    </footer>
  )
}
