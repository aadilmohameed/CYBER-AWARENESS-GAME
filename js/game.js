/**
 * game.js — Cyber Shield v2.0 Game Logic
 * Handles all game state, UI rendering, audio, timer, badges, leaderboard,
 * simulator UIs (email, phone, browser, ransomware), consequence overlays,
 * compliance panels, difficulty system, and hint system.
 */

/* ============================================================
   AUDIO ENGINE — Web Audio API for procedural sound effects
   No external audio files required
   ============================================================ */
const AudioEngine = {
  ctx: null,
  enabled: true,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.enabled = false;
    }
  },

  _tone(freq, duration, type = 'sine', vol = 0.25, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime  + delay + duration);
    } catch (e) { /* ignore */ }
  },

  correct()      { [[523,0],[659,0.1],[784,0.2]].forEach(([f,d]) => this._tone(f, 0.2, 'sine',     0.3,  d)); },
  wrong()        { [[220,0],[180,0.12]].forEach(([f,d])           => this._tone(f, 0.15,'square',   0.2,  d)); },
  levelUp()      { [[523,0],[659,0.1],[784,0.2],[1047,0.3]].forEach(([f,d]) => this._tone(f,0.25,'sine',0.3,d)); },
  click()        { this._tone(900,  0.04, 'sine',     0.1); },
  timerWarning() { this._tone(440,  0.08, 'square',   0.12); },
  badge()        { [[880,0],[1100,0.1],[1320,0.2],[1760,0.35]].forEach(([f,d]) => this._tone(f,0.25,'triangle',0.2,d)); },
  breach()       { [[180,0],[120,0.15],[80,0.35]].forEach(([f,d]) => this._tone(f, 0.3, 'sawtooth', 0.3, d)); },
  safe()         { [[440,0],[550,0.12],[660,0.25],[880,0.4]].forEach(([f,d]) => this._tone(f,0.2,'sine',0.25,d)); }
};


/* ============================================================
   GAME STATE — Single source of truth for all game data
   ============================================================ */
const State = {
  playerName:    'Agent',
  score:         0,
  totalCorrect:  0,
  totalAnswered: 0,
  earnedBadges:  [],
  completedLevels: [],
  levelScores:   {},

  currentLevelIndex:    0,
  currentQuestionIndex: 0,
  levelCorrect:         0,
  levelPoints:          0,
  questionAnswered:     false,

  // Timer
  timerInterval: null,
  timerValue:    30,

  // Difficulty
  difficulty:   'medium',  // 'easy' | 'medium' | 'hard'
  diffMultiplier: 1,        // points multiplier

  // Hints (Easy mode only)
  hintsRemaining: 0,        // per question

  // UI
  darkMode:     true,
  soundEnabled: true,

  // Consequence overlay
  consequenceInterval:  null,
  consequenceCallback:  null
};


/* ============================================================
   DOM HELPERS
   ============================================================ */
const $ = id => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = $(`screen-${name}`);
  if (screen) screen.classList.add('active');
}

function animateScore(value) {
  const el = $('score-display');
  if (!el) return;
  el.textContent = value;
  el.classList.remove('score-animate');
  void el.offsetWidth;
  el.classList.add('score-animate');
}


/* ============================================================
   DIFFICULTY SYSTEM
   ============================================================ */
function setDifficulty(diff) {
  State.difficulty = diff;

  // Update pill active state
  document.querySelectorAll('.diff-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.diff === diff);
  });

  // Set multiplier
  const multipliers = { easy: 0.75, medium: 1, hard: 1.25 };
  State.diffMultiplier = multipliers[diff] || 1;

  AudioEngine.click();
}

function getDifficultyTimer() {
  return { easy: 45, medium: 30, hard: 20 }[State.difficulty] || 30;
}

function getDifficultyLabel() {
  return { easy: 'EASY', medium: 'MED', hard: 'HARD' }[State.difficulty] || 'MED';
}

function getDifficultyFullLabel() {
  return { easy: 'Easy Difficulty', medium: 'Medium Difficulty', hard: 'Hard Difficulty' }[State.difficulty] || 'Medium Difficulty';
}

function getOptions(question) {
  if (State.difficulty === 'hard' && question.hardOptions) {
    return question.hardOptions;
  }
  return question.options;
}


/* ============================================================
   MATRIX RAIN ANIMATION
   ============================================================ */
function initMatrixRain() {
  const canvas = $('matrix-canvas');
  const ctx    = canvas.getContext('2d');

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const chars   = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]!@#$%^&*';
  const fontSize = 14;
  let drops = [];

  const initDrops = () => {
    const cols = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  };
  initDrops();
  window.addEventListener('resize', initDrops);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00d4ff';
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.globalAlpha = Math.random() * 0.7 + 0.3;
      ctx.fillText(char, i * fontSize, y * fontSize);
      ctx.globalAlpha = 1;
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    });
  }

  setInterval(drawMatrix, 40);
}


/* ============================================================
   TIMER — Circular SVG countdown with color transitions
   ============================================================ */
