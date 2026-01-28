import React from 'react';
import { X, Trophy } from 'lucide-react';
import type { CompletedEvent } from '../../types';
import { formatDate } from '../../utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    events: CompletedEvent[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, events }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Side Content */}
            <aside className={`fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-[#0f172a] border-l border-white/10 z-[60] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="text-emerald-400" size={24} />
                            Đã hoàn thành
                        </h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {events.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                <p className="italic">Chưa có sự kiện nào đã qua.</p>
                            </div>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="glass-card p-4 bg-emerald-500/5 border-emerald-500/10">
                                    <h4 className="font-bold text-white mb-2">{event.title}</h4>
                                    <div className="text-xs text-slate-400 space-y-1">
                                        <p>Mục tiêu: {formatDate(event.targetDate)}</p>
                                        <p>Hoàn thành: {formatDate(event.completedAt)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pt-6 border-t border-white/5 text-center text-xs text-slate-500">
                        Tự động lưu trữ các sự kiện đã kết thúc
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
