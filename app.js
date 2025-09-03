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

// Khi load trang
window.onload = function() {
    console.log('Page loaded');
    loadSavedData();
    refreshDisplay();
    refreshCompletedDisplay();
};

function addNewCountdown() {
    console.log('Add button clicked');
    
    const title = document.getElementById('eventTitle').value.trim();
    const dateTime = document.getElementById('eventDateTime').value;
    
    console.log('Title:', title, 'DateTime:', dateTime);
    
    if (!title) {
        alert('Vui lòng nhập tiêu đề sự kiện!');
        return;
    }
    
    if (!dateTime) {
        alert('Vui lòng chọn ngày giờ mục tiêu!');
        return;
    }
    
    const targetDate = new Date(dateTime);
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
    document.getElementById('eventDateTime').value = '';
    
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
