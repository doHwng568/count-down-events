import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface AddEventFormProps {
    onAdd: (title: string, date: string) => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date) return;

        onAdd(title, date);
        setTitle('');
        setDate('');
    };

    return (
        <div className="glass-card overflow-hidden bg-white/5 border-white/10 group">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Sparkles className="text-primary group-hover:scale-110 transition-transform" size={16} />
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Tạo mốc thời gian mới</h4>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 flex flex-col gap-3 w-full">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Tên sự kiện</label>
                    <div className="relative group/input">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ghi lại khoảnh khắc sắp tới..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all pr-12"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary transition-colors">
                            <Plus size={20} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-[280px]">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Ngày giờ mục tiêu</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all [color-scheme:dark]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!title || !date}
                    className="btn-primary flex items-center justify-center gap-3 w-full md:w-auto h-[58px] min-w-[160px] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                >
                    <Plus size={22} strokeWidth={3} />
                    <span className="font-bold">Bắt đầu</span>
                </button>
            </form>
        </div>
    );
};

export default AddEventForm;
