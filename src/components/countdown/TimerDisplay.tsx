import React from 'react';
import type { TimeRemaining } from '../../types';

interface TimerDisplayProps {
    timeLeft: TimeRemaining;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => {
    const units = [
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds },
    ];

    return (
        <div className="grid grid-cols-4 gap-3 md:gap-5">
            {units.map((unit) => (
                <div
                    key={unit.label}
                    className="flex flex-col items-center bg-white/5 border border-white/5 backdrop-blur-sm p-3 md:p-5 rounded-2xl md:rounded-3xl"
                >
                    <span className="text-2xl md:text-4xl font-black text-white tabular-nums tracking-tighter">
                        {unit.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] md:text-[11px] uppercase tracking-widest text-slate-500 font-bold mt-1">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TimerDisplay;
