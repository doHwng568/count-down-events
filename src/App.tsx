import { useMemo } from 'react';
import { HARDCODED_EVENTS } from './data/defaultEvents';
import Header from './components/layout/Header';
import CountdownCard from './components/countdown/CountdownCard';
import { CalendarDays } from 'lucide-react';

function App() {
  const activeEvents = useMemo(() => {
    const now = Date.now();
    return [...HARDCODED_EVENTS]
      .filter(e => e.targetDate > now)
      .sort((a, b) => a.targetDate - b.targetDate);
  }, []);

  const heroEvent = activeEvents[0];
  const otherEvents = activeEvents.slice(1);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="bg-mesh" />

      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 space-y-20">
        {/* Welcome Section */}
        <section
          className="text-center space-y-6 animate-up"
          style={{ animationDelay: '0s' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-[0.25em] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SỰ KIỆN TOÀN CẦU ĐÁNG CHÚ Ý</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            <span className="text-gradient">Đếm ngược những khoảnh khắc lớn</span>
          </h2>

          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Khám phá và theo dõi các sự kiện quan trọng nhất thế giới – từ lễ hội truyền thống đến các sự kiện thể thao và thiên văn kỳ thú.
          </p>
        </section>

        {/* Events Layout */}
        <div className="space-y-16">
          {/* Hero Section */}
          {heroEvent ? (
            <section className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <CalendarDays className="text-primary" size={20} />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">Sự kiện sắp diễn ra</h3>
              </div>
              <CountdownCard event={heroEvent} isHero />
            </section>
          ) : (
            <div className="text-center py-20 animate-up">
              <p className="text-slate-500 italic">Hiện không có sự kiện lớn nào sắp diễn ra. Quay lại sau nhé!</p>
            </div>
          )}

          {/* Grid Section */}
          {otherEvents.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <div className="h-px flex-1 bg-white/5" />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Các sự kiện khác</h3>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {otherEvents.map((event, index) => (
                  <div key={event.id} className="animate-up h-full" style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}>
                    <CountdownCard event={event} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer Info */}
        <div
          className="flex flex-col items-center gap-6 animate-up"
          style={{ animationDelay: '0.4s' }}
        >
          <p className="text-[11px] text-slate-500 text-center max-w-md">
            Danh sách sự kiện được cập nhật định kỳ dựa trên các cột mốc thời gian quan trọng trên toàn thế giới.
          </p>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="pb-6 px-6">
        <div className="max-w-5xl mx-auto text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4">
          <span>VibeTime · Kết nối thế giới qua những khoảnh khắc</span>
          <span className="text-slate-500">Thiết kế tối giản & hiện đại</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
