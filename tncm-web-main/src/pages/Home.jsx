import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../index.css';

const Home = () => {
    return (
        <div className="home-page-wrapper">
            {/* SEO */}
            <SEO
                title="Home"
                description="nuttychocomorsels - Premium Bakery Delights in Gandhinagar. Freshly baked eggless brownies, cheesecakes, and artisanal chocolates delivered to your doorstep."
                keywords="bakery, Gandhinagar, eggless brownies, cheesecakes, luxury chocolates, home delivery"
            />

            {/* HERO SECTION */}
            <div className="hero-section">
                <img
                    src="https://plus.unsplash.com/premium_photo-1681826507324-0b3c43928753?q=80&w=1169&auto=format&fit=crop"
                    alt="Premium bakery products - fresh cookies, brownies, cheesecakes from nuttychocomorsels"
                    className="hero-image"
                />
                <div className="hero-content">
                    <h1 className="main-title">nuttychocomorsels - Premium Bakery Delights</h1>
                    <p className="sub-text">Experience the taste of luxury in Gandhinagar - 100% Eggless Bakery</p>
                </div>
            </div>

            {/* FEATURES SECTION (Why nuttychocomorsels?) */}
            <section className="features-section" style={{ padding: '15px 5% 40px', background: '#fff' }}>
                <h2 className="responsive-title">Why nuttychocomorsels?</h2>
                <div className="features-grid">
                    <div className="feature-box" style={{ border: '2px solid #5D2E17', boxShadow: '0 4px 10px rgba(139, 69, 19, 0.15)', borderRadius: '10px', background: 'white' }}>
                        <i className="fa-solid fa-leaf"></i>
                        <h3>100% Eggless</h3>
                        <p>Pure vegetarian treats baked to perfection.</p>
                    </div>
                    <div className="feature-box" style={{ border: '2px solid #5D2E17', boxShadow: '0 4px 10px rgba(139, 69, 19, 0.2)', borderRadius: '10px', background: 'white' }}>
                        <i className="fa-solid fa-cookie-bite"></i>
                        <h3>Premium Quality</h3>
                        <p>Made from Premium quality chocolate & handpicked nuts.</p>
                    </div>
                    <div className="feature-box" style={{ border: '2px solid #5D2E17', boxShadow: '0 4px 10px rgba(139, 69, 19, 0.2)', borderRadius: '10px', background: 'white' }}>
                        <i className="fa-solid fa-truck-fast"></i>
                        <h3>Freshly Baked</h3>
                        <p>Oven-fresh goodness , delivered to your doorstep.</p>
                    </div>
                    <div className="feature-box" style={{ border: '2px solid #5D2E17', boxShadow: '0 4px 10px rgba(139, 69, 19, 0.2)', borderRadius: '10px', background: 'white' }}>
                        <i className="fa-solid fa-heart"></i>
                        <h3>Made with Love</h3>
                        <p>Crafted by passion, served with sweetness.</p>
                    </div>
                </div>
            </section>

            {/* EXPLORE MENU SECTION */}
            <h2 className="section-title" style={{ marginBottom: '10px' }}>Explore Our Menu</h2>
            <div className="grid" style={{ paddingTop: '10px' }}>
                <div className="cat-card">
                    <Link to="/menu?cat=brownie" style={{ textDecoration: 'none' }}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdBW4W-3x_osH5jYgOQR69xyqjhHjE2xH1Ag&s" className="cat-img" alt="Brownies" />
                        <div className="cat-title">Brownies</div>
                    </Link>
                </div>
                <div className="cat-card">
                    <Link to="/menu?cat=cookie" style={{ textDecoration: 'none' }}>
                        <img src="https://media.istockphoto.com/id/187957173/photo/chocolate-chip-cookies-on-linen-napkin-wooden-table.jpg?s=2048x2048&w=is&k=20&c=n35CcgX1M2HUCH0VfSfZ-BqCQtTrswi3MuhPhTVWiJc=" className="cat-img" alt="Cookies" />
                        <div className="cat-title">Cookies</div>
                    </Link>
                </div>
                <div className="cat-card">
                    <Link to="/menu?cat=cheesecake" style={{ textDecoration: 'none' }}>
                        <img src="https://ik.imagekit.io/auwbv7fp3/cheezcake.png" className="cat-img" alt="Cheesecakes" />
                        <div className="cat-title">Cheesecakes</div>
                    </Link>
                </div>
                <div className="cat-card">
                    <Link to="/menu?cat=muffin" style={{ textDecoration: 'none' }}>
                        <img src="https://www.allrecipes.com/thmb/i9KCEbxUGQ1Sa4F7Gts7SGBOpoM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/157877-vanilla-cupcakes-ddmfs-4X3-0397-59653731be1d4769969698e427d7f5bc.jpg" className="cat-img" alt="Muffins & Cupcakes" />
                        <div className="cat-title">Muffins & Cupcakes</div>
                    </Link>
                </div>
                <div className="cat-card">
                    <Link to="/menu?cat=chocolate" style={{ textDecoration: 'none' }}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjhFzo66ZKUtklpwPn5glVmIzXez9gSOkvbg&s" className="cat-img" alt="Dubai Viral Chocolates" />
                        <div className="cat-title">Dubai Viral Chocolates</div>
                    </Link>
                </div>
            </div>

            {/* FOOTER PUSH - To ensure spacing before footer layout */}
            <div style={{ paddingBottom: '30px' }}></div>
        </div>
    );
};

export default Home;