function startTimer() {
  const max = getDifficultyTimer();
  State.timerValue = max;
  updateTimerDisplay(max, max);
  clearInterval(State.timerInterval);

  State.timerInterval = setInterval(() => {
    State.timerValue--;
    updateTimerDisplay(State.timerValue, max);

    if (State.timerValue <= 10) {
      $('timer-container').classList.add('timer-warning');
      if (State.timerValue % 3 === 0 && State.soundEnabled) AudioEngine.timerWarning();
    }

    if (State.timerValue <= 0) {
      clearInterval(State.timerInterval);
      if (!State.questionAnswered) handleAnswer(-1);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(State.timerInterval);
  $('timer-container').classList.remove('timer-warning');
}

function updateTimerDisplay(value, max) {
  const display = $('timer-display');
  const ring    = $('timer-ring');
  if (!display || !ring) return;

  // Guard: max might be undefined when called during init
  const total = max || getDifficultyTimer();

  display.textContent = value;

  const offset = 100 - (value / total) * 100;
  ring.style.strokeDashoffset = offset;

  if (value <= 5) {
    ring.style.stroke  = '#ff3366';
    display.style.color = '#ff3366';
  } else if (value <= 10) {
    ring.style.stroke  = '#fbbf24';
    display.style.color = '#fbbf24';
  } else {
    ring.style.stroke  = '#00d4ff';
    display.style.color = '';
  }
}


/* ============================================================
   LEADERBOARD — localStorage, top 10 entries
   ============================================================ */
function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem('cyberShieldLeaderboard') || '[]'); }
  catch { return []; }
}

function saveToLeaderboard(name, score) {
  const lb = getLeaderboard();
  lb.push({ name, score, difficulty: State.difficulty, date: new Date().toLocaleDateString() });
  lb.sort((a, b) => b.score - a.score);
  const top10 = lb.slice(0, 10);
  try { localStorage.setItem('cyberShieldLeaderboard', JSON.stringify(top10)); }
  catch { /* Storage full */ }
  return top10;
}


/* ============================================================
   BADGE SYSTEM
   ============================================================ */
function awardBadge(badge) {
  if (State.earnedBadges.find(b => b.name === badge.name)) return false;
  State.earnedBadges.push(badge);
  showBadgePopup(badge);
  if (State.soundEnabled) AudioEngine.badge();
  return true;
}

function showBadgePopup(badge) {
  const popup = $('badge-notification');
  $('badge-popup-icon').textContent = badge.icon;
  $('badge-popup-name').textContent = badge.name;
  popup.classList.remove('hidden');
  popup.style.animation = 'none';
  void popup.offsetWidth;
  popup.style.animation = 'slideInRight 0.4s ease';

  setTimeout(() => {
    popup.style.animation = 'slideOutRight 0.4s ease forwards';
    setTimeout(() => popup.classList.add('hidden'), 450);
  }, 3200);
}


/* ============================================================
   LANDING SCREEN
   ============================================================ */
function initLanding() {
  $('btn-start').addEventListener('click', () => {
    const name = $('player-name').value.trim();
    State.playerName = name || 'Agent';
    AudioEngine.init();
    if (State.soundEnabled) AudioEngine.click();
    showLevelSelect();
  });

  $('player-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('btn-start').click();
  });
}


/* ============================================================
   LEVEL SELECT SCREEN
   ============================================================ */
function showLevelSelect() {
  $('player-greeting').textContent     = `Agent: ${State.playerName}`;
  $('header-score-display').textContent = `Score: ${State.score}`;
  $('diff-badge-levels').textContent    = getDifficultyLabel();
  renderBadgesMini();
  renderLevelCards();
  showScreen('levels');
}

function renderBadgesMini() {
  $('badges-mini-display').innerHTML = State.earnedBadges
    .map(b => `<span class="badge-mini-icon" title="${b.name}">${b.icon}</span>`)
    .join('');
}

function renderLevelCards() {
  $('levels-grid').innerHTML = GAME_DATA.levels.map((level, i) => {
    const completed  = State.completedLevels.includes(i);
    const locked     = i > 0 && !State.completedLevels.includes(i - 1);
    const levelScore = State.levelScores[i];

    let statusClass = 'status-available';
    let statusText  = '▶ AVAILABLE';
    let cardClass   = '';

    if (locked)    { statusClass = 'status-locked';    statusText = '🔒 LOCKED';   cardClass = 'locked';    }
    if (completed) { statusClass = 'status-completed'; statusText = '✓ COMPLETED'; cardClass = 'completed'; }

    return `
      <div class="level-card ${cardClass}"
           data-level="${i}"
           style="--level-color: ${level.color}"
           onclick="handleLevelCardClick(${i})">
        <div class="level-card-header">
          <div class="level-card-icon">${level.icon}</div>
          <div class="level-card-info">
            <div class="level-card-num">Mission ${i + 1} of ${GAME_DATA.levels.length}</div>
            <div class="level-card-title">${level.title}</div>
          </div>
        </div>
        <div class="level-card-desc">${level.description}</div>
        <div class="level-card-footer">
          <span class="level-card-status ${statusClass}">${statusText}</span>
          ${levelScore !== undefined
            ? `<span class="level-card-score">⭐ ${levelScore} pts</span>`
            : `<span class="level-card-questions">${level.questions.length} scenarios</span>`}
        </div>
      </div>
    `;
  }).join('');
}

