/**
 * AI Teaching Dashboard - Core Logic (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    initDateTime();
    initClassTimer();
    initFeedbackChart();
    initRandomPicker();
    initFocusTimer();
    initAICopilot();
});

/**
 * 1. 日期與時間更新
 */
function initDateTime() {
    const dateEl = document.getElementById('live-date');
    const updateTime = () => {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long',
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false
        };
        dateEl.textContent = now.toLocaleDateString('zh-TW', options);
    };
    updateTime();
    setInterval(updateTime, 1000);
}

/**
 * 2. 課程進行計時器 (自頁面開啟起算)
 */
function initClassTimer() {
    const timerEl = document.getElementById('class-timer');
    let seconds = 0;
    
    setInterval(() => {
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

/**
 * 3. 課堂溫度計 (Chart.js)
 */
let feedbackChartObj = null;
function initFeedbackChart() {
    const ctx = document.getElementById('feedbackChart').getContext('2d');
    
    const initialData = {
        labels: ['14:00', '14:15', '14:30', '14:45', '15:00'],
        datasets: [
            {
                label: '理解度 (%)',
                data: [85, 88, 82, 90, 88],
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: '疲憊度 (%)',
                data: [15, 20, 35, 25, 30],
                borderColor: '#ff0844',
                backgroundColor: 'rgba(255, 8, 68, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    feedbackChartObj = new Chart(ctx, {
        type: 'line',
        data: initialData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e2e8f0',
                        font: { family: 'Outfit, Noto Sans TC' }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });

    // 模擬更新按鈕
    document.getElementById('simulate-feedback-btn').addEventListener('click', () => {
        // 隨機產生波動數據
        feedbackChartObj.data.datasets[0].data = feedbackChartObj.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * (98 - 70) + 70)
        );
        feedbackChartObj.data.datasets[1].data = feedbackChartObj.data.datasets[1].data.map(() => 
            Math.floor(Math.random() * (50 - 10) + 10)
        );
        feedbackChartObj.update();
        
        // 隨機更新專注度數值
        const attentionScore = Math.floor(Math.random() * (96 - 80) + 80);
        document.getElementById('attention-score').innerHTML = `${attentionScore}% <span class="trend up"><i class="fa-solid fa-caret-up"></i> 正常</span>`;
    });
}

/**
 * 4. AI 隨機抽人
 */
function initRandomPicker() {
    const students = [
        '王小明', '李美玲', '張三豐', '林志豪', '陳雅婷', 
        '黃俊傑', '吳欣怡', '蔡育廷', '劉婷婷', '趙崇智', 
        '鄭雅文', '許志明', '楊千嬅', '謝霆鋒', '周杰倫'
    ];
    const displayEl = document.getElementById('picker-result');
    const pickBtn = document.getElementById('pick-student-btn');
    const audio = document.getElementById('alert-sound');
    
    let isRolling = false;
    
    pickBtn.addEventListener('click', () => {
        if (isRolling) return;
        
        isRolling = true;
        displayEl.classList.add('rolling');
        let counter = 0;
        const maxRolls = 20;
        
        const rollInterval = setInterval(() => {
            const tempIndex = Math.floor(Math.random() * students.length);
            displayEl.textContent = students[tempIndex];
            counter++;
            
            if (counter >= maxRolls) {
                clearInterval(rollInterval);
                const finalIndex = Math.floor(Math.random() * students.length);
                displayEl.innerHTML = `<i class="fa-solid fa-trophy" style="color: #ff0844; margin-right: 8px;"></i> ${students[finalIndex]}`;
                displayEl.classList.remove('rolling');
                isRolling = false;
                
                // 播放音效 (如果瀏覽器阻擋則靜音不報錯)
                audio.play().catch(() => {});
            }
        }, 100);
    });
}

/**
 * 5. 專注倒數計時器
 */
function initFocusTimer() {
    const displayEl = document.getElementById('focus-timer-display');
    const toggleBtn = document.getElementById('timer-toggle-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const btn5 = document.getElementById('timer-5min');
    const btn10 = document.getElementById('timer-10min');
    const audio = document.getElementById('alert-sound');
    
    let timeLeft = 300; // 預設 5 分鐘
    let timerId = null;
    let isRunning = false;
    
    function updateDisplay() {
        const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const secs = String(timeLeft % 60).padStart(2, '0');
        displayEl.textContent = `${mins}:${secs}`;
    }
    
    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> 暫停';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-secondary');
        displayEl.classList.add('running');
        
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerId);
                isRunning = false;
                displayEl.classList.remove('running');
                toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> 開始';
                toggleBtn.classList.remove('btn-secondary');
                toggleBtn.classList.add('btn-primary');
                
                // 倒數結束音效
                audio.play().catch(() => {});
                alert('專注時間結束！休息一下吧！');
            }
        }, 100); // 加快點讓測試時有感，正式版為 1000
    }
    
    function pauseTimer() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timerId);
        toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> 開始';
        toggleBtn.classList.remove('btn-secondary');
        toggleBtn.classList.add('btn-primary');
        displayEl.classList.remove('running');
    }
    
    toggleBtn.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    resetBtn.addEventListener('click', () => {
        pauseTimer();
        timeLeft = 300;
        updateDisplay();
    });
    
    btn5.addEventListener('click', () => {
        pauseTimer();
        timeLeft = 300;
        updateDisplay();
    });
    
    btn10.addEventListener('click', () => {
        pauseTimer();
        timeLeft = 600;
        updateDisplay();
    });
    
    updateDisplay();
}

