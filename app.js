console.log('Script started');

// Dữ liệu hardcode - những countdown mà dev đã tạo từ trước
let countdownData = [
    {
        id: 1,
        title: "🎉 Tết Nguyên Đán 2026",
        targetDate: new Date("2026-02-17T00:00:00").getTime()
    },
    {
        id: 2,
        title: "🌕 Trung Thu 2025",
        targetDate: new Date("2025-10-06T00:00:00").getTime()
    },
    {
        id: 3,
        title: "🎄 Giáng Sinh 2025",
        targetDate: new Date("2025-12-25T00:00:00").getTime()
    }
];

let completedCountdowns = [];
let updateIntervals = {};


// Custom DateTime Picker Class
class CustomDateTimePicker {
    constructor(inputId) {
        this.input = document.getElementById(inputId);
        this.popup = document.getElementById('datetimePopup');
        this.monthYear = document.getElementById('monthYear');
        this.calendarGrid = document.getElementById('calendarGrid');
        this.hourInput = document.getElementById('hourInput');
        this.minuteInput = document.getElementById('minuteInput');

        this.currentDate = new Date();
        this.selectedDate = null;
        this.months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        this.weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        this.init();
    }

    init() {
        this.input.addEventListener('click', () => this.show());
        document.getElementById('prevMonth').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());
        document.getElementById('cancelBtn').addEventListener('click', () => this.hide());
        document.getElementById('confirmBtn').addEventListener('click', () => this.confirm());

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.popup.contains(e.target) && e.target !== this.input) {
                this.hide();
            }
        });

        this.renderCalendar();
    }

    show() {
        this.popup.classList.add('show');
        this.renderCalendar();
    }

    hide() {
        this.popup.classList.remove('show');
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        this.monthYear.textContent = `${this.months[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        let html = '';

        // Weekday headers
        this.weekdays.forEach(day => {
            html += `<div class="weekday">${day}</div>`;
        });

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="day other-month" data-date="${year}-${month}-${day}">${day}</div>`;
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = `${year}-${month + 1}-${day}`;

            let classes = 'day';
            if (date.toDateString() === today.toDateString()) {
                classes += ' today';
            }
            if (this.selectedDate && date.toDateString() === this.selectedDate.toDateString()) {
                classes += ' selected';
            }

            html += `<div class="${classes}" data-date="${dateStr}" onclick="dateTimePicker.selectDate('${dateStr}')">${day}</div>`;
        }

        // Next month days
        const remainingCells = 42 - (firstDay + daysInMonth);
        for (let day = 1; day <= remainingCells && remainingCells < 7; day++) {
            html += `<div class="day other-month" data-date="${year}-${month + 2}-${day}">${day}</div>`;
        }

        this.calendarGrid.innerHTML = html;
    }

    selectDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        this.selectedDate = new Date(year, month - 1, day);
        this.renderCalendar();
    }

    confirm() {
        if (!this.selectedDate) {
            alert('Vui lòng chọn ngày!');
            return;
        }

        const hour = parseInt(this.hourInput.value) || 0;
        const minute = parseInt(this.minuteInput.value) || 0;

        if (hour < 0 || hour > 23) {
            alert('Giờ phải từ 0 đến 23!');
            return;
        }

        if (minute < 0 || minute > 59) {
            alert('Phút phải từ 0 đến 59!');
            return;
        }

        const finalDate = new Date(this.selectedDate);
        finalDate.setHours(hour, minute, 0, 0);

        const formatDate = finalDate.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        this.input.value = formatDate;
        this.input.dataset.datetime = finalDate.toISOString();
        this.hide();
    }

    getValue() {
        return this.input.dataset.datetime ? new Date(this.input.dataset.datetime) : null;
    }
}

// Khi load trang
window.onload = function () {
    console.log('Page loaded');
    loadSavedData();
    refreshDisplay();
    refreshCompletedDisplay();
};


// Initialize custom datetime picker
let dateTimePicker;
window.onload = function () {
    console.log('Page loaded');
    dateTimePicker = new CustomDateTimePicker('eventDateTime');
    loadSavedData();
    refreshDisplay();
    refreshCompletedDisplay();
};


