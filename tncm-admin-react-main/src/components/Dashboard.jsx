import React from 'react';

const Dashboard = ({ stats, inventory, exportData, refreshStats, onNavigate }) => {
    return (
        <div className="space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <div className="glass-card p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Orders</p>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter group-hover:text-blue-600 transition-colors">{stats.totalOrders}</h2>
                        </div>
                        <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                            <i className="fa-solid fa-shopping-bag text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 group animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pending Delivery</p>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter group-hover:text-amber-600 transition-colors">{stats.pendingOrders}</h2>
                        </div>
                        <div className="p-4 bg-amber-500/10 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                            <i className="fa-solid fa-clock-rotate-left text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 group animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Live Revenue</p>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter group-hover:text-green-600 transition-colors">₹{stats.revenue.toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="p-4 bg-green-500/10 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                            <i className="fa-solid fa-indian-rupee-sign text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>



            {/* Inventory Health */}
            <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-amber-500/10 rounded-[1.25rem] flex items-center justify-center border border-amber-500/10 shadow-sm">
                                <i className="fa-solid fa-warehouse text-amber-500 text-2xl"></i>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tighter text-slate-800">Inventory Health</h3>
                                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Live Stock Monitor</p>
                            </div>
                        </div>
                        <button onClick={refreshStats} className="bg-slate-800 hover:bg-slate-900 px-6 py-3 rounded-2xl text-sm font-black tracking-widest uppercase transition-all shadow-lg shadow-slate-200 text-white">
                            Check Stock Level
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2rem] border border-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-red-500 font-black text-[10px] tracking-[0.2em] uppercase">Critical</span>
                                <span className="text-4xl font-black text-red-500 drop-shadow-sm">{inventory.outOfStock}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ring-1 ring-slate-200">
                                <div
                                    className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${(inventory.outOfStock / (inventory.total || 1)) * 100}%` }}
                                ></div>
                            </div>
                            <p className="mt-5 text-slate-500 text-xs font-bold tracking-wide uppercase">Out of Stock</p>
                        </div>

                        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-green-600 font-black text-[10px] tracking-[0.2em] uppercase">Healthy</span>
                                <span className="text-4xl font-black text-green-500 drop-shadow-sm">{inventory.inStock}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ring-1 ring-slate-200">
                                <div
                                    className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${(inventory.inStock / (inventory.total || 1)) * 100}%` }}
                                ></div>
                            </div>
                            <p className="mt-5 text-slate-500 text-xs font-bold tracking-wide uppercase">Available Units</p>
                        </div>

                        <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-blue-600 font-black text-[10px] tracking-[0.2em] uppercase">Total Catalog</span>
                                <span className="text-4xl font-black text-blue-500 drop-shadow-sm">{inventory.total}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ring-1 ring-slate-200">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full w-full"></div>
                            </div>
                            <p className="mt-5 text-slate-500 text-xs font-bold tracking-wide uppercase">Listed Products</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                <button
                    onClick={() => onNavigate('menu')}
                    className="glass-card flex flex-col sm:flex-row items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-amber-500 hover:text-white transition-all duration-500 group text-center sm:text-left"
                >
                    <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-all duration-500 shadow-inner">
                        <i className="fa-solid fa-cookie-bite text-2xl"></i>
                    </div>
                    <div className="text-left">
                        <span className="block font-black text-slate-800 group-hover:text-white leading-tight">Master Menu</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white/70">Update Stock</span>
                    </div>
                </button>

                <button
                    onClick={exportData}
                    className="glass-card flex flex-col sm:flex-row items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-green-600 hover:text-white transition-all duration-500 group text-center sm:text-left"
                >
                    <div className="w-14 h-14 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-all duration-500 shadow-inner">
                        <i className="fa-solid fa-file-csv text-2xl"></i>
                    </div>
                    <div className="text-left">
                        <span className="block font-black text-slate-800 group-hover:text-white leading-tight">Export Data</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white/70">Sales Report</span>
                    </div>
                </button>

                <button
                    onClick={refreshStats}
                    className="glass-card flex flex-col sm:flex-row items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-blue-600 hover:text-white transition-all duration-500 group text-center sm:text-left"
                >
                    <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-all duration-500 shadow-inner">
                        <i className="fa-solid fa-sync text-2xl group-hover:rotate-180 transition-transform duration-700"></i>
                    </div>
                    <div className="text-left">
                        <span className="block font-black text-slate-800 group-hover:text-white leading-tight">Sync Portal</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white/70">Refresh Stats</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
