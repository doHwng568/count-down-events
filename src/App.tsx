import { useState, useEffect, useMemo } from 'react';
import type { CountdownEvent, CompletedEvent } from './types';
import { HARDCODED_EVENTS } from './data/defaultEvents';
import { encodeData, decodeData } from './utils';
import Header from './components/layout/Header';
import AddEventForm from './components/forms/AddEventForm';
import CountdownCard from './components/countdown/CountdownCard';
import Sidebar from './components/layout/Sidebar';
import { Share2, Trash2, CalendarDays } from 'lucide-react';

function App() {
  const [userEvents, setUserEvents] = useState<CountdownEvent[]>(() => {
    const saved = localStorage.getItem('user_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedEvents] = useState<CompletedEvent[]>(() => {
    const saved = localStorage.getItem('completed_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#data=')) {
      const data = decodeData(hash);
      if (data?.userEvents) {
        setUserEvents(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const newEvents = data.userEvents.filter((e: CountdownEvent) => !existingIds.has(e.id));
          return [...prev, ...newEvents];
        });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user_events', JSON.stringify(userEvents));
  }, [userEvents]);

  useEffect(() => {
    localStorage.setItem('completed_events', JSON.stringify(completedEvents));
  }, [completedEvents]);

  const activeEvents = useMemo(() => {
    const now = Date.now();
    return [...HARDCODED_EVENTS, ...userEvents]
      .filter(e => e.targetDate > now)
      .sort((a, b) => a.targetDate - b.targetDate);
  }, [userEvents]);

  const heroEvent = activeEvents[0];
  const otherEvents = activeEvents.slice(1);

  const handleAddEvent = (title: string, dateStr: string) => {
    const newEvent: CountdownEvent = {
      id: Date.now().toString(),
      title,
      targetDate: new Date(dateStr).getTime()
    };
    setUserEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setUserEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleShare = async () => {
    const data = { userEvents };
    const hash = encodeData(data);
    const url = `${window.location.origin}${window.location.pathname}#data=${hash}`;

    try {
      await navigator.clipboard.writeText(url);
      alert('Đã copy link! Bạn có thể gửi link này cho mọi người.');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleClearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả sự kiện do bạn tạo?')) {
      setUserEvents([]);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="bg-mesh" />

      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 space-y-20">
        {/* Welcome Section */}
        <section
          className="text-center space-y-6 animate-up"
          style={{ animationDelay: '0s' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-[0.25em] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SẮP TỚI CÁC KHOẢNH KHẮC CỦA BẠN</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            <span className="text-gradient">Đếm ngược từng khoảnh khắc</span>
          </h2>

          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Biến mọi cột mốc quan trọng – sinh nhật, lễ kỷ niệm, chuyến đi – thành một trải nghiệm đếm ngược đầy cảm hứng.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#add-event"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <span>Bắt đầu tạo sự kiện</span>
            </a>
            <p className="text-xs text-slate-500 max-w-xs">
              Không cần đăng ký tài khoản, dữ liệu được lưu trực tiếp trên trình duyệt của bạn.
            </p>
          </div>
        </section>

        {/* Form Section - Floating Style */}
        <section
          id="add-event"
          className="animate-up max-w-3xl mx-auto"
          style={{ animationDelay: '0.1s' }}
        >
          <AddEventForm onAdd={handleAddEvent} />
        </section>

        {/* Events Layout */}
        <div className="space-y-16">
          {/* Hero Section */}
          {heroEvent && (
            <section className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <CalendarDays className="text-primary" size={20} />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">Sắp diễn ra sớm nhất</h3>
              </div>
              <CountdownCard event={heroEvent} isHero onDelete={handleDeleteEvent} />
            </section>
          )}

          {/* Grid Section */}
          {otherEvents.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <div className="h-px flex-1 bg-white/5" />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Các sự kiện khác</h3>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherEvents.map((event, index) => (
                  <div key={event.id} className="animate-up" style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}>
                    <CountdownCard event={event} onDelete={handleDeleteEvent} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeEvents.length === 0 && (
            <div className="text-center py-20 animate-up">
              <p className="text-slate-500 italic">Chưa có sự kiện nào đang diễn ra. Hãy thêm sự kiện đầu tiên của bạn!</p>
            </div>
          )}
        </div>

        {/* Global Actions */}
        <div
          className="flex flex-col items-center gap-6 animate-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleShare}
              className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-slate-300"
            >
              <Share2 size={18} className="group-hover:scale-110 transition-transform" />
              <span>Chia sẻ danh sách</span>
            </button>

            {userEvents.length > 0 && (
              <button
                onClick={handleClearAll}
                className="group flex items-center gap-2 px-6 py-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/20 transition-all text-rose-400"
              >
                <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Xóa tất cả</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center max-w-md">
            Tạo, lưu và chia sẻ danh sách sự kiện cá nhân hoá chỉ với một đường link – mọi thứ đều được đồng bộ qua URL bạn gửi cho bạn bè.
          </p>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="pb-6 px-6">
        <div className="max-w-5xl mx-auto text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4">
          <span>VibeTime · Đếm ngược những điều quan trọng với bạn</span>
          <span className="text-slate-500">Giao diện tối · Thiết kế tối giản &amp; hiện đại</span>
        </div>
      </footer>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        events={completedEvents}
      />
    </div>
  );
}

export default App;
