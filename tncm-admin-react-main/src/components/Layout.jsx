import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import MobileNav from './MobileNav';
import LogoutModal from './LogoutModal';

const Layout = ({ children, activeSection, setActiveSection, pendingCount }) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleConfirmLogout = () => {
        sessionStorage.removeItem('ncm_admin_auth');
        localStorage.removeItem('ncm_admin_active_section');
        window.location.reload();
    };
    const getHeaderInfo = (section) => {
        switch (section) {
            case 'dashboard':
                return { title: 'Dashboard', subtitle: 'Live overview of your bakery' };
            case 'orders':
                return { title: 'Orders', subtitle: 'Manage your incoming bakery orders' };
            case 'menu':
                return { title: 'Manage Menu', subtitle: 'Update your bakery inventory and pricing' };
            case 'settings':
                return { title: 'Settings', subtitle: 'Configure notifications and app preferences' };
            default:
                return { title: 'Admin Portal', subtitle: 'Bakery Management' };
        }
    };

    const { title, subtitle } = getHeaderInfo(activeSection);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#fcfcfd]">
            {/* Background Accent */}
            <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-amber-100/30 to-transparent pointer-events-none z-0"></div>

            {/* Sidebar for Desktop */}
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                pendingCount={pendingCount}
                onLogout={() => setIsLogoutModalOpen(true)}
            />

            {/* Main Content Area */}
            <main className="flex-grow w-full lg:ml-72 relative z-10">
                <div className="p-4 lg:p-10 max-w-[1400px] mx-auto pb-40 lg:pb-12">
                    <TopHeader
                        title={title}
                        subtitle={subtitle}
                        onLogout={() => setIsLogoutModalOpen(true)}
                    />

                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Navigation */}
            <MobileNav
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onLogout={() => setIsLogoutModalOpen(true)}
            />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};

export default Layout;
