import React from 'react';
import { History, Clock } from 'lucide-react';

interface HeaderProps {
    onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
    return (
        <header className="border-b border-white/5 bg-[#020617]/40 backdrop-blur-2xl sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
                <div className="flex items-center gap-4 group cursor-default">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-105 transition-transform">
                        <Clock className="text-white" size={26} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tight text-white leading-none">VibeTime</h1>
                        <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-black mt-1">Luxury Countdown</p>
                    </div>
                </div>

                <button
                    onClick={onOpenSidebar}
                    className="group relative p-3 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/10"
                    title="Lịch sử sự kiện"
                >
                    <History size={24} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-[#020617] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </header>
    );
};

export default Header;
