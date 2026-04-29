import React from 'react';

const MobileNav = ({ activeSection, setActiveSection, onLogout }) => {
    const navItems = [
        { id: 'dashboard', icon: 'fa-house', label: 'Home' },
        { id: 'orders', icon: 'fa-shopping-bag', label: 'Orders' },
        { id: 'menu', icon: 'fa-cookie-bite', label: 'Menu' },
        { id: 'settings', icon: 'fa-sliders', label: 'Config' },
        { id: 'exit', icon: 'fa-power-off', label: 'Logout' },
    ];

    const handleNavClick = (id) => {
        if (id === 'exit') {
            onLogout();
            return;
        }
        setActiveSection(id);
    };

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg pointer-events-none">
            <nav className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl pointer-events-auto border border-white/10 ring-1 ring-white/10 overflow-hidden">
                <div className="flex justify-around items-center px-4 py-3">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        const isExit = item.id === 'exit';

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`flex flex-col items-center justify-center gap-1 min-w-[4rem] transition-all duration-500 py-1 rounded-2xl ${isActive ? 'bg-amber-500/10 text-amber-500 scale-105' : isExit ? 'text-red-400 hover:text-red-300' : 'text-slate-500 hover:text-slate-200'}`}
                            >
                                <div className={`relative ${isActive ? 'animate-glow rounded-full' : ''}`}>
                                    <i className={`fa-solid ${item.icon} text-xl transition-transform duration-500 ${isActive ? 'scale-110' : ''}`}></i>
                                    {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></div>}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default MobileNav;
