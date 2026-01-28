import type { CountdownEvent } from '../types';

export const HARDCODED_EVENTS: CountdownEvent[] = [
    {
        id: 'hc-tet-2026',
        title: "🎉 Tết Nguyên Đán 2026",
        targetDate: new Date("2026-02-17T00:00:00").getTime(),
        isHardcoded: true,
    },
    {
        id: 'hc-xmas-2025',
        title: "🎄 Giáng Sinh 2025",
        targetDate: new Date("2025-12-25T00:00:00").getTime(),
        isHardcoded: true,
    },
    {
        id: 'hc-mid-autumn-2025',
        title: "🌕 Trung Thu 2025",
        targetDate: new Date("2025-10-06T00:00:00").getTime(),
        isHardcoded: true,
    }
];
