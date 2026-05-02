import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="main-footer">
            <div className="footer-main-container">
                {/* Left Column: Brand & Social */}
                <div className="footer-left-brand">
                    <Link to="/" className="footer-logo">
                        <img src="/assets/images/logo.png" alt="Logo" />
                        <span className="hide-on-mobile">nuttychocomorsels</span>
                    </Link>
                    <p className="footer-description">
                        Crafting premium bakery delights with the finest ingredients and a touch of love since 2024.
                    </p>
                    
                    <div className="footer-social-section">
                        <div className="social-icons">
                            <a href="https://www.instagram.com/nuttychocomorsels" target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <Link to="/whatsapp-select" className="wa-bg">
                                <i className="fa-brands fa-whatsapp"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Columns: Links & Contact */}
                <div className="footer-right-links">
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <Link to="/">Home</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/menu">Menu</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>
                    <div className="footer-col">
                        <h3>Contact Info</h3>
                        <p><i className="fa-solid fa-phone"></i> +91 9978744573</p>
                        <p><i className="fa-solid fa-envelope"></i> thenuttychocomorsels@gmail.com</p>
                        <p><i className="fa-solid fa-location-dot"></i> Swarnim Park, Gandhinagar, 382016</p>
                    </div>
                </div>
            </div>
            <div className="copyright">
                &copy; {currentYear} nuttychocomorsels.<br className="mobile-copyright-break" /> All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
