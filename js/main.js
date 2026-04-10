/* ═══════════════════════════════════
   MAIN — event listeners + boot
═══════════════════════════════════ */

/* ── Keyboard events ── */
document.addEventListener('keydown', e => {
  /* Start game from menu */
  if (e.key === 'Enter' && GS.screen === 'menu') {
    startGame(); return;
  }

  /* Skip instructions with Enter or Space */
  if ((e.key === 'Enter' || e.key === ' ') && GS.screen === 'instructions') {
    showMenu(); return;
  }

  /* Talk to NPC */
  if ((e.key === 'e' || e.key === 'E') && GS.screen === 'game') {
    tryTalk(); return;
  }

  /* Movement keys — only register when game is active and modal is closed */
  if (GS.screen === 'game' && !GS.modalOpen) {
    keys[e.key] = true;
  }
});

document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

/* ── Menu prompt click ── */
document.getElementById('menu-prompt').addEventListener('click', startGame);

/* ── Instructions start button ── */
document.getElementById('inst-start-btn').addEventListener('click', showMenu);

/* ── Result modal close ── */
document.getElementById('result-btn').addEventListener('click', () => closeModal());

/* ── Completion banner ── */
document.getElementById('cb-btn-port').addEventListener('click', showPortfolio);
document.getElementById('cb-btn-replay').addEventListener('click', () => location.reload());

/* ── Touch controls (initialized after game.js defines `keys`) ── */
initTouchControls();

/* ─────────────────────────────────
   BOOT — initial GSAP reveal of lang screen
───────────────────────────────── */
(function boot() {
  const langEl = document.getElementById('screen-lang');
  langEl.style.opacity = '0';

  /* Small star canvas for language screen background */
  const lCanvas = document.getElementById('lang-canvas');
  lCanvas.width  = window.innerWidth;
  lCanvas.height = window.innerHeight;
  const lctx = lCanvas.getContext('2d');

  const lStars = Array.from({ length: 100 }, () => ({
    x: Math.random() * lCanvas.width,
    y: Math.random() * lCanvas.height,
    r: Math.random() * 1.4 + .2,
    a: Math.random(),
    s: (Math.random() * .005 + .002) * (Math.random() < .5 ? 1 : -1),
  }));

  function animLang() {
    if (GS.screen !== 'lang') return;
    lctx.fillStyle = '#050508';
    lctx.fillRect(0, 0, lCanvas.width, lCanvas.height);
    for (const s of lStars) {
      s.a += s.s;
      if (s.a > 1 || s.a < 0) s.s *= -1;
      lctx.beginPath();
      lctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      lctx.fillStyle = `rgba(210,190,100,${Math.max(0, s.a) * .5})`;
      lctx.fill();
    }
    requestAnimationFrame(animLang);
  }
  animLang();

  /* Reveal the lang screen */
  gsap.timeline()
    .to(langEl, { opacity: 1, duration: .8, ease: 'power2.out' })
    .from('.lang-btn', {
      y: 30, opacity: 0, duration: .5,
      stagger: .18, ease: 'power2.out',
    }, '-=.3')
    .from('.lang-heading', { y: -20, opacity: 0, duration: .5 }, '<');
})();
