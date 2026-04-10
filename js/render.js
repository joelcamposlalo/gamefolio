/* ═══════════════════════════════════
   RENDER — all canvas drawing functions
   (tiles, torches, player, NPCs, lighting, prompts)
═══════════════════════════════════ */

let R_gc, R_ctx;

function initRenderer(canvas) {
  R_gc  = canvas;
  R_ctx = canvas.getContext('2d');
}

/* ── Deterministic tile variant based on position ── */
function tileVariant(r, c) {
  const h = ((r * 31 + c * 17 + r * c * 3) % 100 + 100) % 100;
  if (h < 3)  return 'rune';
  if (h < 9)  return 'crack';
  if (h < 17) return 'moss';
  return 'plain';
}

const TILE = 40;

function drawTiles() {
  const W = R_gc.width, H = R_gc.height;
  const cols = Math.ceil(W / TILE) + 1;
  const rows = Math.ceil(H / TILE) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * TILE, y = r * TILE;
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      const v = tileVariant(r, c);

      /* Base fill */
      R_ctx.fillStyle = isEdge ? '#070810' : v === 'moss' ? '#0b1018' : '#0e1120';
      R_ctx.fillRect(x, y, TILE, TILE);

      /* Grout */
      R_ctx.fillStyle = '#07080f';
      R_ctx.fillRect(x, y, TILE, 1);
      R_ctx.fillRect(x, y, 1, TILE);

      if (isEdge) {
        /* Stone-block wall pattern */
        if ((r + c) % 2 === 0) {
          R_ctx.fillStyle = '#090b18';
          R_ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
        }
        R_ctx.fillStyle = '#04050c';
        R_ctx.fillRect(x, y, TILE, 2);
        R_ctx.fillRect(x, y, 2, TILE);
        R_ctx.fillRect(x + TILE - 2, y, 2, TILE);
        R_ctx.fillRect(x, y + TILE - 2, TILE, 2);
      } else {
        if (v === 'crack') {
          R_ctx.fillStyle = '#070810';
          R_ctx.fillRect(x + 10, y + 8,  2, 12);
          R_ctx.fillRect(x + 11, y + 18, 2,  8);
        } else if (v === 'moss') {
          R_ctx.fillStyle = '#091510';
          R_ctx.fillRect(x + 6,  y + 6, 6, 6);
          R_ctx.fillRect(x + 22, y + 22, 4, 4);
        } else if (v === 'rune') {
          R_ctx.fillStyle = '#1a1844';
          R_ctx.fillRect(x + 12, y + 12, 16, 2);
          R_ctx.fillRect(x + 19, y +  5, 2, 16);
          R_ctx.fillRect(x + 28, y + 24, 2,  2);
        }
      }
    }
  }
}

/* ── Torches ── */
let torches = [];

function initTorches() {
  torches = [
    { fx: .15, fy: .005 }, { fx: .50, fy: .005 }, { fx: .85, fy: .005 },
    { fx: .15, fy: .995 }, { fx: .50, fy: .995 }, { fx: .85, fy: .995 },
    { fx: .005, fy: .33 }, { fx: .005, fy: .66 },
    { fx: .995, fy: .33 }, { fx: .995, fy: .66 },
  ];
}

function drawTorches(ts) {
  for (const tor of torches) {
    const tx = tor.fx * R_gc.width;
    const ty = tor.fy * R_gc.height;
    const ph = ts * .0028 + tor.fx * 12;

    /* Glow halo */
    const tg = R_ctx.createRadialGradient(tx, ty, 2, tx, ty, 90);
    tg.addColorStop(0, 'rgba(255,130,20,.14)');
    tg.addColorStop(1, 'rgba(0,0,0,0)');
    R_ctx.fillStyle = tg;
    R_ctx.fillRect(0, 0, R_gc.width, R_gc.height);

    /* Bracket */
    R_ctx.fillStyle = '#221408';
    R_ctx.fillRect(tx - 3, ty - 2, 6, 8);

    /* Flames (3 layers) */
    const fl = Math.sin(ph) * 2.2;
    R_ctx.fillStyle = '#bb3800';
    R_ctx.fillRect(tx - 4 + fl, ty - 13, 8 - Math.abs(fl), 11);
    R_ctx.fillStyle = '#ee6600';
    R_ctx.fillRect(tx - 3 + fl * .6, ty - 17, 6 - Math.abs(fl) * .4, 9);
    R_ctx.fillStyle = '#ffbb00';
    R_ctx.fillRect(tx - 2 + fl * .3, ty - 20, 4, 7);
    R_ctx.fillStyle = 'rgba(255,240,200,.7)';
    R_ctx.fillRect(tx - 1, ty - 22, 2, 5);
  }
}