function handleLevelCardClick(index) {
  const locked = index > 0 && !State.completedLevels.includes(index - 1);
  if (locked) {
    const card = document.querySelector(`[data-level="${index}"]`);
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'shake 0.4s ease';
    return;
  }
  if (State.soundEnabled) AudioEngine.click();
  startLevel(index);
}


/* ============================================================
   GAME PLAY — Core question loop
   ============================================================ */
function startLevel(levelIndex) {
  const level = GAME_DATA.levels[levelIndex];

  State.currentLevelIndex    = levelIndex;
  State.currentQuestionIndex = 0;
  State.levelCorrect         = 0;
  State.levelPoints          = 0;
  State.questionAnswered     = false;

  $('level-indicator').textContent = `Level ${levelIndex + 1}`;
  $('level-banner-icon').textContent = level.icon;
  $('level-banner-name').textContent = level.title;
  $('level-theme-banner').style.setProperty('--banner-color', level.color);
  $('diff-badge-game').textContent = getDifficultyLabel();

  showScreen('game');
  showQuestion();
}

function showQuestion() {
  const level    = GAME_DATA.levels[State.currentLevelIndex];
  const question = level.questions[State.currentQuestionIndex];
  const qNum     = State.currentQuestionIndex + 1;
  const totalQ   = level.questions.length;

  $('question-counter').textContent = `Q ${qNum} / ${totalQ}`;
  $('score-display').textContent    = State.score;

  const totalAllQ = GAME_DATA.levels.reduce((s, l) => s + l.questions.length, 0);
  const doneQ     = State.completedLevels.length * 3 + State.currentQuestionIndex;
  $('progress-bar').style.width = `${(doneQ / totalAllQ) * 100}%`;

  // Update level type badge
  const typeBadges = {
    email:      'EMAIL SIMULATION',
    phone:      'PHONE SIMULATION',
    browser:    'BROWSER SIMULATION',
    ransomware: 'RANSOMWARE INCIDENT',
    scenario:   'SCENARIO'
  };
  $('level-type-badge').textContent = typeBadges[question.type] || 'SCENARIO';

  // Hint button — Easy mode only
  const hintBtn = $('hint-btn');
  if (State.difficulty === 'easy') {
    State.hintsRemaining = 1;
    $('hints-remaining').textContent = State.hintsRemaining;
    hintBtn.classList.remove('hidden');
    hintBtn.disabled = false;
    hintBtn.classList.remove('hint-used');
  } else {
    hintBtn.classList.add('hidden');
  }

  // Reset question state
  State.questionAnswered = false;
  $('timer-container').classList.remove('timer-warning');

  // Render question based on type
  renderQuestion(question);
  startTimer();
}

/* ─── Question Type Dispatcher ─────────────────────────────── */
function renderQuestion(question) {
  $('question-text').textContent = question.question;

  switch (question.type) {
    case 'email':      renderEmailSimulator(question);  break;
    case 'phone':      renderPhoneUI(question);         break;
    case 'browser':    renderBrowserUI(question);       break;
    case 'ransomware': renderRansomwareUI(question);    break;
    default:           renderScenario(question);        break;
  }

  // Render answer options (use hardOptions on Hard difficulty)
  const options = getOptions(question);
  const letters = ['A', 'B', 'C', 'D'];
  $('options-grid').innerHTML = options.map((opt, i) => `
    <button class="option-btn" data-index="${i}" onclick="handleAnswer(${i})">
      <span class="option-letter">${letters[i]}</span>
      <span class="option-text">${opt}</span>
    </button>
  `).join('');
}

/* ─── Scenario (plain text) ────────────────────────────────── */
function renderScenario(question) {
  const box = $('scenario-box');
  box.className = 'scenario-box';
  box.textContent = question.scenario;
}

