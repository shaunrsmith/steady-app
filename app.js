// Steady — App Logic
// All data stored locally in your browser

(function() {
    'use strict';

    // ============================================
    // Storage Keys
    // ============================================
    const KEYS = {
        CHECKINS: 'steady_checkins',
        WINS: 'steady_wins',
        RELEASES: 'steady_releases',
        REFRAMES: 'steady_reframes'
    };

    // ============================================
    // Gentle Reframes Library
    // ============================================
    const REFRAMES = {
        // Task paralysis patterns
        perfectStart: [
            "What if you started with just the first tiny step? You can figure out the rest as you go. Starting messy is still starting.",
            "The first draft of anything is allowed to be imperfect. That's literally what drafts are for.",
            "What would 'good enough to start' look like? Not good enough to finish — just to begin."
        ],
        // All-or-nothing patterns
        allOrNothing: [
            "Something is infinitely more than nothing. Even 5 minutes counts.",
            "What if there's a middle ground between 'perfect' and 'failure'? Most of life happens there.",
            "Partial credit is real. You don't lose everything when you can't do it all."
        ],
        // Rumination patterns
        rumination: [
            "This thought has visited before. You've survived it every time. You'll survive it now too.",
            "What if this thought is just weather passing through? You don't have to grab onto it.",
            "You've checked enough. The checking isn't making you more certain — it's keeping you stuck."
        ],
        // Rigid routine patterns
        rigidity: [
            "Today didn't go as planned, and that's allowed. Tomorrow is another chance to show up.",
            "Flexibility is a strength, not a failure. The plan serves you — not the other way around.",
            "One disrupted day doesn't erase the pattern you're building. You're still on your path."
        ],
        // General perfectionism
        general: [
            "You're holding yourself to a standard you'd never apply to someone you love. What would you tell them?",
            "Done is a gift you give yourself. Let this one be done.",
            "The pursuit of perfect is often the enemy of peace. What would peaceful look like right now?",
            "Your worth isn't measured by your output. You matter even on your unproductive days.",
            "What if 'good enough' is actually good? Not settling — just realistic.",
            "The thing you're worried about is probably invisible to everyone else. They see the whole you."
        ]
    };

    // ============================================
    // Utility Functions
    // ============================================
    function getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return [];
        }
    }

    function saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    function formatDate(date) {
        const d = new Date(date);
        const options = { month: 'short', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    }

    function formatTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function detectPattern(thought) {
        const lower = thought.toLowerCase();

        if (lower.includes('start') || lower.includes('begin') || lower.includes('know how') || lower.includes('ready')) {
            return 'perfectStart';
        }
        if (lower.includes('all') || lower.includes('nothing') || lower.includes('completely') || lower.includes('100%') || lower.includes("can't do")) {
            return 'allOrNothing';
        }
        if (lower.includes('check') || lower.includes('sure') || lower.includes('certain') || lower.includes('what if') || lower.includes('worry')) {
            return 'rumination';
        }
        if (lower.includes('routine') || lower.includes('schedule') || lower.includes('plan') || lower.includes('supposed to') || lower.includes('should have')) {
            return 'rigidity';
        }
        return 'general';
    }

    // ============================================
    // Navigation
    // ============================================
    function initNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;

                // Update nav buttons
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update sections
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');

                // Refresh progress view if navigating there
                if (targetSection === 'progress') {
                    renderProgress();
                }
            });
        });
    }

    // ============================================
    // Check-In Feature
    // ============================================
    function initCheckin() {
        const scaleBtns = document.querySelectorAll('.scale-btn');
        const saveBtn = document.getElementById('save-checkin');
        const reflection = document.getElementById('reflection');
        const feedback = document.getElementById('checkin-feedback');

        let selectedValue = null;

        scaleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                scaleBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedValue = parseInt(btn.dataset.value);
            });
        });

        saveBtn.addEventListener('click', () => {
            if (!selectedValue) {
                showFeedback(feedback, 'Tap a number to check in', 'success');
                return;
            }

            const checkin = {
                id: Date.now(),
                value: selectedValue,
                reflection: reflection.value.trim(),
                date: new Date().toISOString()
            };

            const checkins = getData(KEYS.CHECKINS);
            checkins.unshift(checkin);
            saveData(KEYS.CHECKINS, checkins);

            // Reset form
            scaleBtns.forEach(b => b.classList.remove('selected'));
            reflection.value = '';
            selectedValue = null;

            // Show gentle feedback
            const messages = [
                "Noted. Thank you for checking in.",
                "Recorded. You're paying attention to yourself.",
                "Saved. Awareness is the first step.",
                "Got it. You showed up today."
            ];
            showFeedback(feedback, getRandomItem(messages), 'success');
        });
    }

    function showFeedback(element, message, type) {
        element.textContent = message;
        element.className = `feedback show ${type}`;
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }

    // ============================================
    // Thought Reframe Feature
    // ============================================
    function initReframe() {
        const input = document.getElementById('perfectionist-thought');
        const reframeBtn = document.getElementById('get-reframe');
        const result = document.getElementById('reframe-result');
        const historyList = document.getElementById('reframe-list');

        reframeBtn.addEventListener('click', () => {
            const thought = input.value.trim();
            if (!thought) {
                return;
            }

            // Detect pattern and get appropriate reframe
            const pattern = detectPattern(thought);
            const reframeOptions = [...REFRAMES[pattern], ...REFRAMES.general];
            const reframe = getRandomItem(reframeOptions);

            // Show result
            result.innerHTML = `<p>${reframe}</p>`;
            result.classList.add('show');

            // Save to history
            const reframeData = {
                id: Date.now(),
                thought: thought,
                reframe: reframe,
                date: new Date().toISOString()
            };

            const reframes = getData(KEYS.REFRAMES);
            reframes.unshift(reframeData);
            saveData(KEYS.REFRAMES, reframes.slice(0, 50)); // Keep last 50

            // Update history display
            renderReframeHistory();

            // Clear input
            input.value = '';
        });

        // Initial render
        renderReframeHistory();
    }

    function renderReframeHistory() {
        const historyList = document.getElementById('reframe-list');
        const reframes = getData(KEYS.REFRAMES).slice(0, 5);

        if (reframes.length === 0) {
            historyList.innerHTML = '<p class="empty-state">Your reframes will appear here</p>';
            return;
        }

        historyList.innerHTML = reframes.map(r => `
            <div class="history-item">
                <div class="thought">"${r.thought}"</div>
                <div class="reframe">${r.reframe}</div>
                <div class="date">${formatDate(r.date)}</div>
            </div>
        `).join('');
    }

    // ============================================
    // Micro-Wins Feature
    // ============================================
    function initWins() {
        const input = document.getElementById('win-text');
        const saveBtn = document.getElementById('save-win');
        const feedback = document.getElementById('win-feedback');
        const winsList = document.getElementById('wins-list');

        saveBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text) return;

            const win = {
                id: Date.now(),
                text: text,
                date: new Date().toISOString()
            };

            const wins = getData(KEYS.WINS);
            wins.unshift(win);
            saveData(KEYS.WINS, wins);

            // Clear and show feedback
            input.value = '';
            const messages = [
                "That counts. It all counts.",
                "Win logged. You did that.",
                "Added. Small steps matter.",
                "Noted. Keep collecting these."
            ];
            showFeedback(feedback, getRandomItem(messages), 'success');

            // Update display
            renderWins();
        });

        // Handle enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });

        // Initial render
        renderWins();
    }

    function renderWins() {
        const winsList = document.getElementById('wins-list');
        const wins = getData(KEYS.WINS).slice(0, 10);

        if (wins.length === 0) {
            winsList.innerHTML = '<li class="empty-state">Your wins will stack up here</li>';
            return;
        }

        winsList.innerHTML = wins.map(w => `
            <li>
                <span class="win-text">${w.text}</span>
                <span class="win-date">${formatDate(w.date)}</span>
            </li>
        `).join('');
    }

    // ============================================
    // Good Enough Declarations
    // ============================================
    function initEnough() {
        const input = document.getElementById('enough-text');
        const declareBtn = document.getElementById('declare-enough');
        const result = document.getElementById('enough-result');
        const enoughList = document.getElementById('enough-list');

        declareBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text) return;

            const release = {
                id: Date.now(),
                text: text,
                date: new Date().toISOString()
            };

            const releases = getData(KEYS.RELEASES);
            releases.unshift(release);
            saveData(KEYS.RELEASES, releases);

            // Show celebration
            const celebrations = [
                `Released. "${text}" is done enough.`,
                `Let go. "${text}" no longer needs to be perfect.`,
                `Done. You gave "${text}" what it needed.`,
                `Released. "${text}" served its purpose.`
            ];
            result.innerHTML = `
                <span class="checkmark">✓</span>
                <p>${getRandomItem(celebrations)}</p>
            `;
            result.classList.add('show');

            // Clear input
            input.value = '';

            // Update history
            renderReleases();

            // Hide result after a moment
            setTimeout(() => {
                result.classList.remove('show');
            }, 4000);
        });

        // Handle enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                declareBtn.click();
            }
        });

        // Initial render
        renderReleases();
    }

    function renderReleases() {
        const enoughList = document.getElementById('enough-list');
        const releases = getData(KEYS.RELEASES).slice(0, 10);

        if (releases.length === 0) {
            enoughList.innerHTML = '<li class="empty-state">Things you release will appear here</li>';
            return;
        }

        enoughList.innerHTML = releases.map(r => `
            <li>
                <span class="enough-text">${r.text}</span>
                <span class="enough-date">${formatDate(r.date)}</span>
            </li>
        `).join('');
    }

    // ============================================
    // Progress View
    // ============================================
    function renderProgress() {
        const checkins = getData(KEYS.CHECKINS);
        const wins = getData(KEYS.WINS);
        const releases = getData(KEYS.RELEASES);
        const reframes = getData(KEYS.REFRAMES);

        // Update stats
        document.getElementById('total-checkins').textContent = checkins.length;
        document.getElementById('total-wins').textContent = wins.length;
        document.getElementById('total-releases').textContent = releases.length;
        document.getElementById('total-reframes').textContent = reframes.length;

        // Render check-in chart (last 7 days)
        renderCheckinChart(checkins);

        // Render recent activity
        renderRecentActivity(checkins, wins, releases, reframes);
    }

    function renderCheckinChart(checkins) {
        const chart = document.getElementById('checkin-chart');
        const last7 = checkins.slice(0, 7).reverse();

        if (last7.length === 0) {
            chart.innerHTML = '<p class="empty-state">Check-ins will create a pattern here</p>';
            return;
        }

        // Max value is 5
        const maxHeight = 100;
        chart.innerHTML = last7.map(c => {
            const height = (c.value / 5) * maxHeight;
            const day = new Date(c.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
            return `
                <div class="chart-bar" style="height: ${height}px" title="Level ${c.value}">
                    <span class="bar-label">${day}</span>
                </div>
            `;
        }).join('');
    }

    function renderRecentActivity(checkins, wins, releases, reframes) {
        const activityList = document.getElementById('activity-list');

        // Combine all activities
        const all = [
            ...checkins.slice(0, 3).map(c => ({ type: 'Check-in', date: c.date, detail: `Level ${c.value}` })),
            ...wins.slice(0, 3).map(w => ({ type: 'Win', date: w.date, detail: w.text })),
            ...releases.slice(0, 3).map(r => ({ type: 'Released', date: r.date, detail: r.text })),
            ...reframes.slice(0, 3).map(r => ({ type: 'Reframe', date: r.date, detail: '' }))
        ];

        // Sort by date, most recent first
        all.sort((a, b) => new Date(b.date) - new Date(a.date));

        const recent = all.slice(0, 8);

        if (recent.length === 0) {
            activityList.innerHTML = '<li class="empty-state">Your activity will appear here as you use Steady</li>';
            return;
        }

        activityList.innerHTML = recent.map(a => `
            <li>
                <span class="activity-type">${a.type}</span>
                <span class="activity-date">${formatDate(a.date)} ${formatTime(a.date)}</span>
            </li>
        `).join('');
    }

    // ============================================
    // Initialize App
    // ============================================
    function init() {
        initNavigation();
        initCheckin();
        initReframe();
        initWins();
        initEnough();
        renderProgress();

        console.log('Steady initialized. You\'re doing enough.');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
