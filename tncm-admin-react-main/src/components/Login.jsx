import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Fetch credentials directly from the custom admin document based on user configuration
            const docRef = doc(db, 'config', 'admin_credentials');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                if (data.username === username && data.password === password) {
                    // Success!
                    onLoginSuccess();
                } else {
                    setError('Invalid credentials. Access denied.');
                }
            } else {
                setError('System configuration not found.');
                console.error("The config/admin_credentials document does not exist.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('Connection error. Please check your network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[440px] z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative inline-block mb-6"
                    >
                        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl" />
                        <img
                            src="/assets/icons/logo192.png"
                            alt="NCM Logo"
                            className="w-24 h-24 relative z-10 rounded-full border-2 border-amber-500/20 p-1 bg-[#020617]"
                        />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold text-white tracking-tight mb-2"
                    >
                        NCM <span className="text-amber-500 font-light">Admin</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-400 font-medium tracking-wide text-sm uppercase"
                    >
                        Secure Access Portal
                    </motion.p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3"
                                >
                                    <i className="fa-solid fa-shield-halved"></i>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-4">
                                Admin Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                                    <i className="fa-solid fa-user-shield text-sm"></i>
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-800/30 border border-slate-700/50 text-white rounded-[1.25rem] py-4 pl-14 pr-6 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800/50 transition-all duration-300 placeholder:text-slate-600 text-sm"
                                    placeholder="Enter your identifier"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-4">
                                Master Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                                    <i className="fa-solid fa-key text-sm"></i>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800/30 border border-slate-700/50 text-white rounded-[1.25rem] py-4 pl-14 pr-14 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800/50 transition-all duration-300 placeholder:text-slate-600 text-sm"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-4 px-6 rounded-[1.25rem] shadow-[0_10px_20px_rgba(217,119,6,0.2)] transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <i className="fa-solid fa-circle-notch fa-spin text-lg"></i>
                                ) : (
                                    <>
                                        <span className="tracking-widest text-xs">AUTHENTICATE ACCESS</span>
                                        <i className="fa-solid fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1 }}
                    className="text-center text-white text-[10px] mt-8 font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-3"
                >
                    <div className="h-px w-8 bg-white/20" />
                    nuttychocomorsels
                    <div className="h-px w-8 bg-white/20" />
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;
