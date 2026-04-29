import React, { useEffect } from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const About = () => {
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page-container" style={{ overflow: 'hidden' }}>
            <SEO
                title="Our Story & Mission"
                description="Learn about Nutty Choco Morsels - our mission to bring luxury bakery delights to Gandhinagar. Meet our founders Shrikant and Mihir."
                keywords="about us, bakery mission, Gandhinagar bakery founders, artisanal bakery story"
            />

            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>Our Story</h1>
                    <p>Crafting luxury delights in the heart of Gandhinagar since inception.</p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-section about-text">
                <h2>Our Mission</h2>
                <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
                    Founded with a passion for excellence, <strong>Nutty Choco Morsels</strong> was born from a simple dream: to make premium, luxury bakery delights accessible to all. We believe every bite should be a celebration—a harmonious blend of the finest ingredients, meticulous craftsmanship, and pure passion.
                </p>
                <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    We are on a journey to redefine indulgence, offering everything from our signature melt-in-the-mouth brownies to the latest viral sensations like Dubai-style chocolates. Our commitment is to quality, innovation, and spreading happiness through sweetness.
                </p>
            </section>

            {/* Core Values */}
            <section className="about-section">
                <h2 className="section-title">Why Choose Us?</h2>
                <div className="values-grid">
                    <div className="value-item">
                        <i className="fas fa-gem value-icon"></i>
                        <h3>Luxury Quality</h3>
                        <p>We use only premium ingredients to ensure a world-class taste in every bite.</p>
                    </div>
                    <div className="value-item">
                        <i className="fas fa-leaf value-icon"></i>
                        <h3>Always Fresh</h3>
                        <p>Our products are baked fresh daily, ensuring the highest standards of freshness.</p>
                    </div>
                    <div className="value-item">
                        <i className="fas fa-lightbulb value-icon"></i>
                        <h3>Innovation</h3>
                        <p>From classic recipes to viral trends, we constantly innovate our menu.</p>
                    </div>
                    <div className="value-item">
                        <i className="fas fa-heart value-icon"></i>
                        <h3>Handcrafted</h3>
                        <p>Every delight is handcrafted with love and attention to detail.</p>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="about-section">
                <h2 className="section-title">Meet the Visionaries</h2>
                <div className="founders-grid">
                    <div className="founder-card">
                        <div className="founder-img-wrapper">
                            <img src="/assets/images/shrikant.jpg" alt="Shrikant Limbachiya" className="founder-img" />
                        </div>
                        <h3 className="founder-name">Shrikant Limbachiya</h3>
                        <p className="founder-role">Co-Founder & Head Chef</p>
                        <p className="founder-desc">Shrikant leads our culinary innovation, bringing years of expertise to every recipe. He ensures that every product leaving our kitchen meets the "luxury" standard we promise.</p>
                    </div>

                    <div className="founder-card">
                        <div className="founder-img-wrapper">
                            <img src="/assets/images/mihir.jpg" alt="Mihirkumar Patel" className="founder-img" />
                        </div>
                        <h3 className="founder-name">Mihirkumar Patel</h3>
                        <p className="founder-role">Co-Founder & Business Head</p>
                        <p className="founder-desc">Mihirkumar is the driving force behind our operations and strategy. His vision is to make NCM the most loved bakery destination in the region through exceptional service.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Indulge?</h2>
                <p>Explore our menu and find your next favorite delight.</p>
                <Link to="/menu" className="cta-btn">View Full Menu</Link>
            </section>
        </div>
    );
};

export default About;