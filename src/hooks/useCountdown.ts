import { useState, useEffect } from 'react';
import { calculateTimeRemaining } from '../utils';
import type { TimeRemaining } from '../types';

export const useCountdown = (targetDate: number): TimeRemaining => {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = calculateTimeRemaining(targetDate);
            setTimeLeft(remaining);

            if (remaining.isExpired) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
};
