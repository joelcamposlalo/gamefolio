const STACK = ['.NET / C#', 'JavaScript', 'TypeScript', 'React',
               'SQL Server', 'PostgreSQL', '.NET MAUI', 'Git'];

const WA_NUMBER = '523325799804';

function buildPortfolio() {
  const p   = t().port;
  const isEs = lang.current === 'es';

  const lbl = {
    linkedin:  'LinkedIn',
    github:    'GitHub',
    webPort:   isEs ? '🌐 Portfolio Web' : '🌐 Portfolio',
    whatsapp:  'WhatsApp',
    waMsg:     isEs ? 'Hola Joel, vi tu portfolio!' : 'Hi Joel, I saw your portfolio!',
  };

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lbl.waMsg)}`;

  return `
    <div class="port-header">
      <h1>${p.title}</h1>
      <div class="sub">${p.sub}</div>
    </div>

    <div class="port-sec">
      <h2>${p.s1h}</h2>
      <p>${p.s1p}</p>
    </div>

    <div class="port-sec">
      <h2>${p.s2h}</h2>
      <span class="co-name">${p.s2company}</span>
      <span class="co-role">${p.s2role}</span>
      <ul>${p.s2items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>

    <div class="port-sec">
      <h2>${p.s3h}</h2>
      <div class="tags">
        ${STACK.map(s => `<span class="tag">${s}</span>`).join('')}
      </div>
    </div>

    <div class="port-sec">
      <h2>${p.s4h}</h2>
      ${p.projects.map(proj => `
        <div class="proj-card">
          <h3>${proj.title}</h3>
          <p>${proj.desc}</p>
        </div>`).join('')}
      <p class="port-full-hint">
        ${isEs
          ? '👉 Ver todos los proyectos en el portfolio completo ↓'
          : '👉 See all projects in the full portfolio ↓'}
      </p>
    </div>

    <div class="port-sec">
      <h2>${p.s5h}</h2>
      <p>${p.s5p}</p>
      <div class="contact-grid">
        <a class="c-btn c-btn-gold"
           href="https://www.linkedin.com/in/joel-campos"
           target="_blank" rel="noopener">
          🔗 ${lbl.linkedin}
        </a>
        <a class="c-btn c-btn-gold"
           href="https://github.com/joelcamposlalo/gamefolio"
           target="_blank" rel="noopener">
          🐙 ${lbl.github}
        </a>
        <a class="c-btn c-btn-gold"
           href="https://joelcamposlalo.github.io/portfolio/"
           target="_blank" rel="noopener">
          ${lbl.webPort}
        </a>
        <a class="c-btn c-btn-green"
           href="${waLink}"
           target="_blank" rel="noopener">
          💬 ${lbl.whatsapp}
        </a>
      </div>
    </div>`;
}

function showPortfolio() {
  GS.screen = 'portfolio';
  document.getElementById('screen-game').style.display        = 'none';
  document.getElementById('hud').style.display                = 'none';
  document.getElementById('touch-controls').style.display     = 'none';
  document.getElementById('completion-banner').style.display  = 'none';
  document.getElementById('screen-portfolio').style.display   = 'block';
  document.body.classList.add('scrollable');

  document.getElementById('port-content').innerHTML = buildPortfolio();

  gsap.fromTo('.port-sec',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: .5, stagger: .1, ease: 'power2.out', delay: .1 }
  );
}

function backToGame() {
  document.body.classList.remove('scrollable');
  document.getElementById('screen-portfolio').style.display = 'none';
  document.getElementById('screen-game').style.display      = 'block';
  document.getElementById('hud').style.display              = 'flex';

  GS.screen = 'game';
  restartGameLoop();
}
