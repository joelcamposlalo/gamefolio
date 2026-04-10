/* ═══════════════════════════════════
   TOUCH — virtual D-pad + talk button
   Translates touch events → keys object (same as keyboard)
═══════════════════════════════════ */

function initTouchControls() {

  /* ── D-pad directional buttons ── */
  document.querySelectorAll('.dpad-btn[data-key]').forEach(btn => {
    const key = btn.dataset.key;

    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      keys[key] = true;
      btn.classList.add('pressed');
    }, { passive: false });

    btn.addEventListener('touchend', e => {
      e.preventDefault();
      keys[key] = false;
      btn.classList.remove('pressed');
    }, { passive: false });

    btn.addEventListener('touchcancel', () => {
      keys[key] = false;
      btn.classList.remove('pressed');
    });
  });

  /* ── Talk / interact button ── */
  const talkBtn = document.getElementById('touch-talk-btn');
  talkBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    if (GS.screen === 'game') tryTalk();
  }, { passive: false });

  /* ── Prevent canvas from scrolling / pinch-zooming ── */
  const canvas = document.getElementById('game-canvas');
  canvas.addEventListener('touchmove',  e => e.preventDefault(), { passive: false });
  canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });

  /* ── Hide controls while modal is open, restore on close ── */
  const tc = document.getElementById('touch-controls');

  /* Patch openDialog and closeModal to toggle visibility */
  const _origOpen  = openDialog;
  const _origClose = closeModal;

  window.openDialog = function(npc) {
    tc.classList.add('hidden');
    /* clear all movement keys so player doesn't drift */
    ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D']
      .forEach(k => { keys[k] = false; });
    _origOpen(npc);
  };

  window.closeModal = function() {
    tc.classList.remove('hidden');
    _origClose();
  };
}

/* Update the talk button label when language changes */
function updateTouchLabels() {
  const el = document.querySelector('#touch-talk-btn .talk-text');
  if (el) el.textContent = lang.current === 'es' ? 'HABLAR' : 'TALK';
}
