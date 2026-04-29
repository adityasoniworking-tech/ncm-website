import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShareButton = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: 'NCM Bakery',
            text: 'Check out these delicious treats from Nutty Choco Morsels!',
            url: window.location.origin,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Shared successfully');
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.origin);
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <div style={styles.container}>
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={styles.tooltip}
                    >
                        Link Copied!
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                style={styles.button}
                title="Share Menu"
            >
                <i className="fa-solid fa-share-nodes"></i>
            </motion.button>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '150px', // Above the Install Prompt and Cart
        left: '20px',
        zIndex: 9000
    },
    button: {
        width: '50px',
        height: '50px',
        borderRadius: '25px',
        background: 'white',
        color: '#6b0f1a',
        border: 'none',
        boxShadow: '0 10px 25px rgba(107, 15, 26, 0.15)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem',
        border: '1px solid rgba(107, 15, 26, 0.1)'
    },
    tooltip: {
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1a1a1a',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '10px',
        fontSize: '0.75rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        pointerEvents: 'none'
    }
};

export default ShareButton;
