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
        // Checking and reviewing patterns
        checking: [
            "You already did it. The urge to check again is the OCD talking, not reality.",
            "Checking one more time won't give you the certainty you're looking for. That certainty doesn't exist.",
            "What if you let this one stay unchecked? The discomfort will pass. It always does.",
            "You're not being careless by not checking. You're being brave.",
            "The memory feels uncertain because you're anxious, not because you didn't do it.",
            "Trust the version of you who did the thing. That person was paying attention."
        ],
        // Never enough patterns
        neverEnough: [
            "You've done enough for today. Not because the list is done — because you are a person, not a machine.",
            "The finish line keeps moving because perfectionism moves it. You can choose to stop here.",
            "Enough isn't a number. It's a decision you make. You can make it right now.",
            "What you did today is enough. Even if the voice says otherwise. Especially if the voice says otherwise.",
            "You're not behind. There's no schedule you're supposed to be keeping up with.",
            "The 'more' you think you need to do will still be there tomorrow. You don't have to earn rest.",
            "Productivity is not your worth. You matter when you're doing nothing at all."
        ],
        // Overcommitment patterns
        overcommitment: [
            "You added too much to the list because you forgot you're human. It's okay to remove things.",
            "Saying no to something is saying yes to your sanity. That's a fair trade.",
            "You can't do everything. Nobody can. That's not a personal failing — it's physics.",
            "The list will never be empty. That's not the goal. The goal is to live while the list exists.",
            "Doing less isn't laziness when you're already doing too much. It's correction.",
            "What would happen if you just... didn't do one of these things? Probably nothing catastrophic."
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

        // Checking patterns - OCD specific
        if (lower.includes('did i') || lower.includes('check') || lower.includes('make sure') || lower.includes('double check') || lower.includes('forget') || lower.includes('remember if')) {
            return 'checking';
        }
        // Never enough patterns
        if (lower.includes('not enough') || lower.includes('enough') || lower.includes('more to do') || lower.includes('should be doing') || lower.includes('not doing enough') || lower.includes('behind') || lower.includes('catching up')) {
            return 'neverEnough';
        }
        // Overcommitment patterns
        if (lower.includes('too much') || lower.includes('overwhelm') || lower.includes('so many') || lower.includes('list') || lower.includes('everything') || lower.includes('all the things')) {
            return 'overcommitment';
        }
        // Task paralysis
        if (lower.includes('start') || lower.includes('begin') || lower.includes('know how') || lower.includes('ready')) {
            return 'perfectStart';
        }
        // All-or-nothing
        if (lower.includes('all') || lower.includes('nothing') || lower.includes('completely') || lower.includes('100%') || lower.includes("can't do")) {
            return 'allOrNothing';
        }
        // Rumination
        if (lower.includes('sure') || lower.includes('certain') || lower.includes('what if') || lower.includes('worry') || lower.includes('keep thinking')) {
            return 'rumination';
        }
        // Rigidity
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
        const modeBtns = document.querySelectorAll('.mode-btn');
        const releaseMode = document.getElementById('release-mode');
        const doneMode = document.getElementById('done-mode');
        const input = document.getElementById('enough-text');
        const declareBtn = document.getElementById('declare-enough');
        const doneBtn = document.getElementById('declare-done');
        const result = document.getElementById('enough-result');

        // Mode switching
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (btn.dataset.mode === 'release') {
                    releaseMode.style.display = 'block';
                    doneMode.style.display = 'none';
                } else {
                    releaseMode.style.display = 'none';
                    doneMode.style.display = 'block';
                }
            });
        });

        // Release something specific
        declareBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text) return;

            const release = {
                id: Date.now(),
                text: text,
                type: 'release',
                date: new Date().toISOString()
            };

            const releases = getData(KEYS.RELEASES);
            releases.unshift(release);
            saveData(KEYS.RELEASES, releases);

            const celebrations = [
                `"${text}" is enough. You gave it what it needed.`,
                `Let go. "${text}" doesn't need to be perfect.`,
                `"${text}" is done. The rest is noise.`,
                `Released. "${text}" no longer owns your peace.`
            ];
            showEnoughResult(result, getRandomItem(celebrations));
            input.value = '';
            renderReleases();
        });

        // Done for today
        doneBtn.addEventListener('click', () => {
            const release = {
                id: Date.now(),
                text: 'Drew the line for today',
                type: 'done',
                date: new Date().toISOString()
            };

            const releases = getData(KEYS.RELEASES);
            releases.unshift(release);
            saveData(KEYS.RELEASES, releases);

            const celebrations = [
                "You're done. The list can wait. You cannot be poured from an empty cup.",
                "Line drawn. Tomorrow is tomorrow. Tonight, you rest.",
                "Enough. Not because everything is finished — because you decided.",
                "Done for today. The world will keep spinning. You did your part.",
                "You stopped. That takes more strength than pushing through. Well done."
            ];
            showEnoughResult(result, getRandomItem(celebrations));
            renderReleases();
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

    function showEnoughResult(result, message) {
        result.innerHTML = `
            <span class="checkmark">✓</span>
            <p>${message}</p>
        `;
        result.classList.add('show');
        setTimeout(() => {
            result.classList.remove('show');
        }, 5000);
    }

    function renderReleases() {
        const enoughList = document.getElementById('enough-list');
        const releases = getData(KEYS.RELEASES).slice(0, 10);

        if (releases.length === 0) {
            enoughList.innerHTML = '<li class="empty-state">Your boundaries will appear here</li>';
            return;
        }

        enoughList.innerHTML = releases.map(r => `
            <li class="${r.type === 'done' ? 'done-entry' : ''}">
                <span class="enough-text">${r.type === 'done' ? '🛑 ' : ''}${r.text}</span>
                <span class="enough-date">${formatDate(r.date)}</span>
            </li>
        `).join('');
    }

    // ============================================
    // Box Breathing Feature
    // ============================================
    let breathingInterval = null;
    let breathingTimeout = null;
    let roundCount = 0;

    function initBreathe() {
        const startBtn = document.getElementById('start-breathing');
        const stopBtn = document.getElementById('stop-breathing');
        const box = document.querySelector('.breathe-box');
        const text = document.querySelector('.breathe-text');
        const count = document.querySelector('.breathe-count');
        const roundDisplay = document.getElementById('round-count');

        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            roundCount = 0;
            roundDisplay.textContent = roundCount;
            startBreathingCycle(box, text, count, roundDisplay);
        });

        stopBtn.addEventListener('click', () => {
            stopBreathing(box, text, count);
            stopBtn.style.display = 'none';
            startBtn.style.display = 'inline-block';
        });
    }

    function startBreathingCycle(box, text, count, roundDisplay) {
        const phases = [
            { name: 'inhale', label: 'Breathe In', className: 'inhale' },
            { name: 'hold-in', label: 'Hold', className: 'hold-in' },
            { name: 'exhale', label: 'Breathe Out', className: 'exhale' },
            { name: 'hold-out', label: 'Hold', className: 'hold-out' }
        ];

        let phaseIndex = 0;

        function runPhase() {
            const phase = phases[phaseIndex];

            // Remove all phase classes
            box.classList.remove('inhale', 'hold-in', 'exhale', 'hold-out');
            box.classList.add(phase.className);
            text.textContent = phase.label;

            // Countdown
            let seconds = 4;
            count.textContent = seconds;

            breathingInterval = setInterval(() => {
                seconds--;
                if (seconds > 0) {
                    count.textContent = seconds;
                } else {
                    count.textContent = '';
                }
            }, 1000);

            // Move to next phase
            breathingTimeout = setTimeout(() => {
                clearInterval(breathingInterval);
                phaseIndex++;

                // Completed one full cycle
                if (phaseIndex >= phases.length) {
                    phaseIndex = 0;
                    roundCount++;
                    roundDisplay.textContent = roundCount;
                }

                runPhase();
            }, 4000);
        }

        runPhase();
    }

    function stopBreathing(box, text, count) {
        clearInterval(breathingInterval);
        clearTimeout(breathingTimeout);
        box.classList.remove('inhale', 'hold-in', 'exhale', 'hold-out');
        text.textContent = 'Ready';
        count.textContent = '';
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
        const detail = document.getElementById('checkin-detail');
        const last7 = checkins.slice(0, 7).reverse();

        if (last7.length === 0) {
            chart.innerHTML = '<p class="empty-state">Check-ins will create a pattern here</p>';
            detail.classList.remove('show');
            return;
        }

        // Max value is 5
        const maxHeight = 100;
        chart.innerHTML = last7.map((c, index) => {
            const height = (c.value / 5) * maxHeight;
            const day = new Date(c.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
            return `
                <div class="chart-bar" style="height: ${height}px" data-index="${index}">
                    <span class="bar-label">${day}</span>
                </div>
            `;
        }).join('');

        // Add click handlers to bars
        const bars = chart.querySelectorAll('.chart-bar');
        bars.forEach(bar => {
            bar.addEventListener('click', () => {
                const index = parseInt(bar.dataset.index);
                const checkin = last7[index];

                // Update selected state
                bars.forEach(b => b.classList.remove('selected'));
                bar.classList.add('selected');

                // Show detail
                showCheckinDetail(checkin, detail);
            });
        });
    }

    function showCheckinDetail(checkin, detailEl) {
        const levelLabels = ['', 'Calm', 'Slight', 'Present', 'Strong', 'Intense'];
        const dateStr = new Date(checkin.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });

        detailEl.innerHTML = `
            <div class="detail-header">
                <span class="detail-level">Level ${checkin.value} — ${levelLabels[checkin.value]}</span>
                <span class="detail-date">${dateStr}</span>
            </div>
            ${checkin.reflection
                ? `<p class="detail-reflection">"${checkin.reflection}"</p>`
                : `<p class="no-reflection">No reflection added</p>`
            }
        `;
        detailEl.classList.add('show');
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
        initBreathe();
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