/* ── Player sprite ── */
function drawPlayer(px, py, W, H, frame, facingLeft) {
  R_ctx.save();
  if (facingLeft) { R_ctx.translate(px + W, py); R_ctx.scale(-1, 1); }
  else             { R_ctx.translate(px, py); }

  /* Elliptical shadow */
  R_ctx.fillStyle = 'rgba(0,0,0,.38)';
  R_ctx.beginPath();
  R_ctx.ellipse(W / 2, H + 3, 11, 4, 0, 0, Math.PI * 2);
  R_ctx.fill();

  /* Cape */
  R_ctx.fillStyle = '#7a1212';
  R_ctx.fillRect(0, 7, W, Math.round(H * .55));
  R_ctx.fillStyle = '#9a1c1c';
  R_ctx.fillRect(2, 8, W - 4, Math.round(H * .48));

  /* Body armor */
  R_ctx.fillStyle = '#102050';
  R_ctx.fillRect(4, 10, W - 8, Math.round(H * .44));
  R_ctx.fillStyle = '#183070';
  R_ctx.fillRect(5, 11, W - 10, Math.round(H * .36));

  /* Chest detail */
  R_ctx.fillStyle = '#2050aa';
  R_ctx.fillRect(7, 13, 5, 6);
  R_ctx.fillRect(W - 12, 13, 5, 6);

  /* Shoulder pads */
  R_ctx.fillStyle = '#1e3e8a';
  R_ctx.fillRect(1, 8, 5, 5);
  R_ctx.fillRect(W - 6, 8, 5, 5);
  R_ctx.fillStyle = '#2c4cbe';
  R_ctx.fillRect(2, 9, 3, 3);
  R_ctx.fillRect(W - 5, 9, 3, 3);

  /* Head */
  R_ctx.fillStyle = '#c8906a';
  R_ctx.fillRect(5, 1, W - 10, 11);
  R_ctx.fillStyle = '#a87050';
  R_ctx.fillRect(5, 9, W - 10, 3);

  /* Eyes with blue glow */
  R_ctx.fillStyle = '#111';
  R_ctx.fillRect(7, 4, 3, 3);
  R_ctx.fillRect(W - 10, 4, 3, 3);
  R_ctx.fillStyle = '#2244ff';
  R_ctx.fillRect(7, 4, 2, 2);
  R_ctx.fillRect(W - 10, 4, 2, 2);

  /* Hair */
  R_ctx.fillStyle = '#280e04';
  R_ctx.fillRect(5, 1, W - 10, 3);

  /* Animated legs */
  const legL = frame === 0 ? 4 : 0;
  const legR = frame === 1 ? 4 : 0;
  const legY = Math.round(H * .72);
  const legH = Math.round(H * .28);
  R_ctx.fillStyle = '#0c1840';
  R_ctx.fillRect(4,      legY, 7, legH + legL);
  R_ctx.fillRect(W - 11, legY, 7, legH + legR);

  /* Boots */
  R_ctx.fillStyle = '#0c0806';
  R_ctx.fillRect(3,      legY + legH + legL - 4, 9, 5);
  R_ctx.fillRect(W - 12, legY + legH + legR - 4, 9, 5);
  R_ctx.fillStyle = '#181008';
  R_ctx.fillRect(4,      legY + legH + legL - 4, 7, 2);
  R_ctx.fillRect(W - 11, legY + legH + legR - 4, 7, 2);

  R_ctx.restore();
}

