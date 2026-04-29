import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useRegisterSW } from 'virtual:pwa-register/react';

const Settings = () => {
    const [settings, setSettings] = useState({
        showHomeDelivery: true,
        showPickup: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [checkingUpdate, setCheckingUpdate] = useState(false);

    // PWA Update Hook with safety
    const swResult = useRegisterSW();
    const needUpdate = swResult?.needUpdate?.[0] || false;
    const setNeedUpdate = swResult?.needUpdate?.[1] || (() => { });
    const updateServiceWorker = swResult?.updateServiceWorker;

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'storeConfig');
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'storeConfig'), settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const checkForUpdates = async () => {
        setCheckingUpdate(true);
        try {
            // Service worker registration object check
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    await registration.update();
                    console.log('Checked for updates');
                }
            }
            // If no update found after a delay
            setTimeout(() => {
                setCheckingUpdate(false);
                if (!needUpdate) {
                    alert('App is already up-to-date!');
                }
            }, 1500);
        } catch (err) {
            console.error('Update check failed:', err);
            setCheckingUpdate(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-4"></i>
                <p className="font-medium">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-gear"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Admin Settings</h3>
                </div>

                <div className="p-6 space-y-8">
                    {/* Delivery Options */}
                    <div>
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Toggle Visibility</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setSettings({ ...settings, showHomeDelivery: !settings.showHomeDelivery })}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${settings.showHomeDelivery ? 'border-amber-400 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.showHomeDelivery ? 'bg-amber-100 text-amber-600' : 'bg-white text-gray-400'}`}>
                                        <i className="fa-solid fa-truck-fast"></i>
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-bold ${settings.showHomeDelivery ? 'text-amber-900' : 'text-gray-500'}`}>Home Delivery</div>
                                        <div className="text-xs text-gray-400">Show/Hide in Basket</div>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${settings.showHomeDelivery ? 'bg-amber-500 text-white' : 'bg-gray-200 text-transparent'}`}>
                                    <i className="fa-solid fa-check text-[10px]"></i>
                                </div>
                            </button>

                            <button
                                onClick={() => setSettings({ ...settings, showPickup: !settings.showPickup })}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${settings.showPickup ? 'border-purple-400 bg-purple-50' : 'border-gray-100 bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.showPickup ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-400'}`}>
                                        <i className="fa-solid fa-store"></i>
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-bold ${settings.showPickup ? 'text-purple-900' : 'text-gray-500'}`}>Self Pickup</div>
                                        <div className="text-xs text-gray-400">Show/Hide in Basket</div>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${settings.showPickup ? 'bg-purple-500 text-white' : 'bg-gray-200 text-transparent'}`}>
                                    <i className="fa-solid fa-check text-[10px]"></i>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* App Version / Update Section */}
                    <div className="pt-6 border-t border-gray-50">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Application Version</h4>

                        {needUpdate ? (
                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-bounce">
                                        <i className="fa-solid fa-cloud-arrow-down text-xl"></i>
                                    </div>
                                    <div>
                                        <div className="font-bold text-blue-900">New Update Available!</div>
                                        <p className="text-sm text-blue-700">A new version of Admin Portal is ready to install.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => updateServiceWorker(true)}
                                        className="flex-1 sm:flex-none bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-sm"
                                    >
                                        Update Now
                                    </button>
                                    <button
                                        onClick={() => setNeedUpdate(false)}
                                        className="flex-1 sm:flex-none bg-white text-gray-500 font-bold px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-sm"
                                    >
                                        Later
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <i className="fa-solid fa-circle-check text-green-500 text-xl"></i>
                                    <div>
                                        <div className="font-bold">App is up-to-date</div>
                                        <p className="text-xs text-gray-400">Running the latest official version</p>
                                    </div>
                                </div>
                                <button
                                    onClick={checkForUpdates}
                                    disabled={checkingUpdate}
                                    className="w-full sm:w-auto bg-white text-gray-700 font-bold px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-sm flex items-center justify-center gap-2"
                                >
                                    {checkingUpdate ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-rotate"></i>}
                                    {checkingUpdate ? 'Checking...' : 'Check'}
                                </button>
                                <button
                                    onClick={async () => {
                                        if (confirm('This will unregister the Service Worker and clear cache. Use only if app is stuck in a refresh loop. Continue?')) {
                                            const regs = await navigator.serviceWorker.getRegistrations();
                                            for (let reg of regs) await reg.unregister();
                                            const cachesKeys = await caches.keys();
                                            for (let key of cachesKeys) await caches.delete(key);
                                            window.location.reload();
                                        }
                                    }}
                                    className="w-full sm:w-auto text-red-500 text-xs font-bold hover:underline"
                                >
                                    Hard Reset PWA
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-50">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full sm:w-auto bg-slate-900 text-white font-bold px-12 py-4 rounded-2xl hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {saving ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                            )}
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
                <div className="flex gap-4">
                    <div className="text-amber-500">
                        <i className="fa-solid fa-circle-info text-2xl"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900">Real-time Synchronization</h4>
                        <p className="text-amber-700/80 text-sm mt-1 leading-relaxed">
                            Changes saved here will reflect instantly on the consumer website. If you disable an option, customers will not see it as a choice during checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Settings;