/* ─── Email Simulator ───────────────────────────────────────── */
function renderEmailSimulator(question) {
  const box = $('scenario-box');
  box.className = 'scenario-box email-mode';

  const ui  = question.emailUI;
  const isGmail = ui.client === 'Gmail';
  const priorityBadge = ui.priority === 'high'
    ? `<span class="em-priority-badge">⚠️ HIGH PRIORITY</span>`
    : '';

  const attachmentsHTML = ui.attachments && ui.attachments.length
    ? `<div class="em-attachments">
         <div class="em-attach-label">📎 Attachments:</div>
         ${ui.attachments.map(a => `
           <div class="em-attach-item ${a.suspicious ? 'em-attach-suspicious' : ''}">
             <span>${a.icon} ${a.name}</span>
             <span class="em-attach-size">${a.size}</span>
             ${a.suspicious ? '<span class="em-attach-warning">⚠ Suspicious</span>' : ''}
           </div>
         `).join('')}
       </div>`
    : '';

  const redFlagsHTML = ui.redFlags && ui.redFlags.length
    ? `<div class="em-red-flags hidden" id="email-red-flags">
         <div class="em-flags-title">🔍 Security Analysis</div>
         ${ui.redFlags.map(f => `
           <div class="em-flag-item">
             <span class="em-flag-icon">${f.icon}</span>
             <div>
               <span class="em-flag-category">${f.category}</span>
               <span class="em-flag-text">${f.text}</span>
             </div>
           </div>
         `).join('')}
       </div>`
    : '';

  box.innerHTML = `
    <div class="email-simulator ${isGmail ? 'gmail-theme' : 'outlook-theme'}">
      <div class="em-toolbar">
        <div class="em-toolbar-left">
          <span class="em-client-name">${ui.client}</span>
        </div>
        <div class="em-toolbar-right">
          ${ui.redFlags && ui.redFlags.length
            ? `<button class="em-analyse-btn" onclick="toggleEmailAnalysis()" aria-label="Analyse email for red flags">
                 🔍 Analyse
               </button>`
            : ''}
        </div>
      </div>

      <div class="em-header">
        <div class="em-row">
          <span class="em-label">FROM</span>
          <span class="em-address">
            <span class="em-display-name">${escHtml(ui.from.displayName)}</span>
            <span class="em-addr-bracket">&lt;</span><span class="em-from-addr">${escHtml(ui.from.address)}</span><span class="em-addr-bracket">&gt;</span>
          </span>
        </div>
        <div class="em-row">
          <span class="em-label">TO</span>
          <span class="em-address">${escHtml(ui.to)}</span>
        </div>
        <div class="em-row">
          <span class="em-label">SUBJECT</span>
          <span class="em-subject">${escHtml(ui.subject)}</span>
          ${priorityBadge}
        </div>
        <div class="em-row">
          <span class="em-label">DATE</span>
          <span class="em-date">${escHtml(ui.date)}</span>
        </div>
      </div>

      <div class="em-body">
        ${buildEmailBody(ui.body)}
      </div>

      ${attachmentsHTML}
      ${redFlagsHTML}
    </div>
  `;
}

function buildEmailBody(items) {
  return items.map(item => {
    switch (item.type) {
      case 'p':
        if (item.html) return `<p class="em-para">${item.html}</p>`;
        return `<p class="em-para">${escHtml(item.text)}</p>`;

      case 'link':
        return `<div class="em-cta-block">
          <span class="phishing-link"
                onmouseenter="showUrlTooltip(this, event)"
                onmouseleave="hideUrlTooltip()"
                data-real-url="${escHtml(item.realUrl)}"
                role="link"
                tabindex="0">
            ${escHtml(item.text)}
          </span>
        </div>`;

      case 'divider':
        return `<hr class="em-divider" />`;

      case 'footer':
        return `<p class="em-footer">${escHtml(item.text)}</p>`;

      default:
        return `<p class="em-para">${escHtml(item.text || '')}</p>`;
    }
  }).join('');
}

function toggleEmailAnalysis() {
  const panel = $('email-red-flags');
  if (!panel) return;
  panel.classList.toggle('hidden');
  const btn = document.querySelector('.em-analyse-btn');
  if (btn) btn.textContent = panel.classList.contains('hidden') ? '🔍 Analyse' : '🔍 Hide Analysis';
}

/* ─── URL Tooltip (phishing link hover) ────────────────────── */
function showUrlTooltip(el, event) {
  const tooltip = $('url-tooltip');
  $('url-tooltip-value').textContent = el.dataset.realUrl || '(unknown)';
  tooltip.classList.remove('hidden');

  // Position near the element
  const rect = el.getBoundingClientRect();
  tooltip.style.left = Math.min(rect.left, window.innerWidth - 360) + 'px';
  tooltip.style.top  = (rect.bottom + 8) + 'px';
}

function hideUrlTooltip() {
  $('url-tooltip').classList.add('hidden');
}

