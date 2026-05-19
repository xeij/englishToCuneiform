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
    if (swapping) return;
    swapping = true;
    entryImg.classList.add('swapping');
    setTimeout(() => {
      entryImg.src = ENTRY_IMAGES[idx];
      entryImg.classList.remove('swapping');
      swapping = false;
    }, 320);
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

    setTimeout(() => englishInput.focus({ preventScroll: true }), 700);
  }

  // ---- Corner slideshow (auto-rotates) ----
  let cornerIdx = 0;
  function startCornerSlideshow() {
    setInterval(() => {
      cornerIdx = (cornerIdx + 1) % CORNER_IMAGES.length;
      cornerImg.classList.add('swapping');
      setTimeout(() => {
        cornerImg.src = CORNER_IMAGES[cornerIdx];
        cornerImg.classList.remove('swapping');
      }, 600);
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

  function renderTranslation() {
    const text = englishInput.value;
    const { cuneiform, translit } = window.translateToCuneiform(text);

    if (!cuneiform) {
      cuneOutput.classList.add('empty');
      cuneOutput.textContent = '';
      translitOut.textContent = '';
      return;
    }

    cuneOutput.classList.remove('empty');
    cuneOutput.textContent = cuneiform;
    translitOut.textContent = translit;
  }

  englishInput.addEventListener('input', renderTranslation);

  // ---- Read more toggle ----
  readMoreBtn.addEventListener('click', () => {
    const isOpen = deepHistory.classList.toggle('open');
    deepHistory.setAttribute('aria-hidden', String(!isOpen));
    readMoreBtn.setAttribute('aria-expanded', String(isOpen));
    readMoreBtn.textContent = isOpen ? 'Read less' : 'Read more…';
    if (isOpen) {
      setTimeout(() => {
        deepHistory.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  });

  copyBtn.addEventListener('click', async () => {
    const text = cuneOutput.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = old; }, 1500);
    } catch (err) {
      const range = document.createRange();
      range.selectNodeContents(cuneOutput);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });
})();
