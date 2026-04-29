import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("User signed in:", user.displayName);

            if (user.displayName) {
                localStorage.setItem('cachedUserName', user.displayName);
            }

            onClose();
        } catch (error) {
            console.error("Sign-in error:", error);
            setError(error.message || "Failed to sign in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

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
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Background Element */}
                        <div style={styles.decorCircle}></div>

                        <button style={styles.closeBtn} onClick={onClose}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div style={styles.imageContainer}>
                            <img
                                src="/assets/icons/logo192.png"
                                alt="NCM Logo"
                                style={styles.illustration}
                            />
                        </div>

                        <div style={styles.content}>
                            <h2 style={styles.title}>Welcome to NCM</h2>
                            <p style={styles.subtitle}>Log in to unlock exclusive treats & manage your orders.</p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={styles.error}
                                >
                                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={styles.googleBtn}
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google Logo"
                                    style={styles.googleIcon}
                                />
                                {isLoading ? (
                                    <div style={styles.loader}>
                                        <i className="fa-solid fa-spinner fa-spin"></i> Signing in...
                                    </div>
                                ) : (
                                    'Sign in with Google'
                                )}
                            </motion.button>

                            <p style={styles.footerText}>
                                Secure and hassle-free authentication
                            </p>
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
        backgroundColor: 'rgba(54, 4, 10, 0.4)', // Warm tinted overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(10px)',
    },
    modal: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(107, 15, 26, 0.35)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    decorCircle: {
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.2) 0%, rgba(197, 160, 89, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
    },
    closeBtn: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.05)',
        border: 'none',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#666',
        zIndex: 10,
        transition: '0.2s',
    },
    imageContainer: {
        width: '100%',
        height: '180px',
        background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 1,
    },
    illustration: {
        maxHeight: '100%',
        maxWidth: '100%',
        objectFit: 'contain',
        dropShadow: '0 10px 15px rgba(0,0,0,0.1)',
    },
    content: {
        padding: '30px',
        position: 'relative',
        zIndex: 1,
    },
    title: {
        color: '#6b0f1a',
        marginBottom: '8px',
        fontSize: '1.85rem',
        fontFamily: "'Playfair Display', serif",
        fontWeight: '800',
    },
    subtitle: {
        color: '#666',
        marginBottom: '30px',
        fontSize: '0.95rem',
        lineHeight: '1.5',
    },
    error: {
        color: '#6b0f1a',
        backgroundColor: '#fff1f1',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '20px',
        fontSize: '0.85rem',
        border: '1px solid #ffcccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    googleBtn: {
        backgroundColor: '#fff',
        color: '#2c3e50',
        border: '1px solid #e0e0e0',
        borderRadius: '99px', // Pill shape
        padding: '14px 24px',
        width: '100%',
        fontSize: '1.05rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
    },
    googleIcon: {
        width: '20px',
        height: '20px',
    },
    loader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#666',
    },
    footerText: {
        marginTop: '25px',
        fontSize: '0.75rem',
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    }
};

export default AuthModal;
