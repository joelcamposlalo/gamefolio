/* ═══════════════════════════════════
   STATE — global state, translations, NPC data
═══════════════════════════════════ */

/* Active language: 'es' | 'en' */
const lang = { current: 'es' };

/* Shorthand to get current translation object */
const t = () => TXT[lang.current];

/* ── Global game state ── */
const GS = {
  screen:    'lang',   // lang | instructions | menu | game | portfolio
  items:     [],       // collected NPC items (max 3)
  modalOpen: false,
  activeNpc: null,
};

/* ── NPC definitions (fx/fy = fractional canvas position 0–1) ── */
const NPCS = [
  {
    id: 'mago',      npcIdx: 0,
    fx: .20, fy: .32, x: 0, y: 0,
    cBody:   '#4a1a8a',
    cHead:   '#d4a574',
    cDetail: '#8b44cc',
    cGlow:   '#9b59ff',
    item: '⚔️', done: false, bobOff: 0, _by: 0,
  },
  {
    id: 'elfo',      npcIdx: 1,
    fx: .76, fy: .62, x: 0, y: 0,
    cBody:   '#145c2e',
    cHead:   '#d4a574',
    cDetail: '#1fa845',
    cGlow:   '#22dd55',
    item: '🛡️', done: false, bobOff: Math.PI * .7, _by: 0,
  },
  {
    id: 'caballero', npcIdx: 2,
    fx: .50, fy: .17, x: 0, y: 0,
    cBody:   '#555566',
    cHead:   '#d4a574',
    cDetail: '#8888aa',
    cGlow:   '#aaaaff',
    item: '🪖', done: false, bobOff: Math.PI * 1.4, _by: 0,
  },
];

