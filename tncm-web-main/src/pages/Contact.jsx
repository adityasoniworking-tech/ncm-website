import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import { motion } from "framer-motion";

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="contact-page">
            <SEO
                title="Contact Us | nuttychocomorsels"
                description="Get in touch with nuttychocomorsels in Gandhinagar. Contact us for bulk orders, customized gift boxes, and artisanal brownies."
                keywords="contact bakery Gandhinagar, brownie order Gandhinagar, nuttychocomorsels contact"
            />

            <div className="contact-hero">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    Let's Connect
                </motion.h1>
                <p style={{ color: "#666", fontSize: "1.1rem" }}>
                    Craving something sweet or have a special request? We're just a message away.
                </p>
            </div>

            <div className="contact-grid-premium" style={{ gridTemplateColumns: '1fr', maxWidth: '800px' }}>
                {/* Centered: Contact Info */}
                <motion.div 
                    className="contact-info-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    <motion.div className="info-card-premium" variants={fadeInUp}>
                        <div className="info-icon-box">
                            <i className="fa-solid fa-phone"></i>
                        </div>
                        <div className="info-content">
                            <h3>Call Us Directly</h3>
                            <p>Available 10 AM - 9 PM</p>
                            <a href="tel:+919978744573">+91 99787 44573</a><br/>
                            <a href="tel:+919974565391">+91 99745 65391</a>
                        </div>
                    </motion.div>

                    <motion.div className="info-card-premium" variants={fadeInUp}>
                        <div className="info-icon-box">
                            <i className="fa-brands fa-whatsapp"></i>
                        </div>
                        <div className="info-content">
                            <h3>WhatsApp Support</h3>
                            <p>Fastest way to get your answers</p>
                            <Link to="/whatsapp-select" style={{ color: "var(--primary)", fontWeight: "600" }}>
                                Start Chatting →
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div className="info-card-premium" variants={fadeInUp}>
                        <div className="info-icon-box">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div className="info-content">
                            <h3>Email Inquiries</h3>
                            <p>For corporate orders and collaborations</p>
                            <a href="mailto:thenuttychocomorsels@gmail.com">thenuttychocomorsels@gmail.com</a>
                        </div>
                    </motion.div>

                    <motion.div className="info-card-premium" variants={fadeInUp}>
                        <div className="info-icon-box">
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div className="info-content">
                            <h3>Visit Our Store</h3>
                            <p>
                                nuttychocomorsels, SWAGAT AFFORD, <br/>
                                Swagat Queensland Rd, Sargasan, <br/>
                                Gandhinagar, Gujarat 382421
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="info-card-premium" variants={fadeInUp}>
                        <div className="info-icon-box">
                            <i className="fa-brands fa-instagram"></i>
                        </div>
                        <div className="info-content">
                            <h3>Follow Us</h3>
                            <p>Sneak peeks at our latest creations</p>
                            <a href="https://instagram.com/nuttychocomorsels" target="_blank" rel="noreferrer">
                                @nuttychocomorsels
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>


            {/* Map Section */}
            <motion.div 
                className="map-section-premium"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: "800" }}>Find Us In Gandhinagar</h2>
                    <p style={{ color: "#666" }}>Come visit us and smell the fresh-baked goodness!</p>
                </div>
                <div className="map-container-premium">
                    <iframe 
                        title="Bakery Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.067341071485!2d72.6191915!3d23.1917174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2b41c92a05b7%3A0xd2aab4fbd4b909d0!2sNutty%20Choco%20Morsels!5e0!3m2!1sen!2sin!4v1714380000000!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy"
                    ></iframe>
                </div>

            </motion.div>
        </div>
    );
};

export default Contact;