/**
 * 6. AI Classroom Copilot (模擬打字機動態生成簡報大綱)
 */
function initAICopilot() {
    const inputEl = document.getElementById('copilot-input');
    const genBtn = document.getElementById('generate-outline-btn');
    const outputContainer = document.getElementById('copilot-output-container');
    const outputEl = document.getElementById('copilot-output');
    const exportBtn = document.getElementById('export-md-btn');
    
    let generatedMarkdown = '';
    
    const mockResponses = {
        'default': `### 📌 AI 輔助教學投影片大綱

#### 一、 課程引言：什麼是 AI Agent & Vibe Coding？
*   **傳統開發 vs AI 輔助開發**的根本差異。
*   Vibe Coding 核心概念：以思維引導 AI 進行全自動化編碼。
*   AI 代理人 (Agent) 在日常教學工作中的角色。

#### 二、 Model Context Protocol (MCP) 深度解析
*   什麼是 MCP？為什麼它是 AI 連接外部工具的關鍵橋樑？
*   MCP 運作原理：客戶端、伺服器與工具端架構。
*   實際應用：如何讓 AI 自動讀取本機檔案並執行資料庫查詢。

#### 三、 實戰演練：建立本機 AI 字幕與克隆系統
*   啟動本機語音模型 (\`D:\\軟體\\語音模型\\start.bat\`) 進行配音。
*   自動生成 SRT 字幕的 Whisper-large 流程示範。

#### 四、 隨堂互動與實踐評估
*   現場展示：一鍵隨機抽人與專注計時器整合。
*   討論：如何將今日所學儀表板快速部署至日常教學。`
    };
    
    genBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (!text) {
            alert('請輸入一些課堂主題或關鍵字！');
            return;
        }
        
        genBtn.disabled = true;
        genBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI 思考與規劃中...';
        outputContainer.classList.add('hidden');
        outputEl.innerHTML = '';
        
        // 模擬 1.5 秒的「AI 思考規劃時間」
        setTimeout(() => {
            outputContainer.classList.remove('hidden');
            genBtn.disabled = false;
            genBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> 開始生成大綱';
            
            // 決定產出的 Markdown 內容
            let contentText = mockResponses.default;
            if (text.includes('MCP') || text.includes('mcp')) {
                contentText = contentText.replace('Model Context Protocol (MCP) 深度解析', `🔥 MCP 與 AI 外部工具整合 (${text})`);
            }
            
            generatedMarkdown = contentText;
            
            // HTML 格式化展示 (將 markdown 簡單轉換成 HTML)
            const htmlContent = contentText
                .replace(/### (.*)/g, '<h3>$1</h3>')
                .replace(/#### (.*)/g, '<h4>$1</h4>')
                .replace(/\* \*\*(.*?)\*\*(.*)/g, '<li><strong>$1</strong>$2</li>')
                .replace(/\* (.*)/g, '<li>$1</li>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
                
            // 打字機效果
            let index = 0;
            const speed = 10; // 每個字元間隔
            outputEl.innerHTML = '';
            
            const timer = setInterval(() => {
                if (index < htmlContent.length) {
                    // 為了避免標籤斷開，每次處理一個 HTML 區段或字元
                    if (htmlContent[index] === '<') {
                        const endIdx = htmlContent.indexOf('>', index);
                        outputEl.innerHTML += htmlContent.substring(index, endIdx + 1);
                        index = endIdx + 1;
                    } else {
                        outputEl.innerHTML += htmlContent[index];
                        index++;
                    }
                    outputEl.scrollTop = outputEl.scrollHeight;
                } else {
                    clearInterval(timer);
                }
            }, speed);
            
        }, 1500);
    });
    
    // 匯出為 Markdown
    exportBtn.addEventListener('click', () => {
        if (!generatedMarkdown) return;
        
        const blob = new Blob([generatedMarkdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `教學簡報大綱_${new Date().toISOString().slice(0, 10)}.md`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
