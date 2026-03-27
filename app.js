// Steady — App Logic
// All data stored locally in your browser

(function() {
    'use strict';

    // ============================================
    // Welcome Affirmations
    // ============================================
    const AFFIRMATIONS = [
        "You are not your thoughts. You are the one observing them.",
        "Progress over perfection. Always.",
        "The urge to check again is not a signal that you need to check. It's just an urge.",
        "You've already done enough today. Even if you do nothing else.",
        "Uncertainty is uncomfortable, not dangerous. You can sit with it.",
        "Your worth is not measured by your productivity.",
        "Good enough is good. It really is.",
        "You don't have to feel ready to begin.",
        "The anxiety will pass. It always does.",
        "You are allowed to rest before you're exhausted.",
        "Mistakes are proof that you're trying, not proof that you're failing.",
        "You cannot think your way to certainty. And that's okay.",
        "Today, you only need to do today.",
        "The loop wants your attention. You don't have to give it.",
        "You are more than the worst thing your mind tells you.",
        "Letting go isn't giving up. It's moving forward.",
        "Your brain is trying to protect you. But you're already safe.",
        "One thing at a time. That's all anyone can do.",
        "You don't owe anyone perfection. Not even yourself.",
        "Being kind to yourself is not laziness. It's strength."
    ];

    // ============================================
    // Storage Keys
    // ============================================
    const KEYS = {
        CHECKINS: 'steady_checkins',
        WINS: 'steady_wins',
        RELEASES: 'steady_releases',
        REFRAMES: 'steady_reframes',
        REFLECTIONS: 'steady_reflections',
        COMPASSION: 'steady_compassion',
        COMPARISONS: 'steady_comparisons',
        MATTERING: 'steady_mattering',
        WINDDOWNS: 'steady_winddowns'
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

        // Scroll hint: hide fade when scrolled to the end
        const navEl = document.querySelector('.nav');
        const navWrapper = document.querySelector('.nav-wrapper');
        if (navEl && navWrapper) {
            navEl.addEventListener('scroll', () => {
                const atEnd = navEl.scrollLeft + navEl.offsetWidth >= navEl.scrollWidth - 4;
                navWrapper.classList.toggle('scrolled-end', atEnd);
            });
        }

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;

                // Update nav buttons
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update sections
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');

                // Scroll nav to show active tab
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

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
    // Self-Compassion Prompts
    // ============================================
    const COMPASSION_FRIEND = [
        "If your best friend told you they were struggling with this, you wouldn't say 'try harder.' You'd say: 'I see you. You're doing more than you realize.'",
        "You'd never tell your best friend they're not good enough. So why are you saying it to yourself? You deserve the same kindness you give others.",
        "Imagine your friend said these exact words to you. You'd hold space for them. You'd remind them that one bad moment doesn't define them. Now do that for yourself.",
        "Your best friend wouldn't need to be perfect for you to love them. Neither do you.",
        "You'd tell your friend: 'It's okay. You tried. That matters.' Can you hear yourself saying that — to you?",
        "If your friend was this exhausted and still beating themselves up, you'd say: 'Please stop. You've done enough. Rest now.'"
    ];

    const COMPASSION_CHILD = [
        "That five-year-old didn't need to be perfect to deserve love. Neither do you, right now, today.",
        "Little you just wanted to be told: 'You're okay. You don't have to earn your place here.' You can tell yourself that now.",
        "Picture that small kid, trying so hard, worried about getting it right. Would you ever tell them they're not enough? Then don't tell yourself that either.",
        "Five-year-old you didn't know what 'perfect' meant yet. They just wanted to belong. You still deserve to belong — without conditions.",
        "That child was already whole. Nothing was missing. Nothing needed to be fixed. That's still true.",
        "If five-year-old you was crying because they made a mistake, you'd kneel down and say: 'Hey. It's okay. Everyone makes mistakes.' Say it to yourself now."
    ];

    function initCompassion() {
        const modeBtns = document.querySelectorAll('[data-compassion-mode]');
        const friendMode = document.getElementById('compassion-friend-mode');
        const childMode = document.getElementById('compassion-child-mode');
        const friendBtn = document.getElementById('compassion-friend-btn');
        const childBtn = document.getElementById('compassion-child-btn');
        const response = document.getElementById('compassion-response');

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                response.classList.remove('show');
                if (btn.dataset.compassionMode === 'friend') {
                    friendMode.style.display = 'block';
                    childMode.style.display = 'none';
                } else {
                    friendMode.style.display = 'none';
                    childMode.style.display = 'block';
                }
            });
        });

        friendBtn.addEventListener('click', () => {
            const struggle = document.getElementById('compassion-struggle').value.trim();
            if (!struggle) return;
            const msg = getRandomItem(COMPASSION_FRIEND);
            showCompassionResponse(response, msg, struggle, 'friend');
            document.getElementById('compassion-struggle').value = '';
        });

        childBtn.addEventListener('click', () => {
            const struggle = document.getElementById('compassion-child-struggle').value.trim();
            if (!struggle) return;
            const msg = getRandomItem(COMPASSION_CHILD);
            showCompassionResponse(response, msg, struggle, 'child');
            document.getElementById('compassion-child-struggle').value = '';
        });

        renderCompassionHistory();
    }

    function showCompassionResponse(el, message, struggle, mode) {
        el.innerHTML = `<p class="compassion-response-text">${message}</p>`;
        el.classList.add('show');

        const entry = {
            id: Date.now(),
            struggle: struggle,
            response: message,
            mode: mode,
            date: new Date().toISOString()
        };
        const data = getData(KEYS.COMPASSION);
        data.unshift(entry);
        saveData(KEYS.COMPASSION, data.slice(0, 50));
        renderCompassionHistory();
    }

    function renderCompassionHistory() {
        const list = document.getElementById('compassion-list');
        const items = getData(KEYS.COMPASSION).slice(0, 5);
        if (items.length === 0) {
            list.innerHTML = '<p class="empty-state">Your compassion moments will appear here</p>';
            return;
        }
        list.innerHTML = items.map(c => `
            <div class="history-item">
                <div class="thought">"${c.struggle}"</div>
                <div class="reframe">${c.response}</div>
                <div class="date">${formatDate(c.date)}</div>
            </div>
        `).join('');
    }

    // ============================================
    // Comparison Detox
    // ============================================
    const COMPARE_REFRAMES = [
        "You're comparing your behind-the-scenes to someone else's highlight reel. You don't know their struggles, their doubts, their 3am thoughts. You only see the curated version.",
        "Comparison is odious — Shakespeare knew that centuries ago. The game is rigged: you'll always find someone who seems to be doing better. But 'seems' is the key word.",
        "That person you're comparing yourself to? They're probably comparing themselves to someone else right now. Nobody wins the comparison game. The only way to win is not to play.",
        "Social media shows you the painting, never the messy studio. The confident post, never the 47 drafts before it. You're comparing your rough draft to someone else's final edit.",
        "Other people's output is not your benchmark. You are living your life, with your brain, your energy, your circumstances. That's the only fair comparison — you versus yesterday's you.",
        "What if the person you're comparing yourself to is also pretending? Research shows most people curate their lives to look effortless. It's a facade — for almost everyone.",
        "Comparison steals the credit from what you actually accomplished. Your wins don't shrink because someone else also has wins."
    ];

    const COMPARE_RECLAIM_MESSAGES = [
        "That's yours. Nobody else's highlight reel changes that.",
        "Real. Solid. Yours. No comparison can take it away.",
        "See? You're not behind. You're right here, doing real things.",
        "That happened because of you. Hold onto it.",
        "This is what's real. Everything else is noise."
    ];

    function initCompare() {
        const detoxBtn = document.getElementById('compare-detox-btn');
        const response = document.getElementById('compare-response');
        const redirect = document.getElementById('compare-redirect');
        const reclaimBtn = document.getElementById('compare-redirect-btn');
        const reclaimEl = document.getElementById('compare-reclaim');

        detoxBtn.addEventListener('click', () => {
            const thought = document.getElementById('compare-thought').value.trim();
            if (!thought) return;

            const reframe = getRandomItem(COMPARE_REFRAMES);
            response.innerHTML = `<p>${reframe}</p>`;
            response.classList.add('show');
            redirect.style.display = 'block';

            const entry = {
                id: Date.now(),
                thought: thought,
                reframe: reframe,
                date: new Date().toISOString()
            };
            const data = getData(KEYS.COMPARISONS);
            data.unshift(entry);
            saveData(KEYS.COMPARISONS, data.slice(0, 50));

            document.getElementById('compare-thought').value = '';
            renderCompareHistory();
        });

        reclaimBtn.addEventListener('click', () => {
            const win = document.getElementById('compare-redirect-win').value.trim();
            if (!win) return;
            const msg = getRandomItem(COMPARE_RECLAIM_MESSAGES);
            reclaimEl.innerHTML = `<p class="compare-reclaim-text">${msg}</p>`;
            reclaimEl.classList.add('show');
            document.getElementById('compare-redirect-win').value = '';

            // Also save as a micro-win
            const winData = { id: Date.now(), text: win, date: new Date().toISOString() };
            const wins = getData(KEYS.WINS);
            wins.unshift(winData);
            saveData(KEYS.WINS, wins);
        });

        renderCompareHistory();
    }

    function renderCompareHistory() {
        const list = document.getElementById('compare-list');
        const items = getData(KEYS.COMPARISONS).slice(0, 5);
        if (items.length === 0) {
            list.innerHTML = '<li class="empty-state">Your detoxed comparisons will appear here</li>';
            return;
        }
        list.innerHTML = items.map(c => `
            <li>
                <span class="compare-text">${c.thought.substring(0, 60)}${c.thought.length > 60 ? '...' : ''}</span>
                <span class="compare-date">${formatDate(c.date)}</span>
            </li>
        `).join('');
    }

    // ============================================
    // Mattering Reminders
    // ============================================
    const MATTERING_VALUED_PROMPTS = [
        "Who is one person who would notice if you weren't here tomorrow? What do they see in you that has nothing to do with your achievements?",
        "Think of a time someone was genuinely glad to see you — not for what you could do for them, but just because you showed up. What was that like?",
        "What's one quality about you that has nothing to do with productivity, success, or appearance? Something that just... is you.",
        "If someone who loves you had to describe you without mentioning your job, your grades, or anything you've accomplished — what would they say?",
        "When was the last time someone thanked you — not for a task, but for being you? If you can't remember one, that doesn't mean it didn't happen. It means you weren't counting.",
        "You matter to someone right now, in this moment, whether you know it or not. Who might that be?"
    ];

    const MATTERING_ADDVALUE_PROMPTS = [
        "Who relied on you recently — even in a small way? A text reply, holding a door, listening for a moment. What did you give them?",
        "Think of someone whose day you made a little better this week. It doesn't have to be dramatic. A smile counts. Showing up counts.",
        "What's one thing you do for others that you rarely get credit for? The invisible labor, the quiet kindness, the things no one sees.",
        "Is there someone who feels safer, calmer, or less alone because you exist in their life? Who is that person?",
        "What's something you contribute to your household, your family, your community, or your friendships that would be missed if you stopped?",
        "When was the last time you helped someone without being asked? What moved you to do it?"
    ];

    const MATTERING_RESPONSES = [
        "This is real. This is evidence that you matter — not for what you produce, but for who you are.",
        "Read that back to yourself. That's not nothing. That's proof of your place in this world.",
        "You matter. Not because of what you do. Because of who you are to the people around you.",
        "This is the kind of thing perfectionism wants you to overlook. Don't let it. You matter here.",
        "Saved. Come back and read this on the days when the voice says you're not enough."
    ];

    function initMattering() {
        const modeBtns = document.querySelectorAll('[data-mattering-mode]');
        const valuedMode = document.getElementById('mattering-valued-mode');
        const addvalueMode = document.getElementById('mattering-addvalue-mode');
        const valuedPromptEl = document.getElementById('mattering-valued-prompt');
        const addvaluePromptEl = document.getElementById('mattering-addvalue-prompt');
        const feedback = document.getElementById('mattering-feedback');

        function showPrompt(el, prompts) {
            el.innerHTML = `<p class="mattering-prompt-text">${getRandomItem(prompts)}</p>`;
        }

        // Initial prompts
        showPrompt(valuedPromptEl, MATTERING_VALUED_PROMPTS);
        showPrompt(addvaluePromptEl, MATTERING_ADDVALUE_PROMPTS);

        // Mode switching
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (btn.dataset.matteringMode === 'valued') {
                    valuedMode.style.display = 'block';
                    addvalueMode.style.display = 'none';
                } else {
                    valuedMode.style.display = 'none';
                    addvalueMode.style.display = 'block';
                }
            });
        });

        // Skip buttons
        document.getElementById('mattering-valued-skip').addEventListener('click', () => {
            showPrompt(valuedPromptEl, MATTERING_VALUED_PROMPTS);
        });
        document.getElementById('mattering-addvalue-skip').addEventListener('click', () => {
            showPrompt(addvaluePromptEl, MATTERING_ADDVALUE_PROMPTS);
        });

        // Save buttons
        document.getElementById('mattering-valued-btn').addEventListener('click', () => {
            const text = document.getElementById('mattering-valued-text').value.trim();
            if (!text) return;
            saveMatteringEntry(text, 'valued', valuedPromptEl.textContent, feedback);
            document.getElementById('mattering-valued-text').value = '';
            showPrompt(valuedPromptEl, MATTERING_VALUED_PROMPTS);
        });

        document.getElementById('mattering-addvalue-btn').addEventListener('click', () => {
            const text = document.getElementById('mattering-addvalue-text').value.trim();
            if (!text) return;
            saveMatteringEntry(text, 'addvalue', addvaluePromptEl.textContent, feedback);
            document.getElementById('mattering-addvalue-text').value = '';
            showPrompt(addvaluePromptEl, MATTERING_ADDVALUE_PROMPTS);
        });

        renderMatteringHistory();
    }

    function saveMatteringEntry(text, mode, prompt, feedback) {
        const entry = {
            id: Date.now(),
            text: text,
            mode: mode,
            prompt: prompt,
            date: new Date().toISOString()
        };
        const data = getData(KEYS.MATTERING);
        data.unshift(entry);
        saveData(KEYS.MATTERING, data.slice(0, 50));
        showFeedback(feedback, getRandomItem(MATTERING_RESPONSES), 'success');
        renderMatteringHistory();
    }

    function renderMatteringHistory() {
        const list = document.getElementById('mattering-list');
        const items = getData(KEYS.MATTERING).slice(0, 8);
        if (items.length === 0) {
            list.innerHTML = '<li class="empty-state">Your mattering reminders will appear here</li>';
            return;
        }
        list.innerHTML = items.map(m => `
            <li>
                <span class="mattering-text">${m.text.substring(0, 60)}${m.text.length > 60 ? '...' : ''}</span>
                <span class="mattering-date">${formatDate(m.date)}</span>
            </li>
        `).join('');
    }

    // ============================================
    // Wind Down / Sleep Mode
    // ============================================
    const WINDDOWN_RELEASE_MESSAGES = [
        "Set down. It's not yours to carry tonight.",
        "Released. That thought can wait until morning.",
        "Put down. Your pillow doesn't need to hold this too.",
        "Let go for now. Tomorrow-you can pick it back up if needed.",
        "Down it goes. One less thing between you and rest."
    ];

    const WINDDOWN_CLOSING = [
        "You've set down what you were carrying. The thoughts may try to come back — that's okay. You've already practiced letting go once tonight. You can do it again.\n\nThe day is done. You don't need to solve anything else. Sleep is not a reward for a productive day. It's a human need, and you deserve it.",
        "Look at what you put down. Those thoughts felt urgent, but they'll still be there tomorrow if they need to be. Tonight, they don't need you.\n\nYour brain is trying to protect you by replaying things. But you're safe. Nothing needs to be solved right now. Let your body rest.",
        "Every thought you released was a small act of self-compassion. You chose rest over rumination. That's not lazy — that's brave.\n\nThe mistakes you're replaying? They're proof you care. But caring doesn't require losing sleep. Goodnight.",
        "You showed up today. You did what you could. The parts that didn't go perfectly? They're human. You're human.\n\nNobody is lying awake judging you as harshly as you judge yourself. Let that sink in. Now let yourself sink into rest."
    ];

    function initWinddown() {
        const releaseBtn = document.getElementById('winddown-release-btn');
        const nextBtn = document.getElementById('winddown-next-btn');
        const pile = document.getElementById('winddown-pile');
        const input = document.getElementById('winddown-thought');
        let releasedThoughts = [];

        releaseBtn.addEventListener('click', () => {
            const thought = input.value.trim();
            if (!thought) return;

            releasedThoughts.push(thought);
            input.value = '';

            const msg = getRandomItem(WINDDOWN_RELEASE_MESSAGES);
            const item = document.createElement('div');
            item.className = 'winddown-pile-item';
            item.innerHTML = `
                <span class="winddown-pile-thought">${thought}</span>
                <span class="winddown-pile-msg">${msg}</span>
            `;
            pile.appendChild(item);

            nextBtn.style.display = 'block';
            input.focus();
        });

        nextBtn.addEventListener('click', () => {
            document.getElementById('winddown-step-1').style.display = 'none';
            document.getElementById('winddown-step-2').style.display = 'block';

            const closing = document.getElementById('winddown-closing');
            const msg = getRandomItem(WINDDOWN_CLOSING);
            closing.innerHTML = `
                <span class="winddown-closing-icon">&#9790;</span>
                <p class="winddown-closing-count">You set down <strong>${releasedThoughts.length} thought${releasedThoughts.length === 1 ? '' : 's'}</strong> tonight.</p>
                <p class="winddown-closing-message">${msg.replace(/\n/g, '<br>')}</p>
            `;
            closing.classList.add('show');

            // Save
            const entry = {
                id: Date.now(),
                thoughts: [...releasedThoughts],
                date: new Date().toISOString()
            };
            const data = getData(KEYS.WINDDOWNS);
            data.unshift(entry);
            saveData(KEYS.WINDDOWNS, data.slice(0, 30));
            renderWinddownHistory();
        });

        document.getElementById('winddown-reset').addEventListener('click', () => {
            releasedThoughts = [];
            pile.innerHTML = '';
            nextBtn.style.display = 'none';
            document.getElementById('winddown-step-2').style.display = 'none';
            document.getElementById('winddown-step-1').style.display = 'block';
            document.getElementById('winddown-closing').classList.remove('show');
        });

        renderWinddownHistory();
    }

    function renderWinddownHistory() {
        const list = document.getElementById('winddown-list');
        const items = getData(KEYS.WINDDOWNS).slice(0, 5);
        if (items.length === 0) {
            list.innerHTML = '<li class="empty-state">Your wind-downs will appear here</li>';
            return;
        }
        list.innerHTML = items.map(w => `
            <li>
                <span class="winddown-history-text">${w.thoughts.length} thought${w.thoughts.length === 1 ? '' : 's'} released</span>
                <span class="winddown-history-date">${formatDate(w.date)}</span>
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
        const reflections = getData(KEYS.REFLECTIONS);
        const compassion = getData(KEYS.COMPASSION);
        const comparisons = getData(KEYS.COMPARISONS);
        const mattering = getData(KEYS.MATTERING);
        const winddowns = getData(KEYS.WINDDOWNS);

        // Update stats
        document.getElementById('total-checkins').textContent = checkins.length;
        document.getElementById('total-wins').textContent = wins.length;
        document.getElementById('total-releases').textContent = releases.length;
        document.getElementById('total-reframes').textContent = reframes.length;
        document.getElementById('total-reflections').textContent = reflections.length;
        document.getElementById('total-compassion').textContent = compassion.length;
        document.getElementById('total-detoxes').textContent = comparisons.length;
        document.getElementById('total-mattering').textContent = mattering.length;
        document.getElementById('total-winddowns').textContent = winddowns.length;

        // Render check-in chart (last 7 days)
        renderCheckinChart(checkins);

        // Render recent activity
        renderRecentActivity(checkins, wins, releases, reframes, reflections);
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

    function renderRecentActivity(checkins, wins, releases, reframes, reflections) {
        const activityList = document.getElementById('activity-list');
        const compassion = getData(KEYS.COMPASSION);
        const comparisons = getData(KEYS.COMPARISONS);
        const mattering = getData(KEYS.MATTERING);
        const winddowns = getData(KEYS.WINDDOWNS);

        // Combine all activities
        const all = [
            ...checkins.slice(0, 3).map(c => ({ type: 'Check-in', date: c.date, detail: `Level ${c.value}` })),
            ...wins.slice(0, 3).map(w => ({ type: 'Win', date: w.date, detail: w.text })),
            ...releases.slice(0, 3).map(r => ({ type: 'Released', date: r.date, detail: r.text })),
            ...reframes.slice(0, 3).map(r => ({ type: 'Reframe', date: r.date, detail: '' })),
            ...reflections.slice(0, 3).map(r => ({ type: 'Reflection', date: r.date, detail: `${r.items.length} thing${r.items.length === 1 ? '' : 's'}` })),
            ...compassion.slice(0, 3).map(c => ({ type: 'Compassion', date: c.date, detail: c.mode })),
            ...comparisons.slice(0, 3).map(c => ({ type: 'Detox', date: c.date, detail: '' })),
            ...mattering.slice(0, 3).map(m => ({ type: 'Mattering', date: m.date, detail: m.mode })),
            ...winddowns.slice(0, 3).map(w => ({ type: 'Wind-down', date: w.date, detail: `${w.thoughts.length} thought${w.thoughts.length === 1 ? '' : 's'}` }))
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
    // End of Day Reflection
    // ============================================
    const TRAP_RESPONSES = {
        goalposts: [
            "Notice that: you finished something, and instead of letting it count, you raised the bar. The goalpost moved — but you didn't fail. The game changed without your permission.",
            "The finish line isn't real. Your brain invented it, then moved it. What you did today was real. That's what counts.",
            "You could cure a disease and your brain would ask why you didn't cure two. The goalpost trick is one of perfectionism's oldest moves. Don't fall for it."
        ],
        comparing: [
            "You're comparing your behind-the-scenes to someone else's highlight reel. You don't know what they didn't do today. You only know what you did. And it was enough.",
            "Other people's output is not your benchmark. You are living your life, with your brain, your energy, your circumstances. That's the only fair comparison.",
            "Comparison steals the credit from what you actually accomplished. Those things you did today? They happened. No one else's day changes that."
        ],
        discounting: [
            "You just listed real things you did, and now you're trying to un-count them. That's the anxiety talking. Read your list again — slowly. Those things happened because of you.",
            "'That doesn't count' is a lie perfectionism tells to keep you running. Everything counts. The small stuff especially.",
            "If a friend told you they did these things, you'd say 'that's great.' Try giving yourself that same grace."
        ],
        shouldhave: [
            "The 'should have' list is infinite. It will never be empty. But the 'what I did' list is real and finite, and you just wrote it down. Stay with what's real.",
            "You're grieving a fantasy version of today that never existed. The actual today had you in it, doing actual things. That's the one that matters.",
            "Focusing on what you didn't do is like looking at a painting and only seeing the blank canvas around it. The painting is there. Look at the painting."
        ]
    };

    const CLOSING_MESSAGES = [
        "The day is closed. Not because everything got done — because you decided to stop carrying it. Sleep is not a reward for productivity. It's a human need. Go rest.",
        "You showed up today. In all the ways you listed, and probably in ways you forgot to mention. The day is done. Let it be done.",
        "Look at that list one more time. That was you. That was today. Tomorrow will bring its own list. Tonight, this one is finished.",
        "The day doesn't need your permission to end. But you gave it a proper goodbye, and that matters. You did enough. Goodnight.",
        "Every single thing on your list was a choice you made to show up. The day is over now. You can put it down."
    ];

    function initReflect() {
        const itemInput = document.getElementById('reflect-item-input');
        const addBtn = document.getElementById('add-reflect-item');
        const nextBtn = document.getElementById('reflect-next');
        const closeBtn = document.getElementById('close-the-day');
        const entriesContainer = document.getElementById('reflect-entries');
        const trapBtns = document.querySelectorAll('.trap-btn');

        let reflectItems = [];

        function renderEntries() {
            if (reflectItems.length === 0) {
                entriesContainer.innerHTML = '';
                nextBtn.disabled = true;
                return;
            }

            nextBtn.disabled = false;
            entriesContainer.innerHTML = reflectItems.map((item, i) => `
                <div class="reflect-entry">
                    <span class="reflect-entry-text">${item}</span>
                    <button class="reflect-entry-remove" data-index="${i}" aria-label="Remove">&times;</button>
                </div>
            `).join('');

            // Attach remove handlers
            entriesContainer.querySelectorAll('.reflect-entry-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    reflectItems.splice(parseInt(btn.dataset.index), 1);
                    renderEntries();
                });
            });
        }

        function addItem() {
            const text = itemInput.value.trim();
            if (!text) return;
            reflectItems.push(text);
            itemInput.value = '';
            renderEntries();
            itemInput.focus();
        }

        addBtn.addEventListener('click', addItem);
        itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addItem();
        });

        // Step 1 → Step 2: Show summary
        nextBtn.addEventListener('click', () => {
            document.getElementById('reflect-step-1').style.display = 'none';
            document.getElementById('reflect-step-2').style.display = 'block';

            const summary = document.getElementById('reflect-summary');
            const count = reflectItems.length;
            const countWord = count === 1 ? 'one thing' : count + ' things';

            summary.innerHTML = `
                <p class="reflect-count">You did <strong>${countWord}</strong> today.</p>
                <ul class="reflect-summary-list">
                    ${reflectItems.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <p class="reflect-affirmation">Read that list. That was you. That was real.</p>
            `;

            summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        // Trap buttons
        trapBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                trapBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const trap = btn.dataset.trap;
                const response = getRandomItem(TRAP_RESPONSES[trap]);

                const responseEl = document.getElementById('trap-response');
                responseEl.innerHTML = `<p>${response}</p>`;
                responseEl.classList.add('show');
            });
        });

        // Close the day
        closeBtn.addEventListener('click', () => {
            document.getElementById('reflect-step-2').style.display = 'none';
            document.getElementById('reflect-step-3').style.display = 'block';

            const closedEl = document.getElementById('reflect-closed');
            closedEl.innerHTML = `
                <span class="reflect-closed-icon">&#9790;</span>
                <p class="reflect-closed-message">${getRandomItem(CLOSING_MESSAGES)}</p>
                <button class="secondary-btn" id="reflect-reset">Start a new reflection</button>
            `;
            closedEl.classList.add('show');

            // Save the reflection
            const reflection = {
                id: Date.now(),
                items: [...reflectItems],
                date: new Date().toISOString()
            };
            const reflections = getData(KEYS.REFLECTIONS);
            reflections.unshift(reflection);
            saveData(KEYS.REFLECTIONS, reflections.slice(0, 30));

            renderReflectHistory();

            // Reset button
            document.getElementById('reflect-reset').addEventListener('click', () => {
                reflectItems = [];
                renderEntries();
                document.getElementById('reflect-step-3').style.display = 'none';
                document.getElementById('reflect-step-1').style.display = 'block';
                document.getElementById('trap-response').classList.remove('show');
                document.querySelectorAll('.trap-btn').forEach(b => b.classList.remove('active'));
                document.getElementById('reflect-closed').classList.remove('show');
            });
        });

        renderReflectHistory();
    }

    function renderReflectHistory() {
        const list = document.getElementById('reflect-list');
        const reflections = getData(KEYS.REFLECTIONS).slice(0, 5);

        if (reflections.length === 0) {
            list.innerHTML = '<li class="empty-state">Your reflections will appear here</li>';
            return;
        }

        list.innerHTML = reflections.map(r => `
            <li>
                <span class="reflect-history-text">${r.items.length} thing${r.items.length === 1 ? '' : 's'} done</span>
                <span class="reflect-history-date">${formatDate(r.date)}</span>
            </li>
        `).join('');
    }

    // ============================================
    // Welcome Affirmation
    // ============================================
    function initAffirmation() {
        const overlay = document.getElementById('affirmation-overlay');
        const textEl = document.getElementById('affirmation-text');
        const dismissBtn = document.getElementById('affirmation-dismiss');

        if (!overlay || !textEl || !dismissBtn) return;

        // Show random affirmation
        const affirmation = getRandomItem(AFFIRMATIONS);
        textEl.textContent = affirmation;

        // Dismiss on button click
        dismissBtn.addEventListener('click', () => {
            overlay.style.animation = 'affirmationFadeIn 0.3s ease reverse';
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        });

        // Also dismiss on overlay click (outside card)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                dismissBtn.click();
            }
        });
    }

    // ============================================
    // Initialize App
    // ============================================
    function init() {
        initAffirmation();
        initNavigation();
        initCheckin();
        initBreathe();
        initReframe();
        initWins();
        initEnough();
        initCompassion();
        initCompare();
        initMattering();
        initWinddown();
        initReflect();
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
