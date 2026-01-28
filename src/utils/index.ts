import type { TimeRemaining } from '../types';

export const calculateTimeRemaining = (targetDate: number): TimeRemaining => {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
    };
};

export const encodeData = (data: any): string => {
    try {
        return btoa(JSON.stringify(data));
    } catch (e) {
        console.error('Encoding failed', e);
        return '';
    }
};

export const decodeData = (hash: string): any => {
    try {
        const base64 = hash.replace('#data=', '');
        return JSON.parse(atob(base64));
    } catch (e) {
        console.error('Decoding failed', e);
        return null;
    }
};

export const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
