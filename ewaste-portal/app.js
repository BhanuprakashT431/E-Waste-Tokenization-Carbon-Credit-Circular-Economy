/* =============================================
   E-Waste Ledger — Application Logic
   ============================================= */

'use strict';

// ============================================================
// GLOBAL STATE
// ============================================================
const state = {
  balance: 1250,
  view: 'consumer', // 'consumer' | 'recycler'
  verifiedCount: 7,
  cctIssued: 525,
  assets: [
    { id: 'ast-001', device: 'Dell XPS 15 (2021)', serial: 'DL9X1-VN382', weight: 1.86, status: 'credited',    time: '2h ago' },
    { id: 'ast-002', device: 'iPhone 12 Pro',       serial: 'F2LN2-XR910', weight: 0.19, status: 'in-transit', time: '5h ago' },
    { id: 'ast-003', device: 'Lenovo ThinkPad X1',  serial: 'LT4X1-KM551', weight: 1.34, status: 'pending',    time: '1d ago' },
  ],
  recyclerQueue: [
    { id: 'ship-4471', device: 'HP EliteBook 840',     weight: 1.52, origin: 'Mumbai, IN',    date: 'Apr 26' },
    { id: 'ship-4472', device: 'Samsung Galaxy S22',   weight: 0.17, origin: 'Bangalore, IN', date: 'Apr 26' },
    { id: 'ship-4473', device: 'Apple MacBook Air M1', weight: 1.29, origin: 'Pune, IN',      date: 'Apr 25' },
  ]
};

// ============================================================
// DOM REFS
// ============================================================
const $ = id => document.getElementById(id);
const dom = {
  viewBtn:         $('view-switcher'),
  viewBtnText:     $('view-switcher-text'),
  consumerPortal:  $('consumer-portal'),
  recyclerPortal:  $('recycler-portal'),
  balanceDisplay:  $('balance-display'),
  headerBalance:   $('header-balance'),
  pulseRing:       $('pulse-ring'),
  assetList:       $('asset-list'),
  registerForm:    $('register-form'),
  statTotal:       $('stat-total'),
  statPending:     $('stat-pending'),
  statCo2:         $('stat-co2'),
  vGrid:           $('verification-grid'),
  queueCount:      $('queue-count'),
  emptyQueue:      $('empty-queue'),
  rVerified:       $('r-verified'),
  rIssued:         $('r-issued'),
  lastUpdated:     $('last-updated'),
  toast:           $('toast'),
  canvas:          $('tokenShower'),
};

// ============================================================
// UTILITY
// ============================================================
function fmt(n) {
  return Math.floor(n).toLocaleString('en-US');
}
function uuid() {
  return 'ast-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}
function now() { return 'Just now'; }

// ============================================================
// BALANCE UPDATE (with animation)
// ============================================================
function updateBalance(newVal) {
  const start = state.balance;
  const end   = newVal;
  const duration = 700;
  const startTime = performance.now();

  function step(ts) {
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    dom.balanceDisplay.textContent = fmt(current);
    dom.headerBalance.textContent  = fmt(current) + ' CCT';
    if (progress < 1) requestAnimationFrame(step);
    else {
      state.balance = end;
      dom.balanceDisplay.classList.add('flash');
      setTimeout(() => dom.balanceDisplay.classList.remove('flash'), 650);
    }
  }
  requestAnimationFrame(step);

  // Pulse ring
  dom.pulseRing.classList.remove('pulse');
  void dom.pulseRing.offsetWidth;
  dom.pulseRing.classList.add('pulse');
}

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(title = 'Verification Complete', sub = 'Smart Contract Executed') {
  dom.toast.querySelector('.toast-title').textContent = title;
  dom.toast.querySelector('.toast-sub').textContent   = sub;
  dom.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove('show'), 4000);
}

// ============================================================
// TOKEN SHOWER ANIMATION (canvas)
// ============================================================
const canvas = dom.canvas;
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * -100;
    this.size = Math.random() * 8 + 4;
    this.vx   = (Math.random() - 0.5) * 2;
    this.vy   = Math.random() * 3 + 1.5;
    this.alpha = 1;
    this.char  = '✦';
    this.color = Math.random() > 0.4 ? '#10B981' : '#6EE7B7';
    this.rot   = Math.random() * Math.PI * 2;
    this.rotv  = (Math.random() - 0.5) * 0.15;
  }
  update() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.vy  += 0.06;
    this.rot += this.rotv;
    this.alpha -= 0.012;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle   = this.color;
    ctx.font        = `${this.size * 2}px serif`;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillText(this.char, -this.size / 2, this.size / 2);
    ctx.restore();
  }
}

