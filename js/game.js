/* ═══════════════════════════════════
   GAME — canvas init, game loop, input
═══════════════════════════════════ */

/* Canvas reference — named GC to avoid collision with render.js's _gc */
const GC = document.getElementById('game-canvas');
initRenderer(GC);

/* ── Player state ── */
const PL = {
  x: 0, y: 0,
  w: 22, h: 34,
  frame: 0, frameT: 0,
  facingLeft: false,
};

/* ── Key map (accessed by main.js event listeners) ── */
const keys = {};

/* ── Resize canvas and recompute NPC positions ── */
function resizeCanvas() {
  GC.width  = window.innerWidth;
  GC.height = window.innerHeight;
  _updateNpcPositions();
}

function _updateNpcPositions() {
  for (const n of NPCS) {
    n.x = n.fx * GC.width;
    n.y = n.fy * GC.height;
  }
}

window.addEventListener('resize', () => {
  if (GS.screen === 'game') resizeCanvas();
});

/* ── Bootstrap ── */
function initGame() {
  resizeCanvas();
  PL.x = GC.width  / 2;
  PL.y = GC.height / 2;
  initTorches();
  requestAnimationFrame(ts => { _lastTS = ts; _gameLoop(ts); });
}

function restartGameLoop() {
  requestAnimationFrame(ts => { _lastTS = ts; _gameLoop(ts); });
}

/* ── Main loop ── */
let _lastTS = 0;

function _gameLoop(ts) {
  if (GS.screen !== 'game') return;

  const dt = ts - _lastTS;
  _lastTS  = ts;

  if (!GS.modalOpen) {
    const spd = Math.min(GC.width, GC.height) * .006;
    let mv = false;

    if (keys['ArrowLeft']  || keys['a'] || keys['A']) {
      PL.x = Math.max(PL.w / 2 + 2, PL.x - spd);
      PL.facingLeft = true; mv = true;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      PL.x = Math.min(GC.width - PL.w / 2 - 2, PL.x + spd);
      PL.facingLeft = false; mv = true;
    }
    if (keys['ArrowUp']    || keys['w'] || keys['W']) {
      PL.y = Math.max(PL.h / 2 + 2, PL.y - spd); mv = true;
    }
    if (keys['ArrowDown']  || keys['s'] || keys['S']) {
      PL.y = Math.min(GC.height - PL.h / 2 - 2, PL.y + spd); mv = true;
    }

    if (mv) {
      PL.frameT += dt;
      if (PL.frameT > 165) { PL.frame = 1 - PL.frame; PL.frameT = 0; }
    } else {
      PL.frame = 0;
    }
  }

  /* NPC bob */
  const bt = ts * .002;
  for (const n of NPCS) n._by = Math.sin(bt + n.bobOff) * 3;

  /* Draw */
  GC.getContext('2d').clearRect(0, 0, GC.width, GC.height);
  drawTiles();
  drawTorches(ts);
  for (const n of NPCS) drawNpc(n);
  drawPlayer(PL.x - PL.w / 2, PL.y - PL.h / 2, PL.w, PL.h, PL.frame, PL.facingLeft);
  drawLighting(PL.x, PL.y);
  if (!GS.modalOpen) drawPrompts(PL.x, PL.y);

  requestAnimationFrame(_gameLoop);
}

/* ── Talk to nearby NPC ── */
function tryTalk() {
  if (GS.modalOpen) return;
  const threshold = Math.min(GC.width, GC.height) * .09;

  for (const npc of NPCS) {
    if (npc.done) continue;
    const dx = PL.x - npc.x, dy = PL.y - npc.y;
    if (Math.sqrt(dx * dx + dy * dy) < threshold) {
      openDialog(npc); break;
    }
  }
}
