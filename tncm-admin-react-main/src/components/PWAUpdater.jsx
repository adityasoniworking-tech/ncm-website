import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

function PWAUpdater() {
    const swResult = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered');
            if (r) {
                // Check for updates every hour
                setInterval(() => {
                    r.update();
                }, 60 * 60 * 1000);
            }
        },
        onRegisterError(error) {
            console.error('SW registration error:', error);
        },
    });

    // Handle cases where hook might return undefined or different structure
    const needUpdate = swResult?.needUpdate?.[0];
    const updateServiceWorker = swResult?.updateServiceWorker;

    useEffect(() => {
        if (needUpdate) {
            console.log('New PWA version available. Auto-update disabled to prevent refresh loops.');
            // Manual update would go here if needed
        }
    }, [needUpdate]);

    return null;
}

export default PWAUpdater;
