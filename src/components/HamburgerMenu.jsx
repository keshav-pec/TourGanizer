import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HamburgerMenu({ navCenterItems, navActionItems }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className={`hamburger-menu ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-text">TourGanizer</span>
          </Link>
        </div>

        <div className="mobile-menu-content">
          {/* Navigation Center Items */}
          {navCenterItems && navCenterItems.length > 0 && (
            <div className="mobile-menu-section">
              <h4>Navigation</h4>
              {navCenterItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className={`nav-btn ${item.isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Action Items */}
          {navActionItems && navActionItems.length > 0 && (
            <div className="mobile-menu-section">
              <h4>Actions</h4>
              {navActionItems.map((item, index) => (
                item.type === 'button' ? (
                  <button
                    key={index}
                    className={item.className || 'btn btn-secondary'}
                    onClick={() => {
                      closeMenu()
                      if (item.onClick) item.onClick()
                    }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={item.to}
                    className={item.className || 'btn btn-secondary'}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
