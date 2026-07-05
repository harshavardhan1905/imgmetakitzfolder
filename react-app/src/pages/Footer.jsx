import React from 'react';
import '../assets/css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Brand & Description */}
        <div className="footer-section brand-section">
          <h2>MyLogo</h2>
          <p>Building wonderful experiences and sharing knowledge on the web.</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-section links-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Social Links (Using your existing #social rules) */}
        <div className="footer-section social-section" id="social">
          <h3>Connect</h3>
          <div className="social-icons">
            {/* Replace the text inside with actual SVG icons (like FontAwesome or Heroicons) */}
            <a href="#" className="button-icon" aria-label="Instagram">IG</a>
            <a href="#" className="button-icon" aria-label="LinkedIn">IN</a>
            <a href="#" className="button-icon" aria-label="GitHub">GH</a>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} MyLogo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;