/* ─── Phone UI ──────────────────────────────────────────────── */
function renderPhoneUI(question) {
  const box = $('scenario-box');
  box.className = 'scenario-box';
  const ui = question.phoneUI;

  box.innerHTML = `
    <div class="phone-simulator">
      <div class="phone-screen">
        <div class="phone-status-bar">
          <span>📶</span><span>🔋</span>
        </div>
        <div class="phone-incoming">INCOMING CALL</div>
        <div class="phone-caller">${escHtml(ui.caller)}</div>
        <div class="phone-number">${escHtml(ui.number)}</div>
        ${ui.spoofed ? `<div class="phone-spoofed">⚠️ Caller ID may be spoofed</div>` : ''}
        <div class="phone-avatar">📞</div>
        <div class="phone-buttons">
          <div class="phone-btn decline">✕</div>
          <div class="phone-btn answer">✓</div>
        </div>
      </div>
      ${ui.script && ui.script.length ? `
        <div class="phone-script-box">
          <div class="phone-script-label">📢 What the caller says:</div>
          ${ui.script.map(line => `<div class="phone-script-line">${escHtml(line)}</div>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/* ─── Browser UI ────────────────────────────────────────────── */
function renderBrowserUI(question) {
  const box = $('scenario-box');
  box.className = 'scenario-box';
  const ui = question.browserUI;

  // Highlight the suspicious domain segment in the URL
  const rawUrl  = escHtml(ui.url);
  const suspect = escHtml(ui.suspiciousSegment || '');
  const highlightedUrl = suspect
    ? rawUrl.replace(suspect, `<span class="browser-url-suspicious">${suspect}</span>`)
    : rawUrl;

  box.innerHTML = `
    <div class="browser-simulator">
      <div class="browser-chrome">
        <div class="browser-controls">
          <span class="browser-dot red"></span>
          <span class="browser-dot yellow"></span>
          <span class="browser-dot green"></span>
        </div>
        <div class="browser-address-bar">
          <span class="browser-ssl-icon">${ui.ssl ? '🔒' : '⚠️'}</span>
          <span class="browser-url">${highlightedUrl}</span>
        </div>
        <div class="browser-actions">
          <span>⭐</span>
          <span>⋯</span>
        </div>
      </div>
      <div class="browser-tab-bar">
        <div class="browser-tab active">
          <span>${ui.favicon || '🌐'}</span>
          <span>${escHtml(ui.title)}</span>
        </div>
      </div>
      <div class="browser-page-warning">
        <div class="bpw-icon">⚠️</div>
        <div class="bpw-text">
          <strong>Examine the address bar carefully.</strong><br>
          Compare the URL to the real site you intended to visit.
        </div>
      </div>
    </div>
  `;
}

/* ─── Ransomware UI ─────────────────────────────────────────── */
function renderRansomwareUI(question) {
  const box = $('scenario-box');
  box.className = 'scenario-box';
  const ui = question.ransomwareUI;

  const filesHTML = ui.encryptedFiles
    ? ui.encryptedFiles.map(f => `
        <div class="rw-file">
          <span class="rw-file-icon">${f.icon}</span>
          <span class="rw-file-name">${escHtml(f.name)}</span>
          <span class="rw-file-status">🔒 ENCRYPTED</span>
        </div>
      `).join('')
    : '';

  box.innerHTML = `
    <div class="ransomware-simulator">
      <div class="ransomware-header">
        <div class="rw-skull">☠️</div>
        <div class="rw-title">${escHtml(ui.title)}</div>
      </div>
      <div class="ransomware-body">
        ${ui.body.map(line => `<p class="rw-para">${escHtml(line)}</p>`).join('')}
      </div>
      <div class="ransomware-details">
        <div class="rw-detail-row">
          <span class="rw-detail-label">⏱ COUNTDOWN</span>
          <span class="rw-countdown">${escHtml(ui.countdown)}</span>
        </div>
        <div class="rw-detail-row">
          <span class="rw-detail-label">💰 AMOUNT</span>
          <span class="rw-amount">${escHtml(ui.amount)}</span>
        </div>
        <div class="rw-detail-row rw-wallet-row">
          <span class="rw-detail-label">₿ WALLET</span>
          <span class="rw-wallet">${escHtml(ui.wallet)}</span>
        </div>
      </div>
      ${filesHTML ? `
        <div class="ransomware-files">
          <div class="rw-files-label">Encrypted Files:</div>
          ${filesHTML}
        </div>
      ` : ''}
    </div>
  `;
}

/* ─── HTML escape helper ────────────────────────────────────── */
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* ============================================================
   HINT SYSTEM (Easy mode only)
   ============================================================ */
function useHint() {
  if (State.hintsRemaining <= 0 || State.questionAnswered) return;

  const level    = GAME_DATA.levels[State.currentLevelIndex];
  const question = level.questions[State.currentQuestionIndex];
  const options  = getOptions(question);

  // Collect indices of wrong answers that aren't already eliminated
  const wrongBtns = Array.from(document.querySelectorAll('.option-btn:not(.eliminated):not(.correct)'))
    .filter(btn => parseInt(btn.dataset.index) !== question.correct);

  if (!wrongBtns.length) return;

  // Eliminate one random wrong answer
  const target = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
  target.classList.add('eliminated');
  target.disabled = true;

  State.hintsRemaining--;
  $('hints-remaining').textContent = State.hintsRemaining;

  const hintBtn = $('hint-btn');
  if (State.hintsRemaining <= 0) {
    hintBtn.disabled = true;
    hintBtn.classList.add('hint-used');
  }

  if (State.soundEnabled) AudioEngine.click();
}


/* ============================================================
   ANSWER HANDLING
   ============================================================ */
function handleAnswer(selectedIndex) {
  if (State.questionAnswered) return;
  State.questionAnswered = true;
  stopTimer();

  const level    = GAME_DATA.levels[State.currentLevelIndex];
  const question = level.questions[State.currentQuestionIndex];
  const isCorrect = selectedIndex === question.correct;
  const isTimeout = selectedIndex === -1;

  // Highlight correct / wrong options
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
    const idx = parseInt(btn.dataset.index);
    if (idx === question.correct) {
      btn.classList.add('correct');
    } else if (idx === selectedIndex) {
      btn.classList.add('wrong');
    }
  });

  // Calculate points (with difficulty multiplier; hard deducts 5 on wrong)
  let pointsEarned = 0;
  if (isCorrect) {
    pointsEarned = Math.round(question.points * State.diffMultiplier);
    // Speed bonus: answered with more than 2/3 time remaining
    const max = getDifficultyTimer();
    if (State.timerValue >= Math.floor(max * 0.67)) pointsEarned += 5;
    State.score       += pointsEarned;
    State.levelCorrect++;
    State.levelPoints += pointsEarned;
    State.totalCorrect++;
    if (State.soundEnabled) AudioEngine.correct();
  } else {
    if (State.difficulty === 'hard' && !isTimeout) {
      State.score = Math.max(0, State.score - 5);
    }
    if (State.soundEnabled) AudioEngine.wrong();
  }
  State.totalAnswered++;

  animateScore(State.score);
  $('header-score-display').textContent = `Score: ${State.score}`;

  // Show consequence overlay, then feedback modal
  setTimeout(() => {
    showConsequenceOverlay(isCorrect, isTimeout, question, () => {
      showFeedback(isCorrect, isTimeout, question, pointsEarned);
    });
  }, 500);
}


/* ============================================================
   CONSEQUENCE OVERLAY — Full-screen breach / prevented
   ============================================================ */
function showConsequenceOverlay(isCorrect, isTimeout, question, callback) {
  const overlay = $('consequence-overlay');
  const content = $('consequence-content');

  const data = isCorrect ? question.correctConsequence : question.wrongConsequence;

  if (!data) {
    // No consequence data — skip straight to feedback
    if (callback) callback();
    return;
  }

  const modeClass = isCorrect ? 'safe-mode' : 'breach-mode';
  const headerIcon = isCorrect ? '✅' : (isTimeout ? '⏰' : '💥');

  const listItems = isCorrect
    ? (data.prevented || []).map(p => `<li>${escHtml(p)}</li>`).join('')
    : (data.impacts   || []).map(i => `<li>${escHtml(i)}</li>`).join('');

  const listLabel = isCorrect ? '✓ Threats Prevented:' : '⚠ Consequences:';

  content.innerHTML = `
    <div class="csq-header">
      <div class="csq-icon">${headerIcon}</div>
      <div class="csq-title">${escHtml(data.title)}</div>
      <div class="csq-subtitle">${escHtml(data.subtitle)}</div>
    </div>
    <p class="csq-description">${escHtml(data.description)}</p>
    ${listItems ? `
      <div class="csq-list-section">
        <div class="csq-list-label">${listLabel}</div>
        <ul class="csq-list">${listItems}</ul>
      </div>
    ` : ''}
  `;

  overlay.className = `consequence-overlay ${modeClass}`;
  overlay.classList.remove('hidden');

  if (State.soundEnabled) {
    if (isCorrect) AudioEngine.safe();
    else           AudioEngine.breach();
  }

  State.consequenceCallback = callback;

  // 3-second auto-advance countdown
  let count = 3;
  $('consequence-countdown').textContent = count;

  clearInterval(State.consequenceInterval);
  State.consequenceInterval = setInterval(() => {
    count--;
    const cdEl = $('consequence-countdown');
    if (cdEl) cdEl.textContent = count;
    if (count <= 0) {
      clearInterval(State.consequenceInterval);
      hideConsequenceOverlay();
    }
  }, 1000);
}

function skipConsequence() {
  clearInterval(State.consequenceInterval);
  hideConsequenceOverlay();
}

function hideConsequenceOverlay() {
  const overlay = $('consequence-overlay');
  overlay.classList.add('hidden');
  overlay.className = 'consequence-overlay hidden';
  const cb = State.consequenceCallback;
  State.consequenceCallback = null;
  if (cb) cb();
}


/* ============================================================
   FEEDBACK MODAL
   ============================================================ */
function showFeedback(isCorrect, isTimeout, question, pointsEarned) {
  const modal = $('feedback-modal');

  if (isTimeout) {
    $('feedback-icon').textContent  = '⏰';
    $('feedback-title').textContent = "Time's Up!";
    $('feedback-title').className   = 'feedback-title wrong';
    $('feedback-points').textContent = 'Time Expired — 0 pts';
  } else if (isCorrect) {
    $('feedback-icon').textContent  = '✅';
    $('feedback-title').textContent = 'Correct!';
    $('feedback-title').className   = 'feedback-title correct';
    const max = getDifficultyTimer();
    const speedBonus = State.timerValue >= Math.floor(max * 0.67);
    $('feedback-points').textContent = `+${pointsEarned} pts${speedBonus ? ' ⚡ Speed Bonus!' : ''}`;
  } else {
    $('feedback-icon').textContent  = '❌';
    $('feedback-title').textContent = 'Incorrect!';
    $('feedback-title').className   = 'feedback-title wrong';
    $('feedback-points').textContent = State.difficulty === 'hard' ? '0 pts  −5 penalty' : '0 pts';
  }

  $('feedback-explanation').textContent = question.explanation;
  $('feedback-tip').textContent         = question.tip;

  // Reset compliance panel
  const complianceBody = $('compliance-body');
  complianceBody.classList.add('hidden');
  $('compliance-arrow').textContent = '▼';
  renderCompliancePanel(question);

  modal.classList.remove('hidden');

  $('btn-continue').onclick = () => {
    modal.classList.add('hidden');
    nextQuestion();
  };
}

/* ─── Compliance Panel ──────────────────────────────────────── */
function renderCompliancePanel(question) {
  const body = $('compliance-body');
  if (!question.compliance) {
    $('compliance-panel').style.display = 'none';
    return;
  }
  $('compliance-panel').style.display = '';

  const c = question.compliance;

  const fwSection = (logo, cls, name, controls) => {
    if (!controls || !controls.length) return '';
    return `
      <div class="compliance-fw">
        <div class="cf-fw-header">
          <span class="cf-logo ${cls}">${logo}</span>
          <span class="cf-fw-name">${name}</span>
        </div>
        <div class="cf-controls">
          ${controls.map(ctrl => `
            <div class="cf-control-item">
              <span class="ctrl-code">${escHtml(ctrl.control)}</span>
              <span class="ctrl-title">${escHtml(ctrl.title)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  body.innerHTML =
    fwSection('ISO', 'iso',  'ISO/IEC 27001:2022', c.iso27001) +
    fwSection('NCA', 'nca',  'NCA ECC',            c.nca_ecc)  +
    fwSection('SAMA','sama', 'SAMA CSF',            c.sama);
}

function toggleCompliance() {
  const body  = $('compliance-body');
  const arrow = $('compliance-arrow');
  const open  = body.classList.toggle('hidden');
  arrow.textContent = open ? '▼' : '▲';
}


/* ============================================================
   NEXT QUESTION / LEVEL COMPLETE
   ============================================================ */
function nextQuestion() {
  const level = GAME_DATA.levels[State.currentLevelIndex];
  const next  = State.currentQuestionIndex + 1;

  if (next < level.questions.length) {
    State.currentQuestionIndex = next;
    showQuestion();
  } else {
    completeLevel();
  }
}


/* ============================================================
   LEVEL COMPLETE SCREEN
   ============================================================ */
function completeLevel() {
  const levelIndex = State.currentLevelIndex;
  const level      = GAME_DATA.levels[levelIndex];
  const totalQ     = level.questions.length;

  if (!State.completedLevels.includes(levelIndex)) {
    State.completedLevels.push(levelIndex);
  }
  State.levelScores[levelIndex] = State.levelPoints;

  const perfect = State.levelCorrect === totalQ;
  const good    = State.levelCorrect >= 2;

  $('lc-icon').textContent  = perfect ? '🏆' : good ? '✅' : '📊';
  $('lc-difficulty').textContent = getDifficultyLabel();

  const titles = { 0: 'Keep Practicing!', 1: "You'll Get There!", 2: 'Good Work!', 3: 'Excellent!' };
  $('lc-title').textContent   = titles[State.levelCorrect] || 'Level Complete!';
  $('lc-correct').textContent = `${State.levelCorrect} / ${totalQ}`;
  $('lc-points').textContent  = `+${State.levelPoints}`;

  const badgeEarned    = good ? awardBadge(level.badge) : false;
  const alreadyHadBadge = State.earnedBadges.find(b => b.name === level.badge.name);

  const badgeContainer = $('badge-earned-container');
  if (alreadyHadBadge || badgeEarned) {
    badgeContainer.innerHTML = `
      <div class="badge-earned-display">
        <div class="badge-earned-icon">${level.badge.icon}</div>
        <div class="badge-earned-info">
          <div class="badge-earned-label">🏅 Badge Earned!</div>
          <div class="badge-earned-name">${level.badge.name}</div>
          <div class="badge-earned-desc">${level.badge.description}</div>
        </div>
      </div>
    `;
  } else {
    badgeContainer.innerHTML = `
      <div class="badge-not-earned">
        <span>${level.badge.icon}</span>
        <span>Get 2+ correct to earn the <strong>${level.badge.name}</strong> badge</span>
      </div>
    `;
  }

  const isLastLevel = levelIndex >= GAME_DATA.levels.length - 1;
  const nextBtn = $('btn-next-level');

  if (isLastLevel) {
    nextBtn.textContent = '🏆 View Final Results';
    nextBtn.onclick = () => { if (State.soundEnabled) AudioEngine.levelUp(); showGameEnd(); };
  } else {
    nextBtn.textContent = 'Next Mission →';
    nextBtn.onclick = () => { if (State.soundEnabled) AudioEngine.click(); startLevel(levelIndex + 1); };
  }

  $('btn-to-levels').onclick = () => { if (State.soundEnabled) AudioEngine.click(); showLevelSelect(); };

  if (State.soundEnabled) AudioEngine.levelUp();
  showScreen('level-complete');
}


/* ============================================================
   GAME END SCREEN
   ============================================================ */
function showGameEnd() {
  const totalQ   = GAME_DATA.levels.reduce((s, l) => s + l.questions.length, 0);
  const accuracy = Math.round((State.totalCorrect / totalQ) * 100);

  let trophy, rating;
  if      (accuracy >= 90) { trophy = '🏆'; rating = '🌟 Cyber Expert';       }
  else if (accuracy >= 75) { trophy = '🥇'; rating = '🛡️ Security Guardian';  }
  else if (accuracy >= 60) { trophy = '🥈'; rating = '🔐 Security Analyst';   }
  else if (accuracy >= 40) { trophy = '🥉'; rating = '🔍 Cyber Apprentice';   }
  else                     { trophy = '📚'; rating = '💻 Cyber Rookie';        }

  $('end-trophy').textContent       = trophy;
  $('end-title').textContent        = accuracy >= 75 ? 'Mission Accomplished!' : 'Mission Complete!';
  $('final-score').textContent      = State.score;
  $('final-rating').textContent     = rating;
  $('final-difficulty').textContent = getDifficultyFullLabel();
  $('end-correct-count').textContent = `${State.totalCorrect} / ${totalQ}`;
  $('end-accuracy').textContent     = `${accuracy}%`;
  $('end-badges-count').textContent = `${State.earnedBadges.length} / ${GAME_DATA.levels.length}`;

  $('end-badges-grid').innerHTML = GAME_DATA.levels.map(level => {
    const earned = State.earnedBadges.find(b => b.name === level.badge.name);
    return `
      <div class="badge-display ${earned ? '' : 'locked'}" title="${level.badge.name}">
        <div class="badge-display-icon">${level.badge.icon}</div>
        <div class="badge-display-name">${level.badge.name}</div>
      </div>
    `;
  }).join('');

  const numTips = accuracy >= 75 ? 3 : 6;
  $('tips-list').innerHTML = GAME_DATA.tips.slice(0, numTips)
    .map(tip => `<li>${tip}</li>`)
    .join('');

  const leaderboard = saveToLeaderboard(State.playerName, State.score);
  renderLeaderboard(leaderboard);

  $('btn-restart').onclick       = restartGame;
  $('btn-to-levels-end').onclick = () => { if (State.soundEnabled) AudioEngine.click(); showLevelSelect(); };

  showScreen('end');
}

function renderLeaderboard(entries) {
  const table  = $('leaderboard-table');
  if (!entries.length) {
    table.innerHTML = `<div class="lb-empty">No scores yet — you're first!</div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const diffLabels = { easy: '🟢', medium: '🟡', hard: '🔴' };

  table.innerHTML = entries.map((entry, i) => {
    const isCurrent = entry.name === State.playerName && entry.score === State.score;
    const diffIcon  = diffLabels[entry.difficulty] || '';
    return `
      <div class="leaderboard-row ${isCurrent ? 'current-player' : ''}">
        <span class="leaderboard-rank">${medals[i] || `${i + 1}.`}</span>
        <span class="leaderboard-name">${escHtml(entry.name)}</span>
        <span class="leaderboard-score">${entry.score} pts</span>
        <span class="leaderboard-diff">${diffIcon}</span>
        <span class="leaderboard-date">${entry.date}</span>
      </div>
    `;
  }).join('');
}


/* ============================================================
   RESTART
   ============================================================ */
function restartGame() {
  Object.assign(State, {
    score:         0,
    totalCorrect:  0,
    totalAnswered: 0,
    earnedBadges:  [],
    completedLevels: [],
    levelScores:   {},
    currentLevelIndex:    0,
    currentQuestionIndex: 0,
    levelCorrect:  0,
    levelPoints:   0,
    questionAnswered: false,
    hintsRemaining: 0
  });

  if (State.soundEnabled) AudioEngine.click();
  showLevelSelect();
}


/* ============================================================
   DARK MODE TOGGLE
   ============================================================ */
function initDarkModeToggle() {
  const btn = $('dark-mode-toggle');
  btn.addEventListener('click', () => {
    State.darkMode = !State.darkMode;
    document.body.classList.toggle('light-mode', !State.darkMode);
    btn.textContent = State.darkMode ? '☀️' : '🌙';
    if (State.soundEnabled) AudioEngine.click();
  });
}


/* ============================================================
   SOUND TOGGLE
   ============================================================ */
function initSoundToggle() {
  const btn = $('sound-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    State.soundEnabled = !State.soundEnabled;
    btn.textContent = State.soundEnabled ? '🔊' : '🔇';
    if (State.soundEnabled) AudioEngine.click();
  });
}


/* ============================================================
   INITIALIZATION — Entry point when DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initLanding();
  initDarkModeToggle();
  initSoundToggle();

  console.log('%c🛡️ CYBER SHIELD v2.0 — Cybersecurity Awareness Simulation', 'color:#00d4ff;font-size:16px;font-weight:bold;');
  console.log('%cStay curious. Stay secure.', 'color:#94a3b8;');
});
