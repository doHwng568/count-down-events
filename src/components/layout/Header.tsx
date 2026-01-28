import React from 'react';
import { Clock } from 'lucide-react';

const Header: React.FC = () => {
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
            </div>
        </header>
    );
};

export default Header;
