/* ═══════════════════════════════════
   SCREENS — lang → instructions → menu → game
   All transitions use GSAP
═══════════════════════════════════ */

/* ─── Star canvas (shared by lang + menu screens) ─── */
const _menuCanvas = document.getElementById('menu-canvas');
const _mctx       = _menuCanvas.getContext('2d');
const _stars      = [];
let   _menuAnimId = null;

function _initStars(canvas) {
  _stars.length = 0;
  for (let i = 0; i < 170; i++) {
    _stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + .2,
      a: Math.random(),
      s: (Math.random() * .007 + .002) * (Math.random() < .5 ? 1 : -1),
    });
  }
}

function _animStars() {
  if (GS.screen !== 'menu') return;
  _mctx.fillStyle = '#050508';
  _mctx.fillRect(0, 0, _menuCanvas.width, _menuCanvas.height);
  for (const s of _stars) {
    s.a += s.s;
    if (s.a > 1 || s.a < 0) s.s *= -1;
    _mctx.beginPath();
    _mctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    _mctx.fillStyle = `rgba(210,190,110,${Math.max(0, s.a) * .65})`;
    _mctx.fill();
  }
  _menuAnimId = requestAnimationFrame(_animStars);
}

/* ─── Typewriter ─── */
let _twActive = false, _twTimer = null;

function _typewrite(elId, text, spd, onDone) {
  const el = document.getElementById(elId);
  el.innerHTML = ''; let i = 0; _twActive = true;
  function step() {
    if (!_twActive) { el.innerHTML = text.replace(/\n/g, '<br>'); if (onDone) onDone(); return; }
    if (i < text.length) {
      el.innerHTML += text[i] === '\n' ? '<br>' : text[i];
      i++; _twTimer = setTimeout(step, spd);
    } else if (onDone) onDone();
  }
  step();
}

/* ═══════════════════════════════════
   SCREEN 0 — Language select
═══════════════════════════════════ */
function chooseLang(l) {
  lang.current = l;
  GS.screen = 'instructions';
  updateTouchLabels();            // update "HABLAR" / "TALK" label

  gsap.timeline()
    .to('#screen-lang', { opacity: 0, y: -44, duration: .55, ease: 'power2.in' })
    .call(() => {
      document.getElementById('screen-lang').style.display = 'none';
      _showInstructions();
    });
}

/* ═══════════════════════════════════
   SCREEN 1 — Instructions
═══════════════════════════════════ */
function _showInstructions() {
  const el = document.getElementById('screen-instructions');
  const tx = t();

  /* Build content dynamically */
  el.querySelector('.inst-title').textContent    = tx.instTitle;
  el.querySelector('.inst-controls-title').textContent = tx.ctrlTitle;
  el.querySelector('#ctrl-move-lbl').textContent = tx.ctrlMove;
  el.querySelector('#ctrl-talk-lbl').textContent = tx.ctrlTalk;
  el.querySelector('.inst-obj-title').textContent = tx.objTitle;
  el.querySelector('.inst-obj-text').textContent  = tx.objText;
  document.getElementById('inst-start-btn').textContent = tx.instStart;

  /* NPC cards */
  const cardsEl = el.querySelector('.inst-npcs');
  cardsEl.innerHTML = '';
  tx.npcDescs.forEach(d => {
    cardsEl.insertAdjacentHTML('beforeend', `
      <div class="inst-npc-card" data-color="${d.color}">
        <span class="inst-npc-item">${d.item}</span>
        <span class="inst-npc-name">${d.name}</span>
        <span class="inst-npc-topic">${d.label} · ${d.topic}</span>
      </div>`);
  });

  el.style.display  = 'flex';
  el.style.opacity  = '0';

  gsap.timeline()
    .to(el, { opacity: 1, duration: .55, ease: 'power2.out' })
    .from('.inst-wrap > *', {
      y: 28, opacity: 0, duration: .45,
      stagger: .1, ease: 'power2.out',
    }, '-=.2');
}

function showMenu() {
  if (GS.screen !== 'instructions') return;   // guard against double-calls
  GS.screen = 'menu';                          // ← set immediately

  const instEl = document.getElementById('screen-instructions');

  gsap.timeline()
    .to(instEl, { opacity: 0, x: -60, duration: .5, ease: 'power2.in' })
    .call(() => {
      instEl.style.display = 'none';
      _startMenu();
    });
}

/* ═══════════════════════════════════
   SCREEN 2 — Main Menu
═══════════════════════════════════ */
function _startMenu() {
  const menuEl = document.getElementById('screen-menu');
  menuEl.style.display = 'flex';
  menuEl.style.opacity = '0';

  _menuCanvas.width  = window.innerWidth;
  _menuCanvas.height = window.innerHeight;
  _initStars(_menuCanvas);

  gsap.to(menuEl, { opacity: 1, duration: .7, ease: 'power2.out' });
  requestAnimationFrame(_animStars);
  _runTypewriter();
}

function _runTypewriter() {
  const tx = t();
  setTimeout(() => {
    _typewrite('menu-title', tx.welcome, 72, () => {
      setTimeout(() => {
        gsap.to('#menu-subtitle', { opacity: 1, y: 0, duration: .5 });
        document.getElementById('menu-subtitle').textContent = tx.subtitle;
        setTimeout(() => {
          const prm = document.getElementById('menu-prompt');
          prm.textContent = tx.pressStart;
          gsap.to(prm, { opacity: 1, duration: .4 });
          prm.classList.add('blink');
        }, 900);
      }, 380);
    });
  }, 500);
}

/* ═══════════════════════════════════
   SCREEN 3 — Start game (transition)
═══════════════════════════════════ */
function startGame() {
  if (GS.screen !== 'menu') return;
  GS.screen = 'game';            // ← set immediately, prevents double-trigger
  _twActive = false; clearTimeout(_twTimer);

  const menuEl = document.getElementById('screen-menu');
  const gameEl = document.getElementById('screen-game');

  gsap.set(gameEl, { display: 'block', opacity: 0 });

  gsap.timeline()
    .to(menuEl, { opacity: 0, scale: 1.06, duration: .6, ease: 'power2.in' })
    .call(() => {
      menuEl.style.display = 'none';
      document.getElementById('hud').style.display = 'flex';
      initHUD();
      initGame();
    })
    .to(gameEl, { opacity: 1, duration: .5, ease: 'power2.out' });
}

/* window resize for menu canvas */
window.addEventListener('resize', () => {
  if (GS.screen === 'menu') {
    _menuCanvas.width  = window.innerWidth;
    _menuCanvas.height = window.innerHeight;
    _initStars(_menuCanvas);
  }
});
