import React, { useEffect } from 'react';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';

const WhatsAppSelect = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="contact-page" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SEO
                title="Select WhatsApp Contact | Nutty Choco Morsels"
                description="Choose a founder to contact on WhatsApp for orders or support from The Nutty Choco Morsels."
                keywords="whatsapp contact, bakery support, order inquiry Gandhinagar"
            />
            
            <div className="contact-hero" style={{ paddingBottom: '20px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ fontSize: '2.5rem' }}
                >
                    Connect with Founders
                </motion.h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Choose the right person to get the fastest assistance for your needs.
                </p>
            </div>

            <div className="contact-grid-premium" style={{ gridTemplateColumns: '1fr', maxWidth: '1000px', width: '95%' }}>
                <motion.div 
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >

                    {/* Shrikant Card */}
                    <a
                        href="https://wa.me/919978744573?text=Hello%2C%20Shrikant.%20I%20have%20a%20query%20regarding%20menu%20items%20or%20support."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-card-premium"
                        style={{ textDecoration: 'none', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px' }}
                    >
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <img
                                src="/assets/images/shrikant.jpg"
                                alt="Shrikant"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', padding: '3px' }}
                            />
                            <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#25d366', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '3px solid white', fontSize: '0.8rem' }}>
                                <i className="fa-brands fa-whatsapp" style={{ margin: 'auto' }}></i>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.3rem', color: '#333' }}>Shrikant Limbachiya</h3>
                        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>Menu & General Support</p>
                        <div style={{ background: '#25d366', color: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             Chat Now
                        </div>
                    </a>

                    {/* Mihir Card */}
                    <a
                        href="https://wa.me/919974565391?text=Hello%2C%20Mihirkumar.%20I%20have%20an%20inquiry%20regarding%20orders%20and%20business."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-card-premium"
                        style={{ textDecoration: 'none', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px' }}
                    >
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <img
                                src="/assets/images/mihir.jpg"
                                alt="Mihir"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', padding: '3px' }}
                            />
                            <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#25d366', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '3px solid white', fontSize: '0.8rem' }}>
                                <i className="fa-brands fa-whatsapp" style={{ margin: 'auto' }}></i>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.3rem', color: '#333' }}>Mihirkumar Patel</h3>
                        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>Orders & Business Inquiries</p>
                        <div style={{ background: '#25d366', color: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             Chat Now
                        </div>
                    </a>
                </motion.div>
            </div>

            <p style={{ marginTop: '40px', fontSize: '0.9rem', color: '#999', textAlign: 'center', maxWidth: '500px', padding: '0 20px' }}>
                Choosing the relevant person ensures you get quick and accurate assistance.
            </p>
        </div>
    );
};

export default WhatsAppSelect;

