/**
 * ============================================================================
 * LETTERS FOR YOU — JAVASCRIPT CONTROLLER (Elder Sister to Younger Sister)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STATE & DOM REFERENCES
  // --------------------------------------------------------------------------
  const scenes = {
    landing: document.getElementById('scene-landing'),
    intro: document.getElementById('scene-intro'),
    home: document.getElementById('scene-home'),
    lettersGrid: document.getElementById('scene-letters-grid'),
    letter1: document.getElementById('scene-letter-1'),
    letter2: document.getElementById('scene-letter-2'),
    letter3: document.getElementById('scene-letter-3'),
    letter4: document.getElementById('scene-letter-4'),
    together: document.getElementById('scene-together'),
    secretBonus: document.getElementById('scene-secret-bonus'),
  };

  const btnNoThanks = document.getElementById('btn-no-thanks');
  const btnYesPlease = document.getElementById('btn-yes-please');
  const landingSubheading = document.getElementById('landing-subheading');
  const navSongBtn = document.getElementById('nav-song-btn');
  const introEnvelope = document.getElementById('intro-envelope');
  const candleFlame = document.getElementById('candle-flame');
  const blowCandleBtn = document.getElementById('blow-candle-btn');
  const bgAudio = document.getElementById('bg-audio');
  const birthdayAudio = document.getElementById('birthday-audio');
  const goldenAudio = document.getElementById('golden-audio');

  let currentScene = 'landing';
  let previousScene = 'landing';
  let isEnvelopeOpening = false;
  let isCandleLit = true;
  let isMusicPlaying = false;
  let isBirthdayPlaying = false;
  let isGoldenSongPlaying = false;
  let noThanksDodgeCount = 0;
  const readLetters = new Set();
  let bgSongStarted = false;

  /**
   * Plays the background song (bg-song.mp3) on infinite loop at 40% volume.
   * Triggered automatically upon first user interaction and on initial entry button click.
   */
  function startBackgroundSong() {
    if (bgSongStarted) return;
    bgSongStarted = true;

    // Check if React controller is available
    if (window.__sisterAudio && typeof window.__sisterAudio.playBg === 'function') {
      window.__sisterAudio.playBg();
    }
    window.dispatchEvent(new CustomEvent('sisterhood-entry-click'));

    // HTML5 fallback / direct audio controller
    if (bgAudio) {
      bgAudio.volume = 0.4;
      bgAudio.loop = true;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
        }).catch((err) => {
          console.warn('Background song autoplay awaiting user gesture:', err);
        });
      }
    }
  }

  /**
   * Resumes the background song from the exact second it was paused.
   */
  function resumeBackgroundSong() {
    if (birthdayAudio) {
      birthdayAudio.pause();
      isBirthdayPlaying = false;
    }
    const reactBirthday = document.getElementById('react-birthday-audio');
    if (reactBirthday && typeof reactBirthday.pause === 'function') {
      reactBirthday.pause();
    }

    if (window.__sisterAudio && typeof window.__sisterAudio.resumeBg === 'function') {
      window.__sisterAudio.resumeBg();
    } else if (window.__sisterAudio && typeof window.__sisterAudio.playBg === 'function') {
      window.__sisterAudio.playBg();
    }

    if (bgAudio) {
      bgAudio.volume = 0.4;
      bgAudio.loop = true;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
        }).catch((err) => {
          console.warn('Background song resume awaiting user gesture:', err);
        });
      }
    }
    isMusicPlaying = true;
  }

  // Automatic background music start on first user interaction anywhere
  function handleFirstUserInteraction() {
    startBackgroundSong();
    window.removeEventListener('click', handleFirstUserInteraction);
    window.removeEventListener('touchstart', handleFirstUserInteraction);
    window.removeEventListener('keydown', handleFirstUserInteraction);
  }
  window.addEventListener('click', handleFirstUserInteraction, { once: true });
  window.addEventListener('touchstart', handleFirstUserInteraction, { once: true, passive: true });
  window.addEventListener('keydown', handleFirstUserInteraction, { once: true });

  /**
   * Candle Blow Event (Pause & Play):
   * Inside that function, PAUSE the background song, and immediately PLAY the Happy Birthday melody.
   */
  function triggerBirthdayMelodyOnCandleBlow() {
    // 1. Completely PAUSE the background song (bg-song.mp3)
    if (bgAudio) {
      bgAudio.pause();
      isMusicPlaying = false;
    }
    const reactBg = document.getElementById('react-bg-audio');
    if (reactBg && typeof reactBg.pause === 'function') {
      reactBg.pause();
    }
    if (window.__sisterAudio && typeof window.__sisterAudio.pauseBg === 'function') {
      window.__sisterAudio.pauseBg();
    }

    // 2. Immediately PLAY the Happy Birthday melody
    if (window.__sisterAudio && typeof window.__sisterAudio.playBirthday === 'function') {
      window.__sisterAudio.playBirthday();
    }
    window.dispatchEvent(new CustomEvent('sisterhood-candle-blow'));

    if (birthdayAudio) {
      birthdayAudio.volume = 0.9;
      birthdayAudio.currentTime = 0;
      const playPromise = birthdayAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isBirthdayPlaying = true;
        }).catch((err) => {
          console.warn('Birthday melody playback deferred:', err);
          // Fallback user interaction unlock if needed
          const retryBirthday = () => {
            birthdayAudio.play();
            window.removeEventListener('pointerup', retryBirthday);
            window.removeEventListener('touchend', retryBirthday);
            window.removeEventListener('click', retryBirthday);
          };
          window.addEventListener('pointerup', retryBirthday, { once: true });
          window.addEventListener('touchend', retryBirthday, { once: true });
          window.addEventListener('click', retryBirthday, { once: true });
        });
      }
    }
  }

  /**
   * Exit Candle Letter (Resume):
   * When user closes cake letter or moves to next scene, PAUSE Happy Birthday melody,
   * and RESUME background song (bg-song.mp3) from the exact second it left off.
   */
  function handleExitCandleScene() {
    // 1. Pause Happy Birthday melody
    if (birthdayAudio) {
      birthdayAudio.pause();
      birthdayAudio.currentTime = 0;
      isBirthdayPlaying = false;
    }
    const reactBirthday = document.getElementById('react-birthday-audio');
    if (reactBirthday && typeof reactBirthday.pause === 'function') {
      reactBirthday.pause();
    }
    if (window.__sisterAudio && typeof window.__sisterAudio.stopBirthday === 'function') {
      window.__sisterAudio.stopBirthday();
    }
    window.dispatchEvent(new CustomEvent('sisterhood-exit-candle'));

    // 2. RESUME background song
    resumeBackgroundSong();
  }

  /**
   * Golden Card Scratch (Pause & Play):
   * Inside the onComplete / 50%+ scratched callback:
   * 1. bg-music.current.pause()
   * 2. golden-song.current.play()
   */
  function revealGoldenCardAndPlaySong() {
    // 1. bg-music.current.pause()
    if (window.__sisterAudio && window.__sisterAudio.bgRef && window.__sisterAudio.bgRef.current) {
      try {
        window.__sisterAudio.bgRef.current.pause();
      } catch (e) {}
    } else if (window.__sisterAudio && typeof window.__sisterAudio.pauseBg === 'function') {
      window.__sisterAudio.pauseBg();
    }
    if (bgAudio) {
      try {
        bgAudio.pause();
      } catch (e) {}
    }
    const reactBg = document.getElementById('react-bg-audio');
    if (reactBg && typeof reactBg.pause === 'function') {
      try {
        reactBg.pause();
      } catch (e) {}
    }
    isMusicPlaying = false;

    // Also ensure birthday audio is paused
    if (birthdayAudio) {
      try {
        birthdayAudio.pause();
      } catch (e) {}
      isBirthdayPlaying = false;
    }

    // 2. golden-song.current.play()
    if (window.__sisterAudio && window.__sisterAudio.goldenRef && window.__sisterAudio.goldenRef.current) {
      try {
        const gAudio = window.__sisterAudio.goldenRef.current;
        gAudio.volume = 1.0;
        gAudio.currentTime = 0;
        gAudio.play().then(() => {
          isGoldenSongPlaying = true;
        }).catch((err) => {
          console.warn('golden-song.current.play() deferred:', err);
        });
      } catch (e) {}
    } else if (window.__sisterAudio && typeof window.__sisterAudio.playGolden === 'function') {
      window.__sisterAudio.playGolden();
    }
    window.dispatchEvent(new CustomEvent('sisterhood-golden-reveal'));

    if (goldenAudio) {
      goldenAudio.volume = 1.0;
      goldenAudio.currentTime = 0;
      const playPromise = goldenAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isGoldenSongPlaying = true;
        }).catch((err) => {
          console.warn('Golden song playback deferred:', err);
          const retryAudio = () => {
            goldenAudio.play();
            window.removeEventListener('pointerup', retryAudio);
            window.removeEventListener('touchend', retryAudio);
            window.removeEventListener('click', retryAudio);
          };
          window.addEventListener('pointerup', retryAudio, { once: true });
          window.addEventListener('touchend', retryAudio, { once: true });
          window.addEventListener('click', retryAudio, { once: true });
        });
      }
    }

    // 3. Fade out giant golden overlay and reveal 3-column layout
    const giantOverlay = document.getElementById('giant-golden-overlay');
    if (giantOverlay) {
      giantOverlay.classList.add('is-revealed');
    }
    const scratchCanvasEl = document.getElementById('scratch-canvas');
    if (scratchCanvasEl) {
      scratchCanvasEl.classList.add('is-revealed');
    }

    // Expand main container and modal max-width to 1200px ONLY after the card is revealed
    const bonusCard = document.querySelector('.secret-bonus-card');
    if (bonusCard) {
      bonusCard.classList.add('is-revealed');
    }
    const sceneBonus = document.getElementById('scene-secret-bonus');
    if (sceneBonus) {
      sceneBonus.classList.add('is-revealed');
    }
  }

  // --------------------------------------------------------------------------
  // 2. SCENE TRANSITION CONTROLLER
  // --------------------------------------------------------------------------
  function navigateTo(targetSceneName) {
    if (!scenes[targetSceneName]) return;

    // Record previous scene for dynamic back navigation
    if (currentScene !== targetSceneName) {
      previousScene = currentScene;
    }

    // Hide all scenes
    Object.keys(scenes).forEach((key) => {
      if (scenes[key]) {
        scenes[key].classList.remove('active');
        scenes[key].setAttribute('aria-hidden', 'true');
      }
    });

    // Activate the targeted scene
    const targetEl = scenes[targetSceneName];
    targetEl.classList.add('active');
    targetEl.setAttribute('aria-hidden', 'false');
    currentScene = targetSceneName;

    // Reset scroll positions immediately across window, body, and target scene
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    if (targetEl) targetEl.scrollTop = 0;
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.scrollTop = 0;

    // Trigger festive confetti explosion when opening any of the four letters, memory gallery, or secret bonus
    const confettiScenes = ['letter1', 'letter2', 'letter3', 'letter4', 'together', 'secretBonus'];
    if (confettiScenes.includes(targetSceneName)) {
      triggerConfettiExplosion();
    } else if (targetSceneName === 'home') {
      spawnHeartShower(6);
      if (window.particleEngine) {
        window.particleEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 28);
      }
    }

    // Track read letters & update Secret Bonus unlock progress
    if (['letter1', 'letter2', 'letter3', 'letter4'].includes(targetSceneName)) {
      markLetterAsRead(targetSceneName);
    }

    // Trigger handwritten ink reveal when opening Letter 4
    if (targetSceneName === 'letter4') {
      startHandwrittenInkReveal();
    } else {
      stopHandwrittenInkReveal();
    }

    // Check if exiting Letter 3 (Candle Cake scene)
    if (previousScene === 'letter3' && targetSceneName !== 'letter3') {
      handleExitCandleScene();
    }

    // Initialize gold foil scratch-off canvas when entering Secret Bonus scene
    if (targetSceneName === 'secretBonus') {
      setTimeout(() => {
        initScratchCard();
      }, 60);
    } else {
      stopVinylMelody();
    }

    // Start or stop the letter reading progress tracker
    startLetterReadingProgress(targetSceneName);
  }

  // --------------------------------------------------------------------------
  // 2.2. LETTER REVEAL READING PROGRESS BAR (Scroll + Time-Spent Hybrid)
  // --------------------------------------------------------------------------
  let readingProgressRaf = null;
  let readingStartTime = 0;
  let activeProgressSceneEl = null;
  const READING_DURATION_MS = 6500; // 6.5s full reading time if content fits without scrolling

  function updateReadingProgress() {
    if (!activeProgressSceneEl) return;

    const track = activeProgressSceneEl.querySelector('.reading-progress-track');
    const fill = activeProgressSceneEl.querySelector('.reading-progress-fill');
    if (!track || !fill) return;

    // 1. Time-based reading progress (0 to 100%)
    const elapsed = performance.now() - readingStartTime;
    const timeRatio = Math.min(1, Math.max(0, elapsed / READING_DURATION_MS));

    // 2. Scroll-based reading progress (0 to 100% if scene overflows)
    let scrollRatio = 0;
    const maxScroll = activeProgressSceneEl.scrollHeight - activeProgressSceneEl.clientHeight;
    if (maxScroll > 8) {
      scrollRatio = Math.min(1, Math.max(0, activeProgressSceneEl.scrollTop / maxScroll));
    }

    // Combine both so scrolling accelerates progress and reading naturally completes it
    const combinedRatio = Math.min(1, Math.max(timeRatio, scrollRatio));
    const percent = Math.round(combinedRatio * 100);

    fill.style.width = `${ (combinedRatio * 100).toFixed(1) }%`;
    track.setAttribute('aria-valuenow', String(percent));

    if (combinedRatio >= 1) {
      fill.classList.add('is-complete');
      readingProgressRaf = null;
      return;
    }

    readingProgressRaf = requestAnimationFrame(updateReadingProgress);
  }

  function startLetterReadingProgress(sceneName) {
    if (readingProgressRaf) {
      cancelAnimationFrame(readingProgressRaf);
      readingProgressRaf = null;
    }

    const letterScenes = ['letter1', 'letter2', 'letter3', 'letter4'];
    if (!letterScenes.includes(sceneName)) {
      activeProgressSceneEl = null;
      return;
    }

    const sceneEl = scenes[sceneName];
    if (!sceneEl) return;

    activeProgressSceneEl = sceneEl;
    readingStartTime = performance.now();

    const track = sceneEl.querySelector('.reading-progress-track');
    const fill = sceneEl.querySelector('.reading-progress-fill');
    if (track && fill) {
      fill.classList.remove('is-complete');
      fill.style.width = '0%';
      track.setAttribute('aria-valuenow', '0');
    }

    readingProgressRaf = requestAnimationFrame(updateReadingProgress);
  }

  // Attach scroll listeners to all reveal scenes so manual scrolling updates immediately
  ['letter1', 'letter2', 'letter3', 'letter4'].forEach((key) => {
    const el = scenes[key];
    if (el) {
      el.addEventListener('scroll', () => {
        if (activeProgressSceneEl === el) {
          updateReadingProgress();
        }
      }, { passive: true });
    }
  });

  /**
   * Triggers a dense, colorful canvas-based confetti explosion across the viewport
   * when opening letters or the memory gallery.
   */
  function confetti() {
    if (window.particleEngine && typeof window.particleEngine.confettiExplosion === 'function') {
      window.particleEngine.confettiExplosion();
    } else {
      spawnHeartShower(12);
    }
  }

  function triggerConfettiExplosion() {
    confetti();
  }

  // --------------------------------------------------------------------------
  // 2.5. LANDING PAGE "NO THANKS" CONTINUOUS PLAYABLE DODGING & TEASING
  // --------------------------------------------------------------------------
  const teaseMessages = [
    "Hey! You can't say no to your big sister! 🙈",
    "I'm older, you have to look! 😜",
    "Don't make me tell Mom! 🤫",
    "Look or I'm borrowing your favorite sweater! 👚",
    "Nice try, kiddo! 🏃‍♀️💨",
    "I spent hours making this for you! 🥺",
    "Oops, Di is way too fast for you! ✨",
    "Saying no is strictly against sister rules! 🤭",
    "Haha keep trying, little sis! 🌸",
    "Just click YES PLEASE, DI! 🎁",
    "Over here now, trouble-maker! 🎈",
    "Big sister hugs are non-negotiable! 💖"
  ];

  let dodgeMessageIndex = 0;
  let isDodgingInProgress = false;
  let lastDodgeX = -1;
  let lastDodgeY = -1;

  function dodgeNoThanksButton(e) {
    if (!btnNoThanks) return;

    if (e) {
      if (e.type === 'touchstart' || e.type === 'pointerdown') {
        e.preventDefault();
        e.stopPropagation();
      } else if (e.type === 'click') {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    if (isDodgingInProgress) return;
    isDodgingInProgress = true;
    setTimeout(() => { isDodgingInProgress = false; }, 180);

    noThanksDodgeCount++;

    // Cycle through playful tease messages with subtle lift animation
    if (landingSubheading) {
      landingSubheading.style.opacity = '0';
      landingSubheading.style.transform = 'translateY(-4px)';
      setTimeout(() => {
        const msg = teaseMessages[dodgeMessageIndex % teaseMessages.length];
        dodgeMessageIndex++;
        landingSubheading.textContent = msg;
        landingSubheading.style.opacity = '1';
        landingSubheading.style.transform = 'translateY(0)';
      }, 110);
    }

    // Capture previous button position for particle burst
    const oldRect = btnNoThanks.getBoundingClientRect();
    const oldCenterX = oldRect.left + oldRect.width / 2;
    const oldCenterY = oldRect.top + oldRect.height / 2;

    if (window.particleEngine) {
      window.particleEngine.burst(oldCenterX, oldCenterY, 14);
    } else {
      spawnHeartShower(2);
    }

    // Exact viewport dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const btnWidth = Math.max(110, oldRect.width || 135);
    const btnHeight = Math.max(40, oldRect.height || 44);

    // Padding from viewport edges (ensures button never clips out of screen)
    const paddingX = Math.max(14, Math.floor(vw * 0.04));
    const paddingY = Math.max(14, Math.floor(vh * 0.035));

    const minX = paddingX;
    const maxX = Math.max(minX + 10, vw - btnWidth - paddingX);
    const minY = Math.max(paddingY + 45, 55); // avoid top nav / audio toggle
    const maxY = Math.max(minY + 20, vh - btnHeight - paddingY);

    // Identify main central content & YES button to guarantee zero overlap
    const centerContent = document.querySelector('#scene-landing .landing-center-content');
    const mascotWrapper = document.querySelector('.mascot-media-wrapper');
    const titleEl = document.querySelector('.landing-playful-title');
    const yesRect = btnYesPlease ? btnYesPlease.getBoundingClientRect() : null;
    const centerRect = centerContent ? centerContent.getBoundingClientRect() : null;
    const mascotRect = mascotWrapper ? mascotWrapper.getBoundingClientRect() : null;
    const titleRect = titleEl ? titleEl.getBoundingClientRect() : null;

    // Build exclusion obstacle rectangles with safety buffers
    const obstacles = [];
    if (centerRect) {
      obstacles.push({
        left: centerRect.left - 10,
        right: centerRect.right + 10,
        top: centerRect.top - 6,
        bottom: centerRect.bottom + 6
      });
    }
    if (mascotRect) {
      obstacles.push({
        left: mascotRect.left - 12,
        right: mascotRect.right + 12,
        top: mascotRect.top - 10,
        bottom: mascotRect.bottom + 10
      });
    }
    if (titleRect) {
      obstacles.push({
        left: titleRect.left - 12,
        right: titleRect.right + 12,
        top: titleRect.top - 8,
        bottom: titleRect.bottom + 8
      });
    }
    if (yesRect) {
      obstacles.push({
        left: yesRect.left - 16,
        right: yesRect.right + 16,
        top: yesRect.top - 16,
        bottom: yesRect.bottom + 16
      });
    }

    function isOverlapping(x, y, w, h) {
      const box = { left: x, right: x + w, top: y, bottom: y + h };
      for (const obs of obstacles) {
        if (
          box.left < obs.right &&
          box.right > obs.left &&
          box.top < obs.bottom &&
          box.bottom > obs.top
        ) {
          return true;
        }
      }
      return false;
    }

    // Build distinct safe zone anchor points (corners & perimeter areas)
    const anchorPoints = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: minX, y: maxY },
      { x: maxX, y: maxY },
      { x: Math.floor((minX + maxX) / 2), y: minY },
      { x: Math.floor((minX + maxX) / 2), y: maxY },
      { x: minX, y: Math.floor((minY + maxY) * 0.35) },
      { x: maxX, y: Math.floor((minY + maxY) * 0.35) },
      { x: minX, y: Math.floor((minY + maxY) * 0.65) },
      { x: maxX, y: Math.floor((minY + maxY) * 0.65) }
    ];

    let chosenX = minX;
    let chosenY = maxY;
    let found = false;

    // 1. Try randomized candidate points across safe zones
    for (let attempt = 0; attempt < 35; attempt++) {
      const randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      const distFromLast = Math.hypot(randX - (lastDodgeX > 0 ? lastDodgeX : oldRect.left), randY - (lastDodgeY > 0 ? lastDodgeY : oldRect.top));
      if (distFromLast < 75) continue;

      if (!isOverlapping(randX, randY, btnWidth, btnHeight)) {
        chosenX = randX;
        chosenY = randY;
        found = true;
        break;
      }
    }

    // 2. If random search was constrained, choose the best distinct anchor
    if (!found) {
      let maxDist = -1;
      for (const pt of anchorPoints) {
        const clampedX = Math.max(minX, Math.min(maxX, pt.x));
        const clampedY = Math.max(minY, Math.min(maxY, pt.y));
        const dist = Math.hypot(clampedX - (lastDodgeX > 0 ? lastDodgeX : oldRect.left), clampedY - (lastDodgeY > 0 ? lastDodgeY : oldRect.top));
        
        if (!isOverlapping(clampedX, clampedY, btnWidth, btnHeight)) {
          chosenX = clampedX;
          chosenY = clampedY;
          found = true;
          break;
        } else if (dist > maxDist) {
          maxDist = dist;
          chosenX = clampedX;
          chosenY = clampedY;
        }
      }
    }

    lastDodgeX = chosenX;
    lastDodgeY = chosenY;

    // Apply absolute fixed coordinates
    btnNoThanks.classList.add('is-dodging');
    btnNoThanks.style.left = `${chosenX}px`;
    btnNoThanks.style.top = `${chosenY}px`;

    // Trigger playful CSS wobble jump animation
    btnNoThanks.classList.remove('wobble-jump');
    void btnNoThanks.offsetWidth; // force style reflow for instant retrigger
    btnNoThanks.classList.add('wobble-jump');

    // Softly pulse the "YES PLEASE" button
    if (btnYesPlease && !btnYesPlease.classList.contains('highlight-pulse')) {
      btnYesPlease.classList.add('highlight-pulse');
    }
  }

  if (btnNoThanks) {
    // Desktop hover dodge
    btnNoThanks.addEventListener('mouseenter', dodgeNoThanksButton);
    // Mobile pointer and touch dodges (handles all mobile browser touch interfaces)
    btnNoThanks.addEventListener('touchstart', dodgeNoThanksButton, { passive: false });
    btnNoThanks.addEventListener('touchend', (e) => { e.preventDefault(); }, { passive: false });
    btnNoThanks.addEventListener('pointerdown', dodgeNoThanksButton);
    btnNoThanks.addEventListener('click', dodgeNoThanksButton);
  }

  // Initial entry button ('YES PLEASE, DI!') plays the background song on infinite loop at 40% volume
  if (btnYesPlease) {
    btnYesPlease.addEventListener('click', () => {
      startBackgroundSong();
    });
  }

  // Song Nav Link Handler
  if (navSongBtn && musicToggle) {
    navSongBtn.addEventListener('click', (e) => {
      e.preventDefault();
      musicToggle.click();
    });
  }

  // --------------------------------------------------------------------------
  // 3. ENVELOPE OPENING INTERACTION (Scene 1)
  // --------------------------------------------------------------------------
  function openEnvelopeAndProceed() {
    if (isEnvelopeOpening) return;
    isEnvelopeOpening = true;

    if (introEnvelope) {
      introEnvelope.classList.add('is-opening');
    }

    // Trigger subtle celebratory floating hearts
    spawnHeartShower(5);

    // Wait for flap animation, then transition to Home scene
    setTimeout(() => {
      navigateTo('home');
      isEnvelopeOpening = false;
    }, 1100);
  }

  if (introEnvelope) {
    introEnvelope.addEventListener('click', openEnvelopeAndProceed);
    introEnvelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelopeAndProceed();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. GENERAL NAVIGATION BUTTONS & LINKS
  // --------------------------------------------------------------------------
  document.querySelectorAll('[data-nav-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-nav-target');
      if (target === 'back') {
        // Return intelligently based on current context
        if (currentScene.startsWith('letter') || currentScene === 'together') {
          navigateTo('lettersGrid');
        } else if (currentScene === 'lettersGrid') {
          navigateTo('home');
        } else if (currentScene === 'home') {
          navigateTo('intro');
        } else {
          navigateTo('landing');
        }
      } else {
        navigateTo(target);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. VIRTUAL CAKE CANDLE INTERACTION (Letter 3)
  // --------------------------------------------------------------------------
  function toggleCandleFlame() {
    if (!candleFlame) return;
    isCandleLit = !isCandleLit;

    if (isCandleLit) {
      candleFlame.classList.remove('blown-out');
      if (blowCandleBtn) blowCandleBtn.textContent = '💨 Blow Candle & Make a Wish';
      // When relighting, pause birthday melody and resume background song
      handleExitCandleScene();
    } else {
      candleFlame.classList.add('blown-out');
      if (blowCandleBtn) blowCandleBtn.textContent = '🕯️ Relight Candle';
      spawnHeartShower(16);
      triggerBirthdayMelodyOnCandleBlow();
    }
  }

  if (blowCandleBtn) {
    blowCandleBtn.addEventListener('click', toggleCandleFlame);
  }

  const cakeVisual = document.querySelector('.cake-visual-wrap');
  if (cakeVisual) {
    cakeVisual.addEventListener('click', toggleCandleFlame);
  }

  // --------------------------------------------------------------------------
  // 6. AMBIENT BACKGROUND MUSIC & SOUND CONTROLLER
  // --------------------------------------------------------------------------
  const mascotVideo = document.getElementById('mascot-video');
  if (mascotVideo) {
    // Keep mascot video unobtrusive
    mascotVideo.muted = true;
  }

  // --------------------------------------------------------------------------
  // 7. AMBIENT & INTERACTIVE PARTICLE DISPERSION ENGINE (Hearts, Petals & Sparkles)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  let ctx = null;
  let particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouseX = width / 2;
  let mouseY = height / 2;
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  let mouseSpeed = 0;
  let isMouseMoving = false;
  let mouseMoveTimeout = null;

  if (canvas) {
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Palette
    const petalColors = [
      'rgba(235, 120, 130, ', // blush rose
      'rgba(245, 160, 165, ', // sakura pink
      'rgba(215, 90, 100, ',  // deep rose
      'rgba(255, 195, 190, ', // peach blossom
      'rgba(240, 210, 160, ', // soft gold
    ];

    const heartColors = [
      'rgba(200, 70, 80, ',   // primary rose red
      'rgba(160, 35, 50, ',   // deep wine maroon
      'rgba(240, 120, 150, ', // bright candy rose
      'rgba(212, 175, 55, ',  // royal gold
      'rgba(230, 95, 110, ',  // crimson pink
    ];

    const sparkleColors = [
      'rgba(255, 225, 130, ', // gold glow
      'rgba(255, 255, 255, ', // starlight white
      'rgba(255, 180, 190, ', // soft pink glow
    ];

    const confettiPalette = [
      'rgba(212, 175, 55, ',  // celebration gold
      'rgba(255, 215, 0, ',   // brilliant sunshine gold
      'rgba(200, 90, 83, ',   // romantic rose
      'rgba(255, 105, 135, ', // vibrant strawberry pink
      'rgba(244, 168, 176, ', // pastel blush
      'rgba(158, 45, 58, ',   // velvet crimson
      'rgba(255, 142, 110, ', // festive coral tangerine
      'rgba(186, 140, 235, ', // dreamy lavenderorchid
      'rgba(110, 210, 185, ', // celebration mint aqua
      'rgba(125, 185, 245, ', // pastel sky blue
      'rgba(255, 230, 128, ', // warm lemon chiffon
      'rgba(255, 245, 247, ', // pearl ivory
    ];

    class Particle {
      constructor(options = {}) {
        this.type = options.type || (Math.random() < 0.45 ? 'petal' : Math.random() < 0.8 ? 'heart' : 'sparkle');
        this.x = options.x !== undefined ? options.x : Math.random() * width;
        this.y = options.y !== undefined ? options.y : Math.random() * height;
        
        // Size & life
        this.baseSize = options.size || (this.type === 'petal' ? Math.random() * 8 + 7 : this.type === 'heart' ? Math.random() * 7 + 6 : Math.random() * 5 + 4);
        this.size = this.baseSize;
        this.maxLife = options.maxLife || (options.isBurst ? Math.random() * 60 + 50 : Math.random() * 200 + 160);
        this.life = this.maxLife;
        this.alpha = 0;
        this.targetAlpha = options.alpha || (Math.random() * 0.45 + 0.45);
        this.isAmbient = options.isAmbient || false;

        // Velocity & Physics
        if (options.isConfetti) {
          const angle = options.angle !== undefined ? options.angle : -Math.PI / 2 + (Math.random() - 0.5) * 1.55;
          const speed = options.speed !== undefined ? options.speed : Math.random() * 11 + 4.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.gravity = options.gravity !== undefined ? options.gravity : 0.13;
          this.drag = options.drag !== undefined ? options.drag : 0.962;
          const shapeRoll = Math.random();
          this.confettiShape = options.confettiShape || (shapeRoll < 0.48 ? 'ribbon' : shapeRoll < 0.78 ? 'circle' : 'diamond');
          this.aspect = Math.random() * 0.65 + 0.28;
        } else if (options.isBurst) {
          const angle = options.angle !== undefined ? options.angle : Math.random() * Math.PI * 2;
          const speed = options.speed !== undefined ? options.speed : Math.random() * 4.5 + 1.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.gravity = 0.04;
          this.drag = 0.96;
        } else if (options.isTrail) {
          this.vx = (Math.random() - 0.5) * 2.2 + (options.driftX || 0) * 0.3;
          this.vy = (Math.random() - 0.5) * 2.2 - 0.8;
          this.gravity = 0.02;
          this.drag = 0.97;
        } else {
          // Ambient gentle downward/diagonal drift
          this.vx = Math.random() * 0.8 - 0.2;
          this.vy = Math.random() * 0.7 + 0.35;
          this.gravity = 0;
          this.drag = 1;
        }

        // Oscillations & Rotations
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = options.isConfetti ? (Math.random() - 0.5) * 0.14 : (Math.random() - 0.5) * 0.05;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = options.isConfetti ? Math.random() * 0.12 + 0.05 : Math.random() * 0.04 + 0.02;
        this.swaySeed = Math.random() * 100;
        this.swaySpeed = Math.random() * 0.02 + 0.01;

        // Color selection
        if (this.type === 'confetti') {
          this.colorPrefix = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
        } else if (this.type === 'petal') {
          this.colorPrefix = petalColors[Math.floor(Math.random() * petalColors.length)];
        } else if (this.type === 'heart') {
          this.colorPrefix = heartColors[Math.floor(Math.random() * heartColors.length)];
        } else {
          this.colorPrefix = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        }
      }

      update() {
        this.life--;
        
        // Smooth fade-in and fade-out
        const progress = 1 - (this.life / this.maxLife);
        if (progress < 0.15) {
          this.alpha = (progress / 0.15) * this.targetAlpha;
        } else if (progress > 0.7) {
          this.alpha = ((1 - progress) / 0.3) * this.targetAlpha;
        } else {
          this.alpha = this.targetAlpha;
        }

        // Physics update
        if (this.drag !== 1) {
          this.vx *= this.drag;
          this.vy *= this.drag;
        }
        this.vy += this.gravity;

        // Sway motion for ambient & falling petals
        const sway = Math.sin(this.swaySeed + Date.now() * 0.002 * this.swaySpeed) * 0.6;
        this.x += this.vx + (this.type === 'petal' ? sway : sway * 0.3);
        this.y += this.vy;

        this.rotation += this.rotSpeed;
        this.flip += this.flipSpeed;

        // Ambient wraparound
        if (this.isAmbient) {
          if (this.y > height + 20) {
            this.y = -20;
            this.x = Math.random() * width;
          }
          if (this.x > width + 20) this.x = -20;
          if (this.x < -20) this.x = width + 20;
        }
      }

      draw(c) {
        if (this.alpha <= 0.01) return;
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        const currentAlpha = Math.max(0, Math.min(1, this.alpha));
        const color = `${this.colorPrefix}${currentAlpha})`;

        if (this.type === 'confetti') {
          const scaleY = Math.cos(this.flip);
          c.scale(1, Math.max(0.15, Math.abs(scaleY)));
          c.fillStyle = color;
          if (this.confettiShape === 'circle') {
            c.beginPath();
            c.arc(0, 0, this.size * 0.55, 0, Math.PI * 2);
            c.fill();
          } else if (this.confettiShape === 'diamond') {
            const d = this.size * 0.75;
            c.beginPath();
            c.moveTo(0, -d);
            c.lineTo(d * 0.7, 0);
            c.lineTo(0, d);
            c.lineTo(-d * 0.7, 0);
            c.closePath();
            c.fill();
          } else {
            const w = this.size * 1.25;
            const h = this.size * this.aspect;
            c.fillRect(-w / 2, -h / 2, w, h);
          }
        } else if (this.type === 'petal') {
          // Organic curved flower petal with 3D flip
          const scaleY = Math.abs(Math.sin(this.flip));
          c.scale(1, Math.max(0.2, scaleY));
          
          c.beginPath();
          c.moveTo(0, -this.size * 1.2);
          c.bezierCurveTo(this.size * 0.8, -this.size * 0.8, this.size * 0.9, this.size * 0.5, 0, this.size);
          c.bezierCurveTo(-this.size * 0.9, this.size * 0.5, -this.size * 0.8, -this.size * 0.8, 0, -this.size * 1.2);
          c.fillStyle = color;
          c.fill();
        } else if (this.type === 'heart') {
          // Classic smooth romantic heart
          const s = this.size * 0.75;
          c.scale(s, s);
          c.beginPath();
          c.moveTo(0, 0.4);
          c.bezierCurveTo(-0.6, -0.4, -1.2, 0.2, 0, 1.4);
          c.bezierCurveTo(1.2, 0.2, 0.6, -0.4, 0, 0.4);
          c.fillStyle = color;
          c.shadowColor = 'rgba(212, 175, 55, 0.3)';
          c.shadowBlur = 4;
          c.fill();
        } else {
          // Luminous 4-point star sparkle
          const s = this.size;
          c.beginPath();
          c.moveTo(0, -s);
          c.quadraticCurveTo(0, 0, s, 0);
          c.quadraticCurveTo(0, 0, 0, s);
          c.quadraticCurveTo(0, 0, -s, 0);
          c.quadraticCurveTo(0, 0, 0, -s);
          c.fillStyle = color;
          c.shadowColor = 'rgba(255, 235, 160, 0.8)';
          c.shadowBlur = 6;
          c.fill();
        }

        c.restore();
      }

      isDead() {
        if (this.isAmbient) return false;
        return this.life <= 0 || this.y > height + 50 || this.x < -50 || this.x > width + 50;
      }
    }

    // ------------------------------------------------------------------------
    // Heart-Shaped Floating Birthday Balloons (Landing Page Festive Atmosphere)
    // ------------------------------------------------------------------------
    const balloonColors = [
      {
        base: '#C85A53',
        highlight: '#FFA49E',
        shadow: '#8C2B24',
        knot: '#A63830',
        string: 'rgba(160, 110, 100, '
      },
      {
        base: '#E88C86',
        highlight: '#FFE0DD',
        shadow: '#B55A54',
        knot: '#C4645E',
        string: 'rgba(180, 130, 120, '
      },
      {
        base: '#D4AF37',
        highlight: '#FFF4BF',
        shadow: '#947517',
        knot: '#A88622',
        string: 'rgba(160, 135, 70, '
      },
      {
        base: '#F4A8B0',
        highlight: '#FFF0F2',
        shadow: '#C97780',
        knot: '#D4818B',
        string: 'rgba(190, 140, 145, '
      },
      {
        base: '#9E2D3A',
        highlight: '#E87D8A',
        shadow: '#66161F',
        knot: '#7A1C26',
        string: 'rgba(140, 90, 95, '
      },
      {
        base: '#F28A7A',
        highlight: '#FFE1DC',
        shadow: '#BF5545',
        knot: '#CC6050',
        string: 'rgba(180, 120, 110, '
      }
    ];

    let balloonSceneAlpha = 1.0;
    const balloons = [];

    class HeartBalloon {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        const isMobile = width < 600;
        // Dainty, refined balloon radius
        const minR = isMobile ? 12 : 14;
        const maxR = isMobile ? 18 : 22;
        this.r = Math.random() * (maxR - minR) + minR;

        // Position biased toward edges (5%-36% and 64%-95%) so center mascot and text remain clean
        const side = Math.random();
        if (side < 0.46) {
          this.x = Math.random() * (width * 0.31) + width * 0.05;
        } else if (side < 0.92) {
          this.x = Math.random() * (width * 0.31) + width * 0.64;
        } else {
          this.x = Math.random() * (width * 0.3) + width * 0.35;
        }

        if (isInitial) {
          // Stagger cleanly across height
          this.y = Math.random() * (height + 300) - 100;
        } else {
          // Spawn beneath bottom edge with generous stagger
          this.y = height + this.r * 3 + Math.random() * 260 + 40;
        }

        // Soft, peaceful upward float speed
        this.vy = -(Math.random() * 0.22 + 0.36);
        this.swaySeed = Math.random() * 100;
        this.swayFreq = Math.random() * 0.001 + 0.0007;
        this.swayAmp = Math.random() * 0.4 + 0.25;
        this.stringSeed = Math.random() * 50;
        this.color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        this.rotation = 0;
        // Soft, airy pastel opacity (never heavy or opaque)
        this.opacity = Math.random() * 0.2 + 0.45;
        this.popped = false;
      }

      update() {
        if (this.popped) return;

        // Upward floating translation
        this.y += this.vy;

        // Gentle horizontal sway
        const now = Date.now();
        const sway = Math.sin(this.swaySeed + now * this.swayFreq) * this.swayAmp;
        this.x += sway;

        // Subtle tilt tracking movement
        this.rotation = (sway / (this.swayAmp || 1)) * 0.11;

        // Recycle to bottom when ascending off the top of screen
        const totalHeight = this.r * 4.0;
        if (this.y < -totalHeight) {
          if (currentScene === 'landing') {
            this.reset(false);
          } else {
            this.y = height + 100;
          }
        }
      }

      draw(c) {
        const effectiveAlpha = this.opacity * balloonSceneAlpha;
        if (effectiveAlpha <= 0.01 || this.popped) return;

        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        const r = this.r;
        const color = this.color;

        // 1. Swaying Trailing Ribbon String (rendered behind balloon)
        const stringLen = r * 2.4;
        const time = Date.now() * 0.0022;
        const w1 = Math.sin(this.stringSeed + time) * (r * 0.3);
        const w2 = Math.cos(this.stringSeed + time * 0.8) * (r * 0.4);
        const w3 = Math.sin(this.stringSeed + time * 1.3) * (r * 0.2);

        c.beginPath();
        c.moveTo(0, r * 1.05);
        c.bezierCurveTo(
          w1, r * 1.5,
          w2, r * 2.0,
          w3, r * 1.05 + stringLen
        );
        c.strokeStyle = `${color.string}${0.3 * effectiveAlpha})`;
        c.lineWidth = 1;
        c.lineCap = 'round';
        c.stroke();

        // 2. Heart Balloon Body (plump, rounded lobes)
        c.beginPath();
        c.moveTo(0, r * 0.92);
        // Left flank to left lobe peak
        c.bezierCurveTo(-r * 1.25, r * 0.25, -r * 1.25, -r * 0.72, -r * 0.58, -r * 0.88);
        // Left lobe dipping to center cleft
        c.bezierCurveTo(-r * 0.26, -r * 0.98, 0, -r * 0.65, 0, -r * 0.45);
        // Center cleft rising to right lobe peak
        c.bezierCurveTo(0, -r * 0.65, r * 0.26, -r * 0.98, r * 0.58, -r * 0.88);
        // Right lobe to bottom tip
        c.bezierCurveTo(r * 1.25, -r * 0.72, r * 1.25, r * 0.25, 0, r * 0.92);
        c.closePath();

        // 3D Balloon Volume Radial Gradient
        const grad = c.createRadialGradient(
          -r * 0.32, -r * 0.38, r * 0.08,
          0, 0, r * 1.25
        );
        grad.addColorStop(0, color.highlight);
        grad.addColorStop(0.55, color.base);
        grad.addColorStop(1, color.shadow);

        c.globalAlpha = effectiveAlpha;
        c.fillStyle = grad;
        c.shadowColor = 'rgba(92, 29, 36, 0.08)';
        c.shadowBlur = 5;
        c.shadowOffsetY = 2;
        c.fill();

        // Reset shadow for glossy highlights
        c.shadowColor = 'transparent';
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;

        // 3. Specular Gloss Reflection (curved highlight on top-left lobe)
        c.save();
        c.beginPath();
        c.ellipse(-r * 0.42, -r * 0.52, r * 0.2, r * 0.09, -Math.PI / 4.2, 0, Math.PI * 2);
        c.fillStyle = `rgba(255, 255, 255, ${0.52 * effectiveAlpha})`;
        c.fill();

        // Secondary soft reflection on right lobe
        c.beginPath();
        c.ellipse(r * 0.42, -r * 0.48, r * 0.12, r * 0.06, Math.PI / 4.5, 0, Math.PI * 2);
        c.fillStyle = `rgba(255, 255, 255, ${0.22 * effectiveAlpha})`;
        c.fill();
        c.restore();

        // 4. Tied Balloon Knot at Bottom Tip
        c.beginPath();
        c.moveTo(0, r * 0.88);
        c.lineTo(-r * 0.14, r * 1.08);
        c.lineTo(r * 0.14, r * 1.08);
        c.closePath();
        c.fillStyle = color.knot;
        c.fill();

        c.restore();
      }

      checkClick(cx, cy) {
        if (this.popped || balloonSceneAlpha < 0.25) return false;
        const dist = Math.hypot(cx - this.x, cy - this.y);
        if (dist <= this.r * 1.25) {
          this.pop();
          return true;
        }
        return false;
      }

      pop() {
        this.popped = true;
        if (window.particleEngine) {
          window.particleEngine.burst(this.x, this.y, 22, 'heart');
        }
        setTimeout(() => {
          this.popped = false;
          this.reset(false);
        }, 1400);
      }
    }

    // Initialize floating heart balloons (6 on desktop, 4 on mobile for a clean, spacious look)
    const BALLOON_COUNT = width < 600 ? 4 : 6;
    for (let i = 0; i < BALLOON_COUNT; i++) {
      balloons.push(new HeartBalloon(true));
    }

    // Initialize ambient background floating petals and hearts
    const AMBIENT_COUNT = 24;
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      particles.push(new Particle({ isAmbient: true }));
    }

    // Public particle engine API for bursts and hover trails
    window.particleEngine = {
      burst(x, y, count = 16, type = null) {
        if (particles.length > 180) return;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
          const speed = Math.random() * 3.8 + 1.8;
          particles.push(new Particle({
            x,
            y,
            type: type || (Math.random() < 0.5 ? 'petal' : Math.random() < 0.85 ? 'heart' : 'sparkle'),
            isBurst: true,
            angle,
            speed,
            alpha: 0.95,
            size: Math.random() * 6 + 7,
            maxLife: Math.random() * 45 + 40
          }));
        }
      },
      spawnTrail(x, y, vx, vy) {
        if (particles.length > 160) return;
        particles.push(new Particle({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          isTrail: true,
          driftX: vx,
          alpha: 0.85,
          size: Math.random() * 4 + 4,
          maxLife: Math.random() * 30 + 25
        }));
      },
      confettiExplosion() {
        const origins = [
          { x: width * 0.12, y: height * 0.65, baseAngle: -Math.PI * 0.34 },
          { x: width * 0.32, y: height * 0.54, baseAngle: -Math.PI * 0.44 },
          { x: width * 0.50, y: height * 0.45, baseAngle: -Math.PI * 0.50 },
          { x: width * 0.68, y: height * 0.54, baseAngle: -Math.PI * 0.56 },
          { x: width * 0.88, y: height * 0.65, baseAngle: -Math.PI * 0.66 }
        ];

        const countPerOrigin = width < 600 ? 36 : 54;

        origins.forEach((origin) => {
          for (let i = 0; i < countPerOrigin; i++) {
            const spread = (Math.random() - 0.5) * 1.65;
            const angle = origin.baseAngle + spread;
            const speed = Math.random() * 12.5 + 3.8;
            const randType = Math.random();
            const pType = randType < 0.72 ? 'confetti' : randType < 0.88 ? 'heart' : randType < 0.95 ? 'sparkle' : 'petal';

            // Distinct size tiers: micro-sparkles/dots, medium confetti, and large jumbo streamers
            const sizeTier = Math.random();
            let particleSize;
            if (sizeTier < 0.32) {
              // Petite micro-confetti (3px - 6px)
              particleSize = Math.random() * 3 + 3;
            } else if (sizeTier < 0.76) {
              // Standard festive confetti (6.5px - 11.5px)
              particleSize = Math.random() * 5 + 6.5;
            } else {
              // Large statement streamers & hearts (12px - 18.5px)
              particleSize = Math.random() * 6.5 + 12;
            }

            particles.push(new Particle({
              x: origin.x + (Math.random() - 0.5) * 36,
              y: origin.y + (Math.random() - 0.5) * 36,
              type: pType,
              isConfetti: true,
              angle,
              speed,
              gravity: sizeTier < 0.32 ? 0.09 : sizeTier < 0.76 ? 0.13 : 0.16,
              drag: sizeTier < 0.32 ? 0.955 : 0.964,
              alpha: 0.98,
              size: particleSize,
              maxLife: Math.random() * 80 + 75
            }));
          }
        });
      },
      confetti() {
        this.confettiExplosion();
      }
    };

    // Main 60FPS animation loop
    function animate() {
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        // Smoothly fade balloons in when on landing page, fade out on letters
        const targetBalloonAlpha = (currentScene === 'landing') ? 1.0 : 0.0;
        balloonSceneAlpha += (targetBalloonAlpha - balloonSceneAlpha) * 0.04;

        // Draw and update heart-shaped balloons
        if (balloonSceneAlpha > 0.01) {
          for (let i = 0; i < balloons.length; i++) {
            balloons[i].update();
            balloons[i].draw(ctx);
          }
        }

        // Draw and update ambient petals and particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update();
          p.draw(ctx);

          if (p.isDead()) {
            particles.splice(i, 1);
          }
        }
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Mouse & Touch Tracking for Interactive Flowing Trails
    function handlePointerMove(x, y) {
      const dx = x - lastMouseX;
      const dy = y - lastMouseY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      mouseX = x;
      mouseY = y;
      lastMouseX = x;
      lastMouseY = y;

      if (mouseSpeed > 3 && window.particleEngine) {
        window.particleEngine.spawnTrail(x, y, dx * 0.1, dy * 0.1);
      }
    }

    window.addEventListener('mousemove', (e) => {
      handlePointerMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Global Click / Tap Burst Dispersion & Heart Balloon Pop
    window.addEventListener('click', (e) => {
      let hitBalloon = false;
      if (currentScene === 'landing') {
        for (let i = balloons.length - 1; i >= 0; i--) {
          if (balloons[i].checkClick(e.clientX, e.clientY)) {
            hitBalloon = true;
            break;
          }
        }
      }

      if (!hitBalloon && window.particleEngine) {
        window.particleEngine.burst(e.clientX, e.clientY, 18);
      }
    });

    // Attach Hover Dispersion Effect to all interactive elements
    function attachHoverParticles() {
      const hoverTargets = document.querySelectorAll(
        '.btn-pill-choice, .btn-primary, .btn-secondary, .btn-back, .letter-card, .envelope-wrapper, .polaroid-card, .wax-seal, .cake-visual-wrap, .mascot-media-wrapper'
      );

      hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', (e) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          if (window.particleEngine) {
            window.particleEngine.burst(centerX, centerY, 12);
          }
        });
      });
    }

    attachHoverParticles();
  }

  // --------------------------------------------------------------------------
  // 8. FLOATING HEART CELEBRATION FALLBACK
  // --------------------------------------------------------------------------
  function spawnHeartShower(count = 5) {
    const symbols = ['♥', '💖', '✨', '🌸', '💌'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = `${Math.random() * 80 + 10}vw`;
        heart.style.top = `${Math.random() * 40 + 50}vh`;
        heart.style.fontSize = `${Math.random() * 1.2 + 0.9}rem`;
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 3000);
      }, i * 150);
    }
  }

  // --------------------------------------------------------------------------
  // 9. READ LETTERS TRACKER & SECRET BONUS SURPRISE UNLOCK
  // --------------------------------------------------------------------------
  const btnSecretBonus = document.getElementById('btn-secret-bonus');
  const secretBonusIcon = document.getElementById('secret-bonus-icon');
  const secretBonusText = document.getElementById('secret-bonus-text');

  function markLetterAsRead(letterKey) {
    readLetters.add(letterKey);

    const cardEl = document.querySelector(`.letter-card[data-letter-key="${letterKey}"]`);
    if (cardEl) {
      cardEl.classList.add('is-read');
    }

    updateSecretBonusButtonUI();
  }

  function updateSecretBonusButtonUI() {
    if (!btnSecretBonus || !secretBonusIcon || !secretBonusText) return;
    const count = readLetters.size;

    if (count >= 4) {
      btnSecretBonus.classList.remove('is-locked');
      btnSecretBonus.classList.add('is-unlocked');
      secretBonusIcon.textContent = '🎁';
      secretBonusText.textContent = 'Secret Birthday Surprise Unlocked! Tap to Open ✨';
    } else {
      secretBonusIcon.textContent = '🔒';
      secretBonusText.textContent = `Read all 4 letters to unlock Secret Surprise (${count}/4)`;
    }
  }

  if (btnSecretBonus) {
    btnSecretBonus.addEventListener('click', () => {
      if (readLetters.size >= 4) {
        navigateTo('secretBonus');
      } else {
        // Find the first unread letter to guide the user, or allow direct preview on double tap
        const allKeys = ['letter1', 'letter2', 'letter3', 'letter4'];
        const unread = allKeys.find((k) => !readLetters.has(k));
        if (unread) {
          const unreadCard = document.querySelector(`.letter-card[data-letter-key="${unread}"]`);
          if (unreadCard) {
            unreadCard.style.transform = 'translateY(-8px) scale(1.04)';
            setTimeout(() => {
              unreadCard.style.transform = '';
            }, 380);
          }
          const remaining = 4 - readLetters.size;
          if (secretBonusText) {
            secretBonusText.textContent = `✨ Almost there! Open ${remaining} more letter${remaining > 1 ? 's' : ''} first (${readLetters.size}/4)`;
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. HANDWRITTEN INK REVEAL EFFECT (Letter 4: "My Heartfelt Promise")
  // --------------------------------------------------------------------------
  const inkP1 = document.getElementById('ink-p1');
  const inkP2 = document.getElementById('ink-p2');
  const inkSig = document.getElementById('ink-signature');
  const btnInkSkip = document.getElementById('btn-ink-skip');
  let inkRevealTimeouts = [];
  let isInkRevealing = false;

  function clearInkTimeouts() {
    inkRevealTimeouts.forEach((t) => clearTimeout(t));
    inkRevealTimeouts = [];
  }

  function stopHandwrittenInkReveal() {
    clearInkTimeouts();
    isInkRevealing = false;
  }

  function revealFullLetterInstantly() {
    clearInkTimeouts();
    isInkRevealing = false;

    if (inkP1) {
      inkP1.classList.remove('is-writing');
      inkP1.textContent = inkP1.getAttribute('data-full-text') || '';
    }
    if (inkP2) {
      inkP2.classList.remove('is-writing');
      inkP2.textContent = inkP2.getAttribute('data-full-text') || '';
    }
    if (inkSig) {
      inkSig.classList.add('is-visible');
    }
    if (btnInkSkip) {
      btnInkSkip.textContent = '↻ Replay Ink Writing';
    }
  }

  function startHandwrittenInkReveal() {
    if (!inkP1 || !inkP2 || !inkSig) return;
    clearInkTimeouts();
    isInkRevealing = true;

    const text1 = inkP1.getAttribute('data-full-text') || '';
    const text2 = inkP2.getAttribute('data-full-text') || '';

    inkP1.textContent = '';
    inkP2.textContent = '';
    inkP1.classList.add('is-writing');
    inkP2.classList.remove('is-writing');
    inkSig.classList.remove('is-visible');

    if (btnInkSkip) {
      btnInkSkip.textContent = '✒️ Instant Reveal';
    }

    let delay = 220;
    const charSpeed = 24;

    // Write Paragraph 1
    for (let i = 1; i <= text1.length; i++) {
      const t = setTimeout(() => {
        inkP1.textContent = text1.slice(0, i);
      }, delay);
      inkRevealTimeouts.push(t);
      delay += charSpeed;
    }

    // Switch quill to Paragraph 2
    const switchT = setTimeout(() => {
      inkP1.classList.remove('is-writing');
      inkP2.classList.add('is-writing');
    }, delay);
    inkRevealTimeouts.push(switchT);
    delay += 260;

    // Write Paragraph 2
    for (let j = 1; j <= text2.length; j++) {
      const t = setTimeout(() => {
        inkP2.textContent = text2.slice(0, j);
      }, delay);
      inkRevealTimeouts.push(t);
      delay += charSpeed;
    }

    // Complete & fade in signature
    const finishT = setTimeout(() => {
      inkP2.classList.remove('is-writing');
      inkSig.classList.add('is-visible');
      isInkRevealing = false;
      if (btnInkSkip) {
        btnInkSkip.textContent = '↻ Replay Ink Writing';
      }
    }, delay + 180);
    inkRevealTimeouts.push(finishT);
  }

  if (btnInkSkip) {
    btnInkSkip.addEventListener('click', () => {
      if (isInkRevealing) {
        revealFullLetterInstantly();
      } else {
        startHandwrittenInkReveal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. "TOGETHER" MEMORIES POLAROID FLIP CONTROLLER
  // --------------------------------------------------------------------------
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  polaroidCards.forEach((card) => {
    function toggleCardFlip(e) {
      card.classList.toggle('is-flipped');
      const isFlipped = card.classList.contains('is-flipped');
      card.setAttribute('aria-expanded', isFlipped ? 'true' : 'false');

      // Spawn playful celebration burst particles around the flipped polaroid
      const rect = card.getBoundingClientRect();
      const clickX = e.clientX || (rect.left + rect.width / 2);
      const clickY = e.clientY || (rect.top + rect.height / 2);
      if (typeof spawnBurstParticles === 'function') {
        spawnBurstParticles(clickX, clickY, 8);
      }
    }

    card.addEventListener('click', toggleCardFlip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardFlip(e);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 12. VINTAGE VINYL VOICE NOTE & BIRTHDAY MUSIC-BOX SYNTHESIZER
  // --------------------------------------------------------------------------
  const voiceNoteAudio = document.getElementById('voice-note-audio');
  const vinylDisc = document.getElementById('vinyl-disc');
  const vinylTonearm = document.getElementById('vinyl-tonearm');
  const vinylWaveform = document.getElementById('vinyl-waveform');
  const vinylTrackStatus = document.getElementById('vinyl-track-status');
  const vinylPlayLabel = document.getElementById('vinyl-play-label');
  const btnVinylPlay = document.getElementById('btn-vinyl-play');

  let audioCtx = null;
  let isVinylPlaying = false;
  let melodyTimeouts = [];

  // Warm music-box notes for "Happy Birthday to You" (Frequency in Hz, duration in ms)
  const birthdayMelodyNotes = [
    { f: 261.63, d: 340 }, // C4 "Hap-"
    { f: 261.63, d: 220 }, // C4 "-py"
    { f: 293.66, d: 520 }, // D4 "Birth-"
    { f: 261.63, d: 520 }, // C4 "-day"
    { f: 349.23, d: 520 }, // F4 "to"
    { f: 329.63, d: 950 }, // E4 "you..."

    { f: 261.63, d: 340 }, // C4 "Hap-"
    { f: 261.63, d: 220 }, // C4 "-py"
    { f: 293.66, d: 520 }, // D4 "Birth-"
    { f: 261.63, d: 520 }, // C4 "-day"
    { f: 392.00, d: 520 }, // G4 "to"
    { f: 349.23, d: 950 }, // F4 "you..."

    { f: 261.63, d: 340 }, // C4 "Hap-"
    { f: 261.63, d: 220 }, // C4 "-py"
    { f: 523.25, d: 520 }, // C5 "Birth-"
    { f: 440.00, d: 520 }, // A4 "-day"
    { f: 349.23, d: 520 }, // F4 "my"
    { f: 329.63, d: 520 }, // E4 "love..."
    { f: 293.66, d: 880 }, // D4

    { f: 466.16, d: 340 }, // Bb4 "Hap-"
    { f: 466.16, d: 220 }, // Bb4 "-py"
    { f: 440.00, d: 520 }, // A4 "Birth-"
    { f: 349.23, d: 520 }, // F4 "-day"
    { f: 392.00, d: 520 }, // G4 "to"
    { f: 349.23, d: 1150 } // F4 "you!"
  ];

  function playMusicBoxChime(freq, durationMs) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const overtone = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const overtoneGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Delicate bell harmonic overtone
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + (durationMs / 1000) * 1.45);

    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.04, now + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0005, now + (durationMs / 1000) * 0.7);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(audioCtx.destination);
    overtoneGain.connect(audioCtx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + (durationMs / 1000) * 1.5);
    overtone.stop(now + (durationMs / 1000) * 1.5);
  }

  function updateVinylVisualState(playing) {
    isVinylPlaying = playing;
    const vinylSvg = document.querySelector('.vinyl-record-svg');
    if (vinylDisc) {
      vinylDisc.classList.toggle('is-spinning', playing);
      vinylDisc.classList.toggle('playing', playing);
      vinylDisc.classList.toggle('animate-spin', playing);
    }
    if (vinylSvg) {
      vinylSvg.classList.toggle('is-spinning', playing);
      vinylSvg.classList.toggle('playing', playing);
      vinylSvg.classList.toggle('animate-spin', playing);
    }
    if (vinylTonearm) vinylTonearm.classList.toggle('is-active', playing);
    if (vinylWaveform) vinylWaveform.classList.toggle('is-playing', playing);
    if (vinylPlayLabel) {
      vinylPlayLabel.textContent = playing ? '⏸ Pause Melody' : '▶ Play Birthday Melody';
    }
    if (vinylTrackStatus) {
      vinylTrackStatus.textContent = playing
        ? '♪ Playing "Happy Birthday, Little Sister" ♪'
        : 'Tap play to listen 🎶';
    }
  }

  function stopVinylMelody() {
    melodyTimeouts.forEach((t) => clearTimeout(t));
    melodyTimeouts = [];
    if (voiceNoteAudio) {
      voiceNoteAudio.pause();
      voiceNoteAudio.currentTime = 0;
    }
    updateVinylVisualState(false);
  }

  function startVinylMelody() {
    const customSrc = voiceNoteAudio?.querySelector('source')?.getAttribute('src');
    if (customSrc) {
      voiceNoteAudio.play().then(() => {
        updateVinylVisualState(true);
      }).catch(() => {});
      voiceNoteAudio.onended = () => updateVinylVisualState(false);
      return;
    }

    // Synthesize warm celestial music-box "Happy Birthday" via Web Audio API
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    melodyTimeouts.forEach((t) => clearTimeout(t));
    melodyTimeouts = [];
    updateVinylVisualState(true);

    let offset = 100;
    birthdayMelodyNotes.forEach((note) => {
      const t = setTimeout(() => {
        if (!isVinylPlaying) return;
        playMusicBoxChime(note.f, note.d);
      }, offset);
      melodyTimeouts.push(t);
      offset += note.d + 45;
    });

    const endT = setTimeout(() => {
      updateVinylVisualState(false);
      spawnHeartShower(6);
    }, offset + 350);
    melodyTimeouts.push(endT);
  }

  if (btnVinylPlay) {
    btnVinylPlay.addEventListener('click', () => {
      if (isVinylPlaying) {
        stopVinylMelody();
      } else {
        startVinylMelody();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 13. INTERACTIVE GOLD FOIL SCRATCH-OFF CARD (Scene 6)
  // --------------------------------------------------------------------------
  const scratchCanvas = document.getElementById('scratch-canvas');
  const giantGoldenOverlay = document.getElementById('giant-golden-overlay');
  const scratchStatusText = document.getElementById('scratch-status-text');
  const btnScratchReset = document.getElementById('btn-scratch-reset');
  let scratchCtx = null;
  let isScratching = false;
  let isScratchCompleted = false;

  function initScratchCard() {
    if (!scratchCanvas) return;
    const container = document.getElementById('vault-stage-wrapper') || document.querySelector('.secret-bonus-card');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(380, Math.floor(rect.height));

    scratchCanvas.width = w;
    scratchCanvas.height = h;
    scratchCanvas.classList.remove('is-revealed');
    if (giantGoldenOverlay) {
      giantGoldenOverlay.classList.remove('is-revealed');
    }

    const bonusCard = document.querySelector('.secret-bonus-card');
    if (bonusCard) {
      bonusCard.classList.remove('is-revealed');
    }
    isScratchCompleted = false;

    if (scratchStatusText) {
      scratchStatusText.textContent = '✨ Rub with your finger or cursor to scratch off!';
    }

    scratchCtx = scratchCanvas.getContext('2d');
    if (!scratchCtx) return;

    // 1. Rich Metallic Gold Foil Gradient Coat covering the entire vault area
    scratchCtx.globalCompositeOperation = 'source-over';
    const grad = scratchCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#E6C35C');
    grad.addColorStop(0.2, '#FFF2B2');
    grad.addColorStop(0.42, '#D4AF37');
    grad.addColorStop(0.68, '#B88E1E');
    grad.addColorStop(0.85, '#F0D578');
    grad.addColorStop(1, '#9C781A');

    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, w, h);

    // 2. Subtle Shimmering Foil Pattern & Borders
    scratchCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    scratchCtx.lineWidth = 3;
    scratchCtx.strokeRect(14, 14, w - 28, h - 28);

    scratchCtx.strokeStyle = 'rgba(110, 78, 10, 0.4)';
    scratchCtx.lineWidth = 1.5;
    scratchCtx.strokeRect(22, 22, w - 44, h - 44);

    // 3. Giant Golden Overlay Headline
    // The user should see nothing but a huge golden card that says 'Scratch to reveal your final surprise!'
    scratchCtx.textAlign = 'center';
    scratchCtx.textBaseline = 'middle';

    // Top pill badge
    const badgeW = Math.min(280, w - 60);
    const badgeH = 34;
    const badgeX = (w - badgeW) / 2;
    const badgeY = Math.max(35, h / 2 - 95);

    scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    if (typeof scratchCtx.roundRect === 'function') {
      scratchCtx.beginPath();
      scratchCtx.roundRect(badgeX, badgeY, badgeW, badgeH, 17);
      scratchCtx.fill();
    } else {
      scratchCtx.fillRect(badgeX, badgeY, badgeW, badgeH);
    }

    scratchCtx.fillStyle = '#5C4004';
    scratchCtx.font = '700 13px Montserrat, sans-serif';
    scratchCtx.fillText('✨ SECRET SISTER VAULT VOUCHER ✨', w / 2, badgeY + badgeH / 2);

    // Main giant heading
    const titleFontSize = Math.max(20, Math.min(36, Math.floor(w / 26)));
    scratchCtx.font = `800 ${titleFontSize}px Montserrat, sans-serif`;
    scratchCtx.fillStyle = '#422802';
    scratchCtx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    scratchCtx.shadowBlur = 10;
    scratchCtx.fillText('Scratch to reveal your final surprise!', w / 2, h / 2 - 20);
    scratchCtx.shadowBlur = 0;

    // Subtitle
    scratchCtx.font = '500 16px Lora, serif';
    scratchCtx.fillStyle = '#6E4E0A';
    scratchCtx.fillText('Rub anywhere with your finger or mouse to unveil the melody & VIP pass ✨', w / 2, h / 2 + 25);

    // Giant gift emoji / seal
    scratchCtx.font = '36px sans-serif';
    scratchCtx.fillText('🎁', w / 2, h / 2 + 80);
  }

  function scratchAtPoint(clientX, clientY) {
    if (!scratchCtx || !scratchCanvas || isScratchCompleted) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const scaleX = scratchCanvas.width / (rect.width || 1);
    const scaleY = scratchCanvas.height / (rect.height || 1);
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 48, 0, Math.PI * 2);
    scratchCtx.fill();

    // Check revealed percentage periodically
    checkScratchCompletion();
  }

  function checkScratchCompletion() {
    if (!scratchCtx || !scratchCanvas || isScratchCompleted) return;
    const w = scratchCanvas.width;
    const h = scratchCanvas.height;
    const imgData = scratchCtx.getImageData(0, 0, w, h).data;

    let transparentPixels = 0;
    const stride = 32; // sample every 8th pixel for fast 60fps performance on large canvas
    const totalSampled = Math.floor(imgData.length / stride);

    for (let i = 3; i < imgData.length; i += stride) {
      if (imgData[i] < 128) {
        transparentPixels++;
      }
    }

    const ratio = transparentPixels / (totalSampled || 1);
    // Once 50% scratched, fade out canvas to reveal 3-column layout
    if (ratio >= 0.50) {
      onScratchCardComplete();
    }
  }

  /**
   * Exact function that fires when the Golden Card scratch-off is completed / threshold reached:
   * 1. bg-music.current.pause()
   * 2. golden-song.current.play() at 100% volume
   */
  function onScratchCardComplete() {
    if (isScratchCompleted) return;
    isScratchCompleted = true;

    // Fade out canvas and giant overlay
    if (scratchCanvas) {
      scratchCanvas.classList.add('is-revealed');
    }
    const giantOverlay = document.getElementById('giant-golden-overlay');
    if (giantOverlay) {
      giantOverlay.classList.add('is-revealed');
    }
    const bonusCard = document.querySelector('.secret-bonus-card');
    if (bonusCard) {
      bonusCard.classList.add('is-revealed');
    }
    const sceneBonus = document.getElementById('scene-secret-bonus');
    if (sceneBonus) {
      sceneBonus.classList.add('is-revealed');
    }

    if (scratchStatusText) {
      scratchStatusText.textContent = '🎉 VIP Sister Pass & Keepsake Melody Unlocked! Happy Birthday, Little Sis! 💖';
    }
    confetti();

    // Guarantee background music's .pause() method runs immediately before new song starts
    if (bgAudio) {
      try {
        bgAudio.pause();
      } catch (e) {
        console.log('bgAudio.pause error:', e);
      }
    }
    const reactBg = document.getElementById('react-bg-audio');
    if (reactBg && typeof reactBg.pause === 'function') {
      try {
        reactBg.pause();
      } catch (e) {}
    }
    if (window.__sisterAudio && window.__sisterAudio.bgSongRef && window.__sisterAudio.bgSongRef.current) {
      try {
        window.__sisterAudio.bgSongRef.current.pause();
      } catch (e) {
        console.log('bgSongRef.current.pause error:', e);
      }
    } else if (window.__sisterAudio && window.__sisterAudio.bgRef && window.__sisterAudio.bgRef.current) {
      try {
        window.__sisterAudio.bgRef.current.pause();
      } catch (e) {}
    } else if (window.__sisterAudio && typeof window.__sisterAudio.pauseBg === 'function') {
      window.__sisterAudio.pauseBg();
    }
    isMusicPlaying = false;

    // Explicitly fire goldenSongRef.current.play() inside onComplete / 50% threshold callback
    let goldenStarted = false;
    if (window.__sisterAudio && window.__sisterAudio.goldenSongRef && window.__sisterAudio.goldenSongRef.current) {
      try {
        const gAudio = window.__sisterAudio.goldenSongRef.current;
        gAudio.volume = 1.0;
        gAudio.currentTime = 0;
        gAudio.play().then(() => {
          isGoldenSongPlaying = true;
          if (window.__sisterAudio.setIsPlayingGolden) window.__sisterAudio.setIsPlayingGolden(true);
        }).catch((err) => {
          console.log('Audio autoplay blocked:', err);
        });
        goldenStarted = true;
      } catch (e) {
        console.log('goldenSongRef execution error:', e);
      }
    } else if (window.__sisterAudio && window.__sisterAudio.goldenRef && window.__sisterAudio.goldenRef.current) {
      try {
        const gAudio = window.__sisterAudio.goldenRef.current;
        gAudio.volume = 1.0;
        gAudio.currentTime = 0;
        gAudio.play().then(() => {
          isGoldenSongPlaying = true;
          if (window.__sisterAudio.setIsPlayingGolden) window.__sisterAudio.setIsPlayingGolden(true);
        }).catch((err) => {
          console.log('Audio autoplay blocked:', err);
        });
        goldenStarted = true;
      } catch (e) {}
    }

    if (!goldenStarted && window.__sisterAudio && typeof window.__sisterAudio.playGolden === 'function') {
      window.__sisterAudio.playGolden();
      goldenStarted = true;
    }

    if (goldenAudio) {
      goldenAudio.volume = 1.0;
      goldenAudio.currentTime = 0;
      goldenAudio.play().then(() => {
        isGoldenSongPlaying = true;
      }).catch((err) => {
        console.log('Audio autoplay blocked:', err);
      });
    }

    window.dispatchEvent(new CustomEvent('sisterhood-golden-reveal'));

    // Toggle spinning classes on vinyl disc & equalizer
    const vinylDisc = document.getElementById('vinyl-disc');
    const vinylSvg = document.querySelector('.vinyl-record-svg');
    if (vinylDisc) {
      vinylDisc.classList.add('playing', 'is-spinning', 'animate-spin');
    }
    if (vinylSvg) {
      vinylSvg.classList.add('playing', 'is-spinning', 'animate-spin');
    }
    const vinylEq = document.getElementById('vinyl-equalizer');
    if (vinylEq) {
      vinylEq.classList.add('playing');
    }
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      scratchAtPoint(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
      if (isScratching && currentScene === 'secretBonus') {
        scratchAtPoint(e.clientX, e.clientY);
      }
    });
    window.addEventListener('mouseup', () => {
      if (isScratching) {
        isScratching = false;
        checkScratchCompletion();
      }
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      if (e.touches && e.touches[0]) {
        scratchAtPoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (isScratching && e.touches && e.touches[0]) {
        scratchAtPoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    scratchCanvas.addEventListener('touchend', () => {
      if (isScratching) {
        isScratching = false;
        checkScratchCompletion();
      }
    });
  }

  // Interactive Spotify lyrics line clicking to highlight line
  document.addEventListener('click', (e) => {
    const lyricLine = e.target.closest('.spotify-lyric-line');
    if (lyricLine) {
      document.querySelectorAll('.spotify-lyric-line').forEach((el) => el.classList.remove('active'));
      lyricLine.classList.add('active');
    }
  });

  if (btnScratchReset) {
    btnScratchReset.addEventListener('click', () => {
      initScratchCard();
    });
  }

  // Initial setup: activate landing scene as primary entry point
  navigateTo('landing');
});

