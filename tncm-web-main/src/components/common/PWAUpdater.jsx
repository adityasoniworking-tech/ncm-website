import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';

function PWAUpdater() {
    // Safety check for useRegisterSW result
    const swResult = useRegisterSW();

    // Fallbacks if hook returns undefined
    const [needUpdate] = swResult?.needUpdate || [false];
    const updateServiceWorker = swResult?.updateServiceWorker;

    const [isUpdatedNotificationVisible, setIsUpdatedNotificationVisible] = useState(false);

    // Effect for handling the actual update (Silent Refresh)
    useEffect(() => {
        if (needUpdate && updateServiceWorker) {
            console.log('Main Website: New version detected! Refreshing in background...');

            // Set flag in localStorage so we can show notification AFTER refresh
            localStorage.setItem('tncm_pwa_updated', 'true');

            // Immediate upgrade and refresh (production only to avoid dev loops)
            if (!import.meta.env.DEV) {
                updateServiceWorker(true);
            }
        }
    }, [needUpdate, updateServiceWorker]);

    // Effect for showing the notification AFTER the refresh
    useEffect(() => {
        const justUpdated = localStorage.getItem('tncm_pwa_updated');

        if (justUpdated === 'true') {
            setIsUpdatedNotificationVisible(true);

            // Clean up localStorage flag immediately
            localStorage.removeItem('tncm_pwa_updated');

            // Hide notification after 5 seconds
            const timer = setTimeout(() => {
                setIsUpdatedNotificationVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <AnimatePresence>
            {isUpdatedNotificationVisible && (
                <motion.div
                    initial={{ y: 100, x: '-50%', opacity: 0 }}
                    animate={{ y: 0, x: '-50%', opacity: 1 }}
                    exit={{ y: 100, x: '-50%', opacity: 0 }}
                    style={styles.toast}
                >
                    <div style={styles.content}>
                        <div style={styles.iconContainer}>
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <div style={styles.textContainer}>
                            <h4 style={styles.title}>Website Updated!</h4>
                            <p style={styles.desc}>You are now using the latest version of NCM.</p>
                        </div>
                        <button
                            onClick={() => setIsUpdatedNotificationVisible(false)}
                            style={styles.closeBtn}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const styles = {
    toast: {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        zIndex: 10000,
        width: 'calc(100% - 40px)',
        maxWidth: '400px'
    },
    content: {
        background: '#1a1a1a',
        padding: '16px 20px',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    iconContainer: {
        width: '40px',
        height: '40px',
        background: '#22c55e',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '1.2rem'
    },
    textContainer: {
        flex: 1
    },
    title: {
        margin: 0,
        fontSize: '0.95rem',
        fontWeight: '800',
        color: 'white'
    },
    desc: {
        margin: '2px 0 0',
        fontSize: '0.75rem',
        color: '#999',
        fontWeight: '500'
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#555',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: '5px'
    }
};

export default PWAUpdater;
