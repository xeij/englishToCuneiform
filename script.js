// UI controller: image gallery entrance + corner slideshow + live translation
(function () {
  'use strict';

  // Entry uses image1-4, corner slideshow uses image5-15.
  const ENTRY_IMAGES  = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
  const CORNER_IMAGES = [
    'image5.jpg',  'image6.jpg',  'image7.jpg',  'image8.jpg',
    'image9.jpg',  'image10.jpg', 'image11.jpg', 'image12.jpg',
    'image13.jpg', 'image14.jpg', 'image15.jpg'
  ];

  const entryEl      = document.getElementById('entry');
  const entryImg     = document.getElementById('entry-img');
  const cornerEl     = document.getElementById('corner-slideshow');
  const cornerImg    = document.getElementById('corner-img');
  const titleBar     = document.getElementById('title-bar');
  const app          = document.getElementById('app');
  const inputCard    = document.getElementById('input-container');
  const outputCard   = document.getElementById('output-container');
  const appFooter    = document.getElementById('app-footer');
  const englishInput = document.getElementById('english-input');
  const cuneOutput   = document.getElementById('cuneiform-output');
  const translitOut  = document.getElementById('translit-output');
  const copyBtn      = document.getElementById('copy-btn');
  const readMoreBtn  = document.getElementById('read-more-btn');
  const deepHistory  = document.getElementById('deep-history');
  const demoOverlay  = document.getElementById('demo-overlay');

  let imgIdx = 0;
  let appRevealed = false;
  let swapping = false;

  entryImg.src = ENTRY_IMAGES[0];
  cornerImg.src = CORNER_IMAGES[0];

  // Preload all images so swaps are instant
  [...ENTRY_IMAGES.slice(1), ...CORNER_IMAGES].forEach(src => {
    const i = new Image();
    i.src = src;
  });

  function showEntryImage(idx) {
    entryImg.src = ENTRY_IMAGES[idx];
    swapping = false;
  }

  function advance() {
    if (imgIdx >= ENTRY_IMAGES.length - 1) {
      revealApp();
      return;
    }
    imgIdx++;
    showEntryImage(imgIdx);
  }

  function revealApp() {
    if (appRevealed) return;
    appRevealed = true;

    entryEl.classList.add('gone');

    app.classList.remove('hidden');
    app.setAttribute('aria-hidden', 'false');
    cornerEl.classList.remove('hidden');
    cornerEl.setAttribute('aria-hidden', 'false');

    void app.offsetWidth;  // force reflow so transitions fire

    titleBar.classList.add('visible');
    inputCard.classList.add('visible');
    outputCard.classList.add('visible');
    appFooter.classList.add('visible');
    cornerEl.classList.add('visible');

    startCornerSlideshow();
    startTypewriterDemo();
  }

  // ---- Typewriter demo overlay ----
  // Single words and names — short, recognisable, quick to translate.
  const DEMO_PHRASES = [
    'Darius',
    'Cyrus',
    'Xerxes',
    'Persia',
    'King',
    'Persepolis',
    'Auramazda',
    'Alexander'
  ];
  let demoActive = false;
  let demoTimer  = null;
  let demoIdx    = 0;

  function startTypewriterDemo() {
    if (demoActive) return;
    demoActive = true;
    demoOverlay.classList.remove('hidden');
    typeDemoPhrase();
  }

  function stopTypewriterDemo() {
    if (!demoActive) return;
    demoActive = false;
    clearTimeout(demoTimer);
    demoOverlay.classList.add('hidden');
    demoOverlay.innerHTML = '';
    if (!englishInput.value) {
      renderCuneiformOutput('', '');
    }
  }

  function typeDemoPhrase() {
    if (!demoActive) return;
    const phrase = DEMO_PHRASES[demoIdx];
    let charIdx = 0;

    function typeChar() {
      if (!demoActive) return;
      if (charIdx <= phrase.length) {
        renderDemo(phrase.substring(0, charIdx));
        charIdx++;
        demoTimer = setTimeout(typeChar, 95 + Math.random() * 75);
      } else {
        demoTimer = setTimeout(eraseChar, 2000);
      }
    }

    function eraseChar() {
      if (!demoActive) return;
      if (charIdx > 0) {
        charIdx--;
        renderDemo(phrase.substring(0, charIdx));
        demoTimer = setTimeout(eraseChar, 40);
      } else {
        demoIdx = (demoIdx + 1) % DEMO_PHRASES.length;
        demoTimer = setTimeout(typeDemoPhrase, 550);
      }
    }

    typeChar();
  }

  function renderDemo(text) {
    demoOverlay.innerHTML = escapeHtml(text) + '<span class="demo-caret"></span>';
    const { cuneiform, translit } = window.translateToCuneiform(text);
    renderCuneiformOutput(cuneiform, translit);
  }

  englishInput.addEventListener('focus', stopTypewriterDemo);

  // ---- Corner slideshow (auto-rotates) ----
  let cornerIdx = 0;
  function startCornerSlideshow() {
    setInterval(() => {
      cornerIdx = (cornerIdx + 1) % CORNER_IMAGES.length;
      cornerImg.src = CORNER_IMAGES[cornerIdx];
    }, 4500);
  }

  // ---- Entry input handlers ----

  entryEl.addEventListener('click', () => {
    if (!appRevealed) advance();
  });

  document.addEventListener('keydown', (e) => {
    if (appRevealed && document.activeElement === englishInput) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!appRevealed) advance();
    }
  });

  entryEl.addEventListener('touchend', (e) => {
    if (!appRevealed) {
      e.preventDefault();
      advance();
    }
  }, { passive: false });

  // ---- Live translation ----

  // Track the previously rendered cuneiform so we can diff and only animate
  // glyphs that actually changed. Cuneiform code points are in the
  // supplementary plane, so we use Array.from for proper code-point iteration.
  let prevCuneiform = '';

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }

  function renderCuneiformOutput(cuneiform, translit) {
    if (!cuneiform) {
      cuneOutput.classList.add('empty');
      cuneOutput.innerHTML = '';
      translitOut.textContent = '';
      prevCuneiform = '';
      return;
    }

    cuneOutput.classList.remove('empty');

    const prevChars = Array.from(prevCuneiform);
    const newChars  = Array.from(cuneiform);

    // Length of the shared prefix — these glyphs stay put without re-animating.
    let stable = 0;
    while (stable < prevChars.length &&
           stable < newChars.length &&
           prevChars[stable] === newChars[stable]) {
      stable++;
    }

    let html = '';
    for (let i = 0; i < newChars.length; i++) {
      const ch = escapeHtml(newChars[i]);
      html += i < stable ? ch : `<span class="cune-fade">${ch}</span>`;
    }

    cuneOutput.innerHTML = html;
    translitOut.textContent = translit;
    prevCuneiform = cuneiform;
  }

  function renderTranslation() {
    const text = englishInput.value;
    const { cuneiform, translit } = window.translateToCuneiform(text);
    renderCuneiformOutput(cuneiform, translit);
  }

  englishInput.addEventListener('input', () => {
    stopTypewriterDemo();
    renderTranslation();
  });

  // ---- Read more toggle ----
  const readMoreLabel = readMoreBtn.querySelector('.read-more-label');
  readMoreBtn.addEventListener('click', () => {
    const isOpen = deepHistory.classList.toggle('open');
    deepHistory.setAttribute('aria-hidden', String(!isOpen));
    readMoreBtn.setAttribute('aria-expanded', String(isOpen));
    if (readMoreLabel) readMoreLabel.textContent = isOpen ? 'Read less' : 'Read more';
    if (isOpen) {
      setTimeout(() => {
        deepHistory.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  });

  const copyLabel  = copyBtn.querySelector('.copy-label');
  const copyGlyph  = copyBtn.querySelector('.copy-glyph');
  const checkGlyph = copyBtn.querySelector('.check-glyph');

  function flashCopied() {
    copyBtn.classList.add('is-copied');
    if (copyLabel)  copyLabel.textContent  = 'Copied';
    if (copyGlyph)  copyGlyph.style.display  = 'none';
    if (checkGlyph) checkGlyph.style.display = '';
    setTimeout(() => {
      copyBtn.classList.remove('is-copied');
      if (copyLabel)  copyLabel.textContent  = 'Copy';
      if (copyGlyph)  copyGlyph.style.display  = '';
      if (checkGlyph) checkGlyph.style.display = 'none';
    }, 1500);
  }

  copyBtn.addEventListener('click', async () => {
    const text = cuneOutput.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      flashCopied();
    } catch (err) {
      const range = document.createRange();
      range.selectNodeContents(cuneOutput);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });
})();