function launchTokenShower() {
  for (let i = 0; i < 60; i++) {
    setTimeout(() => particles.push(new Particle()), i * 20);
  }
}

let rafId = null;
function animLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => { p.update(); p.draw(); });
  if (particles.length > 0) rafId = requestAnimationFrame(animLoop);
  else rafId = null;
}

function triggerShower() {
  if (!rafId) animLoop();
  launchTokenShower();
}

// ============================================================
// RENDER ASSET LIST
// ============================================================
const DEVICE_ICONS = {
  default: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  phone:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/></svg>`,
  laptop:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18L4 6h16l2 12H2z"/><path d="M4 6V4h16v2"/></svg>`,
};

function getDeviceIcon(name) {
  const lower = name.toLowerCase();
  if (/iphone|galaxy|pixel|oneplus|redmi/i.test(lower)) return DEVICE_ICONS.phone;
  if (/macbook|laptop|thinkpad|elitebook|xps|yoga/i.test(lower)) return DEVICE_ICONS.laptop;
  return DEVICE_ICONS.default;
}

function renderAssets() {
  dom.assetList.innerHTML = '';
  if (state.assets.length === 0) {
    dom.assetList.innerHTML = `<p style="color:var(--text-3);font-size:13px;padding:24px 0;text-align:center;">No assets registered yet.</p>`;
    return;
  }
  state.assets.forEach(a => {
    const row = document.createElement('div');
    row.className = 'asset-row';
    row.innerHTML = `
      <div class="asset-icon">${getDeviceIcon(a.device)}</div>
      <div class="asset-info">
        <div class="asset-name">${escHtml(a.device)}</div>
        <div class="asset-serial">${escHtml(a.serial)}</div>
      </div>
      <div style="text-align:right;margin-left:auto;">
        <div class="asset-weight">${a.weight} kg</div>
        <div class="asset-time">${a.time}</div>
      </div>
      <div class="asset-badge-col">
        <span class="badge ${a.status}">${statusLabel(a.status)}</span>
      </div>
    `;
    dom.assetList.appendChild(row);
  });
}

function statusLabel(s) {
  return { pending: 'Pending', 'in-transit': 'In-Transit', credited: 'Credited' }[s] || s;
}
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function updateConsumerStats() {
  dom.statTotal.textContent   = state.assets.length;
  dom.statPending.textContent = state.assets.filter(a => a.status === 'pending').length * 75;
  const totalKg = state.assets.reduce((s, a) => s + a.weight, 0);
  dom.statCo2.textContent = (totalKg * 1.4).toFixed(1);
}

