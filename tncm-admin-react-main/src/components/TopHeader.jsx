import React from 'react';

const TopHeader = ({ title, subtitle, onLogout }) => {
    return (
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-12 glass-card p-5 sm:p-6 rounded-[2rem] border-white/60 relative z-10 animate-fadeIn">
            <div className="page-title">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">{title}</h1>
                <p className="text-slate-500 text-sm font-semibold tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    {subtitle}
                </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-200/50">
                <div className="flex items-center gap-2.5 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white shadow-sm ring-1 ring-slate-200/50">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-glow"></span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Store Live</span>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        onClick={onLogout}
                        className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all duration-500 cursor-pointer border border-white shadow-lg shadow-slate-200/20 group hover:rotate-12"
                    >
                        <i className="fa-solid fa-power-off text-lg group-hover:scale-110 transition-transform"></i>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
