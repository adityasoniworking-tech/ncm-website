import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Offline = () => {
    return (
        <div style={styles.container}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={styles.card}
            >
                <div style={styles.iconContainer}>
                    <i className="fa-solid fa-wifi-slash" style={styles.icon}></i>
                </div>
                <h1 style={styles.title}>You're Offline</h1>
                <p style={styles.message}>
                    It looks like your internet is taking a break. Don't worry, your cravings are safe with us!
                </p>
                <div style={styles.suggestion}>
                    Check your connection and try again.
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={styles.retryBtn}
                >
                    Retry Connection
                </button>
                <Link to="/" style={styles.homeLink}>
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fffaff',
        padding: '20px'
    },
    card: {
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        background: 'white',
        padding: '40px 30px',
        borderRadius: '30px',
        boxShadow: '0 20px 40px rgba(107, 15, 26, 0.08)',
        border: '1px solid #fff0f0'
    },
    iconContainer: {
        width: '80px',
        height: '80px',
        background: '#fff0f0',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 25px',
        color: '#6b0f1a'
    },
    icon: {
        fontSize: '2rem'
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '900',
        color: '#1a1a1a',
        margin: '0 0 10px'
    },
    message: {
        fontSize: '1rem',
        color: '#666',
        lineHeight: '1.5',
        margin: '0 0 20px'
    },
    suggestion: {
        fontSize: '0.85rem',
        color: '#999',
        marginBottom: '30px',
        fontWeight: '500'
    },
    retryBtn: {
        width: '100%',
        padding: '16px',
        background: '#6b0f1a',
        color: 'white',
        border: 'none',
        borderRadius: '15px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '15px',
        boxShadow: '0 10px 20px rgba(107, 15, 26, 0.2)'
    },
    homeLink: {
        display: 'block',
        color: '#6b0f1a',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600'
    }
};

export default Offline;