// ============================================================
// RENDER RECYCLER QUEUE
// ============================================================
function renderQueue() {
  dom.vGrid.innerHTML = '';
  const q = state.recyclerQueue;

  dom.queueCount.textContent = q.length;
  dom.rVerified.textContent  = state.verifiedCount;
  dom.rIssued.textContent    = fmt(state.cctIssued);

  if (q.length === 0) {
    dom.emptyQueue.style.display = 'flex';
    dom.emptyQueue.style.flexDirection = 'column';
    return;
  }
  dom.emptyQueue.style.display = 'none';

  q.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'v-card';
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="v-card-top">
        <div class="v-device-icon">${getDeviceIcon(item.device)}</div>
        <div class="v-card-id">
          <div class="v-shipment-id">#${escHtml(item.id)}</div>
          <div style="font-size:10px;color:var(--text-3)">${escHtml(item.date)}</div>
        </div>
      </div>
      <div class="v-card-device">${escHtml(item.device)}</div>
      <div class="v-card-meta">
        <div class="v-meta-item">
          <span class="v-meta-label">Weight</span>
          <span class="v-meta-value">${item.weight} kg</span>
        </div>
        <div class="v-meta-item">
          <span class="v-meta-label">Origin</span>
          <span class="v-meta-value">${escHtml(item.origin)}</span>
        </div>
        <div class="v-meta-item">
          <span class="v-meta-label">Material Grade</span>
          <span class="v-meta-value">Class A</span>
        </div>
      </div>
      <div class="v-reward">
        <span class="v-reward-label">Carbon Credit Reward</span>
        <span class="v-reward-val">+75 CCT</span>
      </div>
      <button class="btn-verify" data-idx="${idx}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        Verify & Confirm Extraction
      </button>
    `;
    dom.vGrid.appendChild(card);
  });
}

// ============================================================
// VERIFY ACTION
// ============================================================
function handleVerify(idx) {
  const card = dom.vGrid.querySelector(`[data-idx="${idx}"]`)?.closest('.v-card');
  if (!card) return;

  // Remove button to prevent double-click
  card.querySelector('.btn-verify').disabled = true;

  // Dissolve card
  card.classList.add('dissolving');

  // After dissolve, remove from state and re-render
  setTimeout(() => {
    const removed = state.recyclerQueue.splice(idx, 1)[0];

    // Update recycler stats
    state.verifiedCount++;
    state.cctIssued += 75;

    // Update consumer balance
    updateBalance(state.balance + 75);

    // Update header
    dom.lastUpdated.textContent = 'Just now';

    // Trigger fx
    triggerShower();
    showToast('Verification Complete', 'Smart Contract Executed · +75 CCT Minted');

    // Re-render queue
    renderQueue();

    // Update consumer stats (balance already handled)
    // Find if there's a corresponding consumer asset to mark credited
  }, 500);
}

// Event delegation for verify buttons
dom.vGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-verify');
  if (!btn || btn.disabled) return;
  const idx = parseInt(btn.dataset.idx, 10);
  handleVerify(idx);
});

// ============================================================
// VIEW SWITCHER
// ============================================================
let isRecyclerView = false;

function switchView(toRecycler) {
  isRecyclerView = toRecycler;
  dom.viewBtnText.textContent = toRecycler ? 'View as Consumer' : 'View as Recycler';
  dom.viewBtn.setAttribute('aria-pressed', String(toRecycler));

  const from = toRecycler ? dom.consumerPortal : dom.recyclerPortal;
  const to   = toRecycler ? dom.recyclerPortal : dom.consumerPortal;

  from.classList.remove('active');
  from.style.display = 'none';

  to.style.display = 'block';
  void to.offsetWidth; // reflow
  to.classList.add('active', 'entering');
  setTimeout(() => to.classList.remove('entering'), 400);
}

dom.viewBtn.addEventListener('click', () => switchView(!isRecyclerView));

// ============================================================
// REGISTER FORM
// ============================================================
dom.registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const deviceInput  = document.getElementById('device-name');
  const serialInput  = document.getElementById('serial-number');
  const weightInput  = document.getElementById('weight');

  let valid = true;
  [deviceInput, serialInput, weightInput].forEach(input => {
    input.classList.remove('error');
    if (!input.value.trim() || (input.type === 'number' && parseFloat(input.value) <= 0)) {
      input.classList.add('error');
      valid = false;
    }
  });
  if (!valid) return;

  const newAsset = {
    id:     uuid(),
    device: deviceInput.value.trim(),
    serial: serialInput.value.trim(),
    weight: parseFloat(parseFloat(weightInput.value).toFixed(2)),
    status: 'pending',
    time:   'Just now',
  };

  state.assets.unshift(newAsset);

  // Add to recycler queue
  state.recyclerQueue.push({
    id:     'ship-' + Math.floor(4500 + Math.random() * 500),
    device: newAsset.device,
    weight: newAsset.weight,
    origin: 'Registered Locally',
    date:   new Intl.DateTimeFormat('en-US', { month:'short', day:'numeric' }).format(new Date()),
  });

  renderAssets();
  renderQueue();
  updateConsumerStats();

  showToast('Asset Registered', `"${newAsset.device}" added to the ledger.`);

  // Reset form
  dom.registerForm.reset();
  [deviceInput, serialInput, weightInput].forEach(i => i.classList.remove('error'));

  // Animate submit btn
  const btn = document.getElementById('submit-btn');
  btn.textContent = '✦ Submitted!';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>Submit to Ledger`;
    btn.disabled = false;
  }, 1800);
});

// Clear error on input
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => input.classList.remove('error'));
});

// ============================================================
// INIT
// ============================================================
function init() {
  dom.balanceDisplay.textContent = fmt(state.balance);
  dom.headerBalance.textContent  = fmt(state.balance) + ' CCT';
  dom.consumerPortal.style.display = 'block';
  dom.consumerPortal.classList.add('active');
  dom.recyclerPortal.style.display = 'none';
  renderAssets();
  updateConsumerStats();
  renderQueue();
}

init();
