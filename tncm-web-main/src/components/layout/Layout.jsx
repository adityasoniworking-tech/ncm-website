import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../common/AuthModal';
import CartModal from '../common/CartModal';
import SuccessModal from '../common/SuccessModal';
import LogoutModal from '../common/LogoutModal';
import PWAUpdater from '../common/PWAUpdater';
import PWAInstallPrompt from '../common/PWAInstallPrompt';
import { useCart } from '../../context/CartContext';

const Layout = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const { cartCount } = useCart();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    // Listen for profile updates or auth modal requests
    useEffect(() => {
        const handler = () => {
            if (auth.currentUser) {
                setUser({ ...auth.currentUser });
            }
        };
        const authModalHandler = () => setIsAuthModalOpen(true);

        window.addEventListener('userProfileUpdated', handler);
        window.addEventListener('openAuthModal', authModalHandler);
        
        return () => {
            window.removeEventListener('userProfileUpdated', handler);
            window.removeEventListener('openAuthModal', authModalHandler);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('cachedUserName');
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <>
            <PWAUpdater />
            <PWAInstallPrompt />
            
            <Header 
                user={user} 
                setIsAuthModalOpen={setIsAuthModalOpen} 
                setIsLogoutModalOpen={setIsLogoutModalOpen} 
            />

            <main>
                <Outlet />
            </main>

            <Footer />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <CartModal
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
            />

            <SuccessModal />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />

            {/* Floating Cart Button */}
            <div
                className="fab"
                id="cartBtnFloating"
                onClick={() => setIsCartModalOpen(true)}
            >
                <i className="fa-solid fa-cart-shopping"></i>
                <span id="cart-count" style={{ display: cartCount > 0 ? 'flex' : 'none' }}>
                    {cartCount}
                </span>
            </div>
        </>
    );
};

export default Layout;
