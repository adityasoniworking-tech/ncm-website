import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={styles.overlay} onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={styles.iconContainer}>
                            <i className="fa-solid fa-power-off" style={styles.icon}></i>
                        </div>

                        <h2 style={styles.title}>Secure Sign Out</h2>
                        <p style={styles.subtitle}>Are you sure you want to exit the Admin Hub? Your session will be securely terminated.</p>

                        <div style={styles.buttonContainer}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                style={styles.cancelBtn}
                            >
                                Stay Signed In
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02, background: '#f59e0b' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                style={styles.logoutBtn}
                            >
                                Sign Out Now
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    modal: {
        background: '#1e293b',
        borderRadius: '32px',
        width: '100%',
        maxWidth: '420px',
        padding: '48px 32px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
    },
    iconContainer: {
        width: '80px',
        height: '80px',
        background: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 24px',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        rotate: '45deg'
    },
    icon: {
        fontSize: '2rem',
        color: '#f59e0b',
        rotate: '-45deg'
    },
    title: {
        margin: '0 0 12px',
        fontSize: '1.8rem',
        fontWeight: '900',
        color: 'white',
        letterSpacing: '-0.025em'
    },
    subtitle: {
        margin: '0 0 32px',
        color: '#94a3b8',
        fontSize: '1rem',
        lineHeight: '1.6',
        fontWeight: '500'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    logoutBtn: {
        padding: '16px',
        borderRadius: '16px',
        border: 'none',
        background: '#f59e0b',
        color: '#0f172a',
        fontSize: '1rem',
        fontWeight: '800',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)'
    },
    cancelBtn: {
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    }
};

export default LogoutModal;
