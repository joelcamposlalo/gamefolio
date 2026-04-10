/* ═══════════════════════════════════
   MODAL — dialog → quiz → result
═══════════════════════════════════ */

let _dlgActive = false, _dlgTimer = null;

/* ── Show / hide modal steps ── */
function _showStep(which) {
  const overlay = document.getElementById('modal-overlay');
  /* Quiz gets full-centre layout; dialog/result stay anchored to bottom */
  if (which === 'quiz') {
    overlay.classList.add('quiz-mode');
  } else {
    overlay.classList.remove('quiz-mode');
  }
  document.getElementById('dialog-step').style.display = which === 'dialog' ? 'flex'  : 'none';
  document.getElementById('quiz-step').style.display   = which === 'quiz'   ? 'flex'  : 'none';
  document.getElementById('result-step').style.display = which === 'result' ? 'block' : 'none';
}

/* ── Typewriter effect for dialog text ── */
function _typeDialog(text) {
  const el = document.getElementById('dialog-text-content');
  el.innerHTML = ''; let i = 0; _dlgActive = true;

  function step() {
    if (!_dlgActive) { el.innerHTML = text.replace(/\n/g, '<br>'); return; }
    if (i < text.length) {
      el.innerHTML += text[i] === '\n' ? '<br>' : text[i];
      i++; _dlgTimer = setTimeout(step, 26);
    }
  }
  step();
}

/* ── Open dialog (step 1) ── */
function openDialog(npc) {
  GS.modalOpen  = true;
  GS.activeNpc  = npc;
  const tx      = t();
  const overlay = document.getElementById('modal-overlay');
  const inner   = overlay.querySelector('.modal-inner');

  overlay.style.display = 'flex';
  _showStep('dialog');

  document.getElementById('dialog-npc-name').textContent    = '— ' + tx.npcNames[npc.npcIdx] + ' —';
  document.getElementById('dialog-continue-btn').textContent = tx.continuar;
  renderAvatar(npc);
  _typeDialog(tx.dialogs[npc.npcIdx]);

  /* Slide up the inner container with GSAP */
  gsap.fromTo(inner,
    { y: 60, opacity: 0 },
    { y: 0,  opacity: 1, duration: .42, ease: 'power3.out' }
  );

  document.getElementById('dialog-continue-btn').onclick = () => {
    _dlgActive = false;
    clearTimeout(_dlgTimer);
    _showQuiz(npc);
  };
}

/* ── Quiz (step 2) ── */
function _showQuiz(npc) {
  _showStep('quiz');
  const tx = t();
  document.getElementById('quiz-question').textContent = tx.questions[npc.npcIdx];

  const container = document.getElementById('quiz-opts');
  container.innerHTML = '';

  tx.options[npc.npcIdx].forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.innerHTML = opt.replace(/\n/g, '<br>');
    btn.onclick   = () => _checkAnswer(npc, i);
    container.appendChild(btn);
  });
}

/* ── Check answer ── */
function _checkAnswer(npc, chosen) {
  const all        = document.querySelectorAll('.quiz-opt');
  const correctIdx = t().correctIdx[npc.npcIdx];

  all.forEach(b => { b.disabled = true; b.onclick = null; });
  all[correctIdx].classList.add('correct');

  if (chosen === correctIdx) {
    gsap.to(all[correctIdx], { scale: 1.04, duration: .2, yoyo: true, repeat: 1 });
    setTimeout(() => { _flashGold(); _showResult(npc, true); }, 500);
  } else {
    all[chosen].classList.add('wrong');
    gsap.fromTo(all[chosen], { x: -6 }, { x: 0, duration: .08, repeat: 5, yoyo: true });
    setTimeout(() => _showResult(npc, false), 650);
  }
}

/* ── Result (step 3) ── */
function _showResult(npc, correct) {
  _showStep('result');
  const tx = t();
  document.getElementById('result-btn').textContent = tx.cerrar;

  if (correct) {
    document.getElementById('result-text').innerHTML =
      tx.correct(npc.item, tx.npcNames[npc.npcIdx]).replace(/\n/g, '<br>');
    npc.done = true;
    giveItem(npc);
  } else {
    document.getElementById('result-text').innerHTML =
      tx.wrong.replace(/\n/g, '<br>');
  }
}

/* ── Close modal ── */
function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  const inner   = overlay.querySelector('.modal-inner');

  gsap.to(inner, {
    y: 40, opacity: 0, duration: .3, ease: 'power2.in',
    onComplete: () => {
      overlay.style.display = 'none';
      overlay.classList.remove('quiz-mode');
      GS.modalOpen = false;
      GS.activeNpc = null;
      checkCompletion();
    }
  });
}

/* ── Gold screen flash ── */
function _flashGold() {
  gsap.fromTo('#gold-flash',
    { opacity: .7 },
    { opacity: 0,  duration: .45, ease: 'power2.out' }
  );
}