/* ── Translations ── */
const TXT = {
  /* ────────── ESPAÑOL ────────── */
  es: {
    /* Language screen */
    langTitle:  'SELECCIONA TU IDIOMA',
    langSub:    'Select your language',

    /* Instructions */
    instTitle:  'CÓMO JUGAR',
    ctrlTitle:  'CONTROLES',
    ctrlMove:   'Mover al guerrero',
    ctrlTalk:   'Hablar con un NPC',
    objTitle:   'OBJETIVO',
    objText:    'Explora el dungeon y encuentra a los 3 guardianes. Responde sus preguntas técnicas para ganar sus items y completar tu aventura.',
    instStart:  'COMENZAR AVENTURA →',
    npcDescs: [
      { name: 'Anciano Mago',  item: '⚔️', label: 'Espada',  topic: 'SQL',        color: 'purple' },
      { name: 'Elfo Arquero',  item: '🛡️', label: 'Escudo',  topic: 'CSS',        color: 'green'  },
      { name: 'Caballero',     item: '🪖', label: 'Traje',   topic: 'JavaScript', color: 'blue'   },
    ],

    /* Menu */
    welcome:    'Bienvenido a\nJoelopolis',
    subtitle:   'Una aventura te espera...',
    pressStart: '[ PULSA ENTER PARA EMPEZAR ]',

    /* HUD / Game */
    hudName:    'JOEL CAMPOS',
    talk:       '[E] Hablar',
    itemNames:  ['Espada', 'Escudo', 'Traje'],

    /* Modals */
    continuar:  'CONTINUAR ▶',
    cerrar:     'CERRAR',
    completed:  '¡AVENTURA\nCOMPLETADA!',
    compSub:    'Has recolectado los 3 items.',
    viewPort:   'VER PORTFOLIO →',
    replayGame: 'REPETIR JUEGO ↺',

    /* NPC names & dialogs */
    npcNames: ['Anciano Mago', 'Elfo Arquero', 'Caballero'],
    dialogs: [
      'Demuestra tu sabiduría, viajero.\nResponde mi acertijo y la\nespada será tuya...',
      'Solo quienes dominan las artes\ntécnicas merecen este escudo.\n¿Estás listo?',
      'Para portar este traje debes\ndemostrar que conoces los\nfundamentos. ¡Responde!',
    ],

    /* Quiz */
    questions: [
      '¿Cuál consulta obtiene el segundo salario más alto de la tabla empleados?',
      '¿Cuál es la forma correcta de centrar un div horizontal y verticalmente con Flexbox?',
      '¿Qué imprime console.log(typeof null) en JavaScript?',
    ],
    options: [
      [
        'A) SELECT MAX(salario) FROM empleados\n   WHERE salario < (SELECT MAX(salario) FROM empleados)',
        'B) SELECT TOP 2 salario FROM empleados\n   ORDER BY salario DESC',
        'C) SELECT salario FROM empleados\n   ORDER BY salario LIMIT 1 OFFSET 1',
        'D) SELECT DISTINCT salario FROM empleados\n   ORDER BY salario DESC LIMIT 2',
      ],
      [
        'A) display: flex;\n   align-items: center;',
        'B) display: flex;\n   justify-content: center;\n   align-items: center;',
        'C) display: flex;\n   justify-content: center;',
        'D) display: grid;\n   align-items: center;',
      ],
      ['A) "null"', 'B) "undefined"', 'C) "object"', 'D) "boolean"'],
    ],
    /* correct answer index per NPC: 0=A, 1=B, 2=C */
    correctIdx: [0, 1, 2],

    correct: (item, name) => `¡Correcto! Toma este ${item}\n${name}, valiente guerrero.`,
    wrong:   'Incorrecto... Vuelve cuando\nhayas estudiado más, viajero.',

    /* Portfolio */
    port: {
      back:       '← VOLVER AL JUEGO',
      title:      'JOEL CAMPOS',
      sub:        'Desarrollador Full-Stack · Ayuntamiento de Zapopan',
      s1h:        '⚔️ SOBRE MÍ',
      s1p:        'Desarrollador full-stack en el Ayuntamiento de Zapopan. Apasionado por crear soluciones tecnológicas para el sector público, modernizando procesos municipales a través de software accesible y bien construido.',
      s2h:        '🏛️ EXPERIENCIA',
      s2company:  'Ayuntamiento de Zapopan',
      s2role:     'Desarrollador de Software · Departamento de TI',
      s2items: [
        'Desarrollo de sistemas internos y aplicaciones municipales',
        'Modernización de procesos administrativos digitales',
        'Diseño e integración de APIs y bases de datos institucionales',
        'Colaboración con áreas operativas para traducir necesidades en software',
      ],
      s3h:  '🛡️ STACK TECNOLÓGICO',
      s4h:  '🪖 PROYECTOS DESTACADOS',
      projects: [
        { title: '⚙️ Sistema de Descuentos Predial',     desc: 'App web para gestión y validación de descuentos en impuesto predial para ciudadanos de Zapopan.' },
        { title: '📦 Sistema de Inventario de Sistemas', desc: 'Control centralizado de sistemas licenciados e internos del Departamento de TI.' },
        { title: '📱 App Móvil Municipal',               desc: 'Aplicación móvil con .NET MAUI e integración Figma → XAML para servicios ciudadanos.' },
      ],
      s5h:    '📬 CONTACTO',
      s5p:    '¿Tienes un proyecto o quieres colaborar?',
      github: '⌨ GitHub',
      email:  '✉ Correo',
    },
  },

  /* ────────── ENGLISH ────────── */
  en: {
    /* Language screen */
    langTitle: 'SELECT YOUR LANGUAGE',
    langSub:   'Selecciona tu idioma',

    /* Instructions */
    instTitle: 'HOW TO PLAY',
    ctrlTitle: 'CONTROLS',
    ctrlMove:  'Move your warrior',
    ctrlTalk:  'Talk to an NPC',
    objTitle:  'OBJECTIVE',
    objText:   'Explore the dungeon and find the 3 guardians. Answer their technical questions to earn their items and complete your adventure.',
    instStart: 'BEGIN ADVENTURE →',
    npcDescs: [
      { name: 'Ancient Mage', item: '⚔️', label: 'Sword',  topic: 'SQL',        color: 'purple' },
      { name: 'Elf Archer',   item: '🛡️', label: 'Shield', topic: 'CSS',        color: 'green'  },
      { name: 'Knight',       item: '🪖', label: 'Armor',  topic: 'JavaScript', color: 'blue'   },
    ],

    /* Menu */
    welcome:    'Welcome to\nJoelopolis',
    subtitle:   'An adventure awaits...',
    pressStart: '[ PRESS ENTER TO START ]',

    /* HUD / Game */
    hudName:    'JOEL CAMPOS',
    talk:       '[E] Talk',
    itemNames:  ['Sword', 'Shield', 'Armor'],

    /* Modals */
    continuar:  'CONTINUE ▶',
    cerrar:     'CLOSE',
    completed:  'ADVENTURE\nCOMPLETE!',
    compSub:    'You collected all 3 items.',
    viewPort:   'VIEW PORTFOLIO →',
    replayGame: 'PLAY AGAIN ↺',

    /* NPC names & dialogs */
    npcNames: ['Ancient Mage', 'Elf Archer', 'Knight'],
    dialogs: [
      'Prove your wisdom, traveler.\nAnswer my riddle and the\nsword shall be yours...',
      'Only those who master the\ntechnical arts deserve this\nshield. Are you ready?',
      'To wear this armor you must\nprove you know the\nfundamentals. Answer me!',
    ],

    /* Quiz */
    questions: [
      'Which query retrieves the second highest salary from the employees table?',
      'What is the correct way to center a div both horizontally and vertically with Flexbox?',
      'What does console.log(typeof null) print in JavaScript?',
    ],
    options: [
      [
        'A) SELECT MAX(salary) FROM employees\n   WHERE salary < (SELECT MAX(salary) FROM employees)',
        'B) SELECT TOP 2 salary FROM employees\n   ORDER BY salary DESC',
        'C) SELECT salary FROM employees\n   ORDER BY salary LIMIT 1 OFFSET 1',
        'D) SELECT DISTINCT salary FROM employees\n   ORDER BY salary DESC LIMIT 2',
      ],
      [
        'A) display: flex;\n   align-items: center;',
        'B) display: flex;\n   justify-content: center;\n   align-items: center;',
        'C) display: flex;\n   justify-content: center;',
        'D) display: grid;\n   align-items: center;',
      ],
      ['A) "null"', 'B) "undefined"', 'C) "object"', 'D) "boolean"'],
    ],
    correctIdx: [0, 1, 2],

    correct: (item, name) => `Correct! Take this ${item}\n${name}, brave warrior.`,
    wrong:   'Wrong... Come back when you\nhave studied more, traveler.',

    /* Portfolio */
    port: {
      back:      '← BACK TO GAME',
      title:     'JOEL CAMPOS',
      sub:       'Full-Stack Developer · Zapopan City Hall',
      s1h:       '⚔️ ABOUT ME',
      s1p:       'Full-stack developer at Zapopan City Hall. Passionate about building technological solutions for the public sector, focused on modernizing municipal processes through accessible and well-crafted software.',
      s2h:       '🏛️ EXPERIENCE',
      s2company: 'Zapopan City Hall',
      s2role:    'Software Developer · IT Department',
      s2items: [
        'Development of internal systems and municipal applications',
        'Digitalization of administrative processes',
        'API design and integration with institutional databases',
        'Collaboration with operational teams to translate needs into software',
      ],
      s3h:  '🛡️ TECH STACK',
      s4h:  '🪖 FEATURED PROJECTS',
      projects: [
        { title: '⚙️ Property Tax Discount System',  desc: 'Web app for managing and validating property tax discounts for Zapopan citizens.' },
        { title: '📦 Systems Inventory Management',  desc: 'Centralized control of licensed and internal IT Department systems.' },
        { title: '📱 Municipal Mobile App',          desc: 'Mobile app with .NET MAUI and Figma → XAML integration for citizen services.' },
      ],
      s5h:    '📬 CONTACT',
      s5p:    'Have a project or want to collaborate?',
      github: '⌨ GitHub',
      email:  '✉ Email',
    },
  },
};
