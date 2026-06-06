// UI controller: image gallery entrance + corner slideshow + live translation
(function () {
  'use strict';

  // Entry uses image1-4, corner slideshows use image5-15.
  const ENTRY_IMAGES  = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
  const LEFT_IMAGES   = ['image6.jpg', 'image8.jpg', 'image10.jpg', 'image12.jpg', 'image14.jpg'];
  const RIGHT_IMAGES  = ['image5.jpg', 'image7.jpg', 'image9.jpg', 'image11.jpg', 'image13.jpg', 'image15.jpg'];

  const entryEl      = document.getElementById('entry');
  const entryImg     = document.getElementById('entry-img');
  const cornerEl     = document.getElementById('corner-slideshow');
  const cornerImg    = document.getElementById('corner-img');
  const leftEl       = document.getElementById('left-slideshow');
  const leftImg      = document.getElementById('left-img');
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
  const swapBtn      = document.getElementById('swap-btn');
  const inputLabel   = document.getElementById('input-label');
  const outputLabel  = document.getElementById('output-label');

  // Translation direction. 'en2op' = English in, cuneiform out (default).
  // 'op2en' = cuneiform in, English out.
  let direction = 'en2op';

  let imgIdx = 0;
  let appRevealed = false;
  let swapping = false;

  entryImg.src = ENTRY_IMAGES[0];
  if (cornerImg) cornerImg.src = RIGHT_IMAGES[0];
  if (leftImg) leftImg.src = LEFT_IMAGES[0];

  // Preload all images so swaps are instant
  [...ENTRY_IMAGES.slice(1), ...LEFT_IMAGES, ...RIGHT_IMAGES].forEach(src => {
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
    if (leftEl) {
      leftEl.classList.remove('hidden');
      leftEl.setAttribute('aria-hidden', 'false');
    }

    void app.offsetWidth;  // force reflow so transitions fire

    titleBar.classList.add('visible');
    inputCard.classList.add('visible');
    outputCard.classList.add('visible');
    appFooter.classList.add('visible');
    cornerEl.classList.add('visible');
    if (leftEl) leftEl.classList.add('visible');

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
      renderOutput('', '');
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
    renderOutput(cuneiform, translit);
  }

  englishInput.addEventListener('focus', stopTypewriterDemo);

  // ---- Corner slideshows (auto-rotate, alternating image pools) ----
  let leftIdx = 0;
  let rightIdx = 0;
  function startCornerSlideshow() {
    setInterval(() => {
      leftIdx = (leftIdx + 1) % LEFT_IMAGES.length;
      rightIdx = (rightIdx + 1) % RIGHT_IMAGES.length;
      if (leftImg) leftImg.src = LEFT_IMAGES[leftIdx];
      if (cornerImg) cornerImg.src = RIGHT_IMAGES[rightIdx];
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

  // Track the previously rendered output so we can diff and only animate
  // characters that actually changed. Cuneiform code points are in the
  // supplementary plane, so we use Array.from for proper code-point iteration.
  let prevOutput = '';

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }

  // Render whatever the current direction produces — cuneiform glyphs in
  // 'en2op' mode, plain English in 'op2en' mode. The fade-in diff on new
  // characters works the same for both since we iterate code points.
  function renderOutput(text, translit) {
    if (!text) {
      cuneOutput.classList.add('empty');
      cuneOutput.innerHTML = '';
      translitOut.textContent = '';
      prevOutput = '';
      return;
    }

    cuneOutput.classList.remove('empty');

    const prevChars = Array.from(prevOutput);
    const newChars  = Array.from(text);

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
    prevOutput = text;
  }

  function renderTranslation() {
    const text = englishInput.value;
    if (direction === 'en2op') {
      const { cuneiform, translit } = window.translateToCuneiform(text);
      renderOutput(cuneiform, translit);
    } else {
      const { english, translit } = window.translateToEnglish(text);
      renderOutput(english, translit);
    }
  }

  // === Swap direction ===
  // Flip the labels, swap the contents of the input box and the output box
  // (Google-Translate style), and re-render. Disables the typewriter demo
  // permanently once the user has interacted with the swap button.
  function applyDirectionLabels() {
    if (direction === 'en2op') {
      inputLabel.textContent  = 'English';
      outputLabel.textContent = 'Old Persian Cuneiform';
      englishInput.setAttribute('aria-label', 'English input');
      document.body.classList.remove('reverse-mode');
    } else {
      inputLabel.textContent  = 'Old Persian Cuneiform';
      outputLabel.textContent = 'English';
      englishInput.setAttribute('aria-label', 'Cuneiform input');
      document.body.classList.add('reverse-mode');
    }
  }

  function swapDirection() {
    stopTypewriterDemo();

    // Capture the current input and the plain-text output before mutating.
    const currentInput  = englishInput.value;
    const currentOutput = cuneOutput.textContent || '';

    direction = direction === 'en2op' ? 'op2en' : 'en2op';
    applyDirectionLabels();

    // Move the previous output into the input box so the user keeps their
    // working text — now in the opposite language.
    englishInput.value = currentOutput;

    // Reset the diff baseline so the next render fully re-paints in the
    // new font and direction.
    prevOutput = '';
    renderTranslation();

    // If the user swapped before typing anything (input was empty), leave
    // the box empty for them; otherwise focus it so they can keep editing.
    if (englishInput.value) englishInput.focus();

    swapBtn.classList.remove('is-swapping');
    void swapBtn.offsetWidth;
    swapBtn.classList.add('is-swapping');
  }

  swapBtn.addEventListener('click', swapDirection);

  englishInput.addEventListener('input', () => {
    stopTypewriterDemo();
    renderTranslation();
  });

  // ---- Syllabary & phrases: click a cell to drop its English into the input ----
  function insertIntoInput(text) {
    stopTypewriterDemo();
    const current = englishInput.value;
    const sep = current && !/\s$/.test(current) ? ' ' : '';
    englishInput.value = current + sep + text;
    renderTranslation();
    englishInput.focus();
    englishInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.querySelectorAll('.ref-cell[data-insert]').forEach(cell => {
    cell.addEventListener('click', () => {
      insertIntoInput(cell.getAttribute('data-insert'));
    });
  });

  document.querySelectorAll('.phrase-card[data-insert]').forEach(card => {
    card.addEventListener('click', () => {
      stopTypewriterDemo();
      englishInput.value = card.getAttribute('data-insert');
      renderTranslation();
      englishInput.focus();
      englishInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // ---- Read more toggle ----
  const readMoreLabel = readMoreBtn.querySelector('.read-more-label');
  readMoreBtn.addEventListener('click', () => {
    const isOpen = deepHistory.classList.toggle('open');
    deepHistory.setAttribute('aria-hidden', String(!isOpen));
    readMoreBtn.setAttribute('aria-expanded', String(isOpen));
    if (readMoreLabel) readMoreLabel.textContent = isOpen ? 'Read less' : 'Read more';
    if (isOpen) {
      deepHistory.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
