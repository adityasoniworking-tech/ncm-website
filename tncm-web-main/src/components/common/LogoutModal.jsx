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
                            <i className="fa-solid fa-right-from-bracket" style={styles.icon}></i>
                        </div>

                        <h2 style={styles.title}>Confirm Logout</h2>
                        <p style={styles.subtitle}>Are you sure you want to logout from NCM Bakery? We'll miss you!</p>

                        <div style={styles.buttonContainer}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                style={styles.cancelBtn}
                            >
                                Stay Here
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, background: '#8b1523' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                style={styles.logoutBtn}
                            >
                                Logout
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
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 5000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    modal: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden'
    },
    iconContainer: {
        width: '70px',
        height: '70px',
        background: '#fff0f0',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px',
        border: '2px solid #6b0f1a'
    },
    icon: {
        fontSize: '1.8rem',
        color: '#6b0f1a'
    },
    title: {
        margin: '0 0 10px',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.8rem',
        color: '#333'
    },
    subtitle: {
        margin: '0 0 30px',
        color: '#666',
        fontSize: '1rem',
        lineHeight: '1.5'
    },
    buttonContainer: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
    },
    cancelBtn: {
        padding: '12px 25px',
        borderRadius: '12px',
        border: '1px solid #ddd',
        background: 'white',
        color: '#666',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flex: 1
    },
    logoutBtn: {
        padding: '12px 25px',
        borderRadius: '12px',
        border: 'none',
        background: '#6b0f1a',
        color: 'white',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flex: 1,
        boxShadow: '0 4px 12px rgba(107, 15, 26, 0.3)'
    }
};

export default LogoutModal;