function addNewCountdown() {
    console.log('Add button clicked');

    const title = document.getElementById('eventTitle').value.trim();
    const targetDate = dateTimePicker.getValue();

    console.log('Title:', title, 'DateTime:', targetDate); // Debug

    if (!title) {
        alert('Vui lòng nhập tiêu đề sự kiện!');
        return;
    }

    if (!targetDate) {
        alert('Vui lòng chọn ngày giờ mục tiêu!');
        return;
    }

    const now = new Date();

    if (targetDate <= now) {
        alert('Thời gian mục tiêu phải ở trong tương lai!');
        return;
    }

    const newCountdown = {
        id: Date.now(),
        title: title,
        targetDate: targetDate.getTime()
    };

    countdownData.push(newCountdown);
    saveData();
    refreshDisplay();

    // Clear form
    document.getElementById('eventTitle').value = '';
    // ⚠️ THAY ĐỔI Ở ĐÂY:
    dateTimePicker.input.value = '';
    delete dateTimePicker.input.dataset.datetime;
    dateTimePicker.selectedDate = null;

    console.log('Countdown added:', newCountdown);
}

function clearAllCountdowns() {
    console.log('Clear all clicked');

    const userCountdowns = countdownData.filter(item => item.id > 3);

    if (userCountdowns.length === 0) {
        alert('Không có countdown nào của bạn để xóa!');
        return;
    }

    if (confirm('Bạn có chắc muốn xóa tất cả countdown do bạn tạo? (Những countdown có sẵn sẽ được giữ lại)')) {
        userCountdowns.forEach(item => {
            if (updateIntervals[item.id]) {
                clearInterval(updateIntervals[item.id]);
                delete updateIntervals[item.id];
            }
        });

        countdownData = countdownData.filter(item => item.id <= 3);
        saveData();
        refreshDisplay();

        console.log('User countdowns cleared');
    }
}

function deleteCountdown(id) {
    console.log('Delete countdown:', id);

    if (id <= 3) {
        alert('Không thể xóa countdown có sẵn!');
        return;
    }

    if (confirm('Bạn có chắc muốn xóa đếm ngược này?')) {
        if (updateIntervals[id]) {
            clearInterval(updateIntervals[id]);
            delete updateIntervals[id];
        }

        countdownData = countdownData.filter(item => item.id !== id);
        saveData();
        refreshDisplay();
    }
}

function refreshDisplay() {
    console.log('Refreshing display, data:', countdownData);

    const container = document.getElementById('countdownList');

    if (countdownData.length === 0) {
        container.innerHTML = '<div class="empty">Chưa có đếm ngược nào. Hãy thêm mốc đầu tiên!</div>';
        return;
    }

    let html = '';
    countdownData.forEach(item => {
        html += createCountdownHTML(item);
    });

    container.innerHTML = html;

    countdownData.forEach(item => {
        startUpdating(item.id);
    });
}

function createCountdownHTML(countdown) {
    const targetDate = new Date(countdown.targetDate);
    const dateStr = targetDate.toLocaleString('vi-VN');

    const deleteButton = countdown.id > 3 ?
        `<button class="delete-btn" onclick="deleteCountdown(${countdown.id})">×</button>` :
        '';

    return `
        <div id="countdown_${countdown.id}" class="countdown-card">
            ${deleteButton}
            <div class="countdown-title">${countdown.title}</div>
            <div style="margin-bottom: 15px; opacity: 0.8;">${dateStr}</div>
            <div class="time-row">
                <div class="time-unit">
                    <span class="time-number" id="days_${countdown.id}">0</span>
                    <div class="time-label">Ngày</div>
                </div>
                <div class="time-unit">
                    <span class="time-number" id="hours_${countdown.id}">00</span>
                    <div class="time-label">Giờ</div>
                </div>
                <div class="time-unit">
                    <span class="time-number" id="minutes_${countdown.id}">00</span>
                    <div class="time-label">Phút</div>
                </div>
                <div class="time-unit">
                    <span class="time-number" id="seconds_${countdown.id}">00</span>
                    <div class="time-label">Giây</div>
                </div>
            </div>
        </div>
    `;
}

