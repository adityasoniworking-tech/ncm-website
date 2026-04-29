import React from 'react';

const Sidebar = ({ activeSection, setActiveSection, pendingCount = 0, onLogout }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'orders', label: 'Orders', icon: 'fa-shopping-bag', count: pendingCount },
        { id: 'menu', label: 'Manage Menu', icon: 'fa-cookie-bite' },
        { id: 'settings', label: 'Settings', icon: 'fa-sliders' },
    ];

    return (
        <aside className="sidebar hidden lg:flex flex-col w-72 bg-slate-950/95 backdrop-blur-2xl text-slate-300 fixed h-full z-50 border-r border-white/5">
            <div className="p-8 flex items-center gap-4 border-b border-white/5 bg-white/[0.02]">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
                    <img
                        src="/assets/icons/logo192.png"
                        alt="Logo"
                        className="w-full h-full object-contain rounded-[14px]"
                    />
                </div>
                <div>
                    <span className="text-xl font-black text-white tracking-tight block">NCM-ADMIN</span>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded">Store Control</span>
                </div>
            </div>

            <nav className="flex-grow py-8 px-2 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`nav-link w-full flex items-center gap-3 px-5 py-3.5 group ${activeSection === item.id ? 'active-link' : ''}`}
                    >
                        <i className={`fa-solid ${item.icon} text-lg transition-transform duration-300 group-hover:scale-110`}></i>
                        <span className="font-semibold tracking-wide">{item.label}</span>
                        {item.count > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full ml-auto shadow-lg shadow-red-500/40 border border-white/20">
                                {item.count}
                            </span>
                        )}
                        {activeSection === item.id && (
                            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full shadow-[0_0_10px_white]"></div>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group font-bold text-sm"
                >
                    <i className="fa-solid fa-power-off text-lg group-hover:rotate-90 transition-transform duration-500"></i>
                    <span>System Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
