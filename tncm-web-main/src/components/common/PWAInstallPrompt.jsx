import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // 1. Check if already installed/running as standalone
        const checkStandalone = () => {
            const isS = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            setIsStandalone(isS);
        };

        checkStandalone();

        // 2. Capture the install prompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log('PWA Install Prompt captured');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 3. Periodic Visibility Logic
        // We only want to show it if it's NOT standalone and we have the prompt
        let timer;
        const startVisibilityCycle = () => {
            if (isStandalone) return;

            // Show for 20 seconds every 1 minute
            const showInterval = 60000; // 1 minute
            const showDuration = 20000;  // 20 seconds

            const runCycle = () => {
                if (deferredPrompt) {
                    setIsVisible(true);
                    setTimeout(() => setIsVisible(false), showDuration);
                }
            };

            // Run immediately when deferredPrompt is available
            runCycle();

            timer = setInterval(runCycle, showInterval);
        };

        startVisibilityCycle();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            if (timer) clearInterval(timer);
        };
    }, [deferredPrompt, isStandalone]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        setIsVisible(false);
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);

        setDeferredPrompt(null);
    };

    // Don't render anything if already installed (standalone)
    if (isStandalone) return null;

    return (
        <AnimatePresence>
            {isVisible && deferredPrompt && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="pwa-install-prompt-container"
                >
                    <div style={styles.prompt}>
                        <div style={styles.iconContainer}>
                            <i className="fa-solid fa-mobile-screen-button"></i>
                        </div>
                        <p style={styles.title}>Install</p>
                        <div style={styles.actions}>
                            <button onClick={handleInstallClick} style={styles.installBtn}>
                                <i className="fa-solid fa-download"></i>
                            </button>
                            <button onClick={() => setIsVisible(false)} style={styles.closeBtn}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const styles = {
    prompt: {
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        padding: '6px 10px',
        borderRadius: '50px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        border: '1px solid rgba(107, 15, 26, 0.1)'
    },
    iconContainer: {
        width: '28px',
        height: '28px',
        background: '#fff0f0',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#6b0f1a',
        fontSize: '0.8rem'
    },
    title: {
        margin: 0,
        fontSize: '0.7rem',
        fontWeight: '800',
        color: '#333',
        whiteSpace: 'nowrap'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    installBtn: {
        width: '28px',
        height: '28px',
        background: '#6b0f1a',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        fontSize: '0.75rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(107, 15, 26, 0.2)'
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#bbb',
        cursor: 'pointer',
        fontSize: '0.8rem',
        padding: '2px'
    }
};

// Injection of responsive styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .pwa-install-prompt-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9000;
        }
        @media (max-width: 768px) {
            .pwa-install-prompt-container {
                bottom: 15px;
                left: 15px;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default PWAInstallPrompt;