/* ── NPC sprite ── */
function drawNpc(npc) {
  if (npc.done) return;

  const by = npc._by;
  const W = 22, H = 34;
  const x = npc.x - W / 2;
  const y = npc.y - H / 2 + by;

  /* Elliptical shadow */
  R_ctx.fillStyle = 'rgba(0,0,0,.3)';
  R_ctx.beginPath();
  R_ctx.ellipse(npc.x, npc.y + H / 2 + 3 + by, 11, 4, 0, 0, Math.PI * 2);
  R_ctx.fill();

  /* Glow halo */
  const gl = R_ctx.createRadialGradient(npc.x, npc.y + by, 4, npc.x, npc.y + by, 44);
  gl.addColorStop(0, npc.cGlow + '28');
  gl.addColorStop(1, 'rgba(0,0,0,0)');
  R_ctx.fillStyle = gl;
  R_ctx.fillRect(npc.x - 55, npc.y - 65 + by, 110, 110);

  R_ctx.save();
  R_ctx.translate(x, y);

  /* Robe */
  R_ctx.fillStyle = npc.cDetail;
  R_ctx.fillRect(2, 8, W - 4, Math.round(H * .6));
  R_ctx.fillStyle = npc.cBody;
  R_ctx.fillRect(4, 10, W - 8, Math.round(H * .5));

  /* Head */
  R_ctx.fillStyle = npc.cHead;
  R_ctx.fillRect(5, 1, W - 10, 11);
  R_ctx.fillStyle = '#a87050';
  R_ctx.fillRect(5, 9, W - 10, 3);

  /* Glowing eyes */
  R_ctx.fillStyle = '#111';
  R_ctx.fillRect(7, 4, 3, 3);
  R_ctx.fillRect(W - 10, 4, 3, 3);
  R_ctx.fillStyle = npc.cGlow;
  R_ctx.fillRect(7, 4, 2, 2);
  R_ctx.fillRect(W - 10, 4, 2, 2);

  /* Legs */
  R_ctx.fillStyle = npc.cBody;
  R_ctx.fillRect(5,      Math.round(H * .72), 6, Math.round(H * .28));
  R_ctx.fillRect(W - 11, Math.round(H * .72), 6, Math.round(H * .28));

  R_ctx.restore();

  /* [!] blinking indicator */
  const blk = Math.floor(Date.now() / 480) % 2 === 0;
  if (blk) {
    R_ctx.save();
    R_ctx.shadowColor = '#f0c040';
    R_ctx.shadowBlur  = 14;
    R_ctx.font        = 'bold 13px "Press Start 2P", monospace';
    R_ctx.fillStyle   = '#f0c040';
    R_ctx.textAlign   = 'center';
    R_ctx.fillText('!', npc.x, y - 10);
    R_ctx.shadowBlur  = 0;
    R_ctx.textAlign   = 'left';
    R_ctx.restore();
  }
}

/* ── NPC avatar for dialog canvas (60×60) ── */
function renderAvatar(npc) {
  const av = document.getElementById('npc-avatar-canvas');
  const ac = av.getContext('2d');
  ac.clearRect(0, 0, 60, 60);
  ac.fillStyle = '#050508';
  ac.fillRect(0, 0, 60, 60);

  const ox = 14, oy = 5;
  const W = 32, H = 44;

  ac.fillStyle = npc.cDetail;
  ac.fillRect(ox + 2, oy + 10, W - 4, Math.round(H * .62));
  ac.fillStyle = npc.cBody;
  ac.fillRect(ox + 5, oy + 12, W - 10, Math.round(H * .52));
  ac.fillStyle = npc.cHead;
  ac.fillRect(ox + 6, oy + 1, W - 12, 14);
  ac.fillStyle = '#a87050';
  ac.fillRect(ox + 6, oy + 12, W - 12, 3);
  ac.fillStyle = '#111';
  ac.fillRect(ox + 9, oy + 5, 4, 4);
  ac.fillRect(ox + W - 13, oy + 5, 4, 4);
  ac.fillStyle = npc.cGlow;
  ac.fillRect(ox + 9, oy + 5, 3, 3);
  ac.fillRect(ox + W - 13, oy + 5, 3, 3);
}

/* ── Radial lighting (darkness around player) ── */
function drawLighting(playerX, playerY) {
  const r = Math.min(R_gc.width, R_gc.height) * .40;
  const g = R_ctx.createRadialGradient(playerX, playerY, r * .10, playerX, playerY, r);
  g.addColorStop(0,    'rgba(0,0,0,0)');
  g.addColorStop(.30,  'rgba(0,0,0,.12)');
  g.addColorStop(.60,  'rgba(0,0,0,.58)');
  g.addColorStop(.85,  'rgba(0,0,0,.82)');
  g.addColorStop(1,    'rgba(0,0,0,.95)');
  R_ctx.fillStyle = g;
  R_ctx.fillRect(0, 0, R_gc.width, R_gc.height);
}

/* ── [E] Talk prompts ── */
function drawPrompts(playerX, playerY) {
  const threshold = Math.min(R_gc.width, R_gc.height) * .09;
  const label     = t().talk;

  for (const npc of NPCS) {
    if (npc.done) continue;
    const dx = playerX - npc.x, dy = playerY - npc.y;
    if (Math.sqrt(dx * dx + dy * dy) < threshold) {
      R_ctx.save();
      R_ctx.shadowColor = '#f0c040';
      R_ctx.shadowBlur  = 8;
      R_ctx.font        = '7px "Press Start 2P", monospace';
      R_ctx.fillStyle   = '#f0c040';
      R_ctx.textAlign   = 'center';
      R_ctx.fillText(label, npc.x, npc.y - 28 + npc._by);
      R_ctx.shadowBlur  = 0;
      R_ctx.textAlign   = 'left';
      R_ctx.restore();
    }
  }
}
