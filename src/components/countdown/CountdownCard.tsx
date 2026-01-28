import React from 'react';
import type { CountdownEvent } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import TimerDisplay from './TimerDisplay';
import { formatDate } from '../../utils';
import { Trash2, Pin } from 'lucide-react';

interface CountdownCardProps {
    event: CountdownEvent;
    onDelete?: (id: string) => void;
    isHero?: boolean;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ event, onDelete, isHero }) => {
    const timeLeft = useCountdown(event.targetDate);

    return (
        <div
            className={`glass-card relative flex flex-col p-6 md:p-8 overflow-hidden group ${isHero ? 'hero-card border-primary/30' : 'hover:border-white/20'
                }`}
        >
            {/* Absolute Background Elements */}
            {isHero && (
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Pin size={40} className="-rotate-45" />
                </div>
            )}

            <div className="flex justify-between items-start gap-4 mb-8">
                <div className="space-y-2">
                    <h3 className={`${isHero ? 'text-2xl md:text-3xl' : 'text-xl'} font-black text-white leading-tight`}>
                        {event.title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${timeLeft.isExpired ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`} />
                        <p className="text-xs md:text-sm text-slate-400 font-medium">
                            {formatDate(event.targetDate)}
                        </p>
                    </div>
                </div>

                {!event.isHardcoded && onDelete && (
                    <button
                        onClick={() => onDelete(event.id)}
                        className="p-2 -mt-2 -mr-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Xóa sự kiện"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            <div className="mt-auto">
                {timeLeft.isExpired ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-3">
                        <span className="text-4xl">🎉</span>
                        <div className="text-emerald-400 font-black text-2xl tracking-tight uppercase">
                            Sự kiện đã kết thúc
                        </div>
                    </div>
                ) : (
                    <TimerDisplay timeLeft={timeLeft} />
                )}
            </div>

            {/* Hero Glow Effect */}
            {isHero && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] pointer-events-none" />
            )}
        </div>
    );
};

export default CountdownCard;