function startUpdating(id) {
    if (updateIntervals[id]) {
        clearInterval(updateIntervals[id]);
    }

    updateIntervals[id] = setInterval(() => {
        updateCountdownDisplay(id);
    }, 1000);

    updateCountdownDisplay(id);
}

function updateCountdownDisplay(id) {
    const countdown = countdownData.find(item => item.id === id);
    if (!countdown) return;

    const now = Date.now();
    const target = countdown.targetDate;
    const difference = target - now;

    const container = document.getElementById(`countdown_${id}`);
    if (!container) return;

    if (difference <= 0) {
        container.classList.add('finished');

        const deleteButton = countdown.id > 3 ?
            `<button class="delete-btn" onclick="deleteCountdown(${id})">×</button>` :
            '';

        container.innerHTML = `
            ${deleteButton}
            <div class="countdown-title">${countdown.title}</div>
            <div class="finished-text">🎉 Đã đến lúc! 🎉</div>
        `;

        addToCompleted(countdown);
        countdownData = countdownData.filter(item => item.id !== id);
        saveData();

        clearInterval(updateIntervals[id]);
        delete updateIntervals[id];
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById(`days_${id}`).textContent = days;
    document.getElementById(`hours_${id}`).textContent = hours.toString().padStart(2, '0');
    document.getElementById(`minutes_${id}`).textContent = minutes.toString().padStart(2, '0');
    document.getElementById(`seconds_${id}`).textContent = seconds.toString().padStart(2, '0');
}

function addToCompleted(countdown) {
    const exists = completedCountdowns.some(item => item.id === countdown.id);
    if (!exists) {
        const completedItem = {
            id: countdown.id,
            title: countdown.title,
            targetDate: countdown.targetDate,
            completedAt: Date.now()
        };

        completedCountdowns.push(completedItem);
        saveCompletedData();
        refreshCompletedDisplay();

        console.log('Added to completed:', completedItem);
    }
}

function refreshCompletedDisplay() {
    const container = document.getElementById('completedList');

    if (completedCountdowns.length === 0) {
        container.innerHTML = '<div class="completed-empty">Chưa có countdown nào hoàn thành</div>';
        return;
    }

    let html = '';
    completedCountdowns
        .sort((a, b) => b.completedAt - a.completedAt)
        .forEach(item => {
            const targetDate = new Date(item.targetDate);
            const completedDate = new Date(item.completedAt);

            html += `
                <div class="completed-item">
                    <div class="completed-title">${item.title}</div>
                    <div class="completed-date">Mục tiêu: ${targetDate.toLocaleDateString('vi-VN')}</div>
                    <div class="completed-date">Hoàn thành: ${completedDate.toLocaleDateString('vi-VN')}</div>
                </div>
            `;
        });

    container.innerHTML = html;
}

function saveData() {
    try {
        const userCountdowns = countdownData.filter(item => item.id > 3);
        localStorage.setItem('countdowns', JSON.stringify(userCountdowns));
        console.log('Data saved:', userCountdowns);
    } catch (e) {
        console.error('Save failed:', e);
    }
}

function loadSavedData() {
    try {
        const saved = localStorage.getItem('countdowns');
        if (saved) {
            const userCountdowns = JSON.parse(saved);
            countdownData = [...countdownData, ...userCountdowns];
            console.log('Data loaded and merged:', countdownData);
        }

        const savedCompleted = localStorage.getItem('completedCountdowns');
        if (savedCompleted) {
            completedCountdowns = JSON.parse(savedCompleted);
            console.log('Completed data loaded:', completedCountdowns);
        }
    } catch (e) {
        console.error('Load failed:', e);
    }
}

function saveCompletedData() {
    try {
        localStorage.setItem('completedCountdowns', JSON.stringify(completedCountdowns));
        console.log('Completed data saved:', completedCountdowns);
    } catch (e) {
        console.error('Save completed failed:', e);
    }
}
