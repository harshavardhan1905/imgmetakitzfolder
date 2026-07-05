import React from 'react';
import '../assets/css/Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo or Brand Name */}
        <div className="brand">
          <a href="/">MyLogo</a>
        </div>

        {/* Navigation Links */}
        <nav className="site-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        {/* Action Buttons (e.g., Auth or CTA) */}
        <div className="header-actions">
          <button className="btn-login">Log In</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;