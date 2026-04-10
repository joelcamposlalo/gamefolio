/* ═══════════════════════════════════
   HUD — inventory slots, completion
═══════════════════════════════════ */

function initHUD() {
  document.getElementById('hud-name').textContent = t().hudName;
  /* Clear all slots */
  for (let i = 0; i < 3; i++) {
    const slot = document.getElementById(`slot-${i}`);
    slot.classList.remove('filled');
    slot.innerHTML = '';
  }
}

/* Called when a quiz is answered correctly */
function giveItem(npc) {
  const idx      = GS.items.length;
  const itemName = t().itemNames[npc.npcIdx];
  GS.items.push(npc);

  const slot = document.getElementById(`slot-${idx}`);
  slot.classList.add('filled');
  slot.innerHTML = `<span style="font-size:18px;line-height:1">${npc.item}</span>
                    <span class="inv-label">${itemName}</span>`;

  /* GSAP bounce animation on the slot */
  gsap.fromTo(slot,
    { scale: 1.6, rotation: -12 },
    { scale: 1, rotation: 0, duration: .55, ease: 'elastic.out(1, .5)' }
  );
}

/* Check if all 3 items collected and show banner */
function checkCompletion() {
  if (GS.items.length < 3) return;

  const tx = t();
  document.getElementById('cb-title').innerHTML    = tx.completed.replace(/\n/g, '<br>');
  document.getElementById('cb-sub').textContent    = tx.compSub;
  document.getElementById('cb-btn-port').textContent   = tx.viewPort;
  document.getElementById('cb-btn-replay').textContent = tx.replayGame;

  const banner = document.getElementById('completion-banner');
  banner.style.display = 'block';

  gsap.fromTo(banner,
    { scale: .55, opacity: 0, y: 30 },
    { scale: 1,   opacity: 1, y: 0, duration: .7, ease: 'back.out(1.7)' }
  );